// src/api/auth.service.ts
// Authentication-related API calls.

import { clearVendorOnboardingState } from '@/src/utils/clearVendorOnboardingState';
import apiClient, {
  clearStoredAuthToken,
  setStoredAuthToken,
} from './client';
import { ENDPOINTS } from './endpoints';
import type {
  AuthContactPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendLoginOtpRequest,
  SendOtpResponse,
  User,
  VerifyLoginOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './types';

function contactBody(payload: AuthContactPayload): AuthContactPayload {
  const body: AuthContactPayload = {};
  if (payload.email?.trim()) body.email = payload.email.trim();
  if (payload.phone?.trim()) body.phone = payload.phone.trim();
  return body;
}

async function persistTokensFromVerifyResponse(data: VerifyOtpResponse): Promise<void> {
  const accessToken = data?.accessToken ?? data?.data?.access_token;
  if (data?.success && accessToken) {
    await setStoredAuthToken(accessToken);
  }
}

export function hasAuthTokens(response?: VerifyOtpResponse | null): boolean {
  if (!response?.success) return false;
  return Boolean(response.accessToken ?? response.data?.access_token);
}

export function authSuccessMessage(response?: VerifyOtpResponse | null): string | undefined {
  return response?.message ?? response?.error;
}

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
    await clearVendorOnboardingState();
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>(ENDPOINTS.auth.me);
  return response.data;
};

/** Login step 1 — POST /auth/login/send-otp */
export const sendLoginOtp = async (
  payload: SendLoginOtpRequest,
): Promise<SendOtpResponse> => {
  const response = await apiClient.post<SendOtpResponse>(
    ENDPOINTS.auth.loginSendOtp,
    contactBody(payload),
  );
  return response.data;
};

/** @deprecated alias — use sendLoginOtp */
export const sendOtp = sendLoginOtp;

/** Registration step 1 — POST /auth/register */
export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const body: RegisterRequest = {
    fullName: payload.fullName.trim(),
    password: payload.password,
    role: payload.role ?? 'user',
    ...(payload.email?.trim() ? { email: payload.email.trim() } : {}),
    ...(payload.phone?.trim() ? { phone: payload.phone.trim() } : {}),
  };

  const response = await apiClient.post<RegisterResponse>(
    ENDPOINTS.auth.register,
    body,
  );
  return response.data;
};

/** Login step 2 — POST /auth/login/verify-otp */
export const verifyLoginOtp = async (
  payload: VerifyLoginOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>(
    ENDPOINTS.auth.loginVerifyOtp,
    {
      ...contactBody(payload),
      otp: payload.otp,
    },
  );

  const data = response.data;
  await persistTokensFromVerifyResponse(data);
  return data;
};

/** Registration step 2 — POST /auth/verify-otp */
export const verifyRegistrationOtp = async (
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>(
    ENDPOINTS.auth.verifyOtp,
    {
      ...contactBody(payload),
      otp: payload.otp,
    },
  );

  const data = response.data;
  await persistTokensFromVerifyResponse(data);
  return data;
};
