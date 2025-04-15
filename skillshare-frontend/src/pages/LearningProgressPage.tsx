import React from 'react';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';

const LearningProgressPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Your Learning Progress</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <LearningProgressTabs />
      </div>
    </div>
  );
};

export default LearningProgressPage;
