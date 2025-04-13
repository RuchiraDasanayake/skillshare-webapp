// src/context/NotificationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NotificationDTO } from '../notifications/NotificationList';  // Now works properly
import { getNotifications as fetchNotifications, addNotification } from '../api/notificationApi';

interface NotificationContextProps {
  notifications: NotificationDTO[];
  loadNotifications: (userId: number) => Promise<void>;
  addNewNotification: (notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

  const loadNotifications = async (userId: number) => {
    const notifications = await fetchNotifications(userId);
    setNotifications(notifications);
  };

  const addNewNotification = (notification: Omit<NotificationDTO, 'id' | 'createdAt' | 'isRead'>) => {
    addNotification(notification); // Call the addNotification API to update the in-memory store
    loadNotifications(notification.userId); // Refresh notifications after a new one is added
  };

  return (
    <NotificationContext.Provider value={{ notifications, loadNotifications, addNewNotification }}>
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
