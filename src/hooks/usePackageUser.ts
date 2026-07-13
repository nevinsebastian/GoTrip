import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchMyPackageEnquiries,
  submitPackageEnquiry,
  type FetchMyEnquiriesParams,
} from '@/src/api/packageUser.service';
import {
  fetchCancellationPolicies,
  fetchListingReviews,
  fetchPackageById,
} from '@/src/api/consumerListing.service';
import type { APIError, PackageDetail, PackageEnquiryRequest } from '@/src/api/types';
import { buildPackageDetailDisplay, type CategoryDetailDisplay } from '@/src/utils/categoryDetailDisplay';

export type PackageDetailData = {
  listing: PackageDetail;
  display: CategoryDetailDisplay;
};

export const packageDetailQueryKey = (id: string) => ['packages', 'detail', id] as const;
export const packageEnquiriesQueryKey = (params: FetchMyEnquiriesParams) =>
  ['packages', 'my-enquiries', params] as const;

async function loadPackageDetail(listingId: string): Promise<PackageDetailData> {
  const [detailRes, reviewsRes, policies] = await Promise.all([
    fetchPackageById(listingId),
    fetchListingReviews(listingId).catch(() => ({ reviews: [] })),
    fetchCancellationPolicies().catch(() => []),
  ]);

  const listing = detailRes.package;
  if (!listing?.id) throw Object.assign(new Error('Package not found'), { status: 404 });

  return {
    listing,
    display: buildPackageDetailDisplay(listing, reviewsRes.reviews ?? [], policies),
  };
}

export function usePackageDetailData(listingId: string | undefined, enabled = true) {
  return useQuery<PackageDetailData, APIError>({
    queryKey: packageDetailQueryKey(listingId ?? ''),
    queryFn: () => {
      if (!listingId) throw new Error('Package id is required');
      return loadPackageDetail(listingId);
    },
    enabled: enabled && Boolean(listingId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyPackageEnquiries(params: FetchMyEnquiriesParams = {}, enabled = true) {
  return useQuery({
    queryKey: packageEnquiriesQueryKey(params),
    queryFn: () => fetchMyPackageEnquiries(params),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useSubmitPackageEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, payload }: { listingId: string; payload: PackageEnquiryRequest }) =>
      submitPackageEnquiry(listingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages', 'my-enquiries'] });
    },
  });
}
