import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import GroupPage from './pages/GroupPage';
import './styles/App.css';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY }).then(token => {
          axios.post(
            `${process.env.REACT_APP_API_URL}/api/notifications/subscribe`,
            { token },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          ).catch(err => console.error('Notification subscription failed:', err));
        }).catch(err => console.error('Failed to get token:', err));
      }
    }).catch(err => console.error('Notification permission error:', err));
  }, []);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
