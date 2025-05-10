import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: "🏠", text: "Home" },
    { path: "/all-posts", icon: "📜", text: "Browse" },
    { path: "/create", icon: "✍️", text: "Create" },
    { path: "/my-posts", icon: "📚", text: "My Posts" },
    { path: "/profile", icon: "👤", text: "Profile" },
  ];
  
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