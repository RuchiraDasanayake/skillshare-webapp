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
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`px-4 py-2 text-sm font-medium rounded-full shadow transition duration-200 ${
              activeTab === tab.type
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-4 shadow">
        <LearningProgressList type={activeTab} />
      </div>
    </div>
  );
};

export default LearningProgressTabs;