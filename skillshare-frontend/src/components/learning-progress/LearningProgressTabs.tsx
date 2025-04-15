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
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition duration-200 shadow-sm ${
              activeTab === tab.type
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <LearningProgressList type={activeTab} />
      </div>
    </div>
  );
};

export default LearningProgressTabs;