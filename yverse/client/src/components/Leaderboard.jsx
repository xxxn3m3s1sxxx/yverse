import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/leaderboard`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        toast.error('Failed to load leaderboard');
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h3>Leaderboard</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username}: {user.points} points</li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
