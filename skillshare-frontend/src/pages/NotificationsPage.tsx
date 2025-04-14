import React from 'react';
import NotificationList from '../notifications/NotificationList';
import { useUser } from '../context/UserContext';

const NotificationsPage = () => {
  const { userId } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Notifications</h1>
      {userId ? <NotificationList userId={userId} /> : <p>Loading user...</p>}
    </div>
  );
};

export default NotificationsPage;
