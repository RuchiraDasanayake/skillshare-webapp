import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { learningPlanApi } from '../../api/learningPlanApi';
import { CreateLearningPlanRequest } from '../../types/learing-plan-types';

interface CreateLearningPlanModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateLearningPlanModal: React.FC<CreateLearningPlanModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateLearningPlanRequest>({
    title: '',
    topics: [''],
    resources: [''],
    timeline: [{ topic: '', expectedCompletionDate: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    const titleRegex = /^[a-zA-Z0-9\s\-_]{3,100}$/;
    if (!titleRegex.test(formData.title)) {
      setError('Title must be 3-100 characters long and can only contain letters, numbers, spaces, hyphens, and underscores');
      return false;
    }

    if (formData.topics.some(topic => !topic.trim())) {
      setError('All topics must be filled');
      return false;
    }

    if (formData.timeline.some(t => !t.topic.trim() || !t.expectedCompletionDate)) {
      setError('All timeline entries must be complete');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    const currentUserId:string = localStorage.getItem('userId')!;
    try {
      await learningPlanApi.createLearningPlan(currentUserId, formData); // Replace with actual user ID
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create learning plan');
    } finally {
      setIsLoading(false);
    }
  };

  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, ''],
      timeline: [...prev.timeline, { topic: '', expectedCompletionDate: '' }]
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Create Learning Plan</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter plan title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics <span className="text-red-500">*</span>
            </label>
            {formData.topics.map((topic, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    const newTopics = [...formData.topics];
                    newTopics[index] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      topics: newTopics,
                      timeline: prev.timeline.map((t, i) => 
                        i === index ? { ...t, topic: e.target.value } : t
                      )
                    }));
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`Topic ${index + 1}`}
                />
                <input
                  type="date"
                  value={formData.timeline[index]?.expectedCompletionDate || ''}
                  onChange={(e) => {
                    const newTimeline = [...formData.timeline];
                    newTimeline[index] = {
                      ...newTimeline[index],
                      expectedCompletionDate: e.target.value
                    };
                    setFormData(prev => ({ ...prev, timeline: newTimeline }));
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formData.topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTopic}
              className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Topic
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resources
            </label>
            {formData.resources.map((resource, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => {
                    const newResources = [...formData.resources];
                    newResources[index] = e.target.value;
                    setFormData(prev => ({ ...prev, resources: newResources }));
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`Resource ${index + 1}`}
                />
                {formData.resources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addResource}
              className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Resource
            </button>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                  Creating...
                </>
              ) : (
                'Create Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLearningPlanModal;