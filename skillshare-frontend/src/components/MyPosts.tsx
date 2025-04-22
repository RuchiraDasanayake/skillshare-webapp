import React, { useEffect, useState, useCallback } from "react";
import { postApi, CURRENT_USER_ID } from "../api/postApi";
import PostCard from "./PostCard";
import { Loader2, AlertCircle, Plus, Rocket, Edit, Trash2, MoreVertical, X, Search, Filter } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditPostForm from "./EditPost";

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [ref, inView] = useInView();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenuId !== null) {
        const targetElement = event.target as Element;
        if (!targetElement.closest('.post-menu')) {
          setShowMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenuId]);

  const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await postApi.getAll(pageNum, 10);
      
      const userPosts = response.content.filter(
        (post: any) => post.userId === CURRENT_USER_ID
      );
      
      if (reset) {
        setPosts(userPosts);
      } else {
        setPosts(prev => [...prev, ...userPosts]);
      }
      
      // Extract unique categories for filter
      if (reset) {
        const uniqueCategories = Array.from(
          new Set(userPosts.map((post: any) => post.skillCategory))
        ).filter(Boolean) as string[];
        setCategories(uniqueCategories);
      }
      
      setHasMore(!response.last);
      setError(null);
    } catch (err) {
      setError("Failed to load your posts. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...posts];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        post => 
          post.title.toLowerCase().includes(query) || 
          post.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      result = result.filter(post => post.skillCategory === selectedCategory);
    }
    
    switch (sortOrder) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "popular":
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }
    
    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory, sortOrder]);

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
    navigate("/create");
  };

  const handleEditPost = (post: any) => {
    setEditingPostId(post.id);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      // Show confirmation dialog
      const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
      
      if (!confirmDelete) return;
      
      await postApi.delete(postId);
      
      // Update both posts and filteredPosts states
      setPosts(prev => prev.filter(post => post.id !== postId));
      setFilteredPosts(prev => prev.filter(post => post.id !== postId));
      
      toast.success("Post deleted successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post. Please try again.", {
        position: "top-right",
        duration: 3000,
      });
    }
  }; 

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortOrder("newest");
  };

  const noPostsFound = filteredPosts.length === 0 && !loading && posts.length > 0;

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
          aria-label="Create new post"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">New Post</span>
          </span>
        </button>
      </div>

      {posts.length > 0 && !loading && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                aria-label="Search posts"
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full md:w-auto px-4 py-3 bg-white rounded-xl border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">Filters</span>
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                id="filter-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-1/3">
                      <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-full md:w-1/3">
                      <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "popular")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>
                    
                    <div className="w-full md:w-1/3 md:self-end">
                      <button
                        onClick={resetFilters}
                        className="w-full px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {(searchQuery || selectedCategory) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
                {selectedCategory && <span> in <span className="font-medium">{selectedCategory}</span></span>}
                {searchQuery && <span> for <span className="font-medium">"{searchQuery}"</span></span>}
              </div>
              
              <button
                onClick={resetFilters}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

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
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
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
      ) : noPostsFound ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-6">
            <Search className="h-7 w-7 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No matching posts found</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {editingPostId === post.id ? (
                    <EditPostForm
                      post={post}
                      categories={categories}
                      onCancel={() => setEditingPostId(null)}
                      onSave={async (updatedData) => {
                        try {
                          const updatedPost = await postApi.update(post.id, {
                            title: updatedData.title,
                            description: updatedData.description,
                            skillCategory: updatedData.skillCategory,
                            userId: CURRENT_USER_ID,
                            mediaUrls: updatedData.mediaUrls
                          });
                          
                          setPosts(posts.map(p => 
                            p.id === post.id ? updatedPost : p
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
                          throw err;
                        }
                      }}
                    />
                  ) : (
                    <div className="group relative">
                      <PostCard post={post} />
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 post-menu">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenuId(showMenuId === post.id ? null : post.id);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm text-gray-500 hover:text-gray-700 rounded-full shadow-md hover:bg-white transition-all"
                            aria-label="Post options"
                            aria-haspopup="true"
                            aria-expanded={showMenuId === post.id}
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