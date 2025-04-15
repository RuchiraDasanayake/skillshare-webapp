import React, { useEffect, useState } from 'react';
import { getLearningProgressByType } from '../../api/progressApi';
import { useUser } from '../../context/UserContext';
import CompletedTutorialCard from './CompletedTutorialCard';

interface Props {
  type: string;
}

const LearningProgressList: React.FC<Props> = ({ type }) => {
  const { user } = useUser();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    getLearningProgressByType(user.id, type)
      .then(setData)
      .catch((err) => console.error('Failed to load progress', err));
  }, [user.id, type]);

  if (!user?.id) return <div className="text-center text-secondary">Loading...</div>;
  if (data.length === 0) return <p className="text-gray-500">No progress records available.</p>;

  return (
    <div className="space-y-4">
      {type === 'COMPLETED_TUTORIAL' &&
        data.map((item) => <CompletedTutorialCard key={item.id} tutorial={item} />)}

      {type === 'ONGOING_TUTORIAL' &&
        data.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">
                Progress: <span className="text-blue-600 font-semibold">{item.completionPercentage}%</span>
              </p>
            </div>
            <button
              className="ml-4 px-4 py-2 bg-button hover:bg-button-dark text-white rounded shadow transition"
              onClick={() => window.open(item.resourceUrl || '#', '_blank')}
            >
              Continue Course
            </button>
          </div>
        ))}

      {type === 'NEW_SKILL' &&
        data.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow bg-white">
            <h3 className="font-semibold text-lg text-primary mb-1">{item.title}</h3>
            <p className="text-sm text-gray-700">Skills: {item.skillsLearned}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        ))}

      {type === 'MILESTONE' &&
        data.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow bg-white">
            <h3 className="font-semibold text-lg text-primary mb-1">{item.title}</h3>
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
            {item.completionDate && (
              <p className="text-sm text-gray-400">Achieved on: {item.completionDate}</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default LearningProgressList;