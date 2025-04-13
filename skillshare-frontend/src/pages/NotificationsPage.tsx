import { useParams } from 'react-router-dom';
import NotificationList from '../notifications/NotificationList';

export default function NotificationsPage() {
  const { userId } = useParams();
  return <NotificationList userId={userId!} />;
}