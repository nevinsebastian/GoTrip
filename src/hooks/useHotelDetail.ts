import {
  fetchCancellationPolicies,
  fetchHotelById,
  fetchListingReviews,
} from '@/src/api/hotel.service';
import type { APIError, CancellationPolicy, HotelDetail, ListingReview } from '@/src/api/types';
import { resolveCancellationText } from '@/src/utils/hotelDetailHelpers';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export type HotelDetailData = {
  hotel: HotelDetail;
  reviews: ListingReview[];
  cancellationPolicyText?: string;
  cancellationPolicies: CancellationPolicy[];
};

export const hotelDetailQueryKey = (id: string) => ['hotels', 'detail', id] as const;

async function loadHotelDetail(listingId: string): Promise<HotelDetailData> {
  const [hotelRes, reviewsRes, policies] = await Promise.all([
    fetchHotelById(listingId),
    fetchListingReviews(listingId).catch(() => ({ reviews: [] as ListingReview[] })),
    fetchCancellationPolicies().catch(() => [] as CancellationPolicy[]),
  ]);

  const hotel = hotelRes.hotel;
  if (!hotel?.id) {
    throw Object.assign(new Error('Hotel not found'), { status: 404 });
  }

  return {
    hotel,
    reviews: reviewsRes.reviews ?? [],
    cancellationPolicies: policies,
    cancellationPolicyText: resolveCancellationText(hotel.cancellationPolicyId, policies),
  };
}

export function useHotelDetail(
  id: string | undefined,
  enabled = true,
): UseQueryResult<HotelDetailData, APIError> {
  return useQuery({
    queryKey: hotelDetailQueryKey(id ?? ''),
    queryFn: () => {
      if (!id) throw new Error('Hotel id is required');
      return loadHotelDetail(id);
    },
    enabled: enabled && Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}
