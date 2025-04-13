// src/api/notificationApi.ts
import { NotificationDTO } from '../models/notificationTypes'; // Update the path to the correct location

export const getNotifications = async (userId: number): Promise<NotificationDTO[]> => {
  const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}`);
  return await response.json();
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
    method: 'PUT'
  });
};

export const markAllNotificationsAsRead = async (userId: number): Promise<void> => {
  await fetch(`http://localhost:8080/api/notifications/user/${userId}/read-all`, {
    method: 'PUT'
  });
};

export const addNotification = async (notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>): Promise<void> => {
  await fetch('http://localhost:8080/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notification)
  });
};