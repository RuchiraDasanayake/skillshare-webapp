// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAuthenticated, 
  setAuthToken, 
  removeAuthToken, 
  getAuthToken,
  decodeToken,
  getUserIdFromToken
} from '../Authentication/auth';

interface User {
  id?: string;
  email?: string;
  fullName?: string;
  image?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
  getUserId: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => false,
  getUserId: () => null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (token: string) => {
    setAuthToken(token);
    setIsLoggedIn(true);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser({
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        fullName: decoded.name || decoded.fullName,
        image: decoded.image
      });
    }
  };

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const checkAuthStatus = (): boolean => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    return authenticated;
  };

  const getUserId = (): string | null => {
    return getUserIdFromToken();
  };

  useEffect(() => {
    if (isLoggedIn && !user) {
      const decoded = decodeToken();
      if (decoded) {
        setUser({
          id: decoded.userId || decoded.sub,
          email: decoded.email,
          fullName: decoded.name || decoded.fullName,
          image: decoded.image
        });
      }
    }
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        user, 
        login, 
        logout, 
        checkAuthStatus,
        getUserId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;