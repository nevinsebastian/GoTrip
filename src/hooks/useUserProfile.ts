// src/hooks/useUserProfile.ts
// React Query hook for fetching the current user's profile (`GET /users/me`).

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchUserProfile } from '../api/user.service';
import type { APIError, User } from '../api/types';

export const USER_PROFILE_QUERY_KEY = ['user', 'me'];

export const useUserProfile = (): UseQueryResult<User, APIError> => {
  return useQuery<User, APIError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserProfile,
  });
};

