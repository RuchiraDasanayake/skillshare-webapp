import { useState, useEffect } from "react";
import { Loader2, X, Check, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "../config/firebaseConfig";

interface EditPostFormProps {
  post: any;
  onCancel: () => void;
  categories: string[];
  onSave: (updatedData: {
    title: string;
    description: string;
    skillCategory: string;
    mediaUrls: string[];
  }) => Promise<void>;
}

const SKILL_CATEGORIES = [
  "Design",
  "Development",
  "Business",
  "Photography",
  "Music",
  "Marketing",
  "Lifestyle",
  "Writing"
] as const;

const DEFAULT_IMAGE_PATH = "defaults/default-post-image.png";
const MAX_MEDIA_FILES = 3;
const MAX_FILE_SIZE_MB = 10;

interface MediaFile {
  file: File;
  previewUrl: string;
  uploadProgress?: number;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  post,
  onCancel,
  onSave
}) => {
  const [editData, setEditData] = useState({
    title: post.title,
    description: post.description,
    skillCategory: post.skillCategory,
    mediaUrls: post.mediaUrls || []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setDefaultImageUrl] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    const loadDefaultImage = async () => {
      try {
        const url = await getDownloadURL(ref(storage, DEFAULT_IMAGE_PATH));
        setDefaultImageUrl(url);

        if (editData.mediaUrls.length === 0) {
          setEditData((prev) => ({
            ...prev,
            mediaUrls: [url]
          }));
        }
      } catch (error) {
        console.error("Error loading default image:", error);
        toast.error("Could not load default image");
      }
    };

    loadDefaultImage();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const removeMedia = (index: number) => {
    if (editData.mediaUrls.length <= 1) {
      toast.warning("Cannot delete the last remaining image");
      return;
    }

    const newMediaUrls = [...editData.mediaUrls];
    newMediaUrls.splice(index, 1);
    setEditData((prev) => ({
      ...prev,
      mediaUrls: newMediaUrls
    }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(
      0,
      MAX_MEDIA_FILES - editData.mediaUrls.length
    );

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`);
        continue;
      }

      const mediaPreview = {
        file,
        previewUrl: URL.createObjectURL(file),
        uploadProgress: 0
      };

      setUploadingFiles((prev) => [...prev, mediaPreview]);

      try {
        const storageRef = ref(storage, `edited-post/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadingFiles((prev) =>
              prev.map((item) =>
                item.file.name === file.name
                  ? { ...item, uploadProgress: progress }
                  : item
              )
            );
          },
          () => {
            toast.error(`Failed to upload ${file.name}`);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setEditData((prev) => ({
              ...prev,
              mediaUrls: [...prev.mediaUrls, downloadURL]
            }));
            setUploadingFiles((prev) =>
              prev.filter((item) => item.file.name !== file.name)
            );
          }
        );
      } catch (err) {
        toast.error(`Error uploading ${file.name}`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!editData.title.trim()) {
      toast.error("Post title cannot be empty");
      return;
    }

    if (!editData.skillCategory) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...editData,
        mediaUrls: editData.mediaUrls
      });
    } catch (err) {
      console.error("Error saving post:", err);
      toast.error("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Edit className="w-5 h-5 mr-2 text-purple-600" />
            Edit Your Post
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cancel editing"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Make changes to your knowledge sharing post
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            id="title"
            value={editData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="What's your post about?"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={editData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px]"
            placeholder="Share details about what you're posting..."
            rows={4}
          />
        </div>

        <div>
          <label
            htmlFor="skillCategory"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Skill Category <span className="text-red-500">*</span>
          </label>
          <select
            name="skillCategory"
            id="skillCategory"
            value={editData.skillCategory}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

        {/* Upload section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Media
            <span className="text-xs text-gray-500 ml-1">
              (At least one required)
            </span>
          </label>

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="mb-4"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {editData.mediaUrls.map((url: string, index: number) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="h-full w-full object-cover rounded-lg shadow-sm border border-gray-200"
                />
                {editData.mediaUrls.length > 1 && (
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-red-100 transition-colors group-hover:opacity-100 opacity-0"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}

            {uploadingFiles.map((media, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden group border border-purple-400 shadow-md"
              >
                <img
                  src={media.previewUrl}
                  alt={`Uploading ${index}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Upload Progress */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:backdrop-blur-md transition duration-300">
                  <div className="text-center text-white">
                    <p className="text-sm mb-1">Uploading...</p>
                    <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${media.uploadProgress || 0}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${media.uploadProgress || 0}%` }}
                        transition={{ ease: "easeOut", duration: 0.4 }}
                      />
                    </div>
                    <p className="text-xs mt-1">{Math.round(media.uploadProgress || 0)}%</p>
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default EditPostForm;
