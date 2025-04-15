// src/pages/ProfilePage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate(`/profile/${userId}/notifications`)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View Notifications
        </button>
        <button
          onClick={() => navigate(`/profile/${userId}/posts`)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          View Posts
        </button>
        <button
          onClick={() => navigate(`/profile/${userId}/progress`)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Learning Progress
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
