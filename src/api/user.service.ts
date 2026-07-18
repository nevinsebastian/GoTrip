// src/api/user.service.ts
// User profile-related API calls.

import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { User } from './types';

function normalizeUser(raw: unknown): User {
  const root = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const u = (
    root.user && typeof root.user === 'object'
      ? root.user
      : root.data && typeof root.data === 'object'
        ? root.data
        : root
  ) as Record<string, unknown>;

  const fullName =
    (u.fullName as string | undefined) ??
    (u.full_name as string | undefined) ??
    (u.name as string | undefined);

  return {
    id: String(u.id ?? ''),
    email: String(u.email ?? ''),
    full_name: fullName,
    name: fullName,
    phone: (u.phone as string | null | undefined) ?? null,
    phoneNumber:
      (u.phoneNumber as string | null | undefined) ??
      (u.phone as string | null | undefined) ??
      null,
    role: u.role as string | undefined,
    avatarUrl: (u.avatarUrl as string | null | undefined) ?? null,
    is_verified: u.is_verified as boolean | undefined,
    createdAt: u.createdAt as string | undefined,
    updatedAt: u.updatedAt as string | undefined,
  };
}

/** GET /auth/me */
export const fetchUserProfile = async (): Promise<User> => {
  const response = await apiClient.get(ENDPOINTS.user.profile);
  return normalizeUser(response.data);
};

export interface UpdateUserProfileRequest {
  fullName?: string;
  name?: string;
  phone?: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

/** PATCH /users/me/profile */
export const updateUserProfile = async (
  payload: UpdateUserProfileRequest,
): Promise<User> => {
  const body: Record<string, unknown> = {};
  const fullName = payload.fullName ?? payload.name;
  if (fullName != null) body.fullName = fullName;
  const phone = payload.phone ?? payload.phoneNumber;
  if (phone != null) body.phone = phone;
  if (payload.avatarUrl !== undefined) body.avatarUrl = payload.avatarUrl;

  const response = await apiClient.patch(ENDPOINTS.user.updateProfile, body);
  return normalizeUser(response.data);
};
