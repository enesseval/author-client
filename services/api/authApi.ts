import axiosInstance from "@/lib/axiosInstance";

// API Response Types
interface ApiResponse<T = any> {
   success: boolean;
   errorMessage?: string;
   message?: string;
   data?: T;
}

// Auth Types
interface LoginCredentials {
   username: string;
   password: string;
}

interface RegisterData {
   username: string;
   password: string;
   role: "SUPER_ADMIN" | "ADMIN";
}

interface UpdateUserData {
   userId: string;
   username: string;
   role: "SUPER_ADMIN" | "ADMIN";
   oldPassword?: string;
   newPassword?: string;
}

interface User {
   id: string;
   username: string;
   role: "SUPER_ADMIN" | "ADMIN";
}

// Auth API Methods
export const authApi = {
   register: async (data: RegisterData): Promise<ApiResponse> => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
   },

   updateUser: async (data: UpdateUserData): Promise<ApiResponse> => {
      const response = await axiosInstance.put(`/auth/users/${data.userId}`, data);
      return response.data;
   },

   getUsers: async (): Promise<ApiResponse<User[]>> => {
      const response = await axiosInstance.get("/auth/users");
      return response.data;
   },

   login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
   },

   checkUser: async (): Promise<ApiResponse<User>> => {
      const response = await axiosInstance.get("/auth/check-user");
      return response.data;
   },

   logout: async (): Promise<ApiResponse> => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
   },

   deleteUser: async (userId: string): Promise<ApiResponse> => {
      const response = await axiosInstance.delete(`/auth/users/${userId}`);
      return response.data;
   },
};
