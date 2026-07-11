import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
    CreateHotelRequest,
    CreateHotelResponse,
    CreateRoomTypeRequest,
    CreateRoomTypeResponse,
  SubmitHotelListingResponse,
} from './types';

export const createHotel = async (
  payload: CreateHotelRequest,
): Promise<CreateHotelResponse> => {
  const response = await apiClient.post<CreateHotelResponse>(
    ENDPOINTS.hotels.create,
    payload,
  );
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data) {
    return data;
  }
  return { success: true, ...(data ?? {}) };
};

export const createHotelRoomType = async (
  hotelId: string,
  payload: CreateRoomTypeRequest,
): Promise<CreateRoomTypeResponse> => {
  const response = await apiClient.post<CreateRoomTypeResponse>(
    ENDPOINTS.hotels.roomTypes(hotelId),
    payload,
  );
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data) {
    return data;
  }
  return { success: true, ...(data ?? {}) };
};

export const submitHotelListingForApproval = async (
  hotelId: string,
): Promise<SubmitHotelListingResponse> => {
  const response = await apiClient.post<SubmitHotelListingResponse>(
    ENDPOINTS.hotels.submit(hotelId),
  );
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data) {
    return data;
  }
  return { success: true, ...(data ?? {}) };
};
