import { register } from '@/src/api/auth.service';
import type { APIError, RegisterRequest, RegisterResponse } from '@/src/api/types';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

export const useRegister = (): UseMutationResult<
  RegisterResponse,
  APIError,
  RegisterRequest
> => {
  return useMutation<RegisterResponse, APIError, RegisterRequest>({
    mutationFn: register,
  });
};
