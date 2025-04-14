import React, { useEffect, useState } from 'react';
import { getLearningProgressByType } from '../../api/progressApi';
import { useUser } from '../../context/UserContext';

interface Props {
  type: string;
}

const LearningProgressList: React.FC<Props> = ({ type }) => {
  const { userId } = useUser();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    getLearningProgressByType(Number(userId), type)
      .then(setData)
      .catch((err) => console.error('Failed to load progress', err));
  }, [userId, type]);

  if (!userId) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Progress: {type}</h2>
      {data.map((item) => (
        <div key={item.id} className="border p-2 mb-2 rounded shadow">
          <strong>{item.title}</strong> ({item.type})
        </div>
      ))}
    </div>
  );
};

export default LearningProgressList;
