import { createHotelRoomType } from '@/src/api/hotel.service';
import type { CreateRoomTypeResponse } from '@/src/api/types';
import type { VendorRoomConfig } from '@/src/constants/vendorListingConstants';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { mapVendorRoomToCreateRoomTypeRequest } from '@/src/utils/mapVendorRoomToApi';
import { getVendorHotelListingId } from '@/src/utils/vendorHotelSession';

export type CreateVendorRoomTypesResult = {
  success: boolean;
  message?: string;
  roomTypeIds?: string[];
};

function extractRoomTypeId(res: CreateRoomTypeResponse): string | undefined {
  return res.id ?? res.roomType?.id ?? res.data?.id;
}

function isRoomTypeCreateFailure(res: CreateRoomTypeResponse): boolean {
  if (res.success === false) return true;
  if (res.success === true) return false;
  return !extractRoomTypeId(res);
}

function validateRoom(room: VendorRoomConfig, index: number): string | null {
  if (!room.roomType.trim()) {
    return `Room ${index + 1}: please enter a room name.`;
  }
  if (!room.basePricePerNight || room.basePricePerNight <= 0) {
    return `Room ${index + 1}: please enter a base price per night.`;
  }
  if (!room.totalUnits || room.totalUnits < 1) {
    return `Room ${index + 1}: number of rooms must be at least 1.`;
  }
  return null;
}

export async function createVendorHotelRoomTypes(
  rooms: VendorRoomConfig[],
): Promise<CreateVendorRoomTypesResult> {
  try {
    const hotelId = await getVendorHotelListingId();
    if (!hotelId) {
      return {
        success: false,
        message: 'Hotel listing not found. Please complete location setup first.',
      };
    }

    const roomTypeIds: string[] = [];

    for (let index = 0; index < rooms.length; index += 1) {
      const room = rooms[index];
      const validationError = validateRoom(room, index);
      if (validationError) {
        return { success: false, message: validationError };
      }

      const payload = mapVendorRoomToCreateRoomTypeRequest(room);
      const res = await createHotelRoomType(hotelId, payload);
      if (isRoomTypeCreateFailure(res)) {
        return { success: false, message: res.message ?? `Could not create room ${index + 1}.` };
      }

      const roomTypeId = extractRoomTypeId(res);
      if (roomTypeId) roomTypeIds.push(roomTypeId);
    }

    return { success: true, roomTypeIds };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
