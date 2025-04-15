import React from 'react';
import { useUser } from '../context/UserContext';
import NotificationList from '../notifications/NotificationList';
import { useParams } from 'react-router-dom';

const NotificationsPage = () => {
  const { userId } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      <NotificationList userId={userId} />
    </div>
  );
};

export default NotificationsPage;
