import type { VendorFoodOptionId } from '@/src/constants/vendorListingConstants';
import {
  PACKAGE_DAY_ONE,
  PACKAGE_EXCLUSIONS,
  PACKAGE_TRIP_HIGHLIGHTS,
  FIGMA_PACKAGE_DETAIL,
} from '@/src/constants/packageDetailConstants';
import { PACKAGE_POPULAR_DESTINATIONS } from '@/src/constants/homePackageConfig';

export const VENDOR_PACKAGE_DESTINATIONS = [
  'Singapore',
  'Bali, Indonesia',
  'Dubai, UAE',
  'Kerala',
  'Thailand',
  'Maldives',
  ...PACKAGE_POPULAR_DESTINATIONS.filter(
    (d) => !['Singapore', 'Bali', 'Dubai', 'Kerala', 'Thailand', 'Maldives'].includes(d),
  ),
];

export const VENDOR_PACKAGE_CATEGORIES = [
  { id: 'couple', label: 'Couple/Honeymoon' },
  { id: 'family', label: 'Family' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'international', label: 'International' },
  { id: 'budget', label: 'Budget' },
] as const;

export type VendorPackageCategoryId = (typeof VENDOR_PACKAGE_CATEGORIES)[number]['id'];

export const VENDOR_PACKAGE_DESCRIBE_COPY = {
  title: 'Describe your property',
  destinationLabel: 'Select your destination',
  destinationPlaceholder: 'Country/Region',
  categoryLabel: 'Category',
  nextSuffix: 'Guest Details',
};

export const VENDOR_GUEST_PACKAGE_COPY = {
  title: 'Guest & Tent Details',
  subtitle: 'Provide the number of guests and days.',
  guestsLabel: 'Guests',
  guestsAgeHint: 'Age 13+',
  daysLabel: 'Days',
  nightsLabel: 'Nights',
  foodLabel: 'Food',
  nextSuffix: 'Amenities',
};

export type VendorGuestPackageDetails = {
  guests: number;
  days: number;
  nights: number;
  food: VendorFoodOptionId[];
};

export const DEFAULT_GUEST_PACKAGE_DETAILS: VendorGuestPackageDetails = {
  guests: 4,
  days: 1,
  nights: 1,
  food: ['breakfast'],
};

export const VENDOR_PACKAGE_ITINERARY_COPY = {
  title: 'Provide package itinerary',
  subtitle: 'How will the guests spend their day.',
  dayLabel: 'Day',
  titleFieldLabel: 'Title',
  aboutLabel: 'About the experience',
  hotelLabel: 'Hotel',
  activityLabel: 'Activity',
  photosLabel: 'Add upto 4 photos',
  uploadCta: 'Upload from device',
  titleMax: 120,
  aboutMax: 500,
  hotelPrimaryMax: 80,
  hotelSecondaryMax: 120,
  activityPrimaryMax: 80,
  activitySecondaryMax: 120,
  maxPhotos: 4,
  nextSuffix: 'Inclusions & Exclusions',
};

export type VendorPackageDayItinerary = {
  id: string;
  label: string;
  title: string;
  aboutExperience: string;
  hotelPrimary: string;
  hotelSecondary: string;
  activityPrimary: string;
  activitySecondary: string;
};

const defaultDayOne: VendorPackageDayItinerary = {
  id: 'day-1',
  label: 'Day 1',
  title: 'Arrival: Flight from New Delhi to Singapore | Night Safari in the Evening',
  aboutExperience: PACKAGE_DAY_ONE.body,
  hotelPrimary: 'The Clan Hotel Singapore',
  hotelSecondary: 'The Clan Hotel Singapore by Far East Hospitality / or similar',
  activityPrimary: 'Singapore Night Safari',
  activitySecondary: '[Open Dated] Singapore Night Safari Admission with Tram Ride',
};

const emptyDay = (index: number): VendorPackageDayItinerary => ({
  id: `day-${index}`,
  label: `Day ${index}`,
  title: '',
  aboutExperience: '',
  hotelPrimary: '',
  hotelSecondary: '',
  activityPrimary: '',
  activitySecondary: '',
});

export const DEFAULT_PACKAGE_ITINERARY_DAYS: VendorPackageDayItinerary[] = [
  defaultDayOne,
  emptyDay(2),
  emptyDay(3),
  emptyDay(4),
];

export const VENDOR_PACKAGE_INCLUSIONS_COPY = {
  title: 'List the inclusions and exclusions',
  subtitle: 'What is included in your package experience.',
  inclusionsTitle: 'Inclusions',
  exclusionsTitle: 'Exclusions',
  maxLength: 500,
  nextSuffix: 'Terms & Conditions',
};

export const DEFAULT_PACKAGE_INCLUSIONS = PACKAGE_TRIP_HIGHLIGHTS.map((item) => `• ${item}`).join('\n');

export const DEFAULT_PACKAGE_EXCLUSIONS = PACKAGE_EXCLUSIONS.map((item) => `• ${item}`).join('\n');

export const VENDOR_PACKAGE_PUBLISH_TITLE = FIGMA_PACKAGE_DETAIL.title;

export const VENDOR_PACKAGE_PRICING_COPY = {
  subtitle: 'How much do you charge for this package?',
  basePriceLabel: 'Enter the price details',
  nextSuffix: 'Itinerary Details',
};

export function getVendorPackageCategory(id: string) {
  return VENDOR_PACKAGE_CATEGORIES.find((item) => item.id === id) ?? VENDOR_PACKAGE_CATEGORIES[0];
}
