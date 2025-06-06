import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return toast.error('Message cannot be empty');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chatbot`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatHistory([...chatHistory, { user: message, bot: res.data.response }]);
      setMessage('');
      toast.success('Chatbot replied!');
    } catch (err) {
      console.error('Chatbot error:', err);
      toast.error('Failed to get chatbot response');
    }
  };

  return (
    <div className="chatbot">
      <h3>Chat with YVerse Bot</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {chatHistory.map((chat, i) => (
          <div key={i}>
            <p><strong>You:</strong> {chat.user}</p>
            <p><strong>Bot:</strong> {chat.bot}</p>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Ask the chatbot..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbot;
