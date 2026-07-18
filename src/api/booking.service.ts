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
import {
  buildHoldPayload,
  normalizeHoldResponse,
  normalizeInitiateResponse,
  sleep,
  toDateOnly,
} from '@/src/utils/bookingPayment';

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
  const body: Record<string, unknown> = {
    entityType: payload.entityType,
    entityId: payload.entityId,
    checkIn: toDateOnly(payload.checkIn) ?? payload.checkIn,
    adults: Math.max(1, payload.adults),
  };
  if (payload.checkOut) body.checkOut = toDateOnly(payload.checkOut) ?? payload.checkOut;
  if (payload.infants != null && payload.infants > 0) body.infants = payload.infants;
  if (payload.unitsBooked != null && payload.unitsBooked > 0) {
    body.unitsBooked = payload.unitsBooked;
  }
  if (payload.mealPlanId) body.mealPlanId = payload.mealPlanId;
  if (payload.couponCode?.trim()) body.couponCode = payload.couponCode.trim();
  if (payload.slotId) body.slotId = payload.slotId;
  if (payload.glampingSiteId) body.glampingSiteId = payload.glampingSiteId;
  if (payload.roomTypeId) body.roomTypeId = payload.roomTypeId;

  const response = await apiClient.post<CheckAvailabilityResponse>(
    ENDPOINTS.bookings.checkAvailability,
    body,
  );
  return response.data;
}

/** @deprecated use checkAvailability */
export const checkHotelAvailability = checkAvailability;

export async function holdBooking(payload: BookingHoldRequest): Promise<BookingHoldResponse> {
  const body = buildHoldPayload(payload);
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[bookings/hold] request', body);
  }
  const response = await apiClient.post(ENDPOINTS.bookings.hold, body);
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[bookings/hold] response', response.data);
  }
  return normalizeHoldResponse(response.data);
}

export async function initiatePayment(
  payload: InitiatePaymentRequest,
): Promise<InitiatePaymentResponse> {
  const bookingId = payload.bookingId?.trim();
  if (!bookingId) {
    throw Object.assign(new Error('Missing bookingId for payment.'), { statusCode: 400 });
  }

  // Same body as working web/desktop flow — OpenAPI only accepts `bookingId`.
  const body = { bookingId };
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[payments/initiate] request', body);
  }

  try {
    const response = await apiClient.post(ENDPOINTS.payments.initiate, body);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[payments/initiate] response', response.data);
    }
    return normalizeInitiateResponse(response.data, bookingId);
  } catch (err) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[payments/initiate] error', err);
    }
    throw err;
  }
}

/**
 * Confirmation is webhook-driven — poll GET /bookings/my/{id} until confirmed
 * (or timeout / failed / cancelled).
 */
export async function waitForBookingConfirmation(
  bookingId: string,
  options?: { timeoutMs?: number; intervalMs?: number },
): Promise<Booking> {
  const timeoutMs = options?.timeoutMs ?? 45_000;
  const intervalMs = options?.intervalMs ?? 2_000;
  const started = Date.now();
  let last: Booking | null = null;

  while (Date.now() - started < timeoutMs) {
    last = await fetchBookingById(bookingId);
    const status = (last.status ?? '').toLowerCase();
    if (status === 'confirmed' || status === 'completed' || status === 'checked_in') {
      return last;
    }
    if (
      status === 'cancelled' ||
      status === 'failed' ||
      status === 'expired' ||
      status === 'no_show'
    ) {
      throw Object.assign(new Error(`Booking ${status}`), {
        statusCode: 400,
        details: last,
      });
    }
    await sleep(intervalMs);
  }

  // Soft success: payment captured client-side; webhook may still be catching up.
  if (last) return last;
  return fetchBookingById(bookingId);
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
      start_date: b.start_date ?? b.check_in ?? b.checkIn ?? '',
      end_date: b.end_date ?? b.check_out ?? b.checkOut ?? '',
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
  const booking = payload?.data ?? payload?.booking ?? (payload as unknown as Booking);
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
