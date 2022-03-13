import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import { ethers } from 'ethers';

function App() {

  const [address, setAddress] = useState(0);
  const [bal, setBal] = useState('N/A');


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

  return (
    <div className="App">
      <header className="App-header">
        <h3>Wallet: {address == -1 ? 'Error' : (address ? address : 'N/A')}</h3>
        <h3>Balance: {address ? bal : 'N/A'}</h3>
        <button disabled={address}
          onClick={connectWallet}> {address == -1 ? 'Error' : address == 0 ? 'Connect Wallet' : 'Connected'}</button>
        <br />
        <button disabled={address == 0}
          onClick={disconnectWallet}>Disconnect</button>
      </header>
    </div>
  );
}

export default App;
