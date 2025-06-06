import React, { useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import { toast } from 'react-toastify';
import PaymentContract_ABI from '../abis/PaymentContract.json';

function Payment({ user, setUser }) {
  const [amount, setAmount] = useState('0.01');

  const upgradeToPremium = async () => {
    if (!window.ethereum) return toast.error('Please install MetaMask');
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new web3.eth.Contract(
        PaymentContract_ABI.abi,
        process.env.REACT_APP_PAYMENT_CONTRACT_ADDRESS
      );
      const weiAmount = web3.utils.toWei(amount, 'ether');

      await contract.methods.payForPremium().send({
        from: accounts[0],
        value: weiAmount
      });

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/premium`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      toast.success('Upgraded to Premium!');
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed');
    }
  };

  return (
    <div>
      <h3>Upgrade to Premium</h3>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        step="0.01"
      />
      <button onClick={upgradeToPremium}>Pay</button>
    </div>
  );
}

export default Payment;
