import React, { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import { postApi, SkillPostDto } from "../api/postApi"; 
import { 
  Loader2, AlertCircle, Plus, RefreshCw,
  Sparkles, Flame, Search, Filter, X,
  TrendingUp, Clock
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<SkillPostDto[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SkillPostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [ref, inView] = useInView();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Debounced search function
  const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      if (reset) setIsRefreshing(true);
      
      const response = await postApi.getAll(pageNum, 10);
      const data = response.content || [];
      
      if (reset) {
        setPosts(data);
        // Extract unique categories for filter
        const uniqueCategories = Array.from(
          new Set(data.map((post: SkillPostDto) => post.skillCategory))
        ).filter(Boolean) as string[];
        setCategories(uniqueCategories);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      
      setHasMore(!response.last);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
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
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case "popular":
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }
    
    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory, sortOrder]);

  // Initial load
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
    navigate("/create");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortOrder("newest");
  };

  const noPostsFound = filteredPosts.length === 0 && !loading && posts.length > 0;

  // Sort order icons
  const getSortIcon = () => {
    switch (sortOrder) {
      case "newest": return <Clock className="h-5 w-5" />;
      case "oldest": return <Clock className="h-5 w-5 transform rotate-180" />;
      case "popular": return <TrendingUp className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-700/50 to-violet-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path fill="url(#grad1)" d="M0,0 L1920,0 L1920,1080 L0,1080 Z" opacity="0.4">
              <animate attributeName="d" dur="15s" repeatCount="indefinite" values="
                M0,0 L1920,0 L1920,1080 L0,1080 Z;
                M0,0 L1920,0 L1850,1080 L70,1080 Z;
                M0,0 L1920,0 L1920,1080 L0,1080 Z" />
            </path>
          </svg>
        </div>
        <div className="relative py-16 px-6 sm:px-12 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-8 right-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-50 blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-40 blur-xl"
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Share Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-300">Skills</span>, Grow Together
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8"
          >
            Discover amazing tutorials, connect with experts, and elevate your expertise
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={handleCreatePost}
              className="px-8 py-3 bg-white text-purple-700 font-medium rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-purple-100"
            >
              <Plus className="inline h-5 w-5 mr-2 -mt-1" />
              Share Your Knowledge
            </button>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      {posts.length > 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search for skills and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-xl border border-purple-100 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
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
            
            <div className="flex md:w-auto gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-3 bg-white rounded-xl border border-purple-100 shadow-sm hover:bg-indigo-50 transition-colors text-purple-700 flex-grow md:flex-grow-0"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <Filter className="h-5 w-5 mr-2" />
                <span>Filters</span>
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center w-14 h-12 bg-white rounded-xl border border-purple-100 shadow-sm hover:bg-indigo-50 transition-colors text-purple-700"
                aria-label="Refresh posts"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/3">
                      <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          id="category-filter"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="appearance-none w-full px-4 py-3 rounded-lg border border-purple-100 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-10"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/3">
                      <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <div className="relative">
                        <select
                          id="sort-order"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "popular")}
                          className="appearance-none w-full px-4 py-3 rounded-lg border border-purple-100 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-10"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="popular">Most Popular</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 md:self-end">
                      <button
                        onClick={resetFilters}
                        className="w-full px-4 py-3 text-purple-600 hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors font-medium"
                      >
                        Reset All Filters
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
                <span className="font-medium">{filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}</span>
                {selectedCategory && <span> in <span className="text-purple-600 font-medium">{selectedCategory}</span></span>}
                {searchQuery && <span> for <span className="text-purple-600 font-medium">"{searchQuery}"</span></span>}
              </div>
              
              <button
                onClick={resetFilters}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Active Sort Order Badge - Shows only when posts are loaded */}
      {posts.length > 0 && !loading && !noPostsFound && (
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
            {getSortIcon()}
            <span className="ml-1 font-medium">
              {sortOrder === "newest" ? "Newest First" : sortOrder === "oldest" ? "Oldest First" : "Most Popular"}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && page === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-200"></div>
              <div className="w-16 h-16 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
            </div>
          </motion.div>
          <p className="text-gray-500 mt-6 font-medium">Discovering amazing skills...</p>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 p-6 mb-6 shadow-sm border border-red-100"
        >
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
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      ) : noPostsFound ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm"
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
              className="inline-flex items-center px-5 py-2 border border-transparent rounded-full shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
        
          {/* Infinite Scroll Loader */}
          <div ref={ref} className="py-10">
            {loading && page > 0 && (
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center shadow-inner"
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
                  {searchQuery ? 'No more matching posts' : "You've explored all the skills!"}
                </div>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-24"
        >
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 mb-6 relative">
            <motion.div
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(139, 92, 246, 0.4)", "0 0 0 20px rgba(139, 92, 246, 0)", "0 0 0 0 rgba(139, 92, 246, 0)"] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
            />
            <div className="relative">
              <Flame className="h-12 w-12 text-purple-500 animate-pulse" />
            </div>
          </div>
          <h3 className="mt-4 text-2xl font-medium text-gray-900">
            {searchQuery ? 'No matching skills found' : 'Be a Pioneer!'}
          </h3>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            {searchQuery 
              ? 'Try a different search term or browse popular categories'
              : 'Be the first to share your knowledge and inspire the community!'}
          </p>
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              className="inline-flex items-center px-8 py-4 shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Share Your First Skill
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleCreatePost}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl flex items-center justify-center text-white hover:from-purple-700 hover:to-indigo-700 focus:outline-none z-40"
      >
        <Plus className="h-8 w-8" />
        <span className="absolute -top-10 right-0 bg-white px-3 py-1 rounded-lg shadow-md text-purple-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Create Post
        </span>
      </motion.button>
    </div>
  );
};

export default PostList;