import type {
  AvailabilityEntityType,
  CancellationPolicy,
  HotelDetail,
  HotelImage,
  HotelMealPlan,
  HotelRoomType,
  ListingReview,
} from '@/src/api/types';
import type { ResortRoomVariant } from '@/src/components/resort/resortConstants';
import { formatRoomOccupancyLabel, roomFitsGuests } from '@/src/utils/hotelCapacity';

export type HotelRoomDisplay = {
  id: string;
  name: string;
  guests: number;
  rooms: number;
  priceLabel: string;
  basePricePerNight?: number;
  occupancyLabel: string;
  maxAdultOccupancy?: number;
  maxChildOccupancy?: number;
  fitsSelectedGuests?: boolean;
  variant: ResortRoomVariant;
  showImages: boolean;
  bedType?: string;
  mealPlans: HotelMealPlan[];
  amenities: string[];
};

export type HotelReviewDisplay = {
  id: string;
  name: string;
  rating: number;
  ratingLabel: string;
  text: string;
};

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatHotelPricePerNight(amount: number | undefined | null): string {
  if (amount == null || !Number.isFinite(amount)) return '—';
  return formatInr(amount);
}

export function getHotelCarouselImages(images?: HotelImage[] | null, coverFallback?: string | null): string[] {
  const sorted = [...(images ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(b.isCover) - Number(a.isCover),
  );
  const urls = sorted.map((img) => img.url?.trim()).filter(Boolean) as string[];
  if (urls.length) return urls;
  if (coverFallback?.trim()) return [coverFallback.trim()];
  return [];
}

export function getHotelLocationLabel(hotel: Pick<HotelDetail, 'locationJson'>): string {
  const loc = hotel.locationJson;
  if (!loc) return '';
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
  return loc.city ?? loc.searchLabel ?? loc.address ?? loc.streetAddress ?? '';
}

export function getHotelAddress(hotel: Pick<HotelDetail, 'locationJson'>): string {
  const loc = hotel.locationJson;
  if (!loc) return '';
  return loc.address ?? loc.streetAddress ?? getHotelLocationLabel(hotel);
}

export function getHotelCoordinates(hotel: Pick<HotelDetail, 'locationJson'>) {
  const loc = hotel.locationJson;
  const lat = loc?.lat ?? loc?.latitude;
  const lng = loc?.lng ?? loc?.longitude;
  return {
    lat: typeof lat === 'number' ? lat : null,
    lng: typeof lng === 'number' ? lng : null,
  };
}

export function getRoomTypes(hotel: HotelDetail): HotelRoomType[] {
  return hotel.hotelProperty?.roomTypes ?? [];
}

export function isFullPropertyHotel(hotel: HotelDetail): boolean {
  return hotel.hotelProperty?.listingType === 'full_property';
}

export function getMinRoomPrice(hotel: HotelDetail): number | null {
  const prices = getRoomTypes(hotel)
    .map((r) => r.basePricePerNight)
    .filter((p): p is number => p != null && Number.isFinite(p));
  if (!prices.length) return null;
  return Math.min(...prices);
}

export function getPriceFromLabel(hotel: HotelDetail): string {
  const min = getMinRoomPrice(hotel);
  if (min == null) return '—';
  return `From ${formatInr(min)}/night`;
}

export function getBookingEntity(hotel: HotelDetail, selectedRoomTypeId?: string | null): {
  entityType: AvailabilityEntityType;
  entityId: string | null;
} {
  const roomTypes = getRoomTypes(hotel);
  if (!roomTypes.length) return { entityType: 'room_type', entityId: null };

  if (isFullPropertyHotel(hotel)) {
    return { entityType: 'full_property', entityId: roomTypes[0].id };
  }

  const room = selectedRoomTypeId
    ? roomTypes.find((r) => r.id === selectedRoomTypeId)
    : roomTypes[0];
  return { entityType: 'room_type', entityId: room?.id ?? null };
}

export function mapRoomTypeToDisplay(
  room: HotelRoomType,
  index: number,
  isFullProperty: boolean,
  selectedGuests?: { adults: number; children: number },
): HotelRoomDisplay {
  const guests = (room.maxAdultOccupancy ?? 2) + (room.maxChildOccupancy ?? 0);
  const variants: ResortRoomVariant[] = ['featured', 'special', 'breakfast', 'compact'];
  const variant = isFullProperty ? 'featured' : variants[index % variants.length];
  const adults = selectedGuests?.adults ?? 0;
  const children = selectedGuests?.children ?? 0;
  const hasGuestFilter = adults > 0 || children > 0;

  return {
    id: room.id,
    name: isFullProperty ? 'Entire property' : room.name,
    guests,
    rooms: 1,
    priceLabel: formatHotelPricePerNight(room.basePricePerNight),
    basePricePerNight: room.basePricePerNight,
    occupancyLabel: formatRoomOccupancyLabel(room),
    maxAdultOccupancy: room.maxAdultOccupancy,
    maxChildOccupancy: room.maxChildOccupancy,
    fitsSelectedGuests: hasGuestFilter
      ? roomFitsGuests(room, Math.max(1, adults), children, 1)
      : true,
    variant,
    showImages: index > 0 || !isFullProperty,
    bedType: room.bedType,
    mealPlans: room.mealPlans ?? [],
    amenities: (room.amenities ?? []).map((a) => a.name).filter(Boolean),
  };
}

export function mapHotelRoomsForDisplay(
  hotel: HotelDetail,
  selectedGuests?: { adults: number; children: number },
): HotelRoomDisplay[] {
  const roomTypes = getRoomTypes(hotel);
  const fullProperty = isFullPropertyHotel(hotel);
  if (fullProperty && roomTypes.length) {
    return [mapRoomTypeToDisplay(roomTypes[0], 0, true, selectedGuests)];
  }
  return roomTypes.map((room, index) =>
    mapRoomTypeToDisplay(room, index, false, selectedGuests),
  );
}

export function normalizePropertyRules(rules: unknown): string[] {
  if (!rules) return [];
  if (Array.isArray(rules)) {
    return rules.map(String).filter(Boolean);
  }
  if (typeof rules === 'string' && rules.trim()) return [rules.trim()];
  return [];
}

export function formatCheckTime(time?: string | null): string {
  if (!time?.trim()) return '—';
  const parts = time.trim().split(':');
  if (parts.length < 2) return time;
  const hour = Number(parts[0]);
  const minute = parts[1];
  if (!Number.isFinite(hour)) return time;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${minute} ${suffix}`;
}

export function mapReviewToDisplay(review: ListingReview, index: number): HotelReviewDisplay {
  const rating = Math.min(5, Math.max(0, Math.round(review.rating ?? 0)));
  const name =
    review.reviewerName ??
    review.user?.full_name ??
    review.user?.name ??
    'Guest';
  return {
    id: review.id ?? `review-${index}`,
    name,
    rating,
    ratingLabel: `${rating}.0/5`,
    text: review.comment?.trim() || 'No comment provided.',
  };
}

export function resolveCancellationText(
  policyId: string | null | undefined,
  policies: CancellationPolicy[],
): string | undefined {
  if (!policyId) return undefined;
  const policy = policies.find((p) => p.id === policyId);
  if (!policy) return undefined;
  return policy.policyText ?? policy.description ?? policy.name;
}

export function normalizeHighlights(highlights: unknown): string[] {
  if (!highlights) return [];
  if (Array.isArray(highlights)) {
    return highlights.map((h) => (typeof h === 'string' ? h : String((h as { title?: string }).title ?? h))).filter(Boolean);
  }
  return [];
}
