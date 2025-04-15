import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

interface UserContextProps {
  userId: number;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId = '1' } = useParams();
  const parsedId = parseInt(userId, 10);

  return (
    <UserContext.Provider value={{ userId: parsedId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
