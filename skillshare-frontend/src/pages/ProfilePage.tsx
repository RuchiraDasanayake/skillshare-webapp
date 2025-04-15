// src/pages/ProfilePage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Your Profile</h1>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate(`/profile/${userId}/notifications`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          View Notifications
        </button>
        <button
          onClick={() => navigate(`/profile/${userId}/posts`)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          View Posts
        </button>
        <button
          onClick={() => navigate(`/profile/${userId}/progress`)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded shadow"
        >
          View Learning Progress
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
