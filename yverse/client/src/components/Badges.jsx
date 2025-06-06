import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Badges({ userId }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/badges/${userId}`, {
          headers: { Authorization:  }
        });
        setBadges(res.data);
      } catch (err) {
        console.error('Error fetching badges:', err);
        toast.error('Failed to load badges');
      }
    };
    fetchBadges();
  }, [userId]);

  return (
    <div>
      <h3>Your Badges</h3>
      {badges.map(badge => (
        <div key={badge._id}>
          <p>{badge.name}: {badge.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Badges;
