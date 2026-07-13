import { useInfiniteQuery, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  fetchActivityById,
  fetchCancellationPolicies,
  fetchGlampingById,
  fetchListingReviews,
  fetchPackageById,
} from '@/src/api/consumerListing.service';
import type {
  ActivityDetail,
  ActivityTypeEnum,
  APIError,
  BrowseListingsParams,
  CancellationPolicy,
  GlampingDetail,
  ListingReview,
  PackageDetail,
  SearchType,
} from '@/src/api/types';
import type { Listing } from '@/src/api/types';
import {
  buildActivityDetailDisplay,
  buildGlampingDetailDisplay,
  buildPackageDetailDisplay,
  type CategoryDetailDisplay,
} from '@/src/utils/categoryDetailDisplay';
import {
  useUnifiedSearch,
  useUnifiedSearchPage,
  type UnifiedSearchFilters,
} from '@/src/hooks/useUnifiedSearch';

export type CategorySearchFilters = {
  q?: string;
  /** @deprecated use q */
  city?: string;
  activityType?: ActivityTypeEnum | string;
  limit?: number;
  checkIn?: string;
  checkOut?: string;
};

function categoryToSearchType(category: 'activities' | 'glamping' | 'packages'): SearchType {
  if (category === 'activities') return 'activity';
  if (category === 'glamping') return 'glamping';
  return 'package';
}

function buildCategorySearchFilters(
  category: 'activities' | 'glamping' | 'packages',
  filters: CategorySearchFilters,
): UnifiedSearchFilters {
  return {
    type: categoryToSearchType(category),
    q: filters.q ?? filters.city,
    checkIn: filters.checkIn,
    checkOut: filters.checkOut,
    category: filters.activityType,
    limit: filters.limit,
  };
}

function useInfiniteCategoryBrowse(
  category: 'activities' | 'glamping' | 'packages',
  filters: CategorySearchFilters,
  enabled = true,
) {
  const unifiedFilters = buildCategorySearchFilters(category, filters);
  const result = useUnifiedSearch(unifiedFilters, enabled);

  return {
    ...result,
    items: result.items,
    listings: result.listings,
    total: result.total,
    hasMore: result.hasMore,
  };
}

export function useActivitySearch(filters: CategorySearchFilters = {}, enabled = true) {
  return useInfiniteCategoryBrowse('activities', filters, enabled);
}

export function useGlampingSearch(filters: CategorySearchFilters = {}, enabled = true) {
  return useInfiniteCategoryBrowse('glamping', filters, enabled);
}

export function usePackageSearch(filters: CategorySearchFilters = {}, enabled = true) {
  return useInfiniteCategoryBrowse('packages', filters, enabled);
}

export function useCategoryListings(
  category: 'activities' | 'glamping' | 'packages',
  params: BrowseListingsParams & {
    enabled?: boolean;
    q?: string;
    checkIn?: string;
    checkOut?: string;
    category?: string;
  },
) {
  const { enabled = true, category: activityCategory, ...browseParams } = params;
  const limit = browseParams.limit ?? 20;
  const offset =
    browseParams.offset ??
    (browseParams.page != null ? Math.max(0, (browseParams.page - 1) * limit) : 0);

  const unifiedFilters: UnifiedSearchFilters & { enabled?: boolean } = {
    ...buildCategorySearchFilters(category, {
      q: browseParams.q ?? browseParams.city,
      activityType: browseParams.activityType ?? activityCategory,
      limit,
      checkIn: browseParams.checkIn,
      checkOut: browseParams.checkOut,
    }),
    offset,
    enabled,
  };

  const query = useUnifiedSearchPage(unifiedFilters);

  return {
    listings: query.listings,
    total: query.total,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

type CategoryDetailData = {
  detail: ActivityDetail | GlampingDetail | PackageDetail;
  display: CategoryDetailDisplay;
  reviews: ListingReview[];
  cancellationPolicies: CancellationPolicy[];
};

async function loadCategoryDetail(
  category: 'activities' | 'glamping' | 'packages',
  listingId: string,
): Promise<CategoryDetailData> {
  const [detailRes, reviewsRes, policies] = await Promise.all([
    category === 'activities'
      ? fetchActivityById(listingId)
      : category === 'glamping'
        ? fetchGlampingById(listingId)
        : fetchPackageById(listingId),
    fetchListingReviews(listingId).catch(() => ({ reviews: [] as ListingReview[] })),
    fetchCancellationPolicies().catch(() => [] as CancellationPolicy[]),
  ]);

  if (category === 'activities') {
    const activity = (detailRes as Awaited<ReturnType<typeof fetchActivityById>>).activity;
    if (!activity?.id) throw Object.assign(new Error('Activity not found'), { status: 404 });
    return {
      detail: activity,
      display: buildActivityDetailDisplay(activity, reviewsRes.reviews ?? [], policies),
      reviews: reviewsRes.reviews ?? [],
      cancellationPolicies: policies,
    };
  }

  if (category === 'glamping') {
    const glamping = (detailRes as Awaited<ReturnType<typeof fetchGlampingById>>).glamping;
    if (!glamping?.id) throw Object.assign(new Error('Glamping not found'), { status: 404 });
    return {
      detail: glamping,
      display: buildGlampingDetailDisplay(glamping, reviewsRes.reviews ?? [], policies),
      reviews: reviewsRes.reviews ?? [],
      cancellationPolicies: policies,
    };
  }

  const pkg = (detailRes as Awaited<ReturnType<typeof fetchPackageById>>).package;
  if (!pkg?.id) throw Object.assign(new Error('Package not found'), { status: 404 });
  return {
    detail: pkg,
    display: buildPackageDetailDisplay(pkg, reviewsRes.reviews ?? [], policies),
    reviews: reviewsRes.reviews ?? [],
    cancellationPolicies: policies,
  };
}

export function useActivityDetail(
  id: string | undefined,
  enabled = true,
): UseQueryResult<CategoryDetailData, APIError> {
  return useQuery({
    queryKey: ['activities', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('Activity id is required');
      return loadCategoryDetail('activities', id);
    },
    enabled: enabled && Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}

export function useGlampingDetail(
  id: string | undefined,
  enabled = true,
): UseQueryResult<CategoryDetailData, APIError> {
  return useQuery({
    queryKey: ['glamping', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('Glamping id is required');
      return loadCategoryDetail('glamping', id);
    },
    enabled: enabled && Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePackageDetail(
  id: string | undefined,
  enabled = true,
): UseQueryResult<CategoryDetailData, APIError> {
  return useQuery({
    queryKey: ['packages', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('Package id is required');
      return loadCategoryDetail('packages', id);
    },
    enabled: enabled && Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}

export type { ActivityTypeEnum, CategoryDetailDisplay, Listing };
