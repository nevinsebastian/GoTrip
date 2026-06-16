export const VENDOR_ONBOARDING = {
  listingsCount: '2735',
  speechBubble: 'Join 2735 other listings already in GoTrip',
  landingTitle: 'Become a vendor',
  landingHeadline: 'Host worry-free. We’ve got your back!',
  earningsPrefix: 'Earn more than ',
  earningsAmount: '₹2,420 a week.',
  registerTitle: 'Create your partner account',
  otpTitle: 'Join the Tribe!',
  documentsTitle: 'Upload documents',
  completeSetupCta: 'Complete Account Setup',
  categoryTitle: 'What would you like to list?',
  categorySubtitle: 'Select the category',
  categoryNextCta: 'Next',
  categoryNextSuffix: 'Select Location',
  idTypeLabel: 'Select ID type',
  propertyDocLabel: 'Select property document type',
  idTypes: ['Adhaar Card', 'PAN Card', 'Passport', 'Driving License'],
  propertyDocTypes: ['Land Tax Reciept', 'Sale Deed', 'Rental Agreement', 'Property Tax Receipt'],
  uploadOptions: [
    { id: 'camera', label: 'Take photo', icon: 'camera-outline' as const },
    { id: 'gallery', label: 'Choose from gallery', icon: 'images-outline' as const },
    { id: 'files', label: 'Browse files', icon: 'document-outline' as const },
  ],
  features: [
    { id: 'payments', label: 'Payments made easy.', icon: 'people-outline' as const },
    { id: 'risk', label: 'Reduced risk', icon: 'shield-checkmark-outline' as const },
    { id: 'rules', label: 'Your rental, your rules', icon: 'clipboard-outline' as const },
    { id: 'steps', label: 'Become a vendor in simple steps', icon: 'play-circle-outline' as const },
  ],
  defaultPhone: '+91 9744893210',
  otpLength: 6,
};

export type VendorListingCategoryId = 'property' | 'packages' | 'glamping' | 'activities';

const PropertyHero = require('../../loginimage.png');
const PropertyThumb = require('../../assets/images/backgroundimagehomehotels.jpg');
const PackagesHero = require('../../assets/images/packagebackground.jpg');
const PackagesThumb = require('../../assets/images/packageexpanded.jpg');
const GlampingHero = require('../../assets/images/glampingbg.jpg');
const GlampingThumb = require('../../assets/images/glamping.jpg');
const ActivitiesHero = require('../../assets/images/activitybg.jpg');
const ActivitiesThumb = require('../../assets/images/activityoffer.jpg');

export type VendorListingCategory = {
  id: VendorListingCategoryId;
  title: string;
  subtitle: string;
  heroImage: number;
  thumbnail: number;
  pillLabel: string;
};

export const VENDOR_LISTING_CATEGORIES: VendorListingCategory[] = [
  {
    id: 'property',
    title: 'Property',
    subtitle: 'Hotel, Resorts, Apartments, Rentals',
    heroImage: PropertyHero,
    thumbnail: PropertyThumb,
    pillLabel: 'Hotels',
  },
  {
    id: 'packages',
    title: 'Packages',
    subtitle: 'Holidays, International, Honeymoon',
    heroImage: PackagesHero,
    thumbnail: PackagesThumb,
    pillLabel: 'Packages',
  },
  {
    id: 'glamping',
    title: 'Glamping site',
    subtitle: 'Base Camps, Tents, Cottages, Tree huts',
    heroImage: GlampingHero,
    thumbnail: GlampingThumb,
    pillLabel: 'Glamping',
  },
  {
    id: 'activities',
    title: 'Activities',
    subtitle: 'Water sports, Adventure sports, Trekking',
    heroImage: ActivitiesHero,
    thumbnail: ActivitiesThumb,
    pillLabel: 'Activities',
  },
];

export function getVendorListingCategory(id: VendorListingCategoryId): VendorListingCategory {
  return VENDOR_LISTING_CATEGORIES.find((item) => item.id === id) ?? VENDOR_LISTING_CATEGORIES[0];
}

export type VendorRegistrationForm = {
  fullName: string;
  email: string;
  phone: string;
};

export type VendorDocumentField = 'id' | 'property';

export type VendorDocumentUpload = {
  idType: string;
  propertyDocType: string;
  idFileName?: string;
  propertyFileName?: string;
};

export const EMPTY_VENDOR_FORM: VendorRegistrationForm = {
  fullName: '',
  email: '',
  phone: VENDOR_ONBOARDING.defaultPhone,
};
