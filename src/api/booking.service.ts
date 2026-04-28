import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { CreateBookingRequest, CreateBookingResponse } from './types';

export async function createBooking(
  payload: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  const response = await apiClient.post<CreateBookingResponse>(
    ENDPOINTS.bookings.create,
    payload,
  );
  return response.data;
}

