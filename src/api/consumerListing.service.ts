import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import {
  browsePackages,
  fetchMyPackageEnquiries,
  fetchPackageById,
  submitPackageEnquiry,
} from './packageUser.service';
import type {
  ActivityDetailResponse,
  ActivityTypeEnum,
  AvailabilityEntityType,
  AvailabilityResponse,
  BrowseListingsParams,
  CancellationPoliciesResponse,
  CancellationPolicy,
  GlampingDetailResponse,
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
  return response.data;
};

export const fetchGlampingById = async (id: string): Promise<GlampingDetailResponse> => {
  const response = await apiClient.get<GlampingDetailResponse>(ENDPOINTS.glamping.detail(id));
  return response.data;
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
