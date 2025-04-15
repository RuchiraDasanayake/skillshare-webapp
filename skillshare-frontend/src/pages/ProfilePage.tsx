import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 transition duration-500 ease-in-out transform hover:scale-105">
        Welcome to Your Profile
      </h1>

      <div className="flex flex-col gap-5 w-full max-w-md">
        <button
          onClick={() => navigate(`/profile/${userId}/notifications`)}
          className="bg-button hover:bg-button-dark text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          🔔 View Notifications
        </button>

        <button
          onClick={() => navigate(`/profile/${userId}/posts`)}
          className="bg-button hover:bg-button-dark text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          📝 View Posts
        </button>

        <button
          onClick={() => navigate(`/profile/${userId}/progress`)}
          className="bg-button hover:bg-button-dark text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          🎯 View Learning Progress
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
