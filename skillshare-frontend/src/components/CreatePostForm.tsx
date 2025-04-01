import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CURRENT_USER_ID, postApi } from '../api/postApi';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../config/firebaseConfig';

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
] as const;

type SkillCategory = typeof SKILL_CATEGORIES[number];

interface MediaFile {
  file: File;
  previewUrl: string;
  uploadProgress?: number;
}

interface FormData {
  title: string;
  description: string;
  skillCategory: SkillCategory | '';
}

const CreatePostForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    skillCategory: '',
  });
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
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
      for (const media of mediaFiles) {
        if (media.file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          throw new Error(`File ${media.file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        }
      }
  
      setIsSubmitting(true);
  
      // Upload files to Firebase and get URLs
      const mediaUrls = await Promise.all(
        mediaFiles.map(async (media, index) => {
          try {
            const postId = "test2"
            const storageRef = ref(storage, `posts/${postId}/${media.file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, media.file);
      
            await new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setMediaFiles(prev => prev.map((file, i) =>
                    i === index ? { ...file, uploadProgress: progress } : file
                  ));
                },
                (error) => reject(error),
                () => resolve(uploadTask)
              );
            });
      
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            return fileUrl;
          } catch (err) {
            console.error('Error uploading file:', err);
            throw new Error(`Failed to upload ${media.file.name}`);
          }
        })
      );
        
      // Create post data
      const postData = {
        ...formData,
        mediaUrls,
        userId: CURRENT_USER_ID
      };
  
      console.log('Post data:', postData); // Log the post data
  
      // Call API to create post
      await postApi.create(postData);
  
      // Reset form
      setFormData({
        title: '',
        description: '',
        skillCategory: '',
      });
      setMediaFiles([]);
  
      // Show success
      alert('Post created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err); // Log the error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .slice(0, MAX_MEDIA_FILES - mediaFiles.length)
        .filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
      
      setMediaFiles(prev => [
        ...prev,
        ...newFiles.map(file => ({
          file,
          previewUrl: URL.createObjectURL(file)
        }))
      ]);
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
      const newFiles = Array.from(e.dataTransfer.files)
        .slice(0, MAX_MEDIA_FILES - mediaFiles.length)
        .filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
      
      setMediaFiles(prev => [
        ...prev,
        ...newFiles.map(file => ({
          file,
          previewUrl: URL.createObjectURL(file)
        }))
      ]);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(mediaFiles[index].previewUrl);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

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
            Posting as <span className="font-semibold">{"currentUser.name"}</span>
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
                  className="w-full px-5 py-3 pr-10 rounded-lg border-2 border-purple-300 shadow-md focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-200 bg-gradient-to-r from-purple-100 to-purple-50"
                  required
                >
                  <option value="">Select a category</option>
                  {SKILL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-purple-800 mb-2"
              >
                Skill Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us more about your skill!"
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Media Files */}
            <div
              className={`mb-6 p-4 border-2 border-dashed rounded-xl ${
                isDragging ? 'border-purple-500' : 'border-purple-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <p className="text-center text-purple-700">Drag & drop media files here or click to browse</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="mediaFileInput"
              />
              <label htmlFor="mediaFileInput" className="block text-center text-purple-500 cursor-pointer">
                Click here to select files
              </label>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative">
                    <img
                      src={media.previewUrl}
                      alt={`preview-${index}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    {media.uploadProgress && (
                      <div
                        className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-1"
                        style={{ width: `${media.uploadProgress}%` }}
                      >
                        {media.uploadProgress.toFixed(0)}%
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-xl shadow-md hover:bg-purple-700 focus:outline-none disabled:bg-gray-400 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating post...' : 'Create Post'}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;
