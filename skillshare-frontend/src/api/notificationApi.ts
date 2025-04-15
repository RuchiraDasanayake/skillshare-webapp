import { NotificationDTO } from '../models/notificationTypes';

export const getNotifications = async (userId: number): Promise<NotificationDTO[]> => {
  const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }
  return await response.json();
};

export const addNotification = async (notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>): Promise<void> => {
  await fetch('http://localhost:8080/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification)
  });
};
