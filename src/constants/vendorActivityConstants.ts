import type { VendorFoodOptionId } from '@/src/constants/vendorListingConstants';
import { FIGMA_ACTIVITY_DETAIL } from '@/src/constants/activityDetailConstants';

const ActivityThumb = require('../../assets/images/activitybg.jpg');
const WaterThumb = require('../../assets/images/activityoffer.jpg');

export type VendorActivityKind = {
  id: string;
  label: string;
  thumbnail: number;
};

export const VENDOR_ACTIVITY_KINDS: VendorActivityKind[] = [
  { id: 'water', label: 'Water Activity', thumbnail: WaterThumb },
  { id: 'adventure', label: 'Adventure Activity', thumbnail: ActivityThumb },
  { id: 'trekking', label: 'Trekking Activity', thumbnail: ActivityThumb },
];

export const VENDOR_ACTIVITY_TYPES = [
  { id: 'scuba', label: 'Scuba Diving' },
  { id: 'kayaking', label: 'Kayaking' },
  { id: 'parasailing', label: 'Parasailing' },
  { id: 'snorkeling', label: 'Snorkeling' },
  { id: 'trekking', label: 'Trekking' },
] as const;

export type VendorActivityTypeId = (typeof VENDOR_ACTIVITY_TYPES)[number]['id'];

export const VENDOR_ACTIVITY_DESCRIBE_COPY = {
  title: 'Describe your activity',
  kindLabel: 'What kind of activity will you host?',
  activityLabel: 'Choose your activity',
  nextSuffix: 'Select Location',
};

export const VENDOR_GUEST_ACTIVITY_COPY = {
  title: 'Guest & Activity Details',
  subtitle: 'Provide the number of guests and hours.',
  guestsLabel: 'Guests',
  guestsAgeHint: 'Age 13+',
  hoursLabel: 'Hours',
  commonBathroomsLabel: 'Common Bathrooms',
  foodLabel: 'Food',
  nextSuffix: 'Amenities',
};

export type VendorGuestActivityDetails = {
  guests: number;
  hours: number;
  commonBathrooms: number;
  food: VendorFoodOptionId[];
};

export const DEFAULT_GUEST_ACTIVITY_DETAILS: VendorGuestActivityDetails = {
  guests: 4,
  hours: 1,
  commonBathrooms: 4,
  food: ['breakfast'],
};

export const VENDOR_ACTIVITY_PRICING_COPY = {
  subtitle: 'How much do you charge for this activity?',
  basePriceLabel: 'Enter the price details',
  nextSuffix: 'Terms & Conditions',
};

export const VENDOR_ACTIVITY_PUBLISH_TITLE = FIGMA_ACTIVITY_DETAIL.title;

export function getVendorActivityKind(id: string): VendorActivityKind {
  return VENDOR_ACTIVITY_KINDS.find((item) => item.id === id) ?? VENDOR_ACTIVITY_KINDS[0];
}

export function getVendorActivityType(id: string) {
  return VENDOR_ACTIVITY_TYPES.find((item) => item.id === id) ?? VENDOR_ACTIVITY_TYPES[0];
}
