import type { APIError, Listing } from '@/src/api/types';
import { cityQueryFromLocation } from '@/src/utils/hotelSearchFilters';
import { useUnifiedSearchPage, type UnifiedSearchFilters } from '@/src/hooks/useUnifiedSearch';
import { useMemo } from 'react';

export type HotelSearchCriteria = {
  checkIn?: string;
  checkOut?: string;
  locationQuery?: string;
  starRatingMin?: number;
  starRatingMax?: number;
};

export type UseHotelListingsParams = {
  q?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  guests?: number;
  adults?: number;
  children?: number;
  locationQuery?: string;
  starRatingMin?: number;
  starRatingMax?: number;
  limit?: number;
  offset?: number;
  page?: number;
  enabled?: boolean;
};

export const hotelsQueryKey = (params: UseHotelListingsParams) =>
  ['search', 'hotel', 'page', params] as const;

export function useHotelListings(params: UseHotelListingsParams) {
  const {
    enabled = true,
    checkIn,
    checkOut,
    locationQuery,
    city,
    q,
    rooms,
    guests,
    adults,
    children,
    starRatingMin,
    starRatingMax,
    limit,
    offset,
    page,
  } = params;

  const textQuery = q ?? city ?? cityQueryFromLocation(locationQuery ?? '') ?? locationQuery;

  const searchFilters: UnifiedSearchFilters & { enabled?: boolean } = {
    type: 'hotel',
    q: textQuery?.trim() || undefined,
    checkIn,
    checkOut,
    rooms,
    guests,
    adults,
    children,
    limit,
    offset,
    page,
    starRatingMin,
    starRatingMax,
    enabled,
  };

  const query = useUnifiedSearchPage(searchFilters);

  const listings = useMemo<Listing[]>(() => query.listings, [query.listings]);

  return {
    listings,
    total: query.total,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as APIError | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    meta: query.meta,
  };
}
