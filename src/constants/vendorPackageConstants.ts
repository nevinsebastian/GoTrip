import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
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
  title: 'Describe your package',
  destinationLabel: 'Select your destination',
  destinationPlaceholder: 'Country/Region',
  categoryLabel: 'Category',
  nextSuffix: 'Select Location',
};

export const VENDOR_PACKAGE_TITLE_COPY = {
  title: 'Create a title for your package',
  subtitle: 'Give your package a catchy name and description.',
  titleLabel: 'Package title',
  descriptionLabel: 'Package description',
  descriptionMax: 500,
  nextSuffix: 'Guest Details',
};

export const VENDOR_GUEST_PACKAGE_COPY = {
  title: 'Guest & trip details',
  subtitle: 'Set duration, group size, and how guests can book.',
  daysLabel: 'Days',
  nightsLabel: 'Nights',
  minGroupLabel: 'Minimum group size',
  maxGroupLabel: 'Maximum group size',
  bookingModeLabel: 'Booking mode',
  bookingModes: [
    { id: 'enquiry_only' as const, label: 'Enquiry only' },
    { id: 'direct' as const, label: 'Direct booking' },
  ],
  nextSuffix: 'Set Pricing',
};

export type VendorGuestPackageDetails = {
  days: number;
  nights: number;
  minGroupSize: number;
  maxGroupSize: number;
  bookingMode: 'direct' | 'enquiry_only';
};

export const DEFAULT_GUEST_PACKAGE_DETAILS: VendorGuestPackageDetails = {
  days: 4,
  nights: 3,
  minGroupSize: 2,
  maxGroupSize: 12,
  bookingMode: 'enquiry_only',
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
  emptyDay(1),
  emptyDay(2),
  emptyDay(3),
  emptyDay(4),
];

export const VENDOR_PACKAGE_INCLUSIONS_COPY = {
  title: 'List the inclusions and exclusions',
  subtitle: 'What is included in your package experience.',
  inclusionsTitle: 'Inclusions',
  exclusionsTitle: 'Exclusions',
  whatsprovidedTitle: 'What we provide',
  maxLength: 500,
  nextSuffix: 'Upload Photos',
};

export const EMPTY_PACKAGE_INCLUSIONS = '• Hotel stay\n• Breakfast\n• Airport pickup';
export const EMPTY_PACKAGE_EXCLUSIONS = '• Flights\n• Personal expenses';
export const EMPTY_PACKAGE_WHATS_PROVIDED = '• Travel guide\n• AC transport';

export const DEFAULT_PACKAGE_INCLUSIONS = EMPTY_PACKAGE_INCLUSIONS;
export const DEFAULT_PACKAGE_EXCLUSIONS = EMPTY_PACKAGE_EXCLUSIONS;

export const VENDOR_PACKAGE_PUBLISH_TITLE = FIGMA_PACKAGE_DETAIL.title;

export const VENDOR_PACKAGE_PUBLISH_COPY = {
  description: 'Review your package listing before submitting for admin approval.',
  priceLabel: 'Price per person',
  taxLabel: 'Taxes and fees may apply',
};

export const PACKAGE_PHOTO_LIMITS = {
  min: 1,
  max: 10,
} as const;

export const VENDOR_PACKAGE_PHOTOS_COPY = {
  title: 'Add photos of your package',
  subtitle: 'Upload up to 10 images that showcase the experience.',
  nextSuffix: 'Submit for Approval',
};

export const VENDOR_PACKAGE_PRICING_COPY = {
  subtitle: 'How much do you charge per person for this package?',
  basePriceLabel: 'Price per person',
  nextSuffix: 'Itinerary Details',
};

export function getVendorPackageCategory(id: string) {
  return VENDOR_PACKAGE_CATEGORIES.find((item) => item.id === id) ?? VENDOR_PACKAGE_CATEGORIES[0];
}
