import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchMyBookings, type BrowseBookingsParams } from '../api/booking.service';
import type { APIError, BookingsResponse } from '../api/types';

export const bookingsQueryKey = (params: BrowseBookingsParams) =>
  ['bookings', params] as const;

export function useBookings(
  params: BrowseBookingsParams = {},
  enabled = true,
): UseQueryResult<BookingsResponse, APIError> {
  return useQuery<BookingsResponse, APIError>({
    queryKey: bookingsQueryKey(params),
    queryFn: () => fetchMyBookings(params),
    enabled,
    staleTime: 60 * 1000,
  });
}

