import axiosInstance from "../config/axiosConfig";
import { CreateUserRequest, User, LoginUserRequest, LoginUserResponse } from "../types/user-types";
import axios from "axios";
const BASE_URL = '/api/users';

export const userApi = {
    // Register a new user
    register: async (userData: CreateUserRequest): Promise<User> => {
        try {
            const response = await axiosInstance.post<User>(`${BASE_URL}/register`, userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('An unexpected error occurred during registration');
        }
    },

    // Get all users
    getAllUsers: async (): Promise<User[]> => {
        try {
            const response = await axiosInstance.get<User[]>(BASE_URL);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to fetch users');
        }
    },

    // Get user by ID
    getUserById: async (id: string): Promise<User> => {
        try {
            const response = await axiosInstance.get<User>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to fetch user');
        }
    },

    // Update user
    updateUser: async (id: string, userData: CreateUserRequest): Promise<User> => {
        try {
            const response = await axiosInstance.put<User>(`${BASE_URL}/${id}`, userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to update user');
        }
    },

    // Delete user
    deleteUser: async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to delete user');
        }
    },
    loginUser:async (userData:LoginUserRequest):Promise<LoginUserResponse>=>{
        try {
            const response = await axiosInstance.post<LoginUserResponse>(`/api/auth/login`, userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to login user');
        }
    },
    initiateGoogleLogin() {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
      },
};

