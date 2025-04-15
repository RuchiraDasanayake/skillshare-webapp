import { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Notifications</h2>
        <Button onClick={loadNotifications} variant="outlined" className="hover:bg-primary/10">
          Refresh
        </Button>
      </div>

      {loading ? (
        <Typography className="text-gray-500">Loading...</Typography>
      ) : notifications.length === 0 ? (
        <Typography className="text-gray-500">No notifications to show.</Typography>
      ) : (
        <List className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <ListItem key={notification.id} className="flex items-start gap-2 py-3">
              <Badge
                color="primary"
                variant={notification.isRead ? 'standard' : 'dot'}
                sx={{ mr: 2 }}
              />
              <ListItemText
                primary={<span className="text-sm text-gray-800">{notification.message}</span>}
                secondary={<span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
