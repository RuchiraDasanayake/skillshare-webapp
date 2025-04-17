import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import CreatePostForm from "./components/CreatePostForm";
import MyPosts from "./components/MyPosts";
import Home from "./pages/HomePage";
import { PostProvider } from "./context/PostContext";
import ProfileHome from "./components/ProfileHome";
import Navbar from "./components/Navigation/NavBar"; 

const App: React.FC = () => {
  return (
    <PostProvider>
      <Router>
        <Navbar /> {/* 🆕 Use the Navbar */}
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-posts" element={<PostList />} />
            <Route path="/create" element={<CreatePostForm />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/profile" element={<ProfileHome />} />
          </Routes>
        </div>
      </Router>
    </PostProvider>
  );
};

export default App;
