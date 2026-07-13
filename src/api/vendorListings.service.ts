import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  Listing,
  VendorMyListingsQuery,
  VendorMyListingsResponse,
  VendorMyListingsResult,
} from './types';

function extractListingsPayload(data: VendorMyListingsResponse): VendorMyListingsResult {
  const listings: Listing[] = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.listings)
      ? data.listings
      : [];

  const meta = data.meta ?? {};
  const limit = Number(data.limit ?? meta.limit ?? 20);
  const offset = Number(data.offset ?? meta.offset ?? 0);
  const total = Number(data.total ?? meta.total ?? listings.length);

  return {
    listings,
    meta: { total, limit, offset },
  };
}

export const getVendorMyListings = async (
  query: VendorMyListingsQuery = {},
): Promise<VendorMyListingsResult> => {
  const params: Record<string, string | number> = {};

  if (query.category) params.category = query.category;
  if (query.status) params.status = query.status;
  if (query.limit != null) params.limit = query.limit;
  if (query.offset != null) params.offset = query.offset;

  const response = await apiClient.get<VendorMyListingsResponse>(
    ENDPOINTS.vendors.myListings,
    { params },
  );

  const payload = response.data;
  if (payload && typeof payload === 'object' && payload.success === false) {
    throw new Error(payload.error ?? payload.message ?? 'Failed to load listings');
  }

  return extractListingsPayload(payload ?? {});
};
