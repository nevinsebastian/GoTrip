import { useInfiniteQuery, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  browseActivities,
  browseGlamping,
  browsePackages,
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
  PaginatedBrowseResponse,
  PublicActivity,
  PublicGlamping,
  PublicPackage,
} from '@/src/api/types';
import type { Listing } from '@/src/api/types';
import {
  mapActivitiesToListings,
  mapGlampingToListings,
  mapPackagesToListings,
} from '@/src/utils/mapCategoryListing';
import {
  buildActivityDetailDisplay,
  buildGlampingDetailDisplay,
  buildPackageDetailDisplay,
  type CategoryDetailDisplay,
} from '@/src/utils/categoryDetailDisplay';

export type CategorySearchFilters = Pick<
  BrowseListingsParams,
  'city' | 'activityType' | 'limit'
>;

function useInfiniteCategoryBrowse<T>(
  key: string,
  browseFn: (params: BrowseListingsParams) => Promise<PaginatedBrowseResponse<T>>,
  mapFn: (items: T[]) => Listing[],
  filters: CategorySearchFilters,
  enabled = true,
) {
  const limit = filters.limit ?? 20;

  const query = useInfiniteQuery({
    queryKey: [key, 'search', filters],
    queryFn: ({ pageParam }) =>
      browseFn({
        city: filters.city,
        activityType: filters.activityType,
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

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data?.pages],
  );
  const listings = useMemo(() => mapFn(items), [items, mapFn]);
  const total = query.data?.pages[0]?.total ?? items.length;

  return { ...query, listings, items, total, hasMore: items.length < total };
}

export function useActivitySearch(filters: CategorySearchFilters = {}, enabled = true) {
  return useInfiniteCategoryBrowse(
    'activities',
    browseActivities,
    mapActivitiesToListings,
    filters,
    enabled,
  );
}

export function useGlampingSearch(filters: CategorySearchFilters = {}, enabled = true) {
  return useInfiniteCategoryBrowse(
    'glamping',
    browseGlamping,
    mapGlampingToListings,
    filters,
    enabled,
  );
}

export function usePackageSearch(filters: CategorySearchFilters = {}, enabled = true) {
  return useInfiniteCategoryBrowse(
    'packages',
    browsePackages,
    mapPackagesToListings,
    filters,
    enabled,
  );
}

export function useCategoryListings(
  category: 'activities' | 'glamping' | 'packages',
  params: BrowseListingsParams & { enabled?: boolean },
) {
  const { enabled = true, ...browseParams } = params;
  const limit = browseParams.limit ?? 20;
  const offset =
    browseParams.offset ??
    (browseParams.page != null ? Math.max(0, (browseParams.page - 1) * limit) : 0);

  const query = useQuery({
    queryKey: [category, 'browse', { ...browseParams, limit, offset }],
    queryFn: async () => {
      const args = { ...browseParams, limit, offset };
      if (category === 'activities') return browseActivities(args);
      if (category === 'glamping') return browseGlamping(args);
      return browsePackages(args);
    },
    enabled,
    staleTime: 60 * 1000,
  });

  const listings = useMemo(() => {
    const data = query.data?.data ?? [];
    if (category === 'activities') return mapActivitiesToListings(data as PublicActivity[]);
    if (category === 'glamping') return mapGlampingToListings(data as PublicGlamping[]);
    return mapPackagesToListings(data as PublicPackage[]);
  }, [category, query.data?.data]);

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

export type { ActivityTypeEnum, CategoryDetailDisplay };
