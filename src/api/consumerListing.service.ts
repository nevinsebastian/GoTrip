import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import {
  browsePackages,
  fetchMyPackageEnquiries,
  fetchPackageById,
  submitPackageEnquiry,
} from './packageUser.service';
import type {
  ActivityDetail,
  ActivityDetailResponse,
  ActivityTypeEnum,
  AvailabilityEntityType,
  AvailabilityResponse,
  BrowseListingsParams,
  CancellationPoliciesResponse,
  CancellationPolicy,
  GlampingDetail,
  GlampingDetailResponse,
  GlampingSite,
  HotelDetailResponse,
  HotelRoomTypesResponse,
  HotelsBrowseResponse,
  ListingReviewsResponse,
  PackageDetailResponse,
  PackageEnquiryRequest,
  PackageEnquiryResponse,
  PaginatedBrowseResponse,
  PublicActivity,
  PublicGlamping,
  PublicPackage,
  BrowseHotelsParams,
} from './types';

export { browsePackages, fetchPackageById, submitPackageEnquiry, fetchMyPackageEnquiries };

function resolveOffset(params: { offset?: number; page?: number; limit: number }): number {
  if (params.offset != null) return Math.max(0, params.offset);
  if (params.page != null) return Math.max(0, (params.page - 1) * params.limit);
  return 0;
}

function normalizePaginated<T>(
  payload: Partial<PaginatedBrowseResponse<T>> | null | undefined,
  limit: number,
  offset: number,
): PaginatedBrowseResponse<T> {
  const data = Array.isArray(payload?.data) ? payload.data : [];
  return {
    success: payload?.success,
    data,
    total: Number(payload?.total ?? data.length),
    limit: Number(payload?.limit ?? limit),
    offset: Number(payload?.offset ?? offset),
  };
}

function buildBrowseQuery(
  params: BrowseListingsParams | BrowseHotelsParams,
): Record<string, string | number> {
  const limit = params.limit ?? 20;
  const offset = resolveOffset({ ...params, limit });
  const query: Record<string, string | number> = { limit, offset };
  if (params.city?.trim()) query.city = params.city.trim();
  if ('minRating' in params && params.minRating != null) query.minRating = params.minRating;
  if ('activityType' in params && params.activityType) query.activityType = params.activityType;
  return query;
}

export const browseHotels = async (
  params: BrowseHotelsParams = {},
): Promise<HotelsBrowseResponse> => {
  const query = buildBrowseQuery(params);
  const response = await apiClient.get<HotelsBrowseResponse>(ENDPOINTS.hotels.browse, { params: query });
  return normalizePaginated(response.data, query.limit as number, query.offset as number);
};

export const browseActivities = async (
  params: BrowseListingsParams = {},
): Promise<PaginatedBrowseResponse<PublicActivity>> => {
  const query = buildBrowseQuery(params);
  const response = await apiClient.get<PaginatedBrowseResponse<PublicActivity>>(
    ENDPOINTS.activities.browse,
    { params: query },
  );
  return normalizePaginated(response.data, query.limit as number, query.offset as number);
};

export const browseGlamping = async (
  params: BrowseListingsParams = {},
): Promise<PaginatedBrowseResponse<PublicGlamping>> => {
  const query = buildBrowseQuery(params);
  const response = await apiClient.get<PaginatedBrowseResponse<PublicGlamping>>(
    ENDPOINTS.glamping.browse,
    { params: query },
  );
  return normalizePaginated(response.data, query.limit as number, query.offset as number);
};

export const fetchHotelById = async (id: string): Promise<HotelDetailResponse> => {
  const response = await apiClient.get<HotelDetailResponse>(ENDPOINTS.hotels.detail(id));
  return response.data;
};

export const fetchActivityById = async (id: string): Promise<ActivityDetailResponse> => {
  const response = await apiClient.get<ActivityDetailResponse>(ENDPOINTS.activities.detail(id));
  const payload = response.data;
  const listing = payload?.activity as
    | (ActivityDetail & { activity?: Record<string, unknown> & { slots?: ActivityDetail['slots'] } })
    | undefined;
  if (!listing?.id) return payload;

  // Backend shape: { activity: Listing & { activity: Activity & { slots } } }
  // Flatten nested product fields onto the listing for booking + UI.
  const nested = listing.activity;
  if (!nested || typeof nested !== 'object') return payload;

  const flattened: ActivityDetail = {
    ...listing,
    activityType: (nested.activityType as ActivityDetail['activityType']) ?? listing.activityType,
    basePriceAdult:
      (nested.basePriceAdult as number | undefined) ?? listing.basePriceAdult,
    basePriceInfant:
      (nested.basePriceInfant as number | undefined) ?? listing.basePriceInfant,
    minAge: (nested.minAge as number | undefined) ?? listing.minAge,
    totalSlotsPerDay:
      (nested.totalSlotsPerDay as number | undefined) ?? listing.totalSlotsPerDay,
    aboutExperience:
      (nested.aboutExperience as string | undefined) ?? listing.aboutExperience,
    inclusions: (nested.inclusions as string[] | undefined) ?? listing.inclusions,
    exclusions: (nested.exclusions as string[] | undefined) ?? listing.exclusions,
    whatsprovided: (nested.whatsprovided as string[] | undefined) ?? listing.whatsprovided,
    thingsToCarry: (nested.thingsToCarry as string[] | undefined) ?? listing.thingsToCarry,
    howToReach: (nested.howToReach as string | undefined) ?? listing.howToReach,
    slots: nested.slots ?? listing.slots,
  };

  return { ...payload, activity: flattened };
};

export const fetchGlampingById = async (id: string): Promise<GlampingDetailResponse> => {
  const response = await apiClient.get<GlampingDetailResponse>(ENDPOINTS.glamping.detail(id));
  const payload = response.data;
  const listing = payload?.glamping as
    | (GlampingDetail & {
        glampingSite?: GlampingSite & {
          mealPlans?: GlampingDetail['mealPlans'];
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
      })
    | undefined;
  if (!listing?.id) return payload;

  // Backend shape: { glamping: Listing & { glampingSite: GlampingSite & { mealPlans } } }
  const site = listing.glampingSite;
  if (!site?.id) return payload;

  const siteAsDisplay: GlampingSite = {
    id: site.id,
    name: site.name,
    totalUnits: site.totalCamps ?? site.totalUnits,
    maxAdults: site.adultsPerCamp ?? site.maxAdults,
    maxInfants: site.infantsPerCamp ?? site.maxInfants,
    basePricePerNight: site.pricePerCampNight ?? site.basePricePerNight,
  };

  const flattened: GlampingDetail = {
    ...listing,
    totalCamps: site.totalCamps ?? listing.totalCamps,
    adultsPerCamp: site.adultsPerCamp ?? listing.adultsPerCamp,
    infantsPerCamp: site.infantsPerCamp ?? listing.infantsPerCamp,
    pricePerCampNight: site.pricePerCampNight ?? listing.pricePerCampNight,
    extraAdultCharge: site.extraAdultCharge ?? listing.extraAdultCharge,
    extraInfantCharge: site.extraInfantCharge ?? listing.extraInfantCharge,
    aboutExperience: site.aboutExperience ?? listing.aboutExperience,
    inclusions: site.inclusions ?? listing.inclusions,
    exclusions: site.exclusions ?? listing.exclusions,
    whatsprovided: site.whatsprovided ?? listing.whatsprovided,
    thingsToCarry: site.thingsToCarry ?? listing.thingsToCarry,
    howToReach: site.howToReach ?? listing.howToReach,
    mealPlans: site.mealPlans ?? listing.mealPlans,
    sites: listing.sites?.length ? listing.sites : [siteAsDisplay],
    glampingSite: site,
  };

  return { ...payload, glamping: flattened };
};

export const fetchHotelRoomTypes = async (hotelId: string): Promise<HotelRoomTypesResponse> => {
  const response = await apiClient.get<HotelRoomTypesResponse>(ENDPOINTS.hotels.roomTypes(hotelId));
  return response.data;
};

export const fetchAvailability = async (
  entityType: AvailabilityEntityType,
  entityId: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityResponse> => {
  const response = await apiClient.get<AvailabilityResponse>(
    ENDPOINTS.availability.entity(entityType, entityId),
    { params: { startDate, endDate } },
  );
  return response.data;
};

export const fetchListingReviews = async (listingId: string): Promise<ListingReviewsResponse> => {
  const response = await apiClient.get<ListingReviewsResponse>(
    ENDPOINTS.reviews.listing(listingId),
  );
  const payload = response.data;
  return {
    success: payload?.success,
    reviews: Array.isArray(payload?.reviews) ? payload.reviews : [],
  };
};

export const fetchCancellationPolicies = async (): Promise<CancellationPolicy[]> => {
  const response = await apiClient.get<CancellationPoliciesResponse>(
    ENDPOINTS.admin.cancellationPolicies,
  );
  const payload = response.data;
  const list = payload?.data ?? payload?.policies ?? [];
  return Array.isArray(list) ? list : [];
};

export const fetchActivityHighlights = async (activityType: ActivityTypeEnum) => {
  const response = await apiClient.get(ENDPOINTS.admin.activityHighlights, {
    params: { activityType },
  });
  return response.data;
};
