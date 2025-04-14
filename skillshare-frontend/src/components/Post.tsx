import React, { useEffect, useState } from 'react';

interface PostProps {
  userId: number;
}

const Post: React.FC<PostProps> = ({ userId }) => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to fetch posts', err));
  }, [userId]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">User {userId}'s Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="border p-3 mb-3 rounded shadow">
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Post;
