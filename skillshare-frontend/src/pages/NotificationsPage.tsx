import React from 'react';
import { useUser } from '../context/UserContext';
import NotificationList from '../notifications/NotificationList';

const NotificationsPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto bg-white text-gray-800">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center drop-shadow-sm">
        🔔 Your Notifications
      </h1>
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <NotificationList userId={user.id} />
      </div>
    </div>
  );
};

export default NotificationsPage;
