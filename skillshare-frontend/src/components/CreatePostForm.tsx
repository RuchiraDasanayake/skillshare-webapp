import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPost, getCurrentUser, SkillPostDto } from '../api/postApi';

const MAX_MEDIA_FILES = 3;
const MAX_FILE_SIZE_MB = 10;
const SKILL_CATEGORIES = [
  'Design',
  'Development',
  'Business',
  'Photography',
  'Music',
  'Marketing',
  'Lifestyle',
  'Writing'
];

const CreatePostForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<SkillPostDto, 'id' | 'userId'>>({
    title: '',
    description: '',
    skillCategory: ''
  });
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.skillCategory) throw new Error('Skill category is required');
      if (mediaFiles.length === 0) throw new Error('At least one media file is required');
      if (mediaFiles.length > MAX_MEDIA_FILES) throw new Error(`Maximum ${MAX_MEDIA_FILES} files allowed`);

      // Check file sizes
      for (const file of mediaFiles) {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        }
      }

      setIsSubmitting(true);
      
      // Call API with FormData
      await createPost(formData, mediaFiles);

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        skillCategory: ''
      });
      setMediaFiles([]);
      
      // Show success message or redirect
      alert('Post created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(prev => {
        const newFiles = Array.from(e.target.files || []);
        const combined = [...prev, ...newFiles].slice(0, MAX_MEDIA_FILES);
        return combined;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setMediaFiles(prev => {
        const newFiles = Array.from(e.dataTransfer.files);
        const combined = [...prev, ...newFiles].slice(0, MAX_MEDIA_FILES);
        return combined;
      });
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const currentUser = getCurrentUser();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-extrabold text-purple-900 mb-2">
            Share Your Skill
          </h2>
          <p className="text-purple-600">
            Posting as <span className="font-semibold">{currentUser.name}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {error && (
            <motion.div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Title Field */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-purple-800 mb-2">
                Skill Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What skill are you sharing?"
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Skill Category Field */}
            <div className="mb-6">
              <label
                htmlFor="skillCategory"
                className="block text-sm font-medium text-purple-800 mb-2"
              >
                Skill Category *
              </label>
              <div className="relative">
                <select
                  id="skillCategory"
                  name="skillCategory"
                  value={formData.skillCategory}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 pr-10 rounded-lg border-2 border-purple-300 shadow-md focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-200 bg-gradient-to-r from-purple-50 to-white hover:border-purple-400 appearance-none"
                  required
                >
                  <option value="" className="text-gray-400">Select a category</option>
                  {SKILL_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="text-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <svg
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-purple-500 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your skill in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            {/* Media Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Add Media (Max {MAX_MEDIA_FILES} files) *
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-purple-300 hover:border-purple-400'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-purple-600">
                    {isDragging ? 'Drop your files here' : 'Drag & drop files here, or click to browse'}
                  </p>
                  <input
                    id="media"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="media"
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors duration-200 cursor-pointer"
                  >
                    Select Files
                  </label>
                  <p className="text-xs text-purple-500 mt-2">
                    Max {MAX_FILE_SIZE_MB}MB per file • Images or Videos
                  </p>
                </div>
              </div>

              {mediaFiles.length > 0 && (
                <motion.div 
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {mediaFiles.map((file, index) => (
                    <motion.div 
                      key={index}
                      className="relative group rounded-xl overflow-hidden border border-purple-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <video 
                          src={URL.createObjectURL(file)}
                          className="w-full h-40 object-cover"
                          controls={false}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white text-sm truncate">{file.name}</p>
                        <p className="text-purple-200 text-xs">{(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'bg-purple-400' : 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 shadow-lg hover:shadow-xl'}`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Publish Skill
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          className="mt-8 text-center text-purple-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Your knowledge helps others grow. Share generously!</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;