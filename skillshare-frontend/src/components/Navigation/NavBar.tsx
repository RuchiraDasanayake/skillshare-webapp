import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isAuthenticated, logout } from "../Authentication/auth"; // adjust the path if needed

const Navbar: React.FC = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: "🏠", text: "Home" },
    { path: "/all-posts", icon: "📜", text: "Browse" },
    { path: "/create", icon: "✍️", text: "Create" },
    { path: "/my-posts", icon: "📚", text: "My Posts" },
    { path: "/profile", icon: "👤", text: "Profile" },
  ];


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      className="bg-white shadow-md fixed top-0 w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
        >
          <span className="text-3xl">💡</span>
          <span>SkillZen</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-4 items-center">
          {navItems.map(({ path, icon, text }) => {
            const isActive = location.pathname === path;

            return (
              <motion.li
                key={path}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-200 font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{text}</span>
                </Link>
              </motion.li>
            );
          })}

          {/* ✅ Logout Button (if authenticated) */}
          {isAuthenticated() && (
            <motion.li whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition duration-200 font-medium"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </motion.li>
          )}
        </ul>

  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">💡</span>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                SkillZen
              </span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex">
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              {navItems.map(({ path, icon, text }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    <span className="mr-1.5">{icon}</span>
                    <span>{text}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;