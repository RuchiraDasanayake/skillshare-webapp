import React, { useState } from 'react';
import LearningProgressList from './LearningProgressList';

const LearningProgressTabs = () => {
  const [activeTab, setActiveTab] = useState('COMPLETED_TUTORIAL');

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('COMPLETED_TUTORIAL')}
          className={`px-4 py-2 rounded ${activeTab === 'COMPLETED_TUTORIAL' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Completed Tutorials
        </button>
        <button
          onClick={() => setActiveTab('ONGOING_TUTORIAL')}
          className={`px-4 py-2 rounded ${activeTab === 'ONGOING_TUTORIAL' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Ongoing Tutorials
        </button>
        <button
          onClick={() => setActiveTab('NEW_SKILL')}
          className={`px-4 py-2 rounded ${activeTab === 'NEW_SKILL' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          New Skills Learned
        </button>
        <button
          onClick={() => setActiveTab('MILESTONE')}
          className={`px-4 py-2 rounded ${activeTab === 'MILESTONE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Learning Milestones
        </button>
      </div>
      <div className="border rounded p-4 shadow">
        <LearningProgressList type={activeTab} />
      </div>
    </div>
  );
};

export default LearningProgressTabs;
