import { createHotel } from '@/src/api/hotel.service';
import { HOTEL_LISTING_DEFAULTS } from '@/src/constants/hotelConstants';
import type { VendorAddress, VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import { buildHotelLocationJson } from '@/src/utils/buildHotelLocationJson';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { getVendorHotelDraft } from '@/src/utils/vendorHotelDraft';
import { saveVendorHotelListingId } from '@/src/utils/vendorHotelSession';

export type CreateVendorHotelResult = {
  success: boolean;
  message?: string;
  hotelId?: string;
};

function extractHotelId(res: Awaited<ReturnType<typeof createHotel>>): string | undefined {
  return res.id ?? res.listing?.id ?? res.data?.id;
}

export async function createVendorHotelListing(
  address: VendorAddress,
  coordinate: VendorMapCoordinate,
  searchLabel: string,
): Promise<CreateVendorHotelResult> {
  try {
    const draft = await getVendorHotelDraft();
    if (!draft?.title.trim()) {
      return { success: false, message: 'Please add a hotel title before continuing.' };
    }

    const res = await createHotel({
      title: draft.title.trim(),
      description: draft.description.trim() || draft.title.trim(),
      listingType: HOTEL_LISTING_DEFAULTS.listingType,
      starRating: HOTEL_LISTING_DEFAULTS.starRating,
      checkInTime: HOTEL_LISTING_DEFAULTS.checkInTime,
      checkOutTime: HOTEL_LISTING_DEFAULTS.checkOutTime,
      locationJson: buildHotelLocationJson(address, coordinate, searchLabel),
    });

    const hotelId = extractHotelId(res);
    if (res.success !== false && hotelId) {
      await saveVendorHotelListingId(hotelId);
      return { success: true, message: res.message, hotelId };
    }

    return { success: false, message: res.message ?? 'Could not create hotel listing.' };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
