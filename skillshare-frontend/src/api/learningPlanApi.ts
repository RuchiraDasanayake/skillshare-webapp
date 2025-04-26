import axiosInstance from "../config/axiosConfig";
import { 
    CreateLearningPlanRequest, 
    UpdateLearningPlanRequest, 
    LearningPlanResponse, 
    LearningPlanWithUserResponse,
    LearningPlanSummary 
} from "../types/learing-plan-types";
import axios from "axios";

const BASE_URL = '/api/learning-plans';

export const learningPlanApi = {
    // Create a new learning plan
    createLearningPlan: async (userId: string, planData: CreateLearningPlanRequest): Promise<LearningPlanResponse> => {
        try {
            const response = await axiosInstance.post<LearningPlanResponse>(`${BASE_URL}?userId=${userId}`, planData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('An unexpected error occurred while creating the learning plan');
        }
    },

    // Get all learning plans
    getAllLearningPlans: async (): Promise<LearningPlanSummary[]> => {
        try {
            const response = await axiosInstance.get<LearningPlanSummary[]>(BASE_URL);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to fetch learning plans');
        }
    },

    // Get all learning plans for a specific user
    getUserLearningPlans: async (userId: string): Promise<LearningPlanSummary[]> => {
        try {
            const response = await axiosInstance.get<LearningPlanSummary[]>(`${BASE_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to fetch user learning plans');
        }
    },

    // Get learning plan details by ID
    getLearningPlanById: async (planId: string): Promise<LearningPlanWithUserResponse> => {
        try {
            const response = await axiosInstance.get<LearningPlanWithUserResponse>(`${BASE_URL}/${planId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to fetch learning plan');
        }
    },

    // Get learning plan details by ID for a specific user
    getUserLearningPlanById: async (userId: string, planId: string): Promise<LearningPlanResponse> => {
        try {
            const response = await axiosInstance.get<LearningPlanResponse>(`${BASE_URL}/user/${userId}/plan/${planId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to fetch user learning plan');
        }
    },

    // Update a learning plan
    updateLearningPlan: async (userId: string, planId: string, planData: UpdateLearningPlanRequest): Promise<LearningPlanResponse> => {
        try {
            const response = await axiosInstance.put<LearningPlanResponse>(`${BASE_URL}/${planId}?userId=${userId}`, planData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to update learning plan');
        }
    },

    // Delete a learning plan (soft delete)
    deleteLearningPlan: async (userId: string, planId: string): Promise<{ message: string }> => {
        try {
            const response = await axiosInstance.delete<{ message: string }>(`${BASE_URL}/${planId}?userId=${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to delete learning plan');
        }
    },

    // Hard delete a learning plan
    hardDeleteLearningPlan: async (planId: string): Promise<{ message: string }> => {
        try {
            const response = await axiosInstance.delete<{ message: string }>(`${BASE_URL}/${planId}/hard-delete`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to permanently delete learning plan');
        }
    },

    // Search learning plans by title
    searchPlansByTitle: async (keyword: string): Promise<LearningPlanSummary[]> => {
        try {
            const response = await axiosInstance.get<LearningPlanSummary[]>(`${BASE_URL}/search/title?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to search learning plans by title');
        }
    },

    // Search learning plans by topic
    searchPlansByTopic: async (topic: string): Promise<LearningPlanSummary[]> => {
        try {
            const response = await axiosInstance.get<LearningPlanSummary[]>(`${BASE_URL}/search/topic?topic=${topic}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to search learning plans by topic');
        }
    }
};