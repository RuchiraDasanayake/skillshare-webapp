import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api/posts';

export interface SkillPostDto {
  [x: string]: any;
  id?: number;
  title: string;
  description: string;
  userId: string;
  skillCategory: string;
  mediaUrls: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentDto {
  id?: number;
  content: string;
  userId: string;
  postId?: number;
  parentCommentId?: number | null;
  createdAt?: string;
}

export interface LikeDto {
  id?: number;
  userId: string;
  postId?: number;
  createdAt?: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// 🔐 Helper: Get token and user ID
function getAuthHeaders() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
}

function getCurrentUserId(): number {
  const id = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  console.log("userId", id)
  return id ? parseInt(id, 10) : 0;
}


// Helper function for consistent error handling
function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    throw new Error(serverMessage || error.message);
  }
  throw new Error('An unexpected error occurred');
}

export const loginUser = (loginData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/signin", loginData);

    dispatch({ type: "LOGIN_SUCCESS", payload: response.data });

    return response.data;
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });

    // Ensure the error bubbles up to onSubmit
    throw error;
  }
};




export const registernUser = (RegisterData: unknown) => async (dispatch: any)=> {
  try {
    const {data} = await axios.post(`http://localhost:8080/api//auth/signup`, RegisterData)
    console.log("register data", data)
    if (data.jwt){
      localStorage.setItem("token", data.jwt);
    }
      dispatch({
        type: "REGISTER_USER_SUCCESS",
        payload: data.jwt,
      });
    
  } catch (error) {
    console.error("Error logging in:", error);
    dispatch({
      type: "REGISTER_USER_FAILURE",
      payload: axios.isAxiosError(error) ? error.message : 'An unexpected error occurred'
    });
  }
}

export const getUserProfile = (jwt: any) => async (dispatch: any) => {
  try {
    const {data} = await axios.get(`http://localhost:8080/api//users/profile`, {
      headers: {
        "Authorization": `Bearer ${jwt}`
      }
    })
    if (data.jwt){
      localStorage.setItem("token", data.jwt);
    }
      dispatch({
        type: "GET_USER_PROFILE_SUCCESS",
        payload: data,
      });
  } catch (error) {
    console.error("Error logging in:", error);
    dispatch({
      type: "GET_USER_PROFILE_FAILURE",
      payload: axios.isAxiosError(error) ? error.message : 'An unexpected error occurred'
    });
  }
}


/// 📦 Post API
export const postApi = {
  create: async (postData: SkillPostDto): Promise<SkillPostDto> => {
    try {
      const userId = getCurrentUserId();
      const payload = { ...postData, userId };
      const response = await api.post<SkillPostDto>('', payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id: number): Promise<SkillPostDto> => {
    try {
      const response = await api.get<SkillPostDto>(`/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getAll: async (page: number = 0, size: number = 10): Promise<Page<SkillPostDto>> => {
    try {
      const response = await api.get<Page<SkillPostDto>>('/all', {
        headers: getAuthHeaders(),
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id: number, postData: SkillPostDto): Promise<SkillPostDto> => {
    try {
      const response = await api.put<SkillPostDto>(`/${id}`, postData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      return handleError(error);
    }
  },
};

// 💬 Comment API
export const commentApi = {
  create: async (postId: number, commentData: CommentDto): Promise<CommentDto> => {
    try {
      const userId = getCurrentUserId();
      const payload = { ...commentData, userId };
      const response = await api.post<CommentDto>(`/${postId}/comments`, payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (commentId: number, commentData: CommentDto): Promise<CommentDto> => {
    try {
      const response = await api.put<CommentDto>(`/comments/${commentId}`, commentData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (commentId: number): Promise<void> => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      return handleError(error);
    }
  },

  getByPost: async (postId: number): Promise<CommentDto[]> => {
    try {
      const response = await api.get<CommentDto[]>(`/${postId}/comments/all`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// ❤️ Like API
export const likeApi = {
  like: async (postId: number): Promise<LikeDto> => {
    try {
      const userId = getCurrentUserId();
      const response = await api.post<LikeDto>(`/${postId}/likes`, null, {
        headers: getAuthHeaders(),
        params: { userId },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unlike: async (postId: number): Promise<void> => {
    try {
      const userId = getCurrentUserId();
      await api.delete(`/${postId}/likes`, {
        headers: getAuthHeaders(),
        params: { userId },
      });
    } catch (error) {
      return handleError(error);
    }
  },

  getCount: async (postId: number): Promise<number> => {
    try {
      const response = await api.get<number>(`/${postId}/likes/count`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  checkLike: async (postId: number): Promise<boolean> => {
    try {
      const userId = getCurrentUserId();
      const response = await api.get<boolean>(`/${postId}/likes/check`, {
        headers: getAuthHeaders(),
        params: { userId },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Optional: Set on login
export const setCurrentUserSession = (token: string, userId: number) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId.toString());
};

export const CURRENT_USER_ID = getCurrentUserId();  