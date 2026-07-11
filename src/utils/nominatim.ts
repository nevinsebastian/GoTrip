import type { VendorAddress, VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'GoTrip/1.0 (vendor-listing; contact: support@gotripholiday.com)';

type NominatimAddress = {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type NominatimSearchResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

type NominatimReverseResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

async function nominatimFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${NOMINATIM_BASE}${path}?${query}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error('Location lookup failed. Please try again.');
  }

  return response.json() as Promise<T>;
}

function pickCity(address: NominatimAddress): string {
  return address.city ?? address.town ?? address.village ?? address.suburb ?? '';
}

function toVendorAddress(address: NominatimAddress, fallbackLabel: string): VendorAddress {
  const streetParts = [address.house_number, address.road ?? address.neighbourhood].filter(Boolean);
  return {
    country: address.country ?? 'India',
    streetAddress: streetParts.join(' ') || fallbackLabel.split(',')[0]?.trim() || '',
    unit: '',
    city: pickCity(address),
    state: address.state ?? '',
    pinCode: address.postcode ?? '',
  };
}

export type NominatimLocation = {
  coordinate: VendorMapCoordinate;
  searchLabel: string;
  address: VendorAddress;
};

export async function searchNominatim(query: string): Promise<NominatimLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results = await nominatimFetch<NominatimSearchResult[]>('/search', {
    q: trimmed,
    format: 'json',
    addressdetails: '1',
    limit: '6',
  });

  return results.map((result) => {
    const coordinate = {
      latitude: Number.parseFloat(result.lat),
      longitude: Number.parseFloat(result.lon),
    };
    const address = result.address
      ? toVendorAddress(result.address, result.display_name)
      : {
          country: 'India',
          streetAddress: result.display_name.split(',')[0]?.trim() ?? '',
          unit: '',
          city: '',
          state: '',
          pinCode: '',
        };

    return {
      coordinate,
      searchLabel: result.display_name,
      address,
    };
  });
}

export async function reverseNominatim(coordinate: VendorMapCoordinate): Promise<NominatimLocation> {
  const result = await nominatimFetch<NominatimReverseResult>('/reverse', {
    lat: String(coordinate.latitude),
    lon: String(coordinate.longitude),
    format: 'json',
    addressdetails: '1',
  });

  const address = result.address
    ? toVendorAddress(result.address, result.display_name)
    : {
        country: 'India',
        streetAddress: '',
        unit: '',
        city: '',
        state: '',
        pinCode: '',
      };

  return {
    coordinate: {
      latitude: Number.parseFloat(result.lat),
      longitude: Number.parseFloat(result.lon),
    },
    searchLabel: result.display_name,
    address,
  };
}
