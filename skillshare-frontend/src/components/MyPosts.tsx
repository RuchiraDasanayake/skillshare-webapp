import React, { useEffect, useState } from "react";
import { fetchMyPosts, SkillPostDto } from "../api/postApi";
import PostCard from "./PostCard";
import { Loader2, AlertCircle } from "lucide-react";

const MyPosts: React.FC = () => {
  const [myPosts, setMyPosts] = useState<SkillPostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        const data = await fetchMyPosts();
        setMyPosts(data);
      } catch (err) {
        setError("Failed to load your posts");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMyPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        📜 My Posts
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center text-red-500 text-lg">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      ) : myPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          You haven't created any posts yet. Create one to get started!
        </p>
      )}
    </div>
  );
};

export default MyPosts;