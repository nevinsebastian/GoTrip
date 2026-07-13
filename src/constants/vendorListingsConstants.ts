import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import type { VendorListingApiCategory, VendorListingApiStatus } from '@/src/api/types';
import type { ImageSourcePropType } from 'react-native';

export type VendorListingCardTheme = 'blue' | 'maroon' | 'green';

export type VendorListingAmenity = {
  id: string;
  label: string;
  icon: 'wifi-outline' | 'car-outline' | 'snow-outline' | 'cafe-outline' | 'airplane-outline' | 'leaf-outline' | 'time-outline';
};

export type VendorListingCardData = {
  id: string;
  categoryId: VendorListingCategoryId;
  listingRef: string;
  typeLabel: string;
  locationPill: string;
  description: string;
  hostName: string;
  hostAvatar: ImageSourcePropType;
  image: ImageSourcePropType;
  amenities: VendorListingAmenity[];
  priceDisplay: string;
  theme: VendorListingCardTheme;
  cardTitle: string;
  status?: VendorListingApiStatus;
  rating?: number;
  customerCount?: number;
  priceRowLabel?: string;
  priceAmount?: string;
  priceTaxNote?: string;
};

export const VENDOR_LISTINGS_PAGE_SIZE = 20;

export type VendorListingStatusFilter = VendorListingApiStatus | 'all';

export const VENDOR_LISTING_API_CATEGORY: Record<
  VendorListingCategoryId,
  VendorListingApiCategory
> = {
  property: 'hotel',
  packages: 'package',
  glamping: 'glamping',
  activities: 'activity',
};

export const VENDOR_LISTINGS_STATUS_OPTIONS: { id: VendorListingStatusFilter; label: string }[] = [
  { id: 'all', label: 'All statuses' },
  { id: 'draft', label: 'Draft' },
  { id: 'pending_approval', label: 'Pending approval' },
  { id: 'active', label: 'Active' },
  { id: 'suspended', label: 'Suspended' },
  { id: 'archived', label: 'Archived' },
];

export const VENDOR_LISTING_STATUS_LABELS: Record<VendorListingApiStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending approval',
  active: 'Active',
  suspended: 'Suspended',
  archived: 'Archived',
};

export const VENDOR_LISTING_STATUS_COLORS: Record<
  VendorListingApiStatus,
  { bg: string; text: string }
> = {
  draft: { bg: 'rgba(15, 26, 32, 0.08)', text: 'rgba(15, 26, 32, 0.7)' },
  pending_approval: { bg: 'rgba(255, 152, 0, 0.12)', text: '#C77700' },
  active: { bg: 'rgba(43, 122, 92, 0.12)', text: '#2B7A5C' },
  suspended: { bg: 'rgba(215, 38, 38, 0.12)', text: '#D72626' },
  archived: { bg: 'rgba(15, 26, 32, 0.08)', text: 'rgba(15, 26, 32, 0.55)' },
};

export const VENDOR_LISTINGS_COPY = {
  title: 'All Listings',
  statusFilter: 'All statuses',
  hostLabel: 'Host',
  totalPrice: 'Total Price',
  totalPriceOneNight: 'Total price for one night',
  pricing: 'Pricing',
  edit: 'Edit',
  delete: 'Delete',
  customersLabel: (count: number) => `${count} customers`,
  deletePropertyTitle: 'Delete Property?',
  deletePropertyBody: 'Are you sure you want to delete your property?',
  deletePropertyCta: 'Delete Property',
  confirmDeleteCta: 'Confirm Delete',
  updatePricingLabel: 'Enter the price details',
  updatePricingCta: 'Update Pricing',
  goBack: 'Go back',
  propertyNumber: (ref: string) => `Property Number # : ${ref}`,
  loading: 'Loading your listings…',
  emptyTitle: 'No listings yet',
  emptyBody: 'Create a listing to see it here.',
  emptyFilteredTitle: 'No listings match these filters',
  emptyFilteredBody: 'Try another category or status filter.',
  errorTitle: 'Could not load listings',
  retry: 'Try again',
  loadMore: 'Load more',
  showingCount: (shown: number, total: number) => `Showing ${shown} of ${total}`,
};

export const VENDOR_LISTINGS_LOCATION_OPTIONS = [
  { id: 'varkala', label: 'Varkala, Kerala' },
  { id: 'munnar', label: 'Munnar, Kerala' },
  { id: 'goa', label: 'Goa' },
];

export const VENDOR_LISTING_THEME_COLORS: Record<
  VendorListingCardTheme,
  { accent: string; pillBg: string; priceBg: string; priceText: string }
> = {
  blue: {
    accent: '#2B6B9C',
    pillBg: '#EBF2F5',
    priceBg: '#F4F8FA',
    priceText: '#2B6B9C',
  },
  maroon: {
    accent: '#9F2B4D',
    pillBg: '#F9E8EE',
    priceBg: '#FCF0F4',
    priceText: '#9F2B4D',
  },
  green: {
    accent: '#2B7A5C',
    pillBg: '#E8F5EF',
    priceBg: '#F0FAF5',
    priceText: '#2B7A5C',
  },
};

const HOST_AVATAR = require('../../loginimage.png');

export const VENDOR_LISTING_CARDS: VendorListingCardData[] = [
  {
    id: 'l1',
    categoryId: 'property',
    listingRef: 'P27641',
    typeLabel: 'Property',
    locationPill: 'Opus Homes, Varkala',
    description: 'Place to stay in Varkala with beach view',
    hostName: 'Mr. Ashish Kumar',
    hostAvatar: HOST_AVATAR,
    image: require('../../assets/images/glamping.jpg'),
    amenities: [
      { id: 'room-service', label: '24/7 Room service', icon: 'time-outline' },
      { id: 'ac', label: 'Air conditioning', icon: 'snow-outline' },
      { id: 'wifi', label: 'Free Wifi', icon: 'wifi-outline' },
    ],
    priceDisplay: '₹ 2,420',
    priceRowLabel: 'Total price for one night',
    priceAmount: '₹ 2,420',
    priceTaxNote: 'including tax',
    rating: 4.5,
    customerCount: 0,
    theme: 'blue',
    cardTitle: 'Place to stay in Varkala with beach view',
  },
  {
    id: 'l1b',
    categoryId: 'property',
    listingRef: 'P27641',
    typeLabel: 'Property',
    locationPill: 'Opus Homes, Varkala',
    description: 'Place to stay in Varkala with beach view',
    hostName: 'Mr. Ashish Kumar',
    hostAvatar: HOST_AVATAR,
    image: require('../../assets/images/glamping.jpg'),
    amenities: [
      { id: 'room-service', label: '24/7 Room service', icon: 'time-outline' },
      { id: 'ac', label: 'Air conditioning', icon: 'snow-outline' },
      { id: 'wifi', label: 'Free Wifi', icon: 'wifi-outline' },
    ],
    priceDisplay: '₹ 2,420',
    priceRowLabel: 'Total price for one night',
    priceAmount: '₹ 2,420',
    priceTaxNote: 'including tax',
    rating: 4.5,
    customerCount: 0,
    theme: 'blue',
    cardTitle: 'Place to stay in Varkala with beach view',
  },
  {
    id: 'l2',
    categoryId: 'packages',
    listingRef: 'PK27642',
    typeLabel: 'Package',
    locationPill: 'Opus Homes, Varkala',
    description: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    hostName: 'Mr. Ashish Kumar',
    hostAvatar: HOST_AVATAR,
    image: require('../../assets/images/packageexpanded.jpg'),
    amenities: [
      { id: 'wifi', label: 'Free Wifi', icon: 'wifi-outline' },
      { id: 'parking', label: 'Parking', icon: 'car-outline' },
      { id: 'flight', label: 'Flights', icon: 'airplane-outline' },
      { id: 'breakfast', label: 'Breakfast', icon: 'cafe-outline' },
    ],
    priceDisplay: '₹ 10,420/night',
    theme: 'maroon',
    cardTitle: 'Place to stay in Varkala, with beach view.',
  },
  {
    id: 'l3',
    categoryId: 'glamping',
    listingRef: 'G27643',
    typeLabel: 'Glamping',
    locationPill: 'Wayanad, Kerala',
    description: 'Forest dome retreat | 1 tent | mountain view',
    hostName: 'Mr. Ashish Kumar',
    hostAvatar: HOST_AVATAR,
    image: require('../../assets/images/glampingbg.jpg'),
    amenities: [
      { id: 'wifi', label: 'Free Wifi', icon: 'wifi-outline' },
      { id: 'parking', label: 'Parking', icon: 'car-outline' },
      { id: 'nature', label: 'Nature walks', icon: 'leaf-outline' },
      { id: 'breakfast', label: 'Breakfast', icon: 'cafe-outline' },
    ],
    priceDisplay: '₹ 8,200/night',
    theme: 'green',
    cardTitle: 'Forest dome retreat with mountain view.',
  },
];
