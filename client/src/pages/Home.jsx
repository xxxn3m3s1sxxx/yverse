import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feed from '../components/Feed.jsx';
import WalletLogin from '../components/WalletLogin.jsx';
import AIChallenge from '../components/AIChallenge.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import Notifications from '../components/Notifications.jsx';
import { toast } from 'react-toastify';

function Home() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`);
        setGroups(res.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
        toast.error('Failed to load groups');
      }
    };
    fetchGroups();
  }, []);

  return (
    <div>
      <Notifications />
      <h1>Welcome to YVerse</h1>
      <WalletLogin />
      <AIChallenge />
      <h2>Groups</h2>
      {groups.map(group => (
        <div key={group._id}>
          <a href={`/group/${group._id}`}>{group.name}</a>
        </div>
      ))}
      <Feed />
      <Leaderboard />
    </div>
  );
}

export default Home;
