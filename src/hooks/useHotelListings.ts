import { browseHotels } from '@/src/api/hotel.service';
import type { APIError, BrowseHotelsParams, Listing } from '@/src/api/types';
import {
  filterHotelsForSearch,
  type HotelSearchCriteria,
} from '@/src/utils/hotelSearchFilters';
import { mapHotelsToListings } from '@/src/utils/mapHotelToListing';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

export type UseHotelListingsParams = BrowseHotelsParams &
  HotelSearchCriteria & {
    enabled?: boolean;
  };

export const hotelsQueryKey = (params: BrowseHotelsParams & HotelSearchCriteria) =>
  ['hotels', 'browse', params] as const;

export function useHotels(
  params: BrowseHotelsParams,
  enabled = true,
): UseQueryResult<Awaited<ReturnType<typeof browseHotels>>, APIError> {
  return useQuery({
    queryKey: hotelsQueryKey(params),
    queryFn: () => browseHotels(params),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useHotelListings(params: UseHotelListingsParams) {
  const { enabled = true, checkIn, checkOut, locationQuery, starRatingMin, starRatingMax, ...browseParams } =
    params;

  const query = useHotels(browseParams, enabled);

  const listings = useMemo<Listing[]>(() => {
    const hotels = filterHotelsForSearch(query.data?.data ?? [], {
      checkIn,
      checkOut,
      locationQuery,
      starRatingMin,
      starRatingMax,
    });
    return mapHotelsToListings(hotels);
  }, [query.data?.data, checkIn, checkOut, locationQuery, starRatingMin, starRatingMax]);

  return {
    listings,
    total: query.data?.total ?? listings.length,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
