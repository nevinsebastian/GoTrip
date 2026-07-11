import type { VendorFoodOptionId } from '@/src/constants/vendorListingConstants';
import { FIGMA_GLAMPING_DETAIL } from '@/src/constants/glampingDetailConstants';

const GlampingThumb = require('../../assets/images/glamping.jpg');
const CottageThumb = require('../../assets/images/glampingbg.jpg');

export type VendorCampPlaceType = {
  id: string;
  label: string;
  thumbnail: number;
};

export const VENDOR_CAMP_PLACE_TYPES: VendorCampPlaceType[] = [
  { id: 'camp-site', label: 'Camp Site', thumbnail: GlampingThumb },
  { id: 'cottage', label: 'Cottage', thumbnail: CottageThumb },
  { id: 'tree-hut', label: 'Tree hut', thumbnail: GlampingThumb },
];

export const VENDOR_GLAMPING_DESCRIBE_COPY = {
  title: 'Describe your camp',
  placeTypeLabel: 'What kind of place will you host?',
  spaceTypeLabel: 'What kind of place will you host?',
  nextSuffix: 'Select Location',
};

export const GLAMPING_PHOTO_LIMITS = {
  min: 2,
  max: 3,
} as const;

export const VENDOR_GLAMPING_PHOTOS_COPY = {
  title: 'Add photos',
  subtitle: 'Upload 2 to 3 photos of your glamping site.',
  addLabel: 'Add image',
  countLabel: (count: number) => `${count}/${GLAMPING_PHOTO_LIMITS.max} photos`,
  nextSuffix: 'Meal Plans',
};

export const VENDOR_GUEST_TENT_COPY = {
  title: 'Guest & Tent Details',
  subtitle: 'Provide the number of guests and rooms.',
  guestsLabel: 'Adults per camp',
  guestsAgeHint: 'Age 13+',
  infantsLabel: 'Infants per camp',
  infantsAgeHint: 'Age below 2',
  tentsLabel: 'Tents',
  cottagesLabel: 'Cottages',
  hutsLabel: 'Huts / Tree huts',
  privateBathroomsLabel: 'Private Bathrooms',
  commonBathroomsLabel: 'Common Bathrooms',
  foodLabel: 'Food',
  nextSuffix: 'Set Pricing',
};

export type VendorGuestTentDetails = {
  adultsPerCamp: number;
  infantsPerCamp: number;
  tents: number;
  cottages: number;
  huts: number;
  privateBathrooms: number;
  commonBathrooms: number;
  food: VendorFoodOptionId[];
};

export const DEFAULT_GUEST_TENT_DETAILS: VendorGuestTentDetails = {
  adultsPerCamp: 0,
  infantsPerCamp: 0,
  tents: 0,
  cottages: 0,
  huts: 0,
  privateBathrooms: 0,
  commonBathrooms: 0,
  food: [],
};

export const GLAMPING_LISTING_DEFAULTS = {
  cancellationPolicyId: 'fb0537e7-a38e-4153-8fcb-d098ba0a9f77',
} as const;

export const VENDOR_GLAMPING_PRICING_COPY = {
  subtitle: 'How much do you charge per camp per night?',
  basePriceLabel: 'Price per camp per night',
  extraAdultLabel: 'Extra adult charge',
  extraInfantLabel: 'Extra infant charge',
  nextSuffix: 'Camping Details',
};

export const VENDOR_CAMPING_INSIGHTS_COPY = {
  title: 'Provide more insights',
  subtitle: 'Tell about the vibe, what to carry along and how to reach to your camp site.',
  aboutTitle: 'About the experience',
  aboutMax: 500,
  carryTitle: 'Things to Carry',
  carryMax: 500,
  reachTitle: 'How to Reach?',
  reachMax: 500,
  nextSuffix: 'Inclusions & Exclusions',
};

const defaultAboutExperience = [
  FIGMA_GLAMPING_DETAIL.aboutCampingBodyIntro,
  ...FIGMA_GLAMPING_DETAIL.aboutCampingBullets,
].join('\n\n');

const defaultThingsToCarry = FIGMA_GLAMPING_DETAIL.thingsToCarry.map((item) => `• ${item}`).join('\n');

const defaultHowToReach = FIGMA_GLAMPING_DETAIL.howToReach.join('\n\n');

export const EMPTY_CAMPING_INSIGHTS = {
  aboutExperience: '',
  thingsToCarry: '',
  howToReach: '',
};

export const DEFAULT_CAMPING_INSIGHTS = {
  aboutExperience: defaultAboutExperience,
  thingsToCarry: defaultThingsToCarry,
  howToReach: defaultHowToReach,
};

export const VENDOR_INCLUSIONS_EXCLUSIONS_COPY = {
  title: 'List the inclusions and exclusions',
  subtitle: 'What is included in your camping experience.',
  inclusionsTitle: 'Inclusions',
  exclusionsTitle: 'Exclusions',
  whatsprovidedTitle: "What's provided",
  maxLength: 500,
  nextSuffix: 'Add Photos',
};

export const EMPTY_CAMPING_INCLUSIONS = '';
export const EMPTY_CAMPING_EXCLUSIONS = '';
export const EMPTY_CAMPING_WHATS_PROVIDED = '';

export const DEFAULT_CAMPING_INCLUSIONS = FIGMA_GLAMPING_DETAIL.inclusions.map((item) => `• ${item}`).join('\n');

export const DEFAULT_CAMPING_EXCLUSIONS = FIGMA_GLAMPING_DETAIL.exclusions.map((item) => `• ${item}`).join('\n');

export const DEFAULT_CAMPING_WHATS_PROVIDED = FIGMA_GLAMPING_DETAIL.provides
  .map((item) => `• ${item.label}`)
  .join('\n');

export const VENDOR_GLAMPING_PUBLISH_TITLE = 'Base Camps, Sky Cottage, Rhodo Mansion';

export type VendorGlampingMealInclusions = {
  includesBreakfast: boolean;
  includesLunch: boolean;
  includesDinner: boolean;
  includesSnacks: boolean;
};

export const DEFAULT_GLAMPING_MEAL_INCLUSIONS: VendorGlampingMealInclusions = {
  includesBreakfast: false,
  includesLunch: false,
  includesDinner: false,
  includesSnacks: false,
};

export const VENDOR_GLAMPING_MEAL_OPTIONS = [
  { key: 'includesBreakfast', label: 'Breakfast' },
  { key: 'includesLunch', label: 'Lunch' },
  { key: 'includesDinner', label: 'Dinner' },
  { key: 'includesSnacks', label: 'Snacks' },
] as const satisfies ReadonlyArray<{
  key: keyof VendorGlampingMealInclusions;
  label: string;
}>;

export const VENDOR_GLAMPING_MEAL_PLANS_COPY = {
  title: 'Meal plans',
  subtitle: 'Select which meals are included in your glamping package.',
  nextSuffix: 'Preview',
};

export function getVendorCampPlaceType(id: string): VendorCampPlaceType {
  return VENDOR_CAMP_PLACE_TYPES.find((item) => item.id === id) ?? VENDOR_CAMP_PLACE_TYPES[0];
}
