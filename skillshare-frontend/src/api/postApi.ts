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


// Post Operations
export const postApi = {
  create: async (postData: SkillPostDto): Promise<SkillPostDto> => {
    try {
      const response = await api.post<SkillPostDto>('', postData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id: number): Promise<SkillPostDto> => {
    try {
      const response = await api.get<SkillPostDto>(`/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getAll: async (page: number = 0, size: number = 10): Promise<Page<SkillPostDto>> => {
    try {
      const response = await api.get<Page<SkillPostDto>>('/all', {
        params: { 
          page,
          size
        }
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (
    id: number,
    postData: SkillPostDto
  ): Promise<SkillPostDto> => {
    try {
      const response = await api.put<SkillPostDto>(`/${id}`, postData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Comment Operations
export const commentApi = {
  create: async (
    postId: number,
    commentData: CommentDto
  ): Promise<CommentDto> => {
    try {
      const response = await api.post<CommentDto>(`/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (commentId: number, commentData: CommentDto): Promise<CommentDto> => {
    try {
      const response = await api.put<CommentDto>(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (commentId: number): Promise<void> => {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (error) {
      return handleError(error);
    }
  },

  getByPost: async (postId: number): Promise<CommentDto[]> => {
    try {
      const response = await api.get<CommentDto[]>(`/${postId}/comments/all`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
};

// Like Operations
export const likeApi = {
  like: async (postId: number, userId: string): Promise<LikeDto> => {
    try {
      const response = await api.post<LikeDto>(`/${postId}/likes`, null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unlike: async (postId: number, userId: string): Promise<void> => {
    try {
      await api.delete(`/${postId}/likes`, {
        params: { userId }
      });
    } catch (error) {
      return handleError(error);
    }
  },

  getCount: async (postId: number): Promise<number> => {
    try {
      const response = await api.get<number>(`/${postId}/likes/count`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  checkLike: async (postId: number, userId: string): Promise<boolean> => {
    try {
      const response = await api.get<boolean>(`/${postId}/likes/check`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

};

export const CURRENT_USER_ID = "Ruchira"; 