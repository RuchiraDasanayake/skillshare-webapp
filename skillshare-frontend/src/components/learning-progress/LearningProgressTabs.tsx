// src/components/learning-progress/LearningProgressTabs.tsx
import React, { useState } from 'react';
import LearningProgressList from './LearningProgressList';

const LearningProgressTabs = () => {
  const [activeTab, setActiveTab] = useState('COMPLETED_TUTORIAL');

  const tabs = [
    { label: 'Completed Tutorials', type: 'COMPLETED_TUTORIAL' },
    { label: 'Ongoing Tutorials', type: 'ONGOING_TUTORIAL' },
    { label: 'New Skills Learned', type: 'NEW_SKILL' },
    { label: 'Learning Milestones', type: 'MILESTONE' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.type ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="border rounded p-4 shadow bg-white">
        <LearningProgressList type={activeTab} />
      </div>
    </div>
  );
};

export default LearningProgressTabs;
