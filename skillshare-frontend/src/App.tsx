import React from 'react'
import { Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import CreatePostForm from "./components/CreatePostForm";
import MyPosts from "./components/MyPosts";
import Home from "./pages/HomePage";
import { PostProvider } from "./context/PostContext";
import ProfileHome from "./components/ProfileHome";
import Navbar from "./components/Navigation/NavBar"; 
import MainPage from "./components/Mainpage"
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";


const App: React.FC = () => {



  return (
    <PostProvider>
      <Navbar />
      <div className="pt-20">
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/all-posts" element={<PostList />} />
        <Route path="/create" element={<CreatePostForm />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/profile" element={<ProfileHome />} />
        </Routes>
      </div>
    </PostProvider>
  );
};

export default App;
