import { getStoredAuthToken } from '@/src/api/client';
import { getVendorMyListings } from '@/src/api/vendorListings.service';
import type { APIError, VendorListingApiCategory, VendorListingApiStatus } from '@/src/api/types';
import type { VendorListingCardData } from '@/src/constants/vendorListingsConstants';
import { VENDOR_LISTINGS_PAGE_SIZE } from '@/src/constants/vendorListingsConstants';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { mapVendorListingToCard } from '@/src/utils/mapVendorListingToCard';
import { goToVendorLogin } from '@/src/utils/vendorNavigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo } from 'react';

export const VENDOR_MY_LISTINGS_QUERY_KEY = ['vendor', 'my-listings'] as const;

export type VendorMyListingsFilters = {
  category?: VendorListingApiCategory;
  status?: VendorListingApiStatus;
  limit?: number;
  hostName?: string;
};

async function handleVendorListingsAuthError(error: unknown): Promise<boolean> {
  const apiError = error as APIError;
  if (apiError.statusCode === 401) {
    goToVendorLogin();
    return true;
  }
  if (apiError.statusCode === 403) {
    const payload = apiError.details as Record<string, unknown> | undefined;
    const backendMessage = String(payload?.error ?? payload?.message ?? apiError.message ?? '');
    if (backendMessage.toLowerCase().includes('vendor profile')) {
      router.push('/become-vendor');
      return true;
    }
  }
  return false;
}

export function useVendorMyListings(filters: VendorMyListingsFilters) {
  const limit = filters.limit ?? VENDOR_LISTINGS_PAGE_SIZE;

  const query = useInfiniteQuery({
    queryKey: [...VENDOR_MY_LISTINGS_QUERY_KEY, filters.category, filters.status, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const token = await getStoredAuthToken();
      if (!token?.trim()) {
        const err: APIError = {
          message: 'Not authenticated',
          isUnauthorized: true,
          statusCode: 401,
        };
        throw err;
      }

      try {
        return await getVendorMyListings({
          category: filters.category,
          status: filters.status,
          limit,
          offset: pageParam,
        });
      } catch (error) {
        await handleVendorListingsAuthError(error);
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.meta.offset + lastPage.listings.length;
      return nextOffset < lastPage.meta.total ? nextOffset : undefined;
    },
    retry: (failureCount, error) => {
      const apiError = error as APIError;
      if (apiError.isUnauthorized || apiError.statusCode === 403) return false;
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });

  const listings = useMemo<VendorListingCardData[]>(() => {
    if (!query.data?.pages.length) return [];
    return query.data.pages.flatMap((page) =>
      page.listings.map((listing) =>
        mapVendorListingToCard(listing, { hostName: filters.hostName }),
      ),
    );
  }, [filters.hostName, query.data?.pages]);

  const total = query.data?.pages[0]?.meta.total ?? 0;
  const hasMore = Boolean(query.hasNextPage);

  return {
    listings,
    total,
    hasMore,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isError: query.isError,
    errorMessage: query.error ? getErrorMessage(query.error) : null,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
  };
}
