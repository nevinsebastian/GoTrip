// src/hooks/useSendOtp.ts
// React Query mutation hook for requesting OTP.

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { sendLoginOtp } from '../api/auth.service';
import type { APIError, SendLoginOtpRequest, SendOtpResponse } from '../api/types';

export const useSendOtp = (): UseMutationResult<
  SendOtpResponse,
  APIError,
  SendLoginOtpRequest
> => {
  return useMutation<SendOtpResponse, APIError, SendLoginOtpRequest>({
    mutationFn: sendLoginOtp,
  });
};

