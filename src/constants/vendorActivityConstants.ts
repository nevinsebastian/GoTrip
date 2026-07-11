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

export const VENDOR_ACTIVITY_TITLE_COPY = {
  title: 'Name your activity',
  subtitle: 'Add a title, short summary, and description guests will see on your listing.',
  titleLabel: 'Activity title',
  taglineLabel: 'Short tagline (optional)',
  taglineMax: 80,
  highlightsLabel: 'Activity highlights',
  descriptionLabel: 'Listing description',
  descriptionMax: 500,
  nextSuffix: 'Guest & slot details',
};

export const VENDOR_GUEST_ACTIVITY_COPY = {
  title: 'Guest & slot details',
  subtitle: 'Set capacity, duration, age limit, and your default time slot.',
  guestsLabel: 'Max participants',
  guestsAgeHint: 'Per batch / slot',
  hoursLabel: 'Duration (hours)',
  minAgeLabel: 'Minimum age',
  minAgeHint: 'Years',
  totalSlotsLabel: 'Slots per day',
  totalSlotsHint: 'How many batches you run daily',
  slotLabel: 'Default slot label',
  slotLabelPlaceholder: 'e.g. Morning Batch',
  startTimeLabel: 'Default start time',
  startTimePlaceholder: '09:00',
  nextSuffix: 'Set Pricing',
};

export const ACTIVITY_PHOTO_LIMITS = {
  min: 1,
  max: 10,
} as const;

export const VENDOR_ACTIVITY_PHOTOS_COPY = {
  title: 'Add photos',
  subtitle: 'Upload photos of your activity (up to 10).',
  addLabel: 'Add image',
  countLabel: (count: number) => `${count}/${ACTIVITY_PHOTO_LIMITS.max} photos`,
  nextSuffix: 'Terms & Conditions',
};

export type VendorGuestActivityDetails = {
  guests: number;
  hours: number;
  minAge: number;
  totalSlotsPerDay: number;
  slotLabel: string;
  slotStartTime: string;
};

export const DEFAULT_GUEST_ACTIVITY_DETAILS: VendorGuestActivityDetails = {
  guests: 15,
  hours: 3,
  minAge: 12,
  totalSlotsPerDay: 2,
  slotLabel: 'Morning Batch',
  slotStartTime: '09:00',
};

export const VENDOR_ACTIVITY_INSIGHTS_COPY = {
  title: 'Describe the experience',
  subtitle: 'Tell guests what to expect, what to bring, and how to reach the activity.',
  aboutTitle: 'About the experience',
  aboutMax: 500,
  carryTitle: 'Things to carry',
  carryMax: 500,
  reachTitle: 'How to reach',
  reachMax: 500,
  nextSuffix: 'Inclusions & Exclusions',
};

export const VENDOR_ACTIVITY_INCLUSIONS_COPY = {
  title: 'Inclusions & exclusions',
  subtitle: 'List what is included, excluded, and provided for this activity.',
  inclusionsTitle: 'Inclusions',
  exclusionsTitle: 'Exclusions',
  whatsprovidedTitle: "What's provided",
  maxLength: 500,
  nextSuffix: 'Add Photos',
};

export const EMPTY_ACTIVITY_INSIGHTS = {
  aboutExperience: '',
  thingsToCarry: '',
  howToReach: '',
};

export const EMPTY_ACTIVITY_INCLUSIONS = '';
export const EMPTY_ACTIVITY_EXCLUSIONS = '';
export const EMPTY_ACTIVITY_WHATS_PROVIDED = '';

export const VENDOR_ACTIVITY_PRICING_COPY = {
  subtitle: 'How much do you charge per adult for this activity?',
  basePriceLabel: 'Base price (adult)',
  infantPriceLabel: 'Base price (infant)',
  nextSuffix: 'Activity Details',
};

export const VENDOR_ACTIVITY_PUBLISH_TITLE = FIGMA_ACTIVITY_DETAIL.title;

export const VENDOR_ACTIVITY_PUBLISH_COPY = {
  description:
    'This activity will be visible to guests 24 hours after you publish. Our team will review it before it goes live.',
  priceLabel: 'Price per adult',
  infantPriceLabel: 'Infant price',
  taxLabel: 'including tax',
  pendingPriceLabel: 'Price not set',
};

export function getVendorActivityKind(id: string): VendorActivityKind {
  return VENDOR_ACTIVITY_KINDS.find((item) => item.id === id) ?? VENDOR_ACTIVITY_KINDS[0];
}

export function getVendorActivityType(id: string) {
  return VENDOR_ACTIVITY_TYPES.find((item) => item.id === id) ?? VENDOR_ACTIVITY_TYPES[0];
}
