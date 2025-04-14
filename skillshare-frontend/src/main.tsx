// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import ProfilePage from './pages/ProfilePage';
import LearningProgressPage from './pages/LearningProgressPage';
import NotificationsPage from './pages/NotificationsPage';
import PostPage from './pages/PostPage';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/progress" element={<LearningProgressPage />} />
            <Route path="/profile/:userId/notifications" element={<NotificationsPage />} />
            <Route path="/profile/:userId/posts" element={<PostPage />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </UserProvider>
  </React.StrictMode>
);
