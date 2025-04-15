import React from 'react';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';

const LearningProgressPage = () => {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto bg-white text-gray-800">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center drop-shadow-sm">
        🎓 Learning Progress Overview
      </h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <LearningProgressTabs />
      </div>
    </div>
  );
};

export default LearningProgressPage;
