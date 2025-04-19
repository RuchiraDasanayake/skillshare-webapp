import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  SkillPostDto, 
  CommentDto,
  likeApi,
  commentApi,
  CURRENT_USER_ID,
} from '../api/postApi';
import { 
  Heart, MessageSquare, Send, 
  User, ChevronDown, ChevronUp,
  Smile, Loader2,
  Play, Pause, Volume2, VolumeX,
  Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface PostCardProps {
  post: SkillPostDto;
  onPostUpdated?: (updatedPost: SkillPostDto) => void;
  onPostDeleted?: (postId: number) => void;
  viewMode?: 'list' | 'grid'; 
}

const MAX_DESCRIPTION_LENGTH = 200;
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const currentUserId = CURRENT_USER_ID;
  
  // State management
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [isLoading, setIsLoading] = useState({
    like: false,
    comment: false,
    general: false,
    delete: false,
    edit: false
  });
  const [showComments, setShowComments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [videoStates, setVideoStates] = useState<{
    [index: number]: {
      playing: boolean;
      muted: boolean;
      loaded: boolean;
    }
  }>({});
  const [editingComment, setEditingComment] = useState<CommentDto | null>(null);
  
  // Refs
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({});

  // Close popups when clicking outside
  useOnClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

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
        
        // Load initial comments
        const postComments = await commentApi.getByPost(post.id!);
        setComments(postComments);
        
        // Initialize video states
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          const initialVideoStates: {[index: number]: {
            playing: boolean;
            muted: boolean;
            loaded: boolean;
          }} = {};
          
          post.mediaUrls.forEach((_url, index) => {
            initialVideoStates[index] = {
              playing: false,
              muted: true,
              loaded: false
            };
          });
          
          setVideoStates(initialVideoStates);
        }
      } catch (error) {
        console.error('Error initializing post data:', error);
      } finally {
        setIsLoading(prev => ({...prev, general: false}));
      }
    };
    
    initializePostData();
  }, [post.id, currentUserId]);

  // Auto-resize comment textarea
  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // Pause all videos when media index changes
  useEffect(() => {
    Object.keys(videoRefs.current).forEach(key => {
      const index = Number(key);
      if (videoRefs.current[index] && videoStates[index]?.playing) {
        videoRefs.current[index]?.pause();
        setVideoStates(prev => ({
          ...prev,
          [index]: {
            ...prev[index],
            playing: false
          }
        }));
      }
    });
  }, [currentMediaIndex]);

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

  const handleDeleteComment = async (commentId: number) => {
    try {
      setIsLoading(prev => ({...prev, delete: true}));
      await commentApi.delete(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setEditingComment(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsLoading(prev => ({...prev, delete: false}));
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment?.content.trim()) return;
    
    try {
      setIsLoading(prev => ({...prev, edit: true}));
      const updatedComment = await commentApi.update(editingComment.id!, {
        content: editingComment.content,
        userId: ''
      });
      setComments(prev => prev.map(c => 
        c.id === editingComment.id ? updatedComment : c
      ));
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsLoading(prev => ({...prev, edit: false}));
    }
  };

  const toggleVideoPlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
  
    if (videoStates[index]?.playing) {
      video.pause();
      setVideoStates(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          playing: false
        }
      }));
    } else {
      video.play()
        .then(() => {
          setVideoStates(prev => ({
            ...prev,
            [index]: {
              ...prev[index],
              playing: true
            }
          }));
        })
        .catch(error => {
          console.error(`Error playing video ${index}:`, error);
          if (error.name === 'NotAllowedError') {
            video.muted = true;
            video.play()
              .then(() => {
                setVideoStates(prev => ({
                  ...prev,
                  [index]: {
                    ...prev[index],
                    playing: true,
                    muted: true
                  }
                }));
              });
          }
        });
    }
  };

  const toggleVideoMute = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const muted = !videoStates[index]?.muted;
    video.muted = muted;
    setVideoStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        muted
      }
    }));
  };

  const handleVideoLoaded = (index: number) => {
    setVideoStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        loaded: true
      }
    }));
  };

  const toggleComments = useCallback(() => {
    setShowComments(prev => !prev);
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const nextMedia = () => {
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % post.mediaUrls!.length);
    }
  };

  const prevMedia = () => {
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      setCurrentMediaIndex((prev) => 
        prev === 0 ? post.mediaUrls!.length - 1 : prev - 1
      );
    }
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension && VIDEO_EXTENSIONS.includes(extension)) {
      return true;
    }
    return (
        url.includes('video') || 
        url.includes('.mp4') || 
        url.includes('/mp4') ||
        url.includes('_30fps') ||
        url.includes('_60fps') ||
        url.includes('hd_1920_1080')
      );
    };

  // Render functions
  const renderPostContent = () => (
    <>
      <div className="mb-2">
        <span className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {post.skillCategory}
        </span>
      </div>
      <h3 className="font-bold text-xl mb-3 text-gray-800">{post.title}</h3>
      <div className="relative h-18 overflow-y-auto">
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

  const renderComment = (comment: CommentDto) => {
    const isOwner = comment.userId === currentUserId;
    const isPostOwner = post.userId === currentUserId;
    const isEditing = editingComment?.id === comment.id;
    
    return (
      <motion.div 
        key={comment.id} 
        className="flex space-x-3 group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white">
          <User className="w-4 h-4" />
        </div>
        
        <div className="flex-1 relative">
          {isEditing ? (
            <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none">
              <textarea
                value={editingComment?.content || ''}
                onChange={(e) => {
                  if (editingComment) {
                    setEditingComment({
                      ...editingComment,
                      content: e.target.value
                    });
                  }
                }}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateComment}
                  disabled={isLoading.edit}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {isLoading.edit ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {comment.userId === currentUserId ? 'You' : `@${comment.userId}`}
                  </p>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
                
                {(isOwner || isPostOwner) && (
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isOwner && (
                      <button 
                        onClick={() => setEditingComment(comment)}
                        className="text-gray-400 hover:text-purple-600 p-1"
                        aria-label="Edit comment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteComment(comment.id!)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {comment.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateTime(comment.createdAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderMediaGallery = () => {
    if (!post.mediaUrls || post.mediaUrls.length === 0) return null;
    
    const currentMedia = post.mediaUrls[currentMediaIndex];
    const isCurrentVideo = isVideo(currentMedia);
    const videoState = videoStates[currentMediaIndex] || { playing: false, muted: true, loaded: false };
    
    return (
      <div className="relative group">
        <div className="h-72 sm:h-96 overflow-hidden bg-black flex items-center justify-center">
          {isCurrentVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={el => {
                  videoRefs.current[currentMediaIndex] = el;
                }}
                src={currentMedia}
                className="w-full h-full object-contain"
                controls={false}
                loop
                muted={videoState.muted}
                onLoadedData={() => handleVideoLoaded(currentMediaIndex)}
                onClick={() => toggleVideoPlay(currentMediaIndex)}
                onEnded={() => {
                  setVideoStates(prev => ({
                    ...prev,
                    [currentMediaIndex]: {
                      ...prev[currentMediaIndex],
                      playing: false
                    }
                  }));
                }}
                playsInline
                preload="metadata"
              />
              {!videoState.loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              {videoState.loaded && !videoState.playing && (
                <button
                  onClick={() => toggleVideoPlay(currentMediaIndex)}
                  className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/30"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                </button>
              )}
              {videoState.playing && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <button
                    onClick={() => toggleVideoPlay(currentMediaIndex)}
                    className="bg-black/50 rounded-full p-2"
                    aria-label="Pause video"
                  >
                    <Pause className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => toggleVideoMute(currentMediaIndex)}
                    className="bg-black/50 rounded-full p-2"
                    aria-label={videoState.muted ? 'Unmute video' : 'Mute video'}
                  >
                    {videoState.muted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <img 
              src={currentMedia} 
              alt={`${post.title} - media ${currentMediaIndex + 1}`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )}
        </div>
        
        {post.mediaUrls.length > 1 && (
          <>
            <button 
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {post.mediaUrls.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentMediaIndex ? 'bg-white w-4' : 'bg-white/60'}`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Post Header */}
    <div className="p-4 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">
            {post.userId === currentUserId ? 'You' : `@${post.userId}`}
          </h4>
          <p className="text-xs text-gray-500">
            {formatDateTime(post.createdAt)}
          </p>
        </div>
      </div>
    </div>

      {/* Post Media */}
      {renderMediaGallery()}
      
      {/* Post Content */}
      <div className="p-5">
        {renderPostContent()}

        {/* Post Actions */}
        <div className="flex justify-between items-center border-t border-gray-100 py-4 my-2">
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isLiked 
                ? 'text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={handleLike}
            disabled={isLoading.like}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            <span className="font-medium">{likeCount}</span>
          </button>
          
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              showComments 
                ? 'text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={toggleComments}
            disabled={isLoading.comment}
            aria-label={showComments ? 'Hide comments' : 'Show comments'}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{comments.length}</span>
            <span className="ml-1">
              {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">Comments ({comments.length})</h4>
                  {comments.length > 0 && (
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full w-16"></div>
                  )}
                </div>
                
                {comments.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                    {comments.map(renderComment)}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                  </div>
                )}

                {/* Add Comment */}
                <div className="relative mt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white mt-1">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 relative">
                      <textarea
                        ref={commentRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a comment..."
                        className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32"
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
                          className={`p-2 rounded-full transition-all ${
                            newComment.trim() 
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
                              : 'bg-gray-200 text-gray-400'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          aria-label="Post comment"
                        >
                          {isLoading.comment ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
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
                    </div>
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

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
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