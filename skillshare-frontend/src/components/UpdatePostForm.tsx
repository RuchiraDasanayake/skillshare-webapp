import React, { useState } from 'react';
import { updatePost } from '../api/postApi';

const UpdatePostForm: React.FC<{ postId: number }> = ({ postId }) => {
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mediaDTOs = mediaFiles.map((file) => ({
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
    }));

    const postDTO = {
      description,
      media: mediaDTOs,
    };

    await updatePost(postId, postDTO);
    alert('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter post description"
      />
      <input
        type="file"
        multiple
        onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
      />
      <button type="submit">Update Post</button>
    </form>
  );
};

export default UpdatePostForm;