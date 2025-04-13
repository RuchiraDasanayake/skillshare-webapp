// src/posts/PostPage.tsx
import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

interface Comment {
  id: number;
  userId: string;
  text: string;
}

interface Post {
  id: number;
  userId: string;
  userName: string;
  content: string;
  likedBy: string[];
  comments: Comment[];
}

const mockPosts: Post[] = [
  {
    id: 1,
    userId: '1',
    userName: 'Alex Johnson',
    content: 'Learning React is fun! Just completed the Intermediate course.',
    likedBy: ['2'],
    comments: [
      { id: 1, userId: '2', text: 'Great job Alex!' }
    ]
  },
  {
    id: 2,
    userId: '1',
    userName: 'Alex Johnson',
    content: 'Just started learning TypeScript!',
    likedBy: [],
    comments: []
  }
];

const loggedInUser = { id: '2', name: 'Jane Doe' };

export default function PostPage() {
  const { userId } = useParams();
  const { addNewNotification } = useNotifications(); // Get notifications context
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [editingComment, setEditingComment] = useState<{ postId: number; commentId: number | null; text: string }>({
    postId: -1,
    commentId: null,
    text: ''
  });

  const notifyOwner = async (post: Post, type: 'LIKE' | 'COMMENT', text = '') => {
    if (post.userId !== loggedInUser.id) {
      await addNewNotification({
        userId: parseInt(post.userId),
        type,
        message:
          type === 'LIKE'
            ? `${loggedInUser.name} liked your post: "${post.content.slice(0, 30)}..."`
            : `${loggedInUser.name} commented: "${text}" on your post.`,
      });
    }
  };

  const toggleLike = (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likedBy: post.likedBy.includes(loggedInUser.id)
                ? post.likedBy.filter(uid => uid !== loggedInUser.id)
                : [...post.likedBy, loggedInUser.id]
            }
          : post
      )
    );

    const post = posts.find(p => p.id === postId)!;
    if (!post.likedBy.includes(loggedInUser.id)) {
      notifyOwner(post, 'LIKE');
    }
  };

  const handleAddComment = (postId: number) => {
    if (!newComment[postId]) return;
    const updatedPosts = posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [...post.comments, {
              id: Date.now(),
              userId: loggedInUser.id,
              text: newComment[postId]
            }]
          }
        : post
    );
    setPosts(updatedPosts);
    const post = updatedPosts.find(p => p.id === postId)!;
    notifyOwner(post, 'COMMENT', newComment[postId]);
    setNewComment(prev => ({ ...prev, [postId]: '' }));
  };

  const handleEditComment = (postId: number, commentId: number) => {
    setEditingComment({
      postId,
      commentId,
      text: posts.find(p => p.id === postId)?.comments.find(c => c.id === commentId)?.text || ''
    });
  };

  const handleUpdateComment = () => {
    setPosts(prev =>
      prev.map(post =>
        post.id === editingComment.postId
          ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === editingComment.commentId ? { ...comment, text: editingComment.text } : comment
              )
            }
          : post
      )
    );
    setEditingComment({ postId: -1, commentId: null, text: '' });
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            }
          : post
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Posts by User</Typography>
      {posts
        .filter(post => post.userId === userId)
        .map(post => (
          <Card key={post.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{post.userName.charAt(0)}</Avatar>
                <Typography variant="h6">{post.userName}</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{post.content}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => toggleLike(post.id)}>
                  {post.likedBy.includes(loggedInUser.id) ? <ThumbUp color="primary" /> : <ThumbUpOutlined />}
                </IconButton>
                <Typography variant="body2">{post.likedBy.length} Likes</Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Comments</Typography>
                <List>
                  {post.comments.map(comment => (
                    <ListItem key={comment.id} disablePadding secondaryAction={
                      comment.userId === loggedInUser.id && (
                        <>
                          <IconButton onClick={() => handleEditComment(post.id, comment.id)}><Edit /></IconButton>
                          <IconButton onClick={() => handleDeleteComment(post.id, comment.id)}><Delete /></IconButton>
                        </>
                      )
                    }>
                      <ListItemText
                        primary={comment.text}
                        secondary={comment.userId === loggedInUser.id ? 'You' : 'User ' + comment.userId}
                      />
                    </ListItem>
                  ))}
                </List>
                {editingComment.postId === post.id && editingComment.commentId !== null ? (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                      fullWidth
                      value={editingComment.text}
                      onChange={(e) => setEditingComment(prev => ({ ...prev, text: e.target.value }))}
                      size="small"
                    />
                    <Button onClick={handleUpdateComment} variant="contained">Update</Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Add a comment"
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      size="small"
                    />
                    <Button onClick={() => handleAddComment(post.id)} variant="contained">Post</Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
}
