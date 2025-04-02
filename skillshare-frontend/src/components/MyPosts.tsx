import React, { useEffect, useState, useCallback } from "react";
import { postApi, CURRENT_USER_ID } from "../api/postApi";
import PostCard from "./PostCard";
import { Loader2, AlertCircle, Plus, Rocket, Edit, Trash2, MoreVertical, X, Check, Image as ImageIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [ref, inView] = useInView();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    skillCategory: '',
    mediaUrls: [] as string[]
  });
  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const navigate = useNavigate();

  const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await postApi.getAll(pageNum, 10);
      
      const filteredPosts = response.content.filter(
        (post: any) => post.userId === CURRENT_USER_ID
      );
      
      setPosts(prev => reset ? filteredPosts : [...prev, ...filteredPosts]);
      setHasMore(!response.last);
      setError(null);
    } catch (err) {
      setError("Failed to load your posts. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(0, true);
  }, [loadPosts]);

  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage(prev => prev + 1);
      loadPosts(page + 1);
    }
  }, [inView, loading, hasMore, loadPosts, page]);

  const handleCreatePost = () => {
    navigate("/posts/new");
  };

  const handleEditPost = (post: any) => {
    setEditingPostId(post.id);
    setEditData({
      title: post.title,
      description: post.description,
      skillCategory: post.skillCategory,
      mediaUrls: post.mediaUrls || []
    });
  };

  const handleUpdatePost = async (postId: number) => {
    try {
      const currentPost = posts.find(post => post.id === postId);
      
      const updatedPost = await postApi.update(postId, {
        title: editData.title,
        description: editData.description,
        skillCategory: editData.skillCategory,
        userId: CURRENT_USER_ID,
        mediaUrls: currentPost?.mediaUrls || []
      });
      
      setPosts(posts.map(post => 
        post.id === postId ? updatedPost : post
      ));
      setEditingPostId(null);
      toast.success("Post updated successfully!", {
        position: "top-right",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to update post", {
        position: "top-right",
        duration: 3000,
      });
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async (postId: number) => {
    toast("Are you sure you want to delete this post?", {
      position: "top-center",
      duration: 5000,
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await postApi.delete(postId);
            setPosts(posts.filter(post => post.id !== postId));
            toast.success("Post deleted successfully!", {
              position: "top-right",
              duration: 3000,
            });
          } catch (err) {
            toast.error("Failed to delete post", {
              position: "top-right",
              duration: 3000,
            });
            console.error("Error deleting post:", err);
          }
        },
      },
      actionButtonStyle: {
        backgroundColor: "#ef4444",
        color: "white",
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    setIsUploadingMedia(true);
    try {
      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newMediaUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      
      setEditData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...newMediaUrls]
      }));
      
      toast.success("Media uploaded successfully!", {
        position: "top-right",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to upload media", {
        position: "top-right",
        duration: 3000,
      });
      console.error("Error uploading media:", err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    setEditData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent inline-block">
            Your Knowledge Hub
          </h1>
          <p className="text-gray-500">
            Manage and showcase all your shared expertise
          </p>
        </div>
        
        <button
          onClick={handleCreatePost}
          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">New Post</span>
          </span>
        </button>
      </div>

      {loading && page === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading your knowledge...</p>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 p-6 mb-6 border border-red-100 shadow-sm"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Oops! Something went wrong</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>We couldn't load your posts. This might be a temporary issue.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => loadPosts(0, true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {editingPostId === post.id ? (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Edit Post</h3>
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              name="title"
                              id="title"
                              value={editData.title}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Post title"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              value={editData.description}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Post description"
                              rows={4}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="skillCategory" className="block text-sm font-medium text-gray-700 mb-1">
                              Skill Category
                            </label>
                            <input
                              name="skillCategory"
                              id="skillCategory"
                              value={editData.skillCategory}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="e.g. Web Development"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Media
                            </label>
                            {editData.mediaUrls?.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-3">
                                  {editData.mediaUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                      <img 
                                        src={url} 
                                        alt={`Media ${index}`}
                                        className="h-24 w-24 object-cover rounded-lg shadow-sm border border-gray-200"
                                      />
                                      <button
                                        onClick={() => removeMedia(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploadingMedia ? (
                                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                ) : (
                                  <>
                                    <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Upload media</p>
                                  </>
                                )}
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                multiple 
                                onChange={handleMediaUpload}
                                disabled={isUploadingMedia}
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdatePost(post.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <PostCard post={post} />
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenuId(showMenuId === post.id ? null : post.id);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm text-gray-500 hover:text-gray-700 rounded-full shadow-md hover:bg-white transition-all"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          <AnimatePresence>
                            {showMenuId === post.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-10 border border-gray-200 overflow-hidden"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditPost(post);
                                      setShowMenuId(null);
                                    }}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                                  >
                                    <Edit className="w-4 h-4 mr-3 text-purple-500" />
                                    Edit Post
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePost(post.id);
                                      setShowMenuId(null);
                                    }}
                                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50 w-full text-left transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 mr-3 text-red-500" />
                                    Delete Post
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Infinite scroll loader */}
          <div ref={ref} className="py-10">
            {loading && page > 0 && (
              <div className="flex justify-center">
                <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500 mr-3" />
                  <span className="text-gray-600">Loading more posts...</span>
                </div>
              </div>
            )}
            
            {!hasMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-purple-50 to-blue-50 text-purple-800 border border-purple-100 shadow-sm">
                  <Rocket className="w-5 h-5 mr-2 text-purple-600" />
                  You've reached the end of your knowledge repository!
                </div>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 mb-6">
            <Rocket className="h-7 w-7 text-purple-600" />
          </div>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">Your knowledge journey begins here</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Share your expertise with the community and build your professional presence.
          </p>
          <div className="mt-8">
            <button
              onClick={handleCreatePost}
              className="group relative inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                <Plus className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Create Your First Post</span>
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyPosts;