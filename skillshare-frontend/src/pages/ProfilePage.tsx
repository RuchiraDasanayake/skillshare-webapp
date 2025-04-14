import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';

const ProfilePage = () => {
  const { userId } = useUser();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => navigate('/notifications')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View Notifications
        </button>
        <button
          onClick={() => navigate('/posts')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          View Posts
        </button>
      </div>

      {userId && <LearningProgressTabs />}
    </div>
  );
};

export default ProfilePage;
