import {
  fetchCancellationPolicies,
  fetchHotelById,
  fetchHotelRoomTypes,
  fetchListingReviews,
} from '@/src/api/hotel.service';
import type {
  APIError,
  CancellationPolicy,
  HotelDetail,
  HotelRoomType,
  ListingReview,
} from '@/src/api/types';
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
  const [hotelRes, roomTypesRes, reviewsRes, policies] = await Promise.all([
    fetchHotelById(listingId),
    fetchHotelRoomTypes(listingId).catch(() => ({ roomTypes: [] as HotelRoomType[] })),
    fetchListingReviews(listingId).catch(() => ({ reviews: [] as ListingReview[] })),
    fetchCancellationPolicies().catch(() => [] as CancellationPolicy[]),
  ]);

  const hotel = hotelRes.hotel;
  if (!hotel?.id) {
    throw Object.assign(new Error('Hotel not found'), { status: 404 });
  }

  const nestedRooms = hotel.hotelProperty?.roomTypes ?? [];
  const fetchedRooms = roomTypesRes.roomTypes ?? [];
  const roomTypes = nestedRooms.length > 0 ? nestedRooms : fetchedRooms;

  const mergedHotel: HotelDetail = {
    ...hotel,
    hotelProperty: hotel.hotelProperty
      ? { ...hotel.hotelProperty, roomTypes }
      : roomTypes.length
        ? {
            id: '',
            listingId: hotel.id,
            roomTypes,
          }
        : hotel.hotelProperty,
  };

  return {
    hotel: mergedHotel,
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
