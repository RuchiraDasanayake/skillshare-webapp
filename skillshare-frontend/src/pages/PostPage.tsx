// src/pages/PostPage.tsx
import { useState } from 'react';
import { Card, CardContent, Typography, IconButton, TextField, Button, Box, Avatar, List, ListItem, ListItemText } from '@mui/material';
import { ThumbUp, ThumbUpOutlined, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useEffect as reactUseEffect } from 'react';

// Define the Post interface
interface Post {
  id: number;
  userId: number;
  content: string;
  likes: number;
  comments: Comment[];
}

// Define the Comment interface
interface Comment {
  id: number;
  userId: number;
  text: string;
}

function useEffect(callback: () => void, dependencies: (string | undefined)[]) {
  reactUseEffect(callback, dependencies);
}

export default function PostPage() {
  const { userId } = useParams();
  const loggedInUser = { id: 1 }; // Replace with actual logic to get the logged-in user
  const { addNewNotification } = useNotifications();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/user/${userId}`);
      const data = await response.json();
      setPosts(data);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };

  // Load posts from API
  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const toggleLike = async (postId: number) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${postId}/like/${loggedInUser.id}`, {
        method: 'POST'
      });
      // Update local state or refetch posts
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!newComment[postId]) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: loggedInUser.id,
          text: newComment[postId]
        })
      });
      
      if (response.ok) {
        const updatedPosts = await fetchPosts();
        setPosts(updatedPosts);
        setNewComment(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // ... (rest of your component remains the same, just replace mock handlers with these API calls)
  return (
    <Box>
      {posts.map((post) => (
        <Card key={post.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => toggleLike(post.id)}>
                  {post.likes > 0 ? <ThumbUp /> : <ThumbUpOutlined />}
                </IconButton>
                <Typography variant="body2">{post.likes}</Typography>
              </Box>
              <Box>
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
            <List>
              {post.comments.map((comment) => (
                <ListItem key={comment.id}>
                  <Avatar sx={{ marginRight: 2 }}>U</Avatar>
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
              <Button onClick={() => handleAddComment(post.id)}>Post</Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

// Removed duplicate useEffect implementation
