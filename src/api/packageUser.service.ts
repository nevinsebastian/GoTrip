import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  BrowseListingsParams,
  PackageDetailResponse,
  PackageEnquiriesResponse,
  PackageEnquiryRequest,
  PackageEnquiryResponse,
  PaginatedBrowseResponse,
  PublicPackage,
} from './types';

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

export async function browsePackages(
  params: BrowseListingsParams = {},
): Promise<PaginatedBrowseResponse<PublicPackage>> {
  const limit = params.limit ?? 20;
  const offset = resolveOffset({ ...params, limit });
  const query: Record<string, string | number> = { limit, offset };
  if (params.city?.trim()) query.city = params.city.trim();

  const response = await apiClient.get<PaginatedBrowseResponse<PublicPackage>>(
    ENDPOINTS.packages.browse,
    { params: query },
  );
  return normalizePaginated(response.data, limit, offset);
}

export async function fetchPackageById(listingId: string): Promise<PackageDetailResponse> {
  const response = await apiClient.get<PackageDetailResponse>(ENDPOINTS.packages.detail(listingId));
  return response.data;
}

export async function submitPackageEnquiry(
  listingId: string,
  payload: PackageEnquiryRequest,
): Promise<PackageEnquiryResponse> {
  const response = await apiClient.post<PackageEnquiryResponse>(
    ENDPOINTS.packages.enquiries(listingId),
    payload,
  );
  return response.data;
}

export type FetchMyEnquiriesParams = {
  limit?: number;
  offset?: number;
  page?: number;
};

export async function fetchMyPackageEnquiries(
  params: FetchMyEnquiriesParams = {},
): Promise<PackageEnquiriesResponse> {
  const limit = params.limit ?? 20;
  const offset = resolveOffset({ ...params, limit });
  const response = await apiClient.get<PackageEnquiriesResponse>(ENDPOINTS.packages.myEnquiries, {
    params: { limit, offset },
  });
  const payload = response.data;
  return {
    success: payload?.success,
    data: Array.isArray(payload?.data) ? payload.data : [],
    total: Number(payload?.total ?? payload?.data?.length ?? 0),
    limit: Number(payload?.limit ?? limit),
    offset: Number(payload?.offset ?? offset),
  };
}
