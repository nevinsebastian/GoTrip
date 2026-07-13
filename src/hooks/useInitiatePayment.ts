import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { initiatePayment } from '@/src/api/booking.service';
import type { APIError, InitiatePaymentRequest, InitiatePaymentResponse } from '@/src/api/types';

export function useInitiatePayment(): UseMutationResult<
  InitiatePaymentResponse,
  APIError,
  InitiatePaymentRequest
> {
  return useMutation<InitiatePaymentResponse, APIError, InitiatePaymentRequest>({
    mutationFn: initiatePayment,
  });
}
