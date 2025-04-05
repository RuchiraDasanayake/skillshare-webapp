import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PostList from "./components/PostList";
import CreatePostForm from "./components/CreatePostForm";
import MyPosts from "./components/MyPosts";
import Home from "./pages/HomePage";
import { PostProvider } from "./context/PostContext";
import ProfileHome from "./components/ProfileHome";

const App: React.FC = () => {
  return (
    <PostProvider>
      <Router>
        {/* Navigation Bar */}
        <motion.nav 
          className="bg-white shadow-md fixed top-0 w-full z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <Link to="/" className="text-2xl font-bold flex items-center space-x-2 text-blue-600">
              <span className="text-3xl">💡</span>
              <span>SkillZen</span>
            </Link>
            
            <ul className="flex space-x-6">
              {[
                { path: "/", icon: "🏠", text: "Home" },
                { path: "/all-posts", icon: "📜", text: "Browse" },
                { path: "/create", icon: "✍️", text: "Create", highlight: true },
                { path: "/my-posts", icon: "📚", text: "My Posts" },
                { path: "/profile", icon: "👤", text: "Profile" },
              ].map(({ path, icon, text, highlight }) => (
                <motion.li 
                  key={path} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={path} className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                    highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:text-blue-600"
                  }`}>
                    <span>{icon}</span>
                    <span>{text}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.nav>

        {/* Routes */}
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
