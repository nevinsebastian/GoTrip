import type { VendorAddress, VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';

export function buildHotelLocationJson(
  address: VendorAddress,
  coordinate: VendorMapCoordinate,
  searchLabel: string,
): Record<string, unknown> {
  const streetParts = [address.streetAddress, address.unit].filter(Boolean);
  const addressLine = streetParts.join(', ') || searchLabel.split(',')[0]?.trim() || '';

  return {
    lat: coordinate.latitude,
    lng: coordinate.longitude,
    city: address.city,
    state: address.state,
    country: address.country,
    address: addressLine,
    pinCode: address.pinCode || undefined,
    searchLabel,
  };
}
