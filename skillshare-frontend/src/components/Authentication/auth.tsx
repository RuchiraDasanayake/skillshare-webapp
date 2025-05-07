

// Constants
export const TOKEN_KEY = 'token';

// Token management
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// JWT token decoding
export const decodeToken = (token?: string): any => {
  const tokenToDecode = token || getAuthToken();
  if (!tokenToDecode) return null;
  
  try {
    const base64Url = tokenToDecode.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const decoded = decodeToken();
  return decoded?.userId || decoded?.sub || null;
};

// Axios interceptor setup
export const setupAuthInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );
};