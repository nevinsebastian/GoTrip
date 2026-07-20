import {
  fetchVendorBookings,
  checkInBooking,
  checkOutBooking,
  markBookingNoShow,
} from '@/src/api/vendorBookings.service';
import type { APIError, VendorBooking } from '@/src/api/types';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { goToVendorLogin } from '@/src/utils/vendorNavigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const VENDOR_BOOKINGS_QUERY_KEY = ['vendor', 'bookings'] as const;

export interface UseVendorBookingsOptions {
  status?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export function useVendorBookings(options: UseVendorBookingsOptions = {}) {
  const { status, limit = 50, offset = 0, enabled = true } = options;

  const query = useQuery<VendorBooking[], APIError>({
    queryKey: [...VENDOR_BOOKINGS_QUERY_KEY, status, limit, offset],
    queryFn: async () => {
      try {
        const res = await fetchVendorBookings({ status, limit, offset });
        return res.data ?? [];
      } catch (error) {
        const apiError = error as APIError;
        if (apiError.statusCode === 401) goToVendorLogin();
        throw error;
      }
    },
    enabled,
    retry: (count, error) => {
      const apiError = error as APIError;
      if (apiError.statusCode === 401 || apiError.statusCode === 403) return false;
      return count < 1;
    },
    staleTime: 60 * 1000,
  });

  return {
    bookings: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useVendorBookingActions() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: VENDOR_BOOKINGS_QUERY_KEY });

  const checkIn = useMutation<unknown, APIError, string>({
    mutationFn: checkInBooking,
    onSuccess: invalidate,
  });

  const checkOut = useMutation<unknown, APIError, string>({
    mutationFn: checkOutBooking,
    onSuccess: invalidate,
  });

  const noShow = useMutation<unknown, APIError, string>({
    mutationFn: markBookingNoShow,
    onSuccess: invalidate,
  });

  return { checkIn, checkOut, noShow };
}
