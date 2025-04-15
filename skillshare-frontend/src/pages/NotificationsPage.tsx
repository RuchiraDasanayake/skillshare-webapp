import React from 'react';
import { useUser } from '../context/UserContext';
import NotificationList from '../notifications/NotificationList';

const NotificationsPage = () => {
  const { user } = useUser();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Your Notifications</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <NotificationList userId={user.id} />
      </div>
    </div>
  );
};

export default NotificationsPage;
