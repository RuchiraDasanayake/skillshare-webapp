import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import CreatePostForm from "./components/CreatePostForm";
import MyPosts from "./components/MyPosts";
import Home from "./pages/HomePage";
import { PostProvider } from "./context/PostContext";
import Navbar from "./components/Navigation/NavBar";
import LoginPage from "./pages/Auth/LoginPage";
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler";
import ProfilePage from "./pages/User/ProfilePage";
import LearningPlansPage from "./pages/LearningPlans/LearningPlansPage";

const App: React.FC = () => {
  return (
    <PostProvider>
      <Router>
        <Navbar /> {/* 🆕 Use the Navbar */}
        <div className="pt-20">
          <Routes>
            {/* USER_MANAGEMENT_ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/login/oauth2/code/google"
              element={<OAuth2RedirectHandler />}
            />
            {/* APPLICATION_ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/all-posts" element={<PostList />} />
            <Route path="/create" element={<CreatePostForm />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* LEARNING_PLAN_ROUTES */}
            <Route path="/learning-plans" element={<LearningPlansPage />} />
           
          </Routes>
        </div>
      </Router>
    </PostProvider>
  );
};

export default App;
