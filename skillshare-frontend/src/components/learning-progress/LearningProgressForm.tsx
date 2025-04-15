import React, { useState } from 'react';

interface LearningProgressFormProps {
  userId: number;
  onSubmit: (progress: {
    skill: string;
    progressTitle: string;
    description: string;
    resourcesUsed: string;
    completionPercentage: number;
  }) => void;
  initialData?: {
    skill: string;
    progressTitle: string;
    description: string;
    resourcesUsed: string;
    completionPercentage: number;
  };
}

const LearningProgressForm: React.FC<LearningProgressFormProps> = ({
  userId,
  onSubmit,
  initialData
}) => {
  const [skill, setSkill] = useState(initialData?.skill || '');
  const [progressTitle, setProgressTitle] = useState(initialData?.progressTitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [resourcesUsed, setResourcesUsed] = useState(initialData?.resourcesUsed || '');
  const [completionPercentage, setCompletionPercentage] = useState(initialData?.completionPercentage || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      skill,
      progressTitle,
      description,
      resourcesUsed,
      completionPercentage
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-primary">
        {initialData ? 'Update Progress' : 'Add New Progress'}
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Skill</label>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a skill</option>
          <option value="Coding">Coding</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
          <option value="DIY Crafts">DIY Crafts</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Progress Title</label>
        <input
          type="text"
          value={progressTitle}
          onChange={(e) => setProgressTitle(e.target.value)}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Resources Used</label>
        <input
          type="text"
          value={resourcesUsed}
          onChange={(e) => setResourcesUsed(e.target.value)}
          placeholder="e.g., Online course, Book, Tutorial"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Completion Percentage</label>
        <select
          value={completionPercentage}
          onChange={(e) => setCompletionPercentage(Number(e.target.value))}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
            <option key={value} value={value}>{value}%</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-button hover:bg-button-dark text-white px-4 py-2 rounded transition"
      >
        {initialData ? 'Update Progress' : 'Add Progress'}
      </button>
    </form>
  );
};

export default LearningProgressForm;