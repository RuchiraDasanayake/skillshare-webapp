// src/components/Post.tsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

interface PostProps {
  postId: string;
  postOwnerId: string; // Post owner id to send notifications to
  postContent: string;
}

const Post: React.FC<PostProps> = ({ postId, postOwnerId, postContent }) => {
  const { userId } = useParams();
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLikes(likes + 1);

    // Create a notification for the post owner when liked
    const notification = {
      userId: postOwnerId, // Send notification to post owner
      message: `${userId} liked your post!`,
      type: 'like',
      timestamp: new Date().toISOString(),
    };

    // You'd want to handle adding this notification properly, depending on your state management (Redux, context API, etc.)
    console.log('Notification for like:', notification);
  };

  const handleComment = () => {
    if (commentText) {
      setComments([...comments, commentText]);
      setCommentText('');

      // Create a notification for the post owner when commented
      const notification = {
        userId: postOwnerId, // Send notification to post owner
        message: `${userId} commented: "${commentText}" on your post.`,
        type: 'comment',
        timestamp: new Date().toISOString(),
      };

      // Add the notification logic here (again, depending on your state management)
      console.log('Notification for comment:', notification);
    }
  };

  return (
    <Box sx={{ border: 1, p: 2, mb: 2 }}>
      <Typography variant="h6">Post Content</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {postContent}
      </Typography>
      <Button onClick={handleLike}>Like</Button>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {likes} Likes
      </Typography>
      <TextField
        label="Add a comment"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button onClick={handleComment} sx={{ mt: 1 }}>
        Add Comment
      </Button>

      <Box sx={{ mt: 2 }}>
        {comments.map((comment, index) => (
          <Typography key={index} variant="body2" sx={{ mt: 1 }}>
            {comment}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Post;
