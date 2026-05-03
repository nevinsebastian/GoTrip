// src/api/client.ts
// Centralized Axios instance with JWT handling and global error normalization.

import axios, { type AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '../config/env';
import { normalizeApiError } from '../utils/errorHandler';
import type { APIError } from './types';

export const AUTH_TOKEN_KEY = 'auth_token';

/** Resolve at call time — module load can run before `window` exists on web, which broke reload persistence. */
function webLocalStorage(): Storage | null {
  if (Platform.OS !== 'web') return null;
  try {
    if (typeof globalThis === 'undefined') return null;
    const ls = (globalThis as unknown as { localStorage?: Storage }).localStorage;
    if (!ls || typeof ls.getItem !== 'function') return null;
    return ls;
  } catch {
    return null;
  }
}

export const getStoredAuthToken = async (): Promise<string | null> => {
  const ls = webLocalStorage();
  if (ls) {
    try {
      return ls.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredAuthToken = async (token: string): Promise<void> => {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // Storage quota / private mode, etc.
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch {
    // Optionally log to monitoring/analytics here
  }
};

export const clearStoredAuthToken = async (): Promise<void> => {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch {
    // Optionally log to monitoring/analytics here
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach JWT token from secure storage
apiClient.interceptors.request.use(
  async config => {
    const token = await getStoredAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: normalize errors for consistent handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const normalized: APIError = normalizeApiError(error);
    return Promise.reject(normalized);
  },
);

export default apiClient;

