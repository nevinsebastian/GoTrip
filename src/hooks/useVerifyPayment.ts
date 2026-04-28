import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { APIError, VerifyPaymentRequest, VerifyPaymentResponse } from '../api/types';
import { verifyPayment } from '../api/payment.service';

export function useVerifyPayment(): UseMutationResult<
  VerifyPaymentResponse,
  APIError,
  VerifyPaymentRequest
> {
  return useMutation<VerifyPaymentResponse, APIError, VerifyPaymentRequest>({
    mutationFn: verifyPayment,
  });
}

