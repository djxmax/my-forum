import * as Yup from "yup";

/**
 * User login & register
 */
export interface User {
  id: string;
  username: string;
  email: string;
}

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email non valide").required("Email requis"),
  password: Yup.string().min(1).required("Mot de passe requis"),
});

/**
 * Create post
 */
export interface Post {
  id: string;
  title: string;
  text: string;
  author: {
    id: string;
    username: string;
  };
  likesCount: number;
  hasLiked: boolean;
  createdAt: string;
}

/**
 * Create comment
 */
export interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    username: string;
  };
  post: string;
  likesCount: number;
  hasLiked: boolean;
  createdAt: string;
}

/**
 * Auth
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * Analytics
 */
export interface AnalyticsData {
  totalPosts: number;
  totalLikes: number;
  recentPosts: number;
  recentLikes: number;
  topPosters: { username: string; postCount: number }[];
  recentLimitDays: number;
}

/**
 * Pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
