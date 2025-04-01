import React, { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import { postApi, SkillPostDto } from "../api/postApi"; // Updated import
import { Loader2, AlertCircle, Plus, Rocket, RefreshCw, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<SkillPostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ref, inView] = useInView();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      if (reset) setIsRefreshing(true);
      
      const response = await postApi.getAll(pageNum, 10); // Fixed function name
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
    }
  }, [searchQuery]);

  // Initial load and refresh
  useEffect(() => {
    loadPosts(0, true);
  }, [loadPosts]);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage(prev => prev + 1);
      loadPosts(page + 1);
    }
  }, [inView, loading, hasMore, loadPosts, page]);

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length > 2) {
        setPage(0);
        loadPosts(0, true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, loadPosts]);

  // Handle post updates
  const handlePostUpdated = useCallback((updatedPost: SkillPostDto) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  }, []);

  // Handle post deletion
  const handlePostDeleted = useCallback((postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const handleRefresh = () => {
    setPage(0);
    loadPosts(0, true);
  };

  const handleCreatePost = () => {
    // Implement post creation modal or navigation
    console.log("Create new post clicked");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent inline-block">
            Community Feed
          </h1>
          <p className="text-gray-500 mt-2">
            Discover and share knowledge with the community
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleCreatePost}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-sm text-sm font-medium hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
          </div>
        </div>
      </div>

      {loading && page === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
          <p className="text-gray-500">Loading community posts...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Please check your connection and try again.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleRefresh}
                  className="text-sm font-medium text-red-800 hover:text-red-700"
                >
                  Retry <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence initial={false}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostCard 
                    post={post} 
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div ref={ref} className="py-10">
            {loading && page > 0 && (
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            )}
            
            {!hasMore && (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <Rocket className="w-4 h-4 mr-2" />
                  {searchQuery ? 'No more matching posts' : "You've reached the end!"}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
            <Rocket className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchQuery ? 'No posts found' : 'No posts yet'}
          </h3>
          <p className="mt-1 text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search query'
              : 'Be the first to share your knowledge with the community!'}
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Create Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;