import React, { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import { postApi, SkillPostDto } from "../api/postApi"; 
import { 
  Loader2, AlertCircle, Plus, RefreshCw,
  Sparkles, Flame, List, Grid3X3
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<SkillPostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ref, inView] = useInView();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Debounced search function
  const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      if (reset) setIsRefreshing(true);
      
      const response = await postApi.getAll(pageNum, 10);
      const data = response.content || [];
      
      setPosts(prev => reset ? data : [...prev, ...data]);
      setHasMore(!response.last);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    loadPosts(0, true);
  }, []);

  // Search trigger with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length > 2) {
        setIsSearching(true);
        setPage(0);
        loadPosts(0, true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery, loadPosts]);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && !loading && hasMore && !isSearching) {
      setPage(prev => prev + 1);
      loadPosts(page + 1);
    }
  }, [inView, loading, hasMore, loadPosts, page, isSearching]);

  const handlePostUpdated = useCallback((updatedPost: SkillPostDto) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  }, []);

  const handlePostDeleted = useCallback((postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const handleRefresh = () => {
    setPage(0);
    loadPosts(0, true);
  };

  const handleCreatePost = () => {
    // Implement post creation
    console.log("Create new post clicked");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20"></div>
        <div className="relative py-12 px-6 sm:px-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Share Your Skills, Grow Together
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8"
          >
            Discover amazing tutorials, connect with experts, and elevate your skills
          </motion.p>
        </div>
      </div>

      {/* Content Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
        </div>
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && page === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent"
          />
          <p className="text-gray-500 mt-6 font-medium">Discovering amazing skills...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium text-red-800">{error}</h3>
              <p className="mt-1 text-md text-red-700">
                We couldn't load the posts. Please check your connection.
              </p>
            </div>
            <div className="flex-shrink-0 sm:ml-auto">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <>
          {/* Posts Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard 
                    post={post} 
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                    viewMode="grid"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard 
                    post={post} 
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                    viewMode="list"
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Infinite Scroll Loader */}
          <div ref={ref} className="py-10">
            {loading && page > 0 && (
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center"
                >
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </motion.div>
              </div>
            )}
            
            {!hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-inner">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  {searchQuery ? 'No more matching posts' : "You've reached the end!"}
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
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 mb-6">
            <div className="relative">
              <Flame className="h-12 w-12 text-purple-500 animate-pulse" />
              <div className="absolute -inset-2 rounded-full bg-purple-100 opacity-30 animate-ping"></div>
            </div>
          </div>
          <h3 className="mt-4 text-2xl font-medium text-gray-900">
            {searchQuery ? 'No matching skills found' : 'The community is quiet...'}
          </h3>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            {searchQuery 
              ? 'Try a different search term or browse popular categories'
              : 'Be the first to share your knowledge and inspire others!'}
          </p>
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              className="inline-flex items-center px-8 py-4 shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Share Your First Skill
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCreatePost}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl flex items-center justify-center text-white hover:from-purple-700 hover:to-indigo-700 focus:outline-none z-40"
      >
        <Plus className="h-8 w-8" />
      </motion.button>
    </div>
  );
};

export default PostList;