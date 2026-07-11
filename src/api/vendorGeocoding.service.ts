import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import { reverseNominatim, searchNominatim } from '@/src/utils/nominatim';

export type GeocodedLocation = {
  coordinate: VendorMapCoordinate;
  searchLabel: string;
  address: import('@/src/constants/vendorPropertyConstants').VendorAddress;
};

export async function reverseGeocodeVendorLocation(
  coordinate: VendorMapCoordinate,
): Promise<GeocodedLocation> {
  return reverseNominatim(coordinate);
}

export async function searchVendorLocations(query: string): Promise<GeocodedLocation[]> {
  return searchNominatim(query);
}

export async function getCurrentVendorLocation(): Promise<GeocodedLocation> {
  const Location = await import('expo-location');
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Location permission is required to use your current position.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const coordinate: VendorMapCoordinate = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  return reverseNominatim(coordinate);
}
