import {
  fetchVendorProfile,
  updateVendorProfile,
} from '@/src/api/vendor.service';
import type {
  APIError,
  UpdateVendorProfileRequest,
  VendorProfileFull,
} from '@/src/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const VENDOR_PROFILE_QUERY_KEY = ['vendor', 'profile'] as const;

export function useVendorProfile() {
  const query = useQuery<VendorProfileFull | undefined, APIError>({
    queryKey: VENDOR_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchVendorProfile();
      return res.data;
    },
    retry: (count, error) => {
      const apiError = error as APIError;
      if (apiError.statusCode === 401 || apiError.statusCode === 404) return false;
      return count < 1;
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();

  return useMutation<unknown, APIError, UpdateVendorProfileRequest>({
    mutationFn: updateVendorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PROFILE_QUERY_KEY });
    },
  });
}
