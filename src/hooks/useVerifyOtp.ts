// src/hooks/useVerifyOtp.ts
// React Query mutation hook for verifying OTP.

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { verifyOtp } from '../api/auth.service';
import type { APIError, VerifyOtpRequest, VerifyOtpResponse } from '../api/types';
import { AUTH_SESSION_QUERY_KEY } from './useIsAuthenticated';

export const useVerifyOtp = (): UseMutationResult<
  VerifyOtpResponse,
  APIError,
  VerifyOtpRequest
> => {
  const queryClient = useQueryClient();

  return useMutation<VerifyOtpResponse, APIError, VerifyOtpRequest>({
    mutationFn: verifyOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    },
  });
};

