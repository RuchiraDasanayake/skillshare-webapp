// src/utils/auth.ts

// Constants
export const TOKEN_KEY = 'jwtToken';  // Use a consistent token key across the app

// Store the JWT token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get the JWT token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove the JWT token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Set up axios interceptors for authentication headers
export const setupAuthInterceptor = (axios: any) => {
  axios.interceptors.request.use(
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