// src/hooks/useListings.ts
// React Query hook for browsing listings.

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { browseListings, type BrowseListingsParams } from '../api/listing.service';
import type { APIError, ListingsResponse } from '../api/types';

export const listingsQueryKey = (params: BrowseListingsParams) => ['listings', params] as const;

export const useListings = (
  params: BrowseListingsParams,
  enabled = true,
): UseQueryResult<ListingsResponse, APIError> => {
  return useQuery<ListingsResponse, APIError>({
    queryKey: listingsQueryKey(params),
    queryFn: () => browseListings(params),
    enabled,
    staleTime: 60 * 1000,
  });
};

