import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import NotificationsPage from './pages/NotificationsPage';
import LearningProgressPage from './pages/LearningProgressPage';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navigation/NavBar'; // ✅ ADDED

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-white text-gray-800 font-sans">
            <Navbar /> {/* ✅ ADDED */}
            <Routes>
              <Route path="/" element={<Navigate to="/profile/1" replace />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/profile/:userId/posts" element={<PostPage />} />
              <Route path="/profile/:userId/notifications" element={<NotificationsPage />} />
              <Route path="/profile/:userId/progress" element={<LearningProgressPage />} />
            </Routes>
          </div>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
