import React from 'react';
import { SkillPostDto } from '../api/postApi';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

interface PostCardProps {
  post: SkillPostDto;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.mediaFiles?.[0] && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.mediaFiles[0].fileUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {post.skillCategory}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <Heart className="w-4 h-4" />
              <span>{post.likes?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-green-500">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>
          <button className="hover:text-gray-700">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;