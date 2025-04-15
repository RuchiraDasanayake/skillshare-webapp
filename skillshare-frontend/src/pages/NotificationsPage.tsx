// src/pages/NotificationsPage.tsx
import React from 'react';
import { useUser } from '../context/UserContext';
import NotificationList from '../notifications/NotificationList';

const NotificationsPage = () => {
  const { user } = useUser();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Notifications</h1>
      <NotificationList userId={user.id} />
    </div>
  );
};

export default NotificationsPage;
