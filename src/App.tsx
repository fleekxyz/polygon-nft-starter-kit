import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  useAccount,
  useNetwork,
  useContract,
  useDisconnect,
  useSigner,
} from "wagmi";

import SelectWalletModal from "./SelectWalletModal";
import metadata from "./metadata/data.json";
import contractData from "./PolygonNFT.json";
import "./App.css";

function App() {
  const [sendingTrx, setSendingTrx] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: "0xa088511dbAAca30E9ee91bB2D07E0fc964775F17",
    contractInterface: contractData.abi,
    signerOrProvider: signer,
  });

  if (chain?.unsupported) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-content">
            <h2 className="card-title">Unsupported Chain</h2>
            <p className="card-body">
              This chain is not supported by this application. Please use any of
              the following chains:
              <ul className="noBullets">
                {chains.map((chain) => (
                  <li>{chain.name}</li>
                ))}
              </ul>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mint = async (index: number) => {
    setSendingTrx(true);
    if (!contract) {
      alert("Contract not loaded");
      return;
    }

    const tx = await contract.mint(
      address,
      `https://bafybeihh5v4qde4sw6572l3tz7vllcg2ec5y7uqn6gyfkbnrn542cef3jy.ipfs.nftstorage.link/${index}.json`
    );
    if(tx) setSendingTrx(false);
    
  };

  return (
    <div className="App">
      {address ? (
        <>
          <div className="disconnect">
            <button
              onClick={() => disconnect()}
              className="card-button disconnectBtn"
            >
              Disconnect Wallet
            </button>
          </div>
          <div className="container">
            {metadata.map((warrior, index) => (
              <div key={index} className="card">
                <div className="card-content">
                  <p>
                    <img src={warrior.image} className="logo" alt="logo" />
                  </p>
                  <h2 className="card-title">{warrior.name}</h2>
                  <p className="card-body">{warrior.description}</p>
                  <button
                    onClick={() => mint(index)}
                    disabled={sendingTrx}
                    className="card-button"
                  >
                    Mint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="container">
          <div className="card">
            <div className="card-content">
              <p>
                <img src="./logo.svg" className="logo" alt="logo" />
              </p>
              <h2 className="card-title">Welcome to PolyWarrior</h2>
              <p className="card-body">
                As foretold, the world is in search of a new hero. Mint your NFT
                warrior with special skills and become a hero.
              </p>
              <button onClick={onOpen} className="card-button">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      )}
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </div>
  );
}

export default App;
