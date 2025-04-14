import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
  userId: string | null;
  setUserId: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/users/1')
      .then((res) => {
        if (!res.ok) throw new Error('User fetch failed');
        return res.json();
      })
      .then((data) => {
        console.log('Loaded user:', data);
        setUserId(data.id.toString());
      })
      .catch((err) => {
        console.error('Failed to load user:', err);
        setUserId(null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
