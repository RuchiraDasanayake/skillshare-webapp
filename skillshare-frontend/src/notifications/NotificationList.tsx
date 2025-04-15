// src/notifications/NotificationList.tsx
import { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Button,
  Badge
} from '@mui/material';
import { getNotifications } from '../api/notificationApi';

export interface NotificationDTO {
  id: number;
  recipientId: number;
  senderId?: number;
  senderName?: string;
  postId?: number;
  message: string;
  type: 'LIKE' | 'COMMENT' | 'PROGRESS_UPDATE';
  isRead: boolean;
  createdAt: string;
}

interface Props {
  userId: number;
}

export default function NotificationList({ userId }: Props) {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const notifs = await getNotifications(userId);
    setNotifications(notifs);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>

      <Button onClick={loadNotifications} variant="outlined" sx={{ mb: 2 }}>
        Refresh
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary">No notifications to show.</Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} divider alignItems="flex-start">
              <Badge
                color="primary"
                variant={notification.isRead ? 'standard' : 'dot'}
                sx={{ mr: 2 }}
              />
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
