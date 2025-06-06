import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

function Messages({ recipientId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${recipientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const decrypted = res.data.map(msg => ({
          ...msg,
          content: CryptoJS.AES.decrypt(msg.content, process.env.REACT_APP_CRYPTO_SECRET).toString(CryptoJS.enc.Utf8)
        }));
        setMessages(decrypted);
      } catch (err) {
        console.error('Error fetching messages:', err);
        toast.error('Failed to load messages');
      }
    };
    fetchMessages();
  }, [recipientId]);

  const sendMessage = async () => {
    if (!content.trim()) return toast.error('Message cannot be empty');
    try {
      const encrypted = CryptoJS.AES.encrypt(content, process.env.REACT_APP_CRYPTO_SECRET).toString();
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        { recipientId, content: encrypted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, {
        ...res.data,
        content: CryptoJS.AES.decrypt(res.data.content, process.env.REACT_APP_CRYPTO_SECRET).toString(CryptoJS.enc.Utf8)
      }]);
      setContent('');
      toast.success('Message sent!');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  return (
    <div>
      <h3>Messages</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map(msg => (
          <p key={msg._id}>{msg.senderId}: {msg.content}</p>
        ))}
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Messages;
