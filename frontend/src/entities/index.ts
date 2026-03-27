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
  likes: string[];
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
  likes: string[];
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
