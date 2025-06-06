import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import { toast } from 'react-toastify';

function Group({ groupId }) {
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const [groupRes, postsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/groups?id=${groupId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/posts?groupId=${groupId}`)
        ]);
        setGroup(groupRes.data);
        setPosts(postsRes.data);
      }, catch (err) {
        console.error('Error fetching group data:', err);
        toast.error('Failed to load group');
      });
    };
    fetchGroupData();
  }, [groupId]);

  const createPost = async () => {
    if (!content.trim()) return toast.error('Post content cannot be empty');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { content, groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
      setContent('');
      toast.success('Post created!');
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post');
    }
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div className="group">
      <h2>{group.name}</h2>
      <p>{group.description}</p>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Post in group..."
      />
      <button onClick={createPost}>Post</button>
      {posts.map(post => (
        <Post key={post._id} post={post} setPosts={setPosts} />
      ))}
    </div>
  );
}

export default Group;
