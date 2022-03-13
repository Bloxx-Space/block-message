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
    console.log('Requesting account...');

    // ❌ Check if Meta Mask Extension exists 
    if (window.ethereum) {
      console.log('detected');
      try {

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        provider.getBalance(accounts[0]).then((balance) => {

          // balance is a BigNumber (in wei); format is as a sting (in ether)
          let etherString = ethers.utils.formatEther(balance) + " ETH";

          console.log("Balance: " + etherString);
          setBal(etherString);
        });
      } catch (error) {
        console.log('Error connecting...');
        setAddress(0)
      }

    } else {
      alert('Meta Mask not detected');
      setAddress(0)
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined' && address == 0) {
      await requestAccount();

    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Wallet: {address}</h3>
        <h3>Balance: {bal}</h3>
        <button
          onClick={connectWallet}> {address == 0 ? 'Connect Wallet' : 'Connected'}</button>
      </header>
    </div>
  );
}

export default App;
