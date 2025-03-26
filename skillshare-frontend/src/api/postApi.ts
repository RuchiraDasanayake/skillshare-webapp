import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080/api/posts';

interface User {
  id: string;
  name: string;
}

export interface SkillPostDto {
  id?: number;
  title: string;
  description: string;
  userId: string;
  skillCategory: string;
  mediaFiles?: MediaDto[];
  comments?: CommentDto[];
  likes?: LikeDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaDto {
  id?: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number;
  postId?: number;
  uploadedAt?: string;
}

export interface CommentDto {
  id?: number;
  content: string;
  userId: string;
  postId?: number;
  parentCommentId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LikeDto {
  id?: number;
  userId: string;
  postId?: number;
  createdAt?: string;
}

// Mock current user - replace with actual auth implementation
const CURRENT_USER: User = {
  id: "user123",
  name: "John Doe"
};

// Fetch all posts with pagination
export const fetchAllPosts = async (page: number = 0, size: number = 10): Promise<SkillPostDto[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}`, {
      params: { page, size }
    });
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
};

// Fetch posts by current user
export const fetchPostsByUser = async (userId: string): Promise<SkillPostDto[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};

// Alias for fetchPostsByUser using current user
export const fetchMyPosts = async (): Promise<SkillPostDto[]> => {
  return fetchPostsByUser(CURRENT_USER.id);
};

// Get single post by ID
export const fetchPostById = async (id: number): Promise<SkillPostDto | null> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const createPost = async (
  postData: Omit<SkillPostDto, 'id' | 'userId'>, 
  files?: File[]
): Promise<SkillPostDto> => {
  const formData = new FormData();
  
  formData.append('post', JSON.stringify({
    ...postData,
    userId: CURRENT_USER.id
  }));

  if (files) {
    files.forEach(file => {
      formData.append('files', file);
    });
  }

  try {
    const response = await axios.post(`${BACKEND_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (
  id: number, 
  postData: Partial<SkillPostDto>
): Promise<SkillPostDto> => {
  try {
    const response = await axios.put(`${BACKEND_URL}/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BACKEND_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Media endpoints
export const addMediaToPost = async (
  postId: number, 
  file: File
): Promise<MediaDto> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${BACKEND_URL}/${postId}/media`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding media:", error);
    throw error;
  }
};

// Comment endpoints
export const addComment = async (
  postId: number, 
  content: string
): Promise<CommentDto> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/${postId}/comments`, {
      content,
      userId: CURRENT_USER.id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Like endpoints
export const likePost = async (postId: number): Promise<LikeDto> => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/${postId}/likes?userId=${CURRENT_USER.id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const getCurrentUser = (): User => CURRENT_USER;