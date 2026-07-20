import apiClient from './client';
import { fetchActivityById, fetchGlampingById, fetchHotelById, fetchHotelRoomTypes, fetchPackageById } from './consumerListing.service';
import { ENDPOINTS } from './endpoints';
import type {
  ActivityDetailResponse,
  CreateActivitySlotRequest,
  CreateActivitySlotResponse,
  GlampingDetailResponse,
  GlampingMealPlanRequest,
  HotelDetailResponse,
  HotelLocationJson,
  HotelRoomTypesResponse,
  PackageDetailResponse,
  UpsertPackageItineraryRequest,
} from './types';

export type VendorEditableCategory = 'property' | 'packages' | 'glamping' | 'activities';

export type HotelUpdatePayload = {
  title?: string;
  description?: string;
  locationJson?: HotelLocationJson | null;
  starRating?: number;
  checkInTime?: string;
  checkOutTime?: string;
  propertyRules?: string[];
  cancellationPolicyId?: string | null;
};

export type HotelRoomTypeUpdatePayload = {
  basePricePerNight?: number;
  name?: string;
  totalUnits?: number;
  mealPlans?: Array<{
    planCode: string;
    includesBreakfast?: boolean;
    includesLunch?: boolean;
    includesDinner?: boolean;
    isDefault?: boolean;
  }>;
  isActive?: boolean;
};

export type HotelPropertyDetailsPayload = {
  bedType?: string;
  totalBeds?: number;
  maxGuests?: number;
  pricePerNight?: number;
};

export type PackageUpdatePayload = {
  title?: string;
  description?: string;
  pricePerPerson?: number;
};

export type GlampingUpdatePayload = {
  title?: string;
  description?: string;
  locationJson?: HotelLocationJson | null;
  totalCamps?: number;
  adultsPerCamp?: number;
  infantsPerCamp?: number;
  pricePerCampNight?: number;
  extraAdultCharge?: number;
  extraInfantCharge?: number;
  aboutExperience?: string;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  thingsToCarry?: string[];
  howToReach?: string;
};

export type ActivityUpdatePayload = {
  title?: string;
  description?: string;
  locationJson?: HotelLocationJson | null;
  activityType?: string;
  basePriceAdult?: number;
  basePriceInfant?: number;
  minAge?: number;
  totalSlotsPerDay?: number;
  aboutExperience?: string;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  thingsToCarry?: string[];
  howToReach?: string;
};

export type ActivitySlotUpdatePayload = {
  label?: string;
  maxParticipants?: number;
  priceOverrideAdult?: number;
  isActive?: boolean;
};

export type PriceOverridePayload = {
  overrides: Array<{ date: string; price: number }>;
};

export async function fetchVendorEditableListing(
  categoryId: VendorEditableCategory,
  listingId: string,
): Promise<
  | { categoryId: 'property'; detail: HotelDetailResponse; roomTypes: HotelRoomTypesResponse }
  | { categoryId: 'packages'; detail: PackageDetailResponse }
  | { categoryId: 'glamping'; detail: GlampingDetailResponse }
  | { categoryId: 'activities'; detail: ActivityDetailResponse }
> {
  if (categoryId === 'property') {
    const [detail, roomTypes] = await Promise.all([
      fetchHotelById(listingId),
      fetchHotelRoomTypes(listingId),
    ]);
    return { categoryId, detail, roomTypes };
  }
  if (categoryId === 'packages') {
    return { categoryId, detail: await fetchPackageById(listingId) };
  }
  if (categoryId === 'glamping') {
    return { categoryId, detail: await fetchGlampingById(listingId) };
  }
  return { categoryId, detail: await fetchActivityById(listingId) };
}

export async function updateHotelListing(listingId: string, payload: HotelUpdatePayload) {
  const response = await apiClient.patch(ENDPOINTS.hotels.update(listingId), payload);
  return response.data;
}

export async function updateHotelRoomType(
  listingId: string,
  roomTypeId: string,
  payload: HotelRoomTypeUpdatePayload,
) {
  const response = await apiClient.patch(ENDPOINTS.hotels.roomType(listingId, roomTypeId), payload);
  return response.data;
}

export async function upsertHotelPropertyDetails(
  listingId: string,
  payload: HotelPropertyDetailsPayload,
) {
  const response = await apiClient.post(ENDPOINTS.hotels.propertyDetails(listingId), payload);
  return response.data;
}

export async function updateHotelRoomAmenities(
  listingId: string,
  roomTypeId: string,
  amenityIds: string[],
) {
  const response = await apiClient.put(ENDPOINTS.hotels.roomAmenities(listingId, roomTypeId), {
    amenityIds,
  });
  return response.data;
}

export async function updatePackageListing(listingId: string, payload: PackageUpdatePayload) {
  const response = await apiClient.patch(ENDPOINTS.packages.update(listingId), payload);
  return response.data;
}

export async function upsertPackageItinerary(
  listingId: string,
  payload: UpsertPackageItineraryRequest,
) {
  const response = await apiClient.post(ENDPOINTS.packages.itineraries(listingId), payload);
  return response.data;
}

export async function updateGlampingListing(listingId: string, payload: GlampingUpdatePayload) {
  const response = await apiClient.patch(ENDPOINTS.glamping.update(listingId), payload);
  return response.data;
}

export async function upsertGlampingMealPlan(
  listingId: string,
  payload: GlampingMealPlanRequest,
) {
  const response = await apiClient.post(ENDPOINTS.glamping.mealPlans(listingId), payload);
  return response.data;
}

export async function updateActivityListing(listingId: string, payload: ActivityUpdatePayload) {
  const response = await apiClient.patch(ENDPOINTS.activities.update(listingId), payload);
  return response.data;
}

export async function updateActivityHighlights(listingId: string, highlightIds: string[]) {
  const response = await apiClient.put(ENDPOINTS.activities.highlights(listingId), { highlightIds });
  return response.data;
}

export async function updateActivitySlot(
  listingId: string,
  slotId: string,
  payload: ActivitySlotUpdatePayload,
) {
  const response = await apiClient.patch(ENDPOINTS.activities.slot(listingId, slotId), payload);
  return response.data;
}

export async function createActivitySlotForListing(
  listingId: string,
  payload: CreateActivitySlotRequest,
): Promise<CreateActivitySlotResponse> {
  const response = await apiClient.post<CreateActivitySlotResponse>(
    ENDPOINTS.activities.slots(listingId),
    payload,
  );
  return response.data;
}

export async function updateAvailabilityPriceOverride(
  entityType: 'room_type' | 'full_property' | 'glamping_site' | 'activity_slot',
  entityId: string,
  payload: PriceOverridePayload,
) {
  const response = await apiClient.patch(
    ENDPOINTS.availability.priceOverride(entityType, entityId),
    payload,
  );
  return response.data;
}
