import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';
import { addNotification } from '../api/notificationApi';
import { useUser } from '../context/UserContext';

const PostPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/user/${userId}`);
      const data = await response.json();
      const normalized = Array.isArray(data)
        ? data.map((post: any) => ({
            ...post,
            likes: post.likes || [],
            comments: post.comments || [],
          }))
        : [];
      setPosts(normalized);
    } catch (err) {
      console.error('Failed to load posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const handleLike = async (postId: number, liked: boolean) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${postId}/like?userId=${user.id}`, {
        method: liked ? 'DELETE' : 'POST'
      });
      fetchPosts();

      const postOwner = posts.find(p => p.id === postId)?.user?.id;
      if (!liked && postOwner && postOwner !== user.id) {
        await addNotification({
          recipientId: postOwner,
          senderId: user.id,
          message: `${user.username} liked your post!`,
          type: 'LIKE',
          postId
        });
      }
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content })
      });
      fetchPosts();

      const postOwner = posts.find(p => p.id === postId)?.user?.id;
      if (postOwner && postOwner !== user.id) {
        await addNotification({
          recipientId: postOwner,
          senderId: user.id,
          message: `${user.username} commented on your post.`,
          type: 'COMMENT',
          postId
        });
      }
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
      fetchPosts();

      const post = posts.find(p => p.comments.some((c: any) => c.id === commentId));
      const postOwner = post?.user?.id;
      if (postOwner && postOwner !== user.id) {
        await addNotification({
          recipientId: postOwner,
          senderId: user.id,
          message: `${user.username} edited their comment on your post.`,
          type: 'COMMENT',
          postId: post.id
        });
      }
    } catch (err) {
      console.error('Edit comment failed', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const post = posts.find(p => p.comments.some((c: any) => c.id === commentId));
      const postOwner = post?.user?.id;

      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE'
      });
      fetchPosts();

      if (postOwner && postOwner !== user.id) {
        await addNotification({
          recipientId: postOwner,
          senderId: user.id,
          message: `${user.username} deleted a comment from your post.`,
          type: 'COMMENT',
          postId: post.id
        });
      }
    } catch (err) {
      console.error('Delete comment failed', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8">Your Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 animate-pulse">No posts to show.</p>
      ) : (
        posts.map(post => (
          <div className="transition duration-300 transform hover:scale-[1.02]">
            <Post
              key={post.id}
              post={post}
              currentUser={user}
              onLike={handleLike}
              onComment={handleComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default PostPage;