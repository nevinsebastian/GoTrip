import { fetchSearch } from '@/src/api/search.service';
import type { SearchParams, SearchType } from '@/src/api/types';
import {
  filterHotelSearchListings,
  mapSearchListingsToListings,
} from '@/src/utils/mapSearchListing';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export type UnifiedSearchFilters = SearchParams & {
  /** Client-side hotel star filter (not sent to API). */
  starRatingMin?: number;
  starRatingMax?: number;
  /** @deprecated use offset */
  page?: number;
};

export const unifiedSearchQueryKey = (filters: UnifiedSearchFilters) =>
  ['search', filters] as const;

function resolveOffset(params: UnifiedSearchFilters, limit: number): number {
  if (params.offset != null) return Math.max(0, params.offset);
  if (params.page != null) return Math.max(0, (params.page - 1) * limit);
  return 0;
}

function buildSearchRequest(
  filters: UnifiedSearchFilters,
  offset: number,
): SearchParams {
  const { starRatingMin: _min, starRatingMax: _max, page: _page, ...rest } = filters;
  return {
    ...rest,
    limit: filters.limit ?? 20,
    offset,
  };
}

export function useUnifiedSearch(filters: UnifiedSearchFilters, enabled = true) {
  const limit = filters.limit ?? 20;
  const { starRatingMin, starRatingMax } = filters;

  const query = useInfiniteQuery({
    queryKey: unifiedSearchQueryKey(filters),
    queryFn: ({ pageParam }) => fetchSearch(buildSearchRequest(filters, pageParam)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      if (loaded >= lastPage.total) return undefined;
      return loaded;
    },
    enabled,
    staleTime: 60_000,
  });

  const rawItems = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data?.pages],
  );

  const items = useMemo(
    () =>
      filters.type === 'hotel'
        ? filterHotelSearchListings(rawItems, { starRatingMin, starRatingMax })
        : rawItems,
    [rawItems, filters.type, starRatingMin, starRatingMax],
  );

  const listings = useMemo(() => mapSearchListingsToListings(items), [items]);
  const total = query.data?.pages[0]?.total ?? items.length;

  return {
    ...query,
    items,
    listings,
    total,
    hasMore: rawItems.length < total,
    meta: query.data?.pages[0]?.meta,
  };
}

export function useUnifiedSearchPage(
  filters: UnifiedSearchFilters & { enabled?: boolean },
) {
  const { enabled = true, ...searchFilters } = filters;
  const limit = searchFilters.limit ?? 20;
  const offset = resolveOffset(searchFilters, limit);
  const { starRatingMin, starRatingMax } = searchFilters;

  const query = useQuery({
    queryKey: unifiedSearchQueryKey({ ...searchFilters, offset }),
    queryFn: () => fetchSearch(buildSearchRequest(searchFilters, offset)),
    enabled,
    staleTime: 60_000,
  });

  const rawItems = query.data?.data ?? [];
  const items =
    searchFilters.type === 'hotel'
      ? filterHotelSearchListings(rawItems, { starRatingMin, starRatingMax })
      : rawItems;
  const listings = mapSearchListingsToListings(items);

  return {
    listings,
    items,
    total: query.data?.total ?? listings.length,
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export type { SearchType };
