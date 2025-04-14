// src/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (userId: string) => {
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/user/${userId}/queue/notifications`, (msg) => {
          setLastMessage(JSON.parse(msg.body));
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame);
      }
    });

    client.activate();

    // ✅ cleanup must be synchronous
    return () => {
      client.deactivate(); // do not await this!
    };
  }, [userId]);

  return { lastMessage };
};
