import React, { useState } from 'react';

interface Comment {
  id: number;
  content: string;
  userId: number;
}

interface Like {
  userId: number;
}

interface PostType {
  id: number;
  content: string;
  comments: Comment[];
  likes: Like[];
  user?: { id: number; username: string };
}

interface Props {
  post: PostType;
  currentUser: { id: number; username: string };
  onLike: (postId: number, liked: boolean) => void;
  onComment: (postId: number, content: string) => void;
  onEditComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

const Post: React.FC<Props> = ({
  post,
  currentUser,
  onLike,
  onComment,
  onEditComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const isLiked = post.likes?.some(like => like.userId === currentUser.id);

  return (
    <div className="border p-4 mb-6 rounded shadow-md bg-white">
      <p className="text-lg mb-3">{post.content}</p>

      <button
        onClick={() => onLike(post.id, isLiked)}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mb-3"
      >
        {isLiked ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
      </button>

      <div>
        <h4 className="font-semibold mb-2">Comments</h4>
        {post.comments?.map(comment => (
          <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2">
            {editingCommentId === comment.id ? (
              <div className="flex gap-2">
                <input
                  className="border p-1 flex-1"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button
                  className="text-green-600 font-bold"
                  onClick={() => {
                    onEditComment(comment.id, editedContent);
                    setEditingCommentId(null);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-gray-500 font-bold"
                  onClick={() => setEditingCommentId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p>{comment.content}</p>
                {comment.userId === currentUser.id && (
                  <div className="flex gap-2 text-sm">
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        setEditedContent(comment.content);
                        setEditingCommentId(comment.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={() => {
              if (newComment.trim()) {
                onComment(post.id, newComment);
                setNewComment('');
              }
            }}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
