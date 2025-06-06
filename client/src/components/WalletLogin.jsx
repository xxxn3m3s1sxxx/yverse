import React, { useState } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import axios from 'axios';

function WalletLogin() {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error('Please install MetaMask');
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/wallet`,
        { walletAddress: accounts[0] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Wallet connected!');
    } catch (err) {
      console.error('Wallet connection error:', err);
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <div>
      <h3>Connect Wallet</h3>
      <button onClick={connectWallet}>Connect MetaMask</button>
      {walletAddress && <p>Connected: {walletAddress}</p>}
    </div>
  );
}

export default WalletLogin;
