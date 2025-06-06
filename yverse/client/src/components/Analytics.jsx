import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';

function Analytics({ userId }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/analytics/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        toast.error('Failed to load analytics');
      }
    };
    fetchAnalytics();
  }, [userId]);

  if (!analytics) return <div>Loading...</div>;

  const pointData = analytics.pointsHistory.map((p, i) => ({
    name: `Day ${i + 1}`,
    points: p
  }));

  return (
    <div className="analytics">
      <h3>Your Analytics</h3>
      <p>Total Posts: {analytics.totalPosts}</p>
      <p>Total Points: {analytics.totalPoints}</p>
      <p>Total NFT Value: {analytics.nftValue} ETH</p>
      <LineChart width={500} height={300} data={pointData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="points" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default Analytics;
