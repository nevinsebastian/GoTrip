import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  VendorBookingActionResponse,
  VendorBookingsResponse,
} from './types';

export interface FetchVendorBookingsParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export const fetchVendorBookings = async (
  params: FetchVendorBookingsParams = {},
): Promise<VendorBookingsResponse> => {
  const query: Record<string, string | number> = {};
  if (params.status) query.status = params.status;
  if (params.limit != null) query.limit = params.limit;
  if (params.offset != null) query.offset = params.offset;

  const response = await apiClient.get<VendorBookingsResponse>(
    ENDPOINTS.vendorBookings.list,
    { params: query },
  );
  return response.data;
};

export const checkInBooking = async (id: string): Promise<VendorBookingActionResponse> => {
  const response = await apiClient.patch<VendorBookingActionResponse>(
    ENDPOINTS.vendorBookings.checkIn(id),
  );
  return response.data;
};

export const checkOutBooking = async (id: string): Promise<VendorBookingActionResponse> => {
  const response = await apiClient.patch<VendorBookingActionResponse>(
    ENDPOINTS.vendorBookings.checkOut(id),
  );
  return response.data;
};

export const markBookingNoShow = async (id: string): Promise<VendorBookingActionResponse> => {
  const response = await apiClient.patch<VendorBookingActionResponse>(
    ENDPOINTS.vendorBookings.noShow(id),
  );
  return response.data;
};
