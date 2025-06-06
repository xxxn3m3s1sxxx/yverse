import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AIChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [submission, setSubmission] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenges`);
        setChallenge(res.data);
      } catch (err) {
        console.error('Error fetching challenge:', err);
        toast.error('Failed to load challenge');
      }
    };
    fetchChallenge();
  }, []);

  const submitChallenge = async () => {
    if (!submission.trim()) return toast.error('Submission cannot be empty');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/challenges/submit`,
        { challengeId: challenge._id, submission },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Challenge submitted!');
      setSubmission('');
    } catch (err) {
      console.error('Error submitting challenge:', err);
      toast.error('Submission failed');
    }
  };

  if (!challenge) return <div>Loading...</div>;

  return (
    <div className="ai-challenge">
      <h3>Daily AI Challenge</h3>
      <p>Prompt: {challenge.prompt}</p>
      <textarea
        value={submission}
        onChange={e => setSubmission(e.target.value)}
        placeholder="Your submission..."
      />
      <button onClick={submitChallenge}>Submit</button>
    </div>
  );
}

export default AIChallenge;
