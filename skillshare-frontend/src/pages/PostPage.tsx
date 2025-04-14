// src/pages/PostPage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, TextField, Button, Box, Avatar, List, ListItem, ListItemText } from '@mui/material';
import { ThumbUp, ThumbUpOutlined, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

interface Post {
  id: number;
  userId: number;
  username?: string;
  content: string;
  likedBy: number[];
  comments: Comment[];
}

interface Comment {
  id: number;
  userId: number;
  text: string;
}

export default function PostPage() {
  const { userId } = useParams();
  const loggedInUser = { id: 1, name: 'John Doe' }; // Replace with real auth
  const { addNewNotification } = useNotifications();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/user/${userId}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const toggleLike = async (post: Post) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/like/${loggedInUser.id}`, { method: 'POST' });

      if (!post.likedBy.includes(loggedInUser.id) && post.userId !== loggedInUser.id) {
        await addNewNotification({
          recipientId: post.userId,
          senderId: loggedInUser.id,
          message: `${loggedInUser.name} liked your post`,
          type: 'LIKE',
          postId: post.id
        });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (post: Post) => {
    const commentText = newComment[post.id];
    if (!commentText) return;

    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: loggedInUser.id, text: commentText })
      });

      if (post.userId !== loggedInUser.id) {
        await addNewNotification({
          recipientId: post.userId,
          senderId: loggedInUser.id,
          message: `${loggedInUser.name} commented: "${commentText}"`,
          type: 'COMMENT',
          postId: post.id
        });
      }

      setNewComment(prev => ({ ...prev, [post.id]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Box>
      {posts.map(post => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => toggleLike(post)}>
                  {post.likedBy.includes(loggedInUser.id) ? <ThumbUp /> : <ThumbUpOutlined />}
                </IconButton>
                <Typography variant="body2">{post.likedBy.length}</Typography>
              </Box>
              <Box>
                <IconButton><Edit /></IconButton>
                <IconButton><Delete /></IconButton>
              </Box>
            </Box>

            <List>
              {post.comments.map((comment) => (
                <ListItem key={comment.id}>
                  <Avatar sx={{ mr: 2 }}>U</Avatar>
                  <ListItemText primary={comment.text} />
                </ListItem>
              ))}
            </List>

            <Box display="flex" mt={2}>
              <TextField
                fullWidth
                value={newComment[post.id] || ''}
                onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Add a comment"
              />
              <Button onClick={() => handleAddComment(post)}>Post</Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
