// hooks/useWebSocket.ts
import { Client as StompClient } from '@stomp/stompjs';

export const useWebSocket = () => {
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const SockJS = require('sockjs-client');
    const socket = new SockJS('http://localhost:8080/api/ws');
    const stompClient = new StompClient({ webSocketFactory: () => socket });
    
    stompClient.onConnect = () => {
      stompClient.subscribe('/user/queue/notifications', (message) => {
        setLastMessage(JSON.parse(message.body));
      });
    };

    stompClient.activate();

    return () => stompClient.deactivate();
  }, []);

  return { lastMessage };
};

function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  let state = initialValue;
  const setState = (newValue: T) => {
    state = newValue;
    // In a real implementation, this would trigger a re-render in a React component.
    console.log('State updated:', state);
  };
  return [state, setState];
}

function useEffect(effect: () => () => void, deps: any[]) {
  const cleanup = effect();
  if (typeof cleanup === 'function') {
    // Simulate cleanup when dependencies change or component unmounts
    console.log('Cleanup function executed');
    cleanup();
  }
}
// Removed duplicate implementation of useEffect.
// Removed duplicate implementation of useState.
