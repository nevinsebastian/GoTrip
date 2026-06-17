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

export const VENDOR_GUEST_TENT_COPY = {
  title: 'Guest & Tent Details',
  subtitle: 'Provide the number of guests and rooms.',
  guestsLabel: 'Guests',
  guestsAgeHint: 'Age 13+',
  tentsLabel: 'Tents',
  cottagesLabel: 'Cottages',
  hutsLabel: 'Huts / Tree huts',
  privateBathroomsLabel: 'Private Bathrooms',
  commonBathroomsLabel: 'Common Bathrooms',
  foodLabel: 'Food',
  nextSuffix: 'Amenities',
};

export type VendorGuestTentDetails = {
  guests: number;
  tents: number;
  cottages: number;
  huts: number;
  privateBathrooms: number;
  commonBathrooms: number;
  food: VendorFoodOptionId[];
};

export const DEFAULT_GUEST_TENT_DETAILS: VendorGuestTentDetails = {
  guests: 4,
  tents: 1,
  cottages: 1,
  huts: 1,
  privateBathrooms: 4,
  commonBathrooms: 4,
  food: ['breakfast'],
};

export const VENDOR_GLAMPING_PRICING_COPY = {
  subtitle: 'How much do you charge for a night?',
  basePriceLabel: 'Enter the price details',
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
  maxLength: 500,
  nextSuffix: 'Terms & Conditions',
};

export const DEFAULT_CAMPING_INCLUSIONS = FIGMA_GLAMPING_DETAIL.inclusions.map((item) => `• ${item}`).join('\n');

export const DEFAULT_CAMPING_EXCLUSIONS = FIGMA_GLAMPING_DETAIL.exclusions.map((item) => `• ${item}`).join('\n');

export const VENDOR_GLAMPING_PUBLISH_TITLE = 'Base Camps, Sky Cottage, Rhodo Mansion';

export function getVendorCampPlaceType(id: string): VendorCampPlaceType {
  return VENDOR_CAMP_PLACE_TYPES.find((item) => item.id === id) ?? VENDOR_CAMP_PLACE_TYPES[0];
}
