// src/api/types.ts
// Shared TypeScript types for API requests and responses.

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  // Backend uses full_name; some parts of app may prefer name.
  full_name?: string;
  name?: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  role?: string;
  is_verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string; // JWT access token
  refreshToken?: string;
  user: User;
}

export type OtpChannel = 'email' | 'phone';

export interface SendOtpRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  channel: OtpChannel;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    channel?: OtpChannel;
    identifier?: string;
  };
}

export interface VerifyOtpRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  channel: OtpChannel;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    access_token: string;
    refresh_token?: string;
  };
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface APIError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
  fieldErrors?: Record<string, string[]>;
  isNetworkError?: boolean;
  isUnauthorized?: boolean;
}

