import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile/Profile';
import Home from './pages/HomePage';
import Signin from './components/auth/Signin';
import CreatePostForm from './components/CreatePostForm';
import MyPosts from './components/MyPosts';
import PostList from './components/PostList';
import Signup from './components/auth/Signup';
import { isAuthenticated, setupAuthInterceptor } from './components/Authentication/auth';
import axios from 'axios';
import Navbar from './components/Navigation/NavBar';

// Setup axios interceptors for automatic authentication headers
setupAuthInterceptor(axios);

// Protected route component
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('Access to protected route denied - redirecting to login');
    return <Navigate to="/login" />;
  }
  return children;
};

// Layout component to handle spacing with fixed navbar
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* pt-24 adds padding top to push content below navbar */}
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Add the rest of the routes mentioned in your NavBar */}
        <Route path="/all-posts" element={
          <ProtectedRoute>
            <PostList />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePostForm />
          </ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        } />
        
        {/* Redirect any unmatched route to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;