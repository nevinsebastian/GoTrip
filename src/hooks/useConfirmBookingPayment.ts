import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { APIError, Booking } from '../api/types';
import { waitForBookingConfirmation } from '../api/booking.service';

/** After Razorpay success, poll booking until webhook confirms (no /payments/verify). */
export function useConfirmBookingPayment(): UseMutationResult<
  Booking,
  APIError,
  { bookingId: string }
> {
  return useMutation<Booking, APIError, { bookingId: string }>({
    mutationFn: ({ bookingId }) => waitForBookingConfirmation(bookingId),
  });
}
