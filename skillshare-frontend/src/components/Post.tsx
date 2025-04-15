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
    <div className="border rounded-lg shadow bg-white p-4 mb-6">
      <p className="text-base text-gray-800 mb-4">{post.content}</p>

      <button
        onClick={() => onLike(post.id, isLiked)}
        className={`text-white px-4 py-1 rounded transition ${
          isLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-button hover:bg-button-dark'
        }`}
      >
        {isLiked ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
      </button>

      <div className="mt-4">
        <h4 className="font-semibold mb-2 text-gray-700">Comments</h4>
        {post.comments?.map((comment: Comment) => (
          <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2">
            {editingCommentId === comment.id ? (
              <div className="flex gap-2">
                <input
                  className="border p-1 rounded flex-1"
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
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setEditedContent(comment.content);
                        setEditingCommentId(comment.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
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

        <div className="mt-4 flex gap-2">
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
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
