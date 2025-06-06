import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Post({ post, setPosts }) {
  const [comment, setComment] = useState('');

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.map(p => p._id === post._id ? res.data : p));
      toast.success('Liked!');
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error('Failed to like post');
    }
  };

  const handleRepost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${post._id}/repost`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => [res.data, ...prev]);
      toast.success('Reposted!');
    } catch (err) {
      console.error('Error reposting:', err);
      toast.error('Failed to repost');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return toast.error('Comment cannot be empty');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${post._id}/comment`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.map(p => p._id === post._id ? res.data : p));
      setComment('');
      toast.success('Comment added!');
    } catch (err) {
      console.error('Error commenting:', err);
      toast.error('Failed to comment');
    }
  };

  const shareOnX = () => {
    const url = `https://yverse.xyz/post/${post._id}`;
    const text = `Check out this post on YVerse: ${post.content.slice(0, 100)}...`;
    window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    toast.success('Shared on X!');
  };

  return (
    <div className="post">
      <p>{post.content}</p>
      {post.nftUrl && (
        <div>
          <img src={post.nftUrl} alt="NFT" style={{ maxWidth: '200px' }} />
          <a href={post.nftUrl} target="_blank" rel="noopener noreferrer">View NFT</a>
        </div>
      )}
      {post.aiImage && (
        <div>
          <img src={post.aiImage} alt="AI Generated" style={{ maxWidth: '200px' }} />
          <p>Generated from: {post.aiPrompt}</p>
        </div>
      )}
      <button onClick={handleLike}>Like ({post.likes})</button>
      <button onClick={handleRepost}>Repost ({post.reposts})</button>
      <button onClick={shareOnX}>Share on X</button>
      <div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleComment}>Comment</button>
      </div>
      {post.comments?.map((c, i) => (
        <p key={i}>{c.content} (by {c.userId})</p>
      ))}
    </div>
  );
}

export default Post;
