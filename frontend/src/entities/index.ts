import * as Yup from "yup";

/**
 * User et login schema
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
 * Register & register schema
 */
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}
export const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(4).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
});

/**
 * Password change
 */
export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}
export const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().min(1).required(),
  newPassword: Yup.string()
    .min(8)
    .notOneOf(
      [Yup.ref("currentPassword")],
      "Le nouveau mot de passe doit être différent de l'actuel",
    )
    .required("Le mot de passe est requis"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
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
export const CreatePostSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(5, "Le titre doit faire au minimum 5 caractères")
    .max(150, "Le titre doit faire 150 caractère maximum")
    .required("Le titre est requis"),
  text: Yup.string()
    .trim()
    .min(8, "Le contenu doit fait au minimum 8 caractères")
    .max(1500, "Le contenu doit faire maximum 1500")
    .required("Le contenu est requis"),
});

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
export const CreateCommentSchema = Yup.object().shape({
  text: Yup.string()
    .trim()
    .min(8, "Le commentaire doit fait au minimum 8 caractères")
    .max(1500, "Le commentaire doit faire maximum 1500")
    .required("Le commentaire est requis"),
});

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
