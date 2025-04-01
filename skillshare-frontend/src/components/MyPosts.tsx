import React, { useEffect, useState, useCallback } from "react";
import { postApi, CURRENT_USER_ID } from "../api/postApi"; // Import the constant
import PostCard from "./PostCard";
import { Loader2, AlertCircle, Plus, Rocket } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [ref, inView] = useInView();
  const navigate = useNavigate();

  const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await postApi.getAll(pageNum, 10);
      
      // Filter posts by the constant user ID
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent inline-block">
            📜 My Posts
          </h1>
          <p className="text-gray-500 mt-2">
            View and manage all your shared knowledge
          </p>
        </div>
        
        <button
          onClick={handleCreatePost}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-sm text-sm font-medium hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </button>
      </div>

      {loading && page === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
          <p className="text-gray-500">Loading your posts...</p>
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
                  onClick={() => loadPosts(0, true)}
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
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Infinite scroll loader */}
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
                  You've reached the end of your posts!
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-gray-500">
            Share your knowledge with the community by creating your first post!
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

export default MyPosts;