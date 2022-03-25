import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import { ethers } from 'ethers';

function App() {

  const [address, setAddress] = useState(0);
  const [bal, setBal] = useState('N/A');
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState();
  const [signature, setSignature] = useState();


  // Helper Functions

  // Requests access to the user's META MASK WALLET
  // https://metamask.io
  async function requestAccount() {

    // ❌ Check if Meta Mask Extension exists 
    if (window.ethereum) {
      try {

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        provider.getBalance(accounts[0]).then((balance) => {

          // balance is a BigNumber (in wei); format is as a sting (in ether)
          let etherString = ethers.utils.formatEther(balance) + " ETH";

          setBal(etherString);
          setProvider(provider)
        });
      } catch (error) {
        alert('Error connecting...');
        setAddress(-1)
      }

    } else {
      alert('Meta Mask not detected');
      setAddress(-1)
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if (address == 0) {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount();

      }
      else setAddress(-1)

    }

  }

  async function disconnectWallet() {
    window.location.reload();

    if (typeof window.ethereum !== 'undefined') {
    }

  }

  async function changeMessage(e) {
    setMessage(e.target.value)
  }

  async function signMessage() {
    if (message == '') {
      alert('Message is empty');
    }
    else {

      // Sign the string message
      let signer = await provider.getSigner()

      // For Solidity, we need the expanded-format of a signature
      // let sig = ethers.utils.splitSignature(flatSig);

      let signature = await signer.signMessage(message);

      setSignature(signature)
    }
  }

  const disabled = address == 0 || address == -1
  return (
    <div className="App">
      <header className="App-header">
        <h3>Wallet Address: {disabled ? 'N/A' : address}</h3>
        <h3>Current Balance: {disabled ? 'N/A' : bal}</h3>
        <button disabled={address}
          onClick={connectWallet}> {address == -1 ? 'Error' : address == 0 ? 'Connect Wallet' : 'Connected'}</button>
        <br />
        <button disabled={disabled}
          onClick={disconnectWallet}>Disconnect</button>


        <br />
        <br />
        <div style={{ visibility: disabled ? 'hidden' : 'visible' }}>
          <input value={message} onChange={changeMessage} disabled={signature} disabled={disabled} placeholder='message'></input>
          <br />
          <br />
          <h3 >Message: {message}</h3>
          <button onClick={signMessage} disabled={disabled || signature}>Sign + Deploy Message</button>

          <div style={{ visibility: signature ? 'visible' : 'hidden' }}>
          <h3>Signature:</h3> 
          <code>{signature}</code>
          <h2><a target="_blank" href="https://etherscan.io/verifiedSignatures">Verify Signature on Etherscan</a></h2>
          You will need:<br/>
          <em>Address + Message + Signature</em>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
