// src/hooks/useLogin.ts
// React Query mutation hook for user login.

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { login } from '../api/auth.service';
import type { LoginRequest, LoginResponse, APIError } from '../api/types';

export const useLogin = (): UseMutationResult<
  LoginResponse,
  APIError,
  LoginRequest
> => {
  return useMutation<LoginResponse, APIError, LoginRequest>({
    mutationFn: login,
  });
};

