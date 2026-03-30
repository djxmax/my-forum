export interface User {
  id: string;
  username: string;
  email: string;
}

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

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AnalyticsData {
  totalPosts: number;
  totalLikes: number;
  recentPosts: number;
  recentLikes: number;
  topPosters: { username: string; postCount: number }[];
  recentLimitDays: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
