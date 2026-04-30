import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  BookingsResponse,
  CreateBookingRequest,
  CreateBookingResponse,
} from './types';

export async function createBooking(
  payload: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  const response = await apiClient.post<CreateBookingResponse>(
    ENDPOINTS.bookings.create,
    payload,
  );
  return response.data;
}

export type BrowseBookingsParams = {
  page?: number;
  limit?: number;
};

export async function fetchMyBookings(
  params: BrowseBookingsParams = {},
): Promise<BookingsResponse> {
  const response = await apiClient.get<BookingsResponse>(ENDPOINTS.bookings.mine, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  });
  return response.data;
}

