// src/context/NotificationContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { NotificationDTO } from '../notifications/NotificationList';
import { getNotifications, addNotification as apiAddNotification } from '../api/notificationApi';
import { useWebSocket } from '../hooks/useWebSocket';
import { useUser } from './UserContext';

interface NotificationContextProps {
  notifications: NotificationDTO[];
  loadNotifications: (userId: number) => Promise<void>;
  addNewNotification: (notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userId } = useUser();
  const { lastMessage } = useWebSocket(userId || '');

  const loadNotifications = async (userId: number) => {
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const addNewNotification = async (notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      await apiAddNotification(notification);
      await loadNotifications(notification.recipientId);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadNotifications(parseInt(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (lastMessage) {
      setNotifications((prev) => [lastMessage, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }
  }, [lastMessage]);

  return (
    <NotificationContext.Provider value={{ notifications, loadNotifications, addNewNotification, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
