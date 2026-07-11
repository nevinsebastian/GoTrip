import { submitHotelListingForApproval } from '@/src/api/hotel.service';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { getVendorHotelListingId } from '@/src/utils/vendorHotelSession';

export type SubmitVendorHotelListingResult = {
  success: boolean;
  message?: string;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function submitVendorHotelListing(): Promise<SubmitVendorHotelListingResult> {
  try {
    const hotelId = await getVendorHotelListingId();
    if (!hotelId) {
      return { success: false, message: 'Hotel listing not found. Please try again.' };
    }
    if (!isUuid(hotelId)) {
      return { success: false, message: 'Invalid hotel id. Please try again.' };
    }

    const res = await submitHotelListingForApproval(hotelId);
    if (res.success === false) {
      return { success: false, message: res.message ?? 'Could not submit listing for approval.' };
    }
    return { success: true, message: res.message };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

