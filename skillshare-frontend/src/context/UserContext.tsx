// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextProps {
  user: User;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ id: 1, username: 'demo_user', email: 'demo@example.com' });

  // Simulated API call to fetch logged-in user
  useEffect(() => {
    setUser({ id: 1, username: 'demo_user', email: 'demo@example.com' });
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
