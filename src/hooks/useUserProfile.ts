// src/hooks/useUserProfile.ts
// React Query hook for fetching the current user's profile (`GET /users/me`).

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getStoredAuthToken } from '../api/client';
import { fetchUserProfile } from '../api/user.service';
import type { APIError, User } from '../api/types';

export const USER_PROFILE_QUERY_KEY = ['user', 'me'];

type UseUserProfileOptions = {
  enabled?: boolean;
};

export const useUserProfile = (
  options?: UseUserProfileOptions,
): UseQueryResult<User, APIError> => {
  const enabled = options?.enabled ?? true;

  return useQuery<User, APIError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const token = await getStoredAuthToken();
      if (!token?.trim()) {
        const err: APIError = {
          message: 'Not authenticated',
          isUnauthorized: true,
          statusCode: 401,
        };
        throw err;
      }
      return fetchUserProfile();
    },
    enabled,
    retry: (failureCount, error) => {
      if (error.isUnauthorized || error.statusCode === 403) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });
};

