import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { APIError, CreateBookingRequest, CreateBookingResponse } from '../api/types';
import { createBooking } from '../api/booking.service';

export function useCreateBooking(): UseMutationResult<
  CreateBookingResponse,
  APIError,
  CreateBookingRequest
> {
  return useMutation<CreateBookingResponse, APIError, CreateBookingRequest>({
    mutationFn: createBooking,
  });
}

