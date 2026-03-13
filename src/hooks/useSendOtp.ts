// src/hooks/useSendOtp.ts
// React Query mutation hook for requesting OTP.

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { sendOtp } from '../api/auth.service';
import type { APIError, SendOtpRequest, SendOtpResponse } from '../api/types';

export const useSendOtp = (): UseMutationResult<
  SendOtpResponse,
  APIError,
  SendOtpRequest
> => {
  return useMutation<SendOtpResponse, APIError, SendOtpRequest>({
    mutationFn: sendOtp,
  });
};

