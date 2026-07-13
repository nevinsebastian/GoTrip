import { browseHotels } from '@/src/api/hotel.service';
import type { BrowseHotelsParams, Listing, PublicHotel } from '@/src/api/types';
import { mapHotelsToListings } from '@/src/utils/mapHotelToListing';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export type HotelSearchFilters = Pick<BrowseHotelsParams, 'city' | 'minRating' | 'limit'>;

export const hotelSearchQueryKey = (filters: HotelSearchFilters) =>
  ['hotels', 'search', filters] as const;

export type HotelSearchPage = Awaited<ReturnType<typeof browseHotels>>;

export function useHotelSearch(filters: HotelSearchFilters = {}, enabled = true) {
  const limit = filters.limit ?? 20;

  const query = useInfiniteQuery({
    queryKey: hotelSearchQueryKey(filters),
    queryFn: ({ pageParam }) =>
      browseHotels({
        city: filters.city,
        minRating: filters.minRating,
        limit,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      if (loaded >= lastPage.total) return undefined;
      return loaded;
    },
    enabled,
    staleTime: 60 * 1000,
  });

  const hotels = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data?.pages],
  );

  const listings = useMemo(() => mapHotelsToListings(hotels), [hotels]);

  const total = query.data?.pages[0]?.total ?? hotels.length;
  const hasMore = hotels.length < total;

  return {
    ...query,
    listings,
    hotels,
    total,
    hasMore,
  };
}
