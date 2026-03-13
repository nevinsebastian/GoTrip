// src/api/user.service.ts
// User profile-related API calls.

import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { User } from './types';

export const fetchUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>(ENDPOINTS.user.profile);
  return response.data;
};

export interface UpdateUserProfileRequest {
  name?: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
}

export const updateUserProfile = async (
  payload: UpdateUserProfileRequest,
): Promise<User> => {
  const response = await apiClient.put<User>(
    ENDPOINTS.user.updateProfile,
    payload,
  );
  return response.data;
};

