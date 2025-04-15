import React, { useState } from 'react';
import LearningProgressList from '../components/learning-progress/LearningProgressList';

const LearningProgressPage = () => {
  const [activeTab, setActiveTab] = useState('completed');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Learning Progress</h1>
      <div className="flex space-x-2 mb-4">
        <button onClick={() => setActiveTab('completed')}>Completed Tutorials</button>
        <button onClick={() => setActiveTab('ongoing')}>Ongoing Tutorials</button>
        <button onClick={() => setActiveTab('skills')}>New Skills Learned</button>
        <button onClick={() => setActiveTab('milestones')}>Learning Milestones</button>
      </div>
      <div className="border rounded p-4 shadow">
        <LearningProgressList type={activeTab} />
      </div>
    </div>
  );
};

export default LearningProgressPage;
