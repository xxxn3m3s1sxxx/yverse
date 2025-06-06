import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import LiveStream from './LiveStream';
import { toast } from 'react-toastify';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [streams, setStreams] = useState([]);
  const [content, setContent] = useState('');
  const [nftFilter, setNftFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, streamRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/posts`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/streams`)
        ]);
        setPosts(postRes.data);
        setStreams(streamRes.data);
      } catch (err) {
        console.error('Error fetching feed:', err);
        toast.error('Failed to load feed');
      }
    };
    fetchData();
  }, []);

  const createPost = async () => {
    if (!content.trim()) return toast.error('Post content cannot be empty');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { content, nftFilter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
      setContent('');
      setNftFilter('');
      toast.success('Post created!');
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="feed">
      <h2>Feed</h2>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input
        value={nftFilter}
        onChange={e => setNftFilter(e.target.value)}
        placeholder="NFT URL (optional)"
      />
      <button onClick={createPost}>Post</button>
      {streams.map(stream => (
        <LiveStream key={stream._id} stream={stream} />
      ))}
      {posts.map(post => (
        <Post key={post._id} post={post} setPosts={setPosts} />
      ))}
    </div>
  );
}

export default Feed;
