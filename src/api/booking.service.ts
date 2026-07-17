import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  BookingsResponse,
  Booking,
  BookingHoldRequest,
  BookingHoldResponse,
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
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
  limit?: number;
  offset?: number;
  page?: number;
  status?: string;
};

function resolveBookingOffset(params: BrowseBookingsParams, limit: number): number {
  if (params.offset != null) return Math.max(0, params.offset);
  if (params.page != null) return Math.max(0, (params.page - 1) * limit);
  return 0;
}

export async function checkAvailability(
  payload: CheckAvailabilityRequest,
): Promise<CheckAvailabilityResponse> {
  const response = await apiClient.post<CheckAvailabilityResponse>(
    ENDPOINTS.bookings.checkAvailability,
    payload,
  );
  return response.data;
}

/** @deprecated use checkAvailability */
export const checkHotelAvailability = checkAvailability;

export async function holdBooking(payload: BookingHoldRequest): Promise<BookingHoldResponse> {
  const response = await apiClient.post<BookingHoldResponse>(ENDPOINTS.bookings.hold, payload);
  return response.data;
}

export async function initiatePayment(
  payload: InitiatePaymentRequest,
): Promise<InitiatePaymentResponse> {
  const response = await apiClient.post<InitiatePaymentResponse>(
    ENDPOINTS.payments.initiate,
    payload,
  );
  const raw = response.data;
  const razorpay = raw?.razorpayOrder;
  const data =
    raw?.data ??
    (razorpay?.id && razorpay.key
      ? {
          order_id: razorpay.id,
          amount: razorpay.amount,
          currency: razorpay.currency ?? 'INR',
          key_id: razorpay.key,
          booking_id: payload.bookingId,
        }
      : undefined);

  return {
    ...raw,
    data: data
      ? {
          order_id: data.order_id,
          amount: data.amount,
          currency: data.currency ?? 'INR',
          key_id: data.key_id,
          booking_id: data.booking_id ?? payload.bookingId,
        }
      : undefined,
  };
}

export async function fetchMyBookings(
  params: BrowseBookingsParams = {},
): Promise<BookingsResponse> {
  const limit = params.limit ?? 20;
  const offset = resolveBookingOffset(params, limit);
  const response = await apiClient.get<BookingsResponse>(ENDPOINTS.bookings.mine, {
    params: {
      limit,
      offset,
      ...(params.status ? { status: params.status } : {}),
    },
  });
  const payload = response.data;
  const data = Array.isArray(payload?.data) ? payload.data : [];
  return {
    success: payload?.success ?? true,
    message: payload?.message ?? '',
    data: data.map((b) => ({
      ...b,
      start_date: b.start_date ?? b.check_in ?? '',
      end_date: b.end_date ?? b.check_out ?? '',
      guests: b.guests ?? b.adults ?? 1,
    })),
    meta: payload?.meta ?? { limit, total: data.length, offset },
  };
}

export async function fetchBookingById(id: string): Promise<Booking> {
  const response = await apiClient.get<{ success?: boolean; data?: Booking; booking?: Booking }>(
    ENDPOINTS.bookings.detail(id),
  );
  const payload = response.data;
  const booking = payload?.data ?? payload?.booking;
  if (!booking?.id) throw new Error('Booking not found');
  return booking;
}

export async function cancelBooking(
  id: string,
  reason?: string,
): Promise<{ success?: boolean; message?: string }> {
  const response = await apiClient.post(ENDPOINTS.bookings.cancel(id), reason ? { reason } : {});
  return response.data;
}
