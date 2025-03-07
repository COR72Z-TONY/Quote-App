import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import {
  ApiResponse,
  InfoData,
  TokenResponse,
  UserProfile,
  LoginRequest,
  Author,
  Quote,
} from "../types";

const API_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get token from cookie
const getToken = (): string | undefined => {
  return Cookies.get("auth_token");
};

// Set token to cookie
export const setToken = (token: string): void => {
  // In a real application, this would be done server-side with httpOnly cookie
  // For development purposes, we're using js-cookie
  Cookies.set("auth_token", token, { expires: 1 }); // Expires in 1 day
};

// Remove token from cookie
export const removeToken = (): void => {
  Cookies.remove("auth_token");
};

// Get company info (public)
export const getInfo = async (): Promise<string> => {
  try {
    const response: AxiosResponse<ApiResponse<InfoData>> = await api.get(
      "/info"
    );
    return response.data.data.info;
  } catch (error) {
    console.error("Error fetching info:", error);
    throw error;
  }
};

// Login user
export const login = async (credentials: LoginRequest): Promise<string> => {
  try {
    const response: AxiosResponse<ApiResponse<TokenResponse>> = await api.post(
      "/login",
      credentials
    );
    const token = response.data.data.token;
    setToken(token);
    return token;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Get user profile
export const getProfile = async (): Promise<UserProfile> => {
  const token = getToken();
  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const response: AxiosResponse<ApiResponse<UserProfile>> = await api.get(
      `/profile?token=${token}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Get random author with abort controller
export const getAuthor = async (
  abortController: AbortController
): Promise<Author> => {
  const token = getToken();
  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const response: AxiosResponse<ApiResponse<Author>> = await api.get(
      `/author?token=${token}`,
      {
        signal: abortController.signal,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching author:", error);
    throw error;
  }
};

// Get quote by author ID with abort controller
export const getQuote = async (
  authorId: number,
  abortController: AbortController
): Promise<Quote> => {
  const token = getToken();
  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const response: AxiosResponse<ApiResponse<Quote>> = await api.get(
      `/quote?token=${token}&authorId=${authorId}`,
      {
        signal: abortController.signal,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    await api.delete(`/logout?token=${token}`);
    removeToken();
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export default api;
