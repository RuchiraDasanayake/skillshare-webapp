// src/pages/LearningProgressPage.tsx
import React from 'react';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';

const LearningProgressPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Learning Progress</h1>
      <LearningProgressTabs />
    </div>
  );
};

export default LearningProgressPage;
