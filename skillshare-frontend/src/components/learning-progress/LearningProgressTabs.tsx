import React, { useState } from 'react';
import LearningProgressList from './LearningProgressList';

const LearningProgressTabs = () => {
  const [activeTab, setActiveTab] = useState('completed');

  return (
    <div>
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

export default LearningProgressTabs;
