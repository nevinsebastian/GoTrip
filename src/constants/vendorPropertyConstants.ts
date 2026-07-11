export type VendorPlaceType = {
  id: string;
  label: string;
  thumbnail: number;
};

export type VendorSpaceType = {
  id: string;
  label: string;
};

const ApartmentThumb = require('../../assets/images/backgroundimagehomehotels.jpg');
const HouseThumb = require('../../loginimage.png');
const ResortThumb = require('../../assets/images/packageexpanded.jpg');

export const VENDOR_PLACE_TYPES: VendorPlaceType[] = [
  { id: 'apartment', label: 'Apartment', thumbnail: ApartmentThumb },
  { id: 'house', label: 'House', thumbnail: HouseThumb },
  { id: 'hotel', label: 'Hotel', thumbnail: ApartmentThumb },
  { id: 'resort', label: 'Resort', thumbnail: ResortThumb },
  { id: 'villa', label: 'Villa', thumbnail: HouseThumb },
];

export const VENDOR_SPACE_TYPES: VendorSpaceType[] = [
  { id: 'entire', label: 'An entire Space' },
  { id: 'private-room', label: 'A private room' },
  { id: 'shared-room', label: 'A shared room' },
];

export const VENDOR_PROPERTY_COPY = {
  title: 'Describe your property',
  placeTypeLabel: 'What kind of place will you host?',
  spaceTypeLabel: 'What kind of place will you host?',
  nextCta: 'Next',
  nextSuffix: 'Select Location',
};

export const VENDOR_LOCATION_COPY = {
  title: 'Select your location',
  searchPlaceholder: 'Search location',
  coordinatesLabel: 'Coordinates (Lat, Lng)',
  coordinatesPlaceholder: 'Drag the map to set coordinates',
  useCurrentLocation: 'Use current location',
  dragHint: 'Drag the map to place the pin on your property',
  countryLabel: 'Where’s your place located?',
  countryPlaceholder: 'Country/Region',
  addressLabel: 'Enter your Address',
  streetPlaceholder: 'Street Address',
  unitPlaceholder: 'Apartment, House, Villa etc (Optional)',
  cityPlaceholder: 'City',
  statePlaceholder: 'State',
  pinPlaceholder: 'Pin Code',
  confirmCta: 'Confirm Location',
  goBack: 'Go back',
};

export const VENDOR_COUNTRIES = ['India', 'United Arab Emirates', 'Singapore', 'United Kingdom'];

export type VendorAddress = {
  country: string;
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  pinCode: string;
};

export const EMPTY_VENDOR_ADDRESS: VendorAddress = {
  country: 'India',
  streetAddress: '',
  unit: '',
  city: '',
  state: '',
  pinCode: '',
};

export type VendorMapCoordinate = {
  latitude: number;
  longitude: number;
};

/** Default pin — Varkala (Figma reference). */
export const VENDOR_DEFAULT_COORDINATE: VendorMapCoordinate = {
  latitude: 8.737868,
  longitude: 76.716339,
};

export function getVendorPlaceType(id: string): VendorPlaceType {
  return VENDOR_PLACE_TYPES.find((item) => item.id === id) ?? VENDOR_PLACE_TYPES[0];
}

export function getVendorSpaceType(id: string): VendorSpaceType {
  return VENDOR_SPACE_TYPES.find((item) => item.id === id) ?? VENDOR_SPACE_TYPES[0];
}
