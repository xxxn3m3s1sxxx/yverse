import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import Web3 from 'web3';
import PinataSDK from '@pinata/sdk';
import Payment from './Payment';
import Analytics from './Analytics';
import Chatbot from './Chatbot';
import { toast } from 'react-toastify';
import YVerseNFT_ABI from '../abis/YVerseNFT.json';
import PolygonNFT_ABI from '../abis/PolygonNFT.json';

function Profile({ username }) {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chain, setChain] = useState('sepolia');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(res.data);
        setBackgroundColor(res.data.backgroundColor || '#ffffff');
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Failed to load profile');
      }
    };
    fetchUser();
  }, [username]);

  const updateProfileColor = async (color) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { backgroundColor: color.hex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBackgroundColor(color.hex);
      toast.success('Profile color updated!');
    } catch (err) {
      console.error('Error updating color:', err);
      toast.error('Failed to update color');
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return toast.error('Prompt cannot be empty');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/generate-image`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImage(res.data.image);
      toast.success('Image generated!');
    } catch (err) {
      console.error('Error generating image:', err);
      toast.error('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!image) return toast.error('Generate an image first');
    if (!user.premium) return toast.error('Upgrade to premium to mint NFTs');
    setLoading(true);
    try {
      const pinata = new PinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_API_KEY);
      const imageBlob = await fetch(image).then(res => res.blob());
      const imageUpload = await pinata.pinFileToIPFS(imageBlob, {
        pinataMetadata: { name: `YVerse NFT - ${prompt}` }
      });
      const ipfsUrl = `https://ipfs.io/ipfs/${imageUpload.IpfsHash}`;

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contractAddress = chain === 'sepolia'
        ? process.env.REACT_APP_NFT_CONTRACT_ADDRESS
        : process.env.REACT_APP_POLYGON_NFT_CONTRACT_ADDRESS;
      const contract = new web3.eth.Contract(
        chain === 'sepolia' ? YVerseNFT_ABI.abi : PolygonNFT_ABI.abi,
        contractAddress
      );
      const metadata = {
        name: `YVerse NFT - ${username}`,
        description: `Generated from prompt: ${prompt}`,
        image: ipfsUrl
      };
      const metadataUpload = await pinata.pinJSONToIPFS(metadata);
      const metadataUrl = `https://ipfs.io/ipfs/${metadataUpload.IpfsHash}`;

      await contract.methods.mintNFT(accounts[0], metadataUrl).send({ from: accounts[0] });

      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nfts`,
        { nftUrl: ipfsUrl, metadataUrl, chain },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`NFT minted on ${chain === 'sepolia' ? 'Sepolia' : 'Mumbai'}!`);
      setImage(null);
      setPrompt('');
    } catch (err) {
      console.error('Error minting NFT:', err);
      toast.error('Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor }}>
      <h2>{username}'s Profile</h2>
      <p>Status: {user.premium ? 'Premium' : 'Free'}</p>
      <ChromePicker color={backgroundColor} onChangeComplete={updateProfileColor} />
      <Payment user={user} setUser={setUser} />
      <Analytics userId={user._id} />
      <Chatbot />
      <h3>Mint a New NFT</h3>
      <select value={chain} onChange={e => setChain(e.target.value)}>
        <option value="sepolia">Sepolia (Ethereum)</option>
        <option value="mumbai">Mumbai (Polygon)</option>
      </select>
      <input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Enter a prompt for your NFT"
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {image && (
        <div>
          <img src={image} alt="Generated" style={{ maxWidth: '200px' }} />
          <button onClick={mintNFT} disabled={loading || !user.premium}>
            {loading ? 'Minting...' : 'Mint as NFT'}
          </button>
        </div>
      )}
      <h3>Your NFTs</h3>
      {user.nfts?.map((nft, index) => (
        <div key={index}>
          <img src={nft.nftUrl} alt="NFT" style={{ maxWidth: '100px' }} />
          <p>Chain: {nft.chain}</p>
          <a href={nft.metadataUrl} target="_blank" rel="noopener noreferrer">View Metadata</a>
        </div>
      ))}
    </div>
  );
}

export default Profile;
