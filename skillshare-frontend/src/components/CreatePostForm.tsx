import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { CURRENT_USER_ID, postApi } from '../api/postApi';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../config/firebaseConfig';
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const MAX_MEDIA_FILES = 3;
const MAX_FILE_SIZE_MB = 10;
const MAX_VIDEO_DURATION = 30;
const DEFAULT_IMAGE_URL = "gs://skillshare-db.firebasestorage.app/default.png"; 
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
  duration?: number;
  isVideo?: boolean;
}

interface FormData {
  title: string;
  description: string;
  skillCategory: SkillCategory | '';
}

// Utility to check if file is a video
const isVideoFile = (file: File) => file.type.startsWith('video/');

// Utility to get video duration
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// const openai = new OpenAI({
//   apiKey: "KEY",
//   dangerouslyAllowBrowser: true,
// });

// const generateDescription = async (title: string, category: string) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: `Write a short engaging description for a skill post titled "${title}" under the "${category}" category.`,
//         },
//       ],
//     });

//     return completion.choices[0]?.message?.content || "";
//   } catch (error) {
//     console.error("Error generating description:", error);
//     return "";
//   }
// };

// const ai = new GoogleGenAI({
//   apiKey: "KEY"
// });

// const generateDescription = async (title: string, category: string): Promise<string> => {
//   try {
//     const prompt = `Write a short and engaging description for a skill post titled "${title}" under the "${category}" category.`;

//     const result = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: prompt,
//     });

//     return result.text ?? "Failed to generate description.";
//   } catch (error) {
//     console.error("Error generating description:", error);
//     return "Failed to generate description.";
//   }
// };



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
      if (mediaFiles.length > MAX_MEDIA_FILES) throw new Error(`Maximum ${MAX_MEDIA_FILES} files allowed`);
  
      // Check file sizes and video durations
      for (const media of mediaFiles) {
        if (media.file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          throw new Error(`File ${media.file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        }
        if (media.isVideo && media.duration && media.duration > MAX_VIDEO_DURATION) {
          throw new Error(`Video ${media.file.name} exceeds ${MAX_VIDEO_DURATION} second limit`);
        }
      }
  
      setIsSubmitting(true);
  
      let mediaUrls: string[] = [];
      
      // Only upload files if they exist, otherwise use default URL
      if (mediaFiles.length > 0) {
        mediaUrls = await Promise.all(
          mediaFiles.map(async (media, index) => {
            try {
              const postId = "temp_post_id"; // Replace with actual post ID when available
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
      } else {
        // Use the default image URL
        mediaUrls = [await getDownloadURL(ref(storage, DEFAULT_IMAGE_URL))];
      }
        
      // Create post data
      const postData = {
        ...formData,
        mediaUrls,
        userId: CURRENT_USER_ID
      };
  
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
      console.error('Error creating post:', err);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
        .slice(0, MAX_MEDIA_FILES - mediaFiles.length)
        .filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

      try {
        const processedFiles = await Promise.all(
          files.map(async (file) => {
            const isVideo = isVideoFile(file);
            let duration = 0;
            
            if (isVideo) {
              duration = await getVideoDuration(file);
              if (duration > MAX_VIDEO_DURATION) {
                throw new Error(`Video exceeds ${MAX_VIDEO_DURATION} second limit (${Math.ceil(duration)}s)`);
              }
            }

            return {
              file,
              previewUrl: URL.createObjectURL(file),
              isVideo,
              duration
            };
          })
        );

        setMediaFiles(prev => [...prev, ...processedFiles]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid video file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files)
        .slice(0, MAX_MEDIA_FILES - mediaFiles.length)
        .filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

      try {
        const processedFiles = await Promise.all(
          files.map(async (file) => {
            const isVideo = isVideoFile(file);
            let duration = 0;
            
            if (isVideo) {
              duration = await getVideoDuration(file);
              if (duration > MAX_VIDEO_DURATION) {
                throw new Error(`Video exceeds ${MAX_VIDEO_DURATION} second limit (${Math.ceil(duration)}s)`);
              }
            }

            return {
              file,
              previewUrl: URL.createObjectURL(file),
              isVideo,
              duration
            };
          })
        );

        setMediaFiles(prev => [...prev, ...processedFiles]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid video file');
      }
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
            Posting as <span className="font-semibold">{CURRENT_USER_ID}</span>
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
              <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Briefly describe what you'll be sharing..."
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              />
              {/* <button
                type="button"
                className="mt-2 text-sm text-purple-600 underline hover:text-purple-800"
                onClick={async () => {
                  if (!formData.title || !formData.skillCategory) {
                    setError("Title and category are required to generate a description.");
                    return;
                  }
                  setError(null);
                  const generated = await generateDescription(formData.title, formData.skillCategory);
                  setFormData(prev => ({ ...prev, description: generated }));
                }}
              >
                Generate Description with AI
              </button> */}
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
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="mediaFileInput"
              />
              <label 
                htmlFor="mediaFileInput" 
                className="block text-center text-purple-500 cursor-pointer hover:text-purple-700 transition-colors"
              >
                Click here to select files (Max {MAX_MEDIA_FILES} files, {MAX_FILE_SIZE_MB}MB each, videos max {MAX_VIDEO_DURATION}s)
              </label>
              <p className="text-center text-sm text-purple-400 mt-1">
                {mediaFiles.length === 0 ? 
                  "No files selected - a default image will be used" : 
                  `${mediaFiles.length} file${mediaFiles.length !== 1 ? 's' : ''} selected`}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.isVideo ? (
                      <div className="relative w-full h-48 bg-black rounded-xl flex items-center justify-center">
                        <video
                          src={media.previewUrl}
                          className="max-h-full max-w-full object-contain"
                          muted
                          loop
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black bg-opacity-50 rounded-full p-3">
                            <Play className="text-white w-6 h-6" />
                          </div>
                        </div>
                        {media.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {Math.ceil(media.duration)}s
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={media.previewUrl}
                        alt={`preview-${index}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    )}
                    {media.uploadProgress && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50">
                        <div 
                          className="h-1 bg-purple-500 transition-all duration-300"
                          style={{ width: `${media.uploadProgress}%` }}
                        />
                        <span className="text-white text-xs block text-center">
                          {media.uploadProgress.toFixed(0)}%
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-700" />
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
              {isSubmitting ? 'Creating post...' : 'Share Post'}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;