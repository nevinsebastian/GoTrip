import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { VendorPayoutsResponse } from './types';

export interface FetchVendorPayoutsParams {
  limit?: number;
  offset?: number;
}

export const fetchVendorPayouts = async (
  params: FetchVendorPayoutsParams = {},
): Promise<VendorPayoutsResponse> => {
  const query: Record<string, number> = {};
  if (params.limit != null) query.limit = params.limit;
  if (params.offset != null) query.offset = params.offset;

  const response = await apiClient.get<VendorPayoutsResponse>(
    ENDPOINTS.payouts.list,
    { params: query },
  );
  return response.data;
};
