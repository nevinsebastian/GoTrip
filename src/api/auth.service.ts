// src/api/auth.service.ts
// Authentication-related API calls.

import apiClient, {
  setStoredAuthToken,
  clearStoredAuthToken,
} from './client';
import { ENDPOINTS } from './endpoints';
import type {
  LoginRequest,
  LoginResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  User,
} from './types';

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    ENDPOINTS.auth.login,
    payload,
  );

  const data = response.data;
  if (data?.token) {
    await setStoredAuthToken(data.token);
  }

  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(ENDPOINTS.auth.logout);
  } catch {
    // Swallow logout API errors; we still clear local auth state.
  } finally {
    await clearStoredAuthToken();
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>(ENDPOINTS.auth.me);
  return response.data;
};

export const sendOtp = async (payload: SendOtpRequest): Promise<SendOtpResponse> => {
  const response = await apiClient.post<SendOtpResponse>(
    ENDPOINTS.auth.sendOtp,
    payload,
  );
  return response.data;
};

export const verifyOtp = async (
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>(
    ENDPOINTS.auth.verifyOtp,
    payload,
  );

  const data = response.data;
  const accessToken = data?.data?.access_token;
  if (data?.success && accessToken) {
    await setStoredAuthToken(accessToken);
  }

  return data;
};

