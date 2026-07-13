import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { holdBooking } from '@/src/api/booking.service';
import type { APIError, BookingHoldRequest, BookingHoldResponse } from '@/src/api/types';

export function useHoldBooking(): UseMutationResult<
  BookingHoldResponse,
  APIError,
  BookingHoldRequest
> {
  return useMutation<BookingHoldResponse, APIError, BookingHoldRequest>({
    mutationFn: holdBooking,
  });
}
