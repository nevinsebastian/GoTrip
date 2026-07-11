export const VENDOR_ONBOARDING = {
  listingsCount: '2735',
  speechBubble: 'Join 2735 other listings already in GoTrip',
  searchPlaceholder: 'What are you looking for?',
  listPropertyLead: 'List your Property.',
  listPropertyCategory: 'Vacation Rentals',
  landingTitle: 'Become a Vendor!',
  landingHeadline: 'Host worry-free. We’ve got your back!',
  earningsPrefix: 'Earn more than ',
  earningsAmount: '₹2,420 a week.',
  registerTitle: 'Create your partner account',
  otpTitle: 'Join the Tribe!',
  profileTitle: 'Create your vendor profile',
  profileSubtitle: 'Tell us about your business to get started.',
  businessNameLabel: 'Business name',
  panNumberLabel: 'PAN',
  gstNumberLabel: 'GST',
  businessNamePlaceholder: 'Business name',
  panNumberPlaceholder: 'PAN',
  gstNumberPlaceholder: 'GST',
  profileOptionalTaxHint: "If you don't have PAN or GST, leave those fields empty.",
  completeProfileCta: 'Create Profile',
  completeProfileCtaDesktop: 'Next  >  Create Profile',
  documentsTitle: 'Upload documents',
  documentsSubtitle: 'Upload your ID and property documents for verification.',
  completeSetupCta: 'Complete Account Setup',
  completeSetupCtaDesktop: 'Next  >  Complete Account Setup',
  setupDoneTitle: 'Account setup done!',
  setupDoneSubtitle: 'Excited to start your journey with GoTrip?',
  proceedToListingCta: 'Proceed to listing',
  skipSetupLink: 'Skip for now. Complete later',
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

export type VendorSignupMode = 'phone' | 'email';

export type VendorRegistrationForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
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
  phone: '',
  password: '',
};

export type VendorProfileForm = {
  businessName: string;
  panNumber: string;
  gstNumber: string;
};

export const EMPTY_VENDOR_PROFILE: VendorProfileForm = {
  businessName: '',
  panNumber: '',
  gstNumber: '',
};
