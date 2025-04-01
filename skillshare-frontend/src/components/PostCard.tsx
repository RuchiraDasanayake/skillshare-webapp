import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  SkillPostDto, 
  CommentDto,
  likeApi,
  commentApi,
  postApi
} from '../api/postApi';
import { 
  Heart, MessageSquare, Share2, Trash2, Edit, Send, 
  MoreVertical, User, Bookmark, ChevronDown, ChevronUp,
  Smile, Image, Video, Link, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface PostCardProps {
  post: SkillPostDto;
  onPostUpdated?: (updatedPost: SkillPostDto) => void;
  onPostDeleted?: (postId: number) => void;
}

const MAX_DESCRIPTION_LENGTH = 200;

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated, onPostDeleted }) => {
  // Mock current user - in a real app, get this from your auth context
  const currentUserId = "current-user-id";
  
  // State management
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPost, setEditedPost] = useState<SkillPostDto>({
    title: post.title,
    description: post.description,
    skillCategory: post.skillCategory,
    userId: post.userId,
    mediaUrls: post.mediaUrls || []
  });
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [isLoading, setIsLoading] = useState({
    like: false,
    comment: false,
    post: false,
    general: false
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Refs
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useOnClickOutside(dropdownRef, () => setShowDropdown(false));
  useOnClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  // Initialize post data
  useEffect(() => {
    const initializePostData = async () => {
      try {
        setIsLoading(prev => ({...prev, general: true}));
        
        // Check if current user liked the post
        const liked = await likeApi.checkLike(post.id!, currentUserId);
        setIsLiked(liked);
        
        // Get like count
        const count = await likeApi.getCount(post.id!);
        setLikeCount(count);
        
        // Load initial comments if needed
        const postComments = await commentApi.getByPost(post.id!);
        setComments(postComments);
      } catch (error) {
        console.error('Error initializing post data:', error);
      } finally {
        setIsLoading(prev => ({...prev, general: false}));
      }
    };
    
    initializePostData();
  }, [post.id]);

  // Auto-resize comment textarea
  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // Handlers
  const handleLike = async () => {
    try {
      setIsLoading(prev => ({...prev, like: true}));
      if (isLiked) {
        await likeApi.unlike(post.id!, currentUserId);
        setLikeCount(prev => prev - 1);
      } else {
        await likeApi.like(post.id!, currentUserId);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(prev => ({...prev, like: false}));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsLoading(prev => ({...prev, comment: true}));
      const newCommentData = await commentApi.create(post.id!, {
        content: newComment,
        userId: currentUserId
      });
      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
      setShowEmojiPicker(false);
      if (!showComments) setShowComments(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(prev => ({...prev, comment: false}));
    }
  };

  const handleUpdatePost = async () => {
    try {
      setIsLoading(prev => ({...prev, post: true}));
      const updatedPost = await postApi.update(post.id!, editedPost);
      onPostUpdated?.(updatedPost);
      setIsEditingPost(false);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(prev => ({...prev, post: false}));
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsLoading(prev => ({...prev, post: true}));
      await postApi.delete(post.id!);
      onPostDeleted?.(post.id!);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsLoading(prev => ({...prev, post: false}));
    }
  };

  const startEditingComment = (comment: CommentDto) => {
    setEditingCommentId(comment.id!);
    setEditCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentContent.trim()) return;
    
    try {
      setIsLoading(prev => ({...prev, comment: true}));
      const updatedComment = await commentApi.update(commentId, {
        content: editCommentContent,
        userId: ''
      });
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      setEditingCommentId(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsLoading(prev => ({...prev, comment: false}));
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      setIsLoading(prev => ({...prev, comment: true}));
      await commentApi.delete(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsLoading(prev => ({...prev, comment: false}));
    }
  };

  const toggleComments = useCallback(() => {
    setShowComments(prev => !prev);
  }, []);

  const toggleLikes = useCallback(() => {
    setShowLikes(prev => !prev);
  }, []);

  const addEmoji = useCallback((emojiData: EmojiClickData) => {
    setNewComment(prev => prev + emojiData.emoji);
    commentRef.current?.focus();
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Memoized components
  const renderPostContent = () => (
    <>
      <div className="mb-1">
        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">
          {post.skillCategory}
        </span>
      </div>
      <h3 className="font-bold text-xl mb-2 text-gray-800">{post.title}</h3>
      <div className="relative">
        <p className={`text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {post.description}
        </p>
        {post.description.length > MAX_DESCRIPTION_LENGTH && (
          <button 
            onClick={toggleExpand}
            className="text-purple-600 text-sm font-medium hover:underline mt-1"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </>
  );

  const renderEditPostForm = () => (
    <div className="mb-4 space-y-3">
      <input
        type="text"
        value={editedPost.title}
        onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        disabled={isLoading.post}
        placeholder="Post title"
      />
      <textarea
        value={editedPost.description}
        onChange={(e) => setEditedPost({...editedPost, description: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        disabled={isLoading.post}
        placeholder="Post description"
        rows={4}
      />
      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => setIsEditingPost(false)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          disabled={isLoading.post}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button 
          onClick={handleUpdatePost}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          disabled={isLoading.post}
        >
          {isLoading.post ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Update
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderComment = (comment: CommentDto) => (
    <motion.div 
      key={comment.id} 
      className="flex space-x-3 group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-purple-100 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-purple-600">
        <User className="w-4 h-4" />
      </div>
      
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none relative">
          {editingCommentId === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading.comment}
                rows={3}
              />
              <div className="flex space-x-2 justify-end">
                <button 
                  onClick={() => setEditingCommentId(null)}
                  className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateComment(comment.id!)}
                  className="px-2 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  disabled={isLoading.comment}
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {comment.userId === currentUserId ? 'You' : `User ${comment.userId}`}
                  </p>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
                
                {comment.userId === currentUserId && (
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEditingComment(comment)}
                      className="text-gray-400 hover:text-purple-600 p-1"
                      aria-label="Edit comment"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.id!)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {comment.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">
              {post.userId === currentUserId ? 'You' : `User ${post.userId}`}
            </h4>
            <p className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        
        {post.userId === currentUserId && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Post options"
              disabled={isLoading.post}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                >
                  <button
                    onClick={() => {
                      setIsEditingPost(true);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    disabled={isLoading.post}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Post Media */}
      {post.mediaUrls?.[0] && (
        <div className="h-64 sm:h-80 overflow-hidden">
          <img 
            src={post.mediaUrls[0]} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="p-5">
        {isEditingPost ? renderEditPostForm() : renderPostContent()}

        {/* Post Actions */}
        <div className="flex justify-between items-center border-t border-b border-gray-100 py-3 my-3">
          <button 
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${isLiked ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}`}
            onClick={handleLike}
            disabled={isLoading.like}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            <span className="font-medium">{likeCount}</span>
            <button 
              onClick={toggleLikes}
              className="ml-1 text-gray-400 hover:text-purple-500"
              aria-label="View likes"
            >
              {showLikes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </button>
          
          <button 
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${showComments ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}`}
            onClick={toggleComments}
            disabled={isLoading.comment}
            aria-label={showComments ? 'Hide comments' : 'Show comments'}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{comments.length}</span>
            <span className="ml-1 text-gray-400">
              {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>
          
          <button 
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            aria-label="Share post"
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
          
          <button 
            className="flex items-center px-3 py-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            aria-label="Save post"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Likes Modal */}
        <AnimatePresence>
          {showLikes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <h4 className="font-medium text-gray-700 mb-2">Liked by {likeCount} people</h4>
                <p className="text-sm text-gray-500">
                  User list not available in current API implementation
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Comments ({comments.length})</h4>
                
                {comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map(renderComment)}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No comments yet. Be the first to comment!
                  </div>
                )}

                {/* Add Comment */}
                <div className="relative">
                  <div className="flex items-center space-x-3 mt-4">
                    <div className="bg-purple-100 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-purple-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 relative">
                      <textarea
                        ref={commentRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a comment..."
                        className="w-full p-3 pr-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32"
                        disabled={isLoading.comment}
                        rows={1}
                      />
                      <div className="absolute right-2 bottom-2 flex space-x-1">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-400 hover:text-purple-600 p-1 rounded-full hover:bg-purple-50"
                          aria-label="Add emoji"
                        >
                          <Smile className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleAddComment}
                          disabled={isLoading.comment || !newComment.trim()}
                          className="p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Post comment"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        ref={emojiPickerRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 bottom-12 z-10"
                      >
                        <EmojiPicker 
                          onEmojiClick={addEmoji} 
                          width={300}
                          height={350}
                          previewConfig={{ showPreview: false }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Comment Attachment Options */}
                  <div className="flex justify-end space-x-2 mt-2">
                    <button 
                      className="text-gray-400 hover:text-purple-600 p-1 rounded-full hover:bg-purple-50"
                      aria-label="Add image"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-purple-600 p-1 rounded-full hover:bg-purple-50"
                      aria-label="Add video"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-purple-600 p-1 rounded-full hover:bg-purple-50"
                      aria-label="Add link"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default React.memo(PostCard);
function useOnClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
