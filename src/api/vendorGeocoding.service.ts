import type { VendorAddress, VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import { VENDOR_DEFAULT_COORDINATE } from '@/src/constants/vendorPropertyConstants';

export type GeocodedLocation = {
  coordinate: VendorMapCoordinate;
  searchLabel: string;
  address: VendorAddress;
};

const MOCK_LOCATIONS: GeocodedLocation[] = [
  {
    coordinate: { latitude: 8.737868, longitude: 76.716339 },
    searchLabel: 'Mundayil Beach Road, Varkala, Thiruvananthapuram',
    address: {
      country: 'India',
      streetAddress: 'Mundayil Beach Road',
      unit: '',
      city: 'Varkala',
      state: 'Kerala',
      pinCode: '695141',
    },
  },
  {
    coordinate: { latitude: 8.7331, longitude: 76.7252 },
    searchLabel: 'North Cliff, Varkala, Kerala',
    address: {
      country: 'India',
      streetAddress: 'North Cliff Road',
      unit: '',
      city: 'Varkala',
      state: 'Kerala',
      pinCode: '695141',
    },
  },
  {
    coordinate: { latitude: 10.0889, longitude: 77.0595 },
    searchLabel: 'Munnar Tea Gardens, Kerala',
    address: {
      country: 'India',
      streetAddress: 'Tea Garden Road',
      unit: '',
      city: 'Munnar',
      state: 'Kerala',
      pinCode: '685612',
    },
  },
  {
    coordinate: { latitude: 9.5916, longitude: 76.5222 },
    searchLabel: 'Alleppey Backwaters, Kerala',
    address: {
      country: 'India',
      streetAddress: 'Backwater Road',
      unit: '',
      city: 'Alappuzha',
      state: 'Kerala',
      pinCode: '688001',
    },
  },
];

function nearestMockLocation(coordinate: VendorMapCoordinate): GeocodedLocation {
  let best = MOCK_LOCATIONS[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const location of MOCK_LOCATIONS) {
    const dLat = location.coordinate.latitude - coordinate.latitude;
    const dLng = location.coordinate.longitude - coordinate.longitude;
    const distance = dLat * dLat + dLng * dLng;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = location;
    }
  }

  return best;
}

/** API-ready reverse geocode stub — swap with Google/Mapbox when keys are available. */
export async function reverseGeocodeVendorLocation(
  coordinate: VendorMapCoordinate,
): Promise<GeocodedLocation> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const base = nearestMockLocation(coordinate);
  return {
    ...base,
    coordinate,
    searchLabel: `${base.address.streetAddress}, ${base.address.city}, ${base.address.state}`,
  };
}

/** API-ready location search stub. */
export async function searchVendorLocations(query: string): Promise<GeocodedLocation[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const normalized = query.trim().toLowerCase();
  if (!normalized) return MOCK_LOCATIONS;
  return MOCK_LOCATIONS.filter((location) => {
    const haystack = [
      location.searchLabel,
      location.address.city,
      location.address.state,
      location.address.streetAddress,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export async function getCurrentVendorLocation(): Promise<GeocodedLocation> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return reverseGeocodeVendorLocation(VENDOR_DEFAULT_COORDINATE);
}
