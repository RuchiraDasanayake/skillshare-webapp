import React from 'react';
import { useUser } from '../context/UserContext';
import Post from '../components/Post';

const PostPage = () => {
  const { userId } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Posts</h1>
      <Post userId={userId} />
    </div>
  );
};

export default PostPage;
