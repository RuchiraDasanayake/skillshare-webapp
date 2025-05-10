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
    { path: "/profile/1/progress", icon: "📈", text: "Progress" } 
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
                SkillShare
              </span>
            </Link>
          </div>
          {/* Navigation Items */}
          <div className="flex space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm px-3 py-2 rounded-md font-medium ${
                  location.pathname === item.path
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.icon} {item.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
