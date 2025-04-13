// hooks/useWebSocket.ts

import { useEffect, useState } from 'react';

export const useWebSocket = () => {
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: '🎉 New course released: Advanced TypeScript!',
        type: 'PROGRESS_UPDATE',
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setLastMessage({ data: JSON.stringify(newNotification) });
    }, 15000); // every 15s for demo

    return () => clearInterval(interval);
  }, []);

  return { lastMessage };
};
