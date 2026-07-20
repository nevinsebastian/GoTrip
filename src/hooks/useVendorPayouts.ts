import { fetchVendorPayouts } from '@/src/api/vendorPayouts.service';
import type { APIError, VendorPayout } from '@/src/api/types';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useQuery } from '@tanstack/react-query';

export const VENDOR_PAYOUTS_QUERY_KEY = ['vendor', 'payouts'] as const;

export function useVendorPayouts(limit = 50, offset = 0) {
  const query = useQuery<VendorPayout[], APIError>({
    queryKey: [...VENDOR_PAYOUTS_QUERY_KEY, limit, offset],
    queryFn: async () => {
      const res = await fetchVendorPayouts({ limit, offset });
      return res.data ?? [];
    },
    retry: (count, error) => {
      const apiError = error as APIError;
      if (apiError.statusCode === 401) return false;
      return count < 1;
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    payouts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}
