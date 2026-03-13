// src/hooks/useVerifyOtp.ts
// React Query mutation hook for verifying OTP.

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { verifyOtp } from '../api/auth.service';
import type { APIError, VerifyOtpRequest, VerifyOtpResponse } from '../api/types';

export const useVerifyOtp = (): UseMutationResult<
  VerifyOtpResponse,
  APIError,
  VerifyOtpRequest
> => {
  return useMutation<VerifyOtpResponse, APIError, VerifyOtpRequest>({
    mutationFn: verifyOtp,
  });
};

