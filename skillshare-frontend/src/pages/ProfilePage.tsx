import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-gray-800">
      <h1 className="text-4xl font-bold text-primary mb-10">Welcome to Your Profile</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => navigate(`/profile/${userId}/notifications`)}
          className="bg-button hover:bg-button-dark text-white py-3 rounded-xl shadow-md transition duration-300"
        >
          🔔 View Notifications
        </button>

        <button
          onClick={() => navigate(`/profile/${userId}/posts`)}
          className="bg-button hover:bg-button-dark text-white py-3 rounded-xl shadow-md transition duration-300"
        >
          📝 View Posts
        </button>

        <button
          onClick={() => navigate(`/profile/${userId}/progress`)}
          className="bg-button hover:bg-button-dark text-white py-3 rounded-xl shadow-md transition duration-300"
        >
          🎯 View Learning Progress
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
