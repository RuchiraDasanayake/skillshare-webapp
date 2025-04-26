// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthPage from './components/AuthPage';
import Home from './pages/HomePage';
import ProfileHome from './components/ProfileHome';
import CreatePostForm from './components/CreatePostForm';
import MyPosts from './components/MyPosts';
import PostList from './components/PostList';
import Navbar from './components/Navigation/NavBar';
import MainPage from './components/Mainpage';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfileHome />} />
        <Route path="/create" element={<CreatePostForm />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/posts" element={<PostList />} />
      </Routes>
    </>
  );
};

export default App;
