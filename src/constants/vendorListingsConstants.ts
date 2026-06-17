import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

export type VendorListingCardTheme = 'blue' | 'maroon' | 'green';

export type VendorListingAmenity = {
  id: string;
  label: string;
  icon: 'wifi-outline' | 'car-outline' | 'snow-outline' | 'cafe-outline' | 'airplane-outline' | 'leaf-outline';
};

export type VendorListingCardData = {
  id: string;
  categoryId: VendorListingCategoryId;
  listingRef: string;
  typeLabel: string;
  locationPill: string;
  description: string;
  hostName: string;
  hostAvatar: number;
  image: number;
  amenities: VendorListingAmenity[];
  priceDisplay: string;
  theme: VendorListingCardTheme;
  cardTitle: string;
};

export const VENDOR_LISTINGS_COPY = {
  title: 'All Listings',
  locationFilter: 'Varkala, Kerala',
  hostLabel: 'Host',
  totalPrice: 'Total Price',
  pricing: 'Pricing',
  edit: 'Edit',
  delete: 'Delete',
  deletePropertyTitle: 'Delete Property?',
  deletePropertyBody: 'Are you sure you want to delete your property?',
  deletePropertyCta: 'Delete Property',
  goBack: 'Go back',
  propertyNumber: (ref: string) => `Property Number # : ${ref}`,
};

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
    description: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    hostName: 'Mr. Ashish Kumar',
    hostAvatar: HOST_AVATAR,
    image: require('../../assets/images/glamping.jpg'),
    amenities: [
      { id: 'wifi', label: 'Free Wifi', icon: 'wifi-outline' },
      { id: 'parking', label: 'Parking', icon: 'car-outline' },
      { id: 'ac', label: 'Air conditioning', icon: 'snow-outline' },
      { id: 'breakfast', label: 'Breakfast', icon: 'cafe-outline' },
    ],
    priceDisplay: '₹ 10,420/night',
    theme: 'blue',
    cardTitle: 'Place to stay in Varkala, with beach view.',
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
