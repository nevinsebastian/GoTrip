import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from './types';

export async function createOrder(
  payload: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const response = await apiClient.post<CreateOrderResponse>(
    ENDPOINTS.payments.createOrder,
    payload,
  );
  return response.data;
}

export async function verifyPayment(
  payload: VerifyPaymentRequest,
): Promise<VerifyPaymentResponse> {
  const response = await apiClient.post<VerifyPaymentResponse>(
    ENDPOINTS.payments.verify,
    payload,
  );
  return response.data;
}

