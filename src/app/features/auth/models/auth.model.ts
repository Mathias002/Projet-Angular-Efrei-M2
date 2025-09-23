export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
