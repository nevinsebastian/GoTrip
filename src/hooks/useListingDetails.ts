// src/hooks/useListingDetails.ts
// React Query hook for fetching listing details (`GET /listings/:id`).

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchListingById } from '../api/listing.service';
import type { APIError, ListingDetailResponse } from '../api/types';

export const listingDetailsQueryKey = (id: string) => ['listings', 'details', id] as const;

export const useListingDetails = (
  id: string | undefined,
): UseQueryResult<ListingDetailResponse, APIError> => {
  return useQuery<ListingDetailResponse, APIError>({
    queryKey: listingDetailsQueryKey(id ?? ''),
    queryFn: () => fetchListingById(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
};

