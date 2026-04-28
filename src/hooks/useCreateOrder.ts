import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { APIError, CreateOrderRequest, CreateOrderResponse } from '../api/types';
import { createOrder } from '../api/payment.service';

export function useCreateOrder(): UseMutationResult<
  CreateOrderResponse,
  APIError,
  CreateOrderRequest
> {
  return useMutation<CreateOrderResponse, APIError, CreateOrderRequest>({
    mutationFn: createOrder,
  });
}

