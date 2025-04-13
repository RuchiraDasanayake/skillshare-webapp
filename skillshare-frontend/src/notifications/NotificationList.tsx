// src/notifications/NotificationList.tsx
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Button } from '@mui/material';
import { getNotifications } from '../api/notificationApi';

// Export the NotificationDTO type to be used in other parts of the application
export interface NotificationDTO {
  id: number;
  userId: number;
  type: 'LIKE' | 'COMMENT' | 'PROGRESS_UPDATE';
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  userId: string;
}

export default function NotificationList({ userId }: Props) {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const notifs = await getNotifications(parseInt(userId));
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
            <ListItem key={notification.id} divider>
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
