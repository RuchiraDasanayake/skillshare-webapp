// src/api/notificationApi.ts
import type { NotificationDTO } from '../notifications/NotificationList';

// In-memory mock data
let notifications: NotificationDTO[] = [
  {
    id: 1,
    type: 'LIKE',
    message: 'John liked your post on React tips!',
    isRead: false,
    createdAt: new Date().toISOString(),
    userId: 1,
  },
  {
    id: 2,
    type: 'COMMENT',
    message: 'Sarah commented on your JavaScript post.',
    isRead: false,
    createdAt: new Date().toISOString(),
    userId: 1,
  },
  {
    id: 3,
    type: 'PROGRESS_UPDATE',
    message: 'You completed the course: JavaScript Basics!',
    isRead: true,
    createdAt: new Date().toISOString(),
    userId: 1,
  },
];

// Fetch all notifications for a specific user
export const getNotifications = async (userId: number): Promise<NotificationDTO[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(notifications.filter((n) => n.userId === userId));
    }, 500);
  });
};

// Mark a specific notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
};

// Add a new notification
export const addNotification = async (
  notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>
): Promise<void> => {
  notifications.push({
    id: Date.now(),
    ...notification,
    createdAt: new Date().toISOString(),
    isRead: false,
  });
};
