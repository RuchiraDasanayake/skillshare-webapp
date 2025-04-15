import React, { useState } from 'react';

export default function CompletedTutorialCard({ tutorial }: any) {
  const [summary, setSummary] = useState(tutorial.summary || tutorial.description || '');
  const [isEditing, setIsEditing] = useState(!summary);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tempSummary, setTempSummary] = useState(summary);

  const handleSave = async () => {
    await fetch(`http://localhost:8080/api/progress/${tutorial.id}/summary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: tempSummary
    });
    setSummary(tempSummary);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setSummary('');
    setTempSummary('');
    setIsEditing(true);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold text-primary mb-1">{tutorial.courseName || tutorial.title}</h2>
      <p className="text-sm text-gray-500 mb-1">Completed: {tutorial.completionDate}</p>
      <p className="text-sm text-gray-700 mb-2">
        <strong>Skills:</strong> {tutorial.skills?.join(', ') || tutorial.skillsLearned}
      </p>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            value={tempSummary}
            onChange={e => setTempSummary(e.target.value)}
            placeholder="Write a short summary about what you learned..."
          />
          <button
            onClick={handleSave}
            className="self-start bg-button hover:bg-button-dark text-white px-4 py-2 rounded transition"
          >
            Save Summary
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-sm text-gray-800">
            <strong>Summary:</strong> {summary}
          </p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline">
              Update
            </button>
            <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mt-4 bg-gray-50 border border-red-300 p-3 rounded">
          <p className="text-sm text-gray-800 mb-2">Are you sure you want to delete this summary?</p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm text-gray-600 hover:underline"
            >
              No
            </button>
            <button
              onClick={confirmDelete}
              className="text-sm text-red-600 hover:underline"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
