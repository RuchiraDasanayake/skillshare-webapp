import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { fetchAllPosts, SkillPostDto } from "../api/postApi";
import { Loader2, AlertCircle } from "lucide-react";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<SkillPostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadPosts = async (pageNum: number) => {
    try {
      const data = await fetchAllPosts(pageNum, 10);
      setPosts(prev => pageNum === 0 ? data : [...prev, ...data]);
      setHasMore(data.length > 0);
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(0);
  }, []);

  const handleLoadMore = () => {
    setLoading(true);
    setPage(prev => prev + 1);
    loadPosts(page + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        🔥 Latest Posts
      </h1>

      {loading && page === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center text-red-500 text-lg">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">No posts available. 🚀</p>
      )}
    </div>
  );
};

export default PostList;