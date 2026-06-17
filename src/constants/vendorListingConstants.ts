import type { ImageSourcePropType } from 'react-native';

export const VENDOR_ROOM_TYPES = [
  'Deluxe AC',
  'Standard AC',
  'Suite',
  'Premium Room',
  'Family Room',
];

export const VENDOR_BED_TYPES = [
  'King Size Bed',
  'Queen Size Bed',
  'Twin Beds',
  'Single Bed',
];

export const VENDOR_FOOD_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
] as const;

export type VendorFoodOptionId = (typeof VENDOR_FOOD_OPTIONS)[number]['id'];

export type VendorRoomConfig = {
  roomType: string;
  floorArea: string;
  adultsDefault: number;
  adultsMax: number;
  childrenDefault: number;
  childrenMax: number;
  bedType: string;
  bedCount: number;
  bathrooms: number;
  food: VendorFoodOptionId[];
};

export const DEFAULT_VENDOR_ROOM: VendorRoomConfig = {
  roomType: 'Deluxe AC',
  floorArea: '720',
  adultsDefault: 2,
  adultsMax: 2,
  childrenDefault: 2,
  childrenMax: 2,
  bedType: 'King Size Bed',
  bedCount: 4,
  bathrooms: 2,
  food: ['breakfast'],
};

export type VendorAmenity = {
  id: string;
  label: string;
  icon: string;
};

export const VENDOR_AMENITIES: VendorAmenity[] = [
  { id: 'kitchen', label: 'Kitchen', icon: 'restaurant-outline' },
  { id: 'parking', label: 'Free Parking', icon: 'car-outline' },
  { id: 'pool', label: 'Private Pool', icon: 'water-outline' },
  { id: 'breakfast', label: 'Breakfast', icon: 'cafe-outline' },
  { id: 'ac', label: 'Air Conditioning', icon: 'snow-outline' },
  { id: 'bathroom', label: 'Private Bathroom', icon: 'bathtub-outline' },
  { id: 'restaurant', label: 'Restaurant Facility', icon: 'fast-food-outline' },
  { id: 'garden', label: 'Outdoor Garden', icon: 'flower-outline' },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi-outline' },
  { id: 'tv', label: 'TV', icon: 'tv-outline' },
  { id: 'laundry', label: 'Laundry', icon: 'shirt-outline' },
  { id: 'gym', label: 'Gym', icon: 'barbell-outline' },
];

export const VENDOR_GUEST_ROOM_COPY = {
  title: 'Guest & Room Details',
  subtitle: 'Provide the number of guests and rooms.',
  roomsLabel: 'Rooms',
  roomTypeLabel: 'Room 1 type',
  floorAreaLabel: 'Total Floor Area',
  adultsLabel: 'Adults (Age 13+)',
  childrenLabel: 'Child (Age below 13)',
  defaultLabel: 'Default',
  maxLabel: 'Max',
  bedsLabel: 'Beds',
  bathroomsLabel: 'Bathrooms',
  foodLabel: 'Food',
  nextSuffix: 'Amenities',
};

export const VENDOR_AMENITIES_COPY = {
  title: 'Amenities and facilities',
  searchPlaceholder: 'Search for Amenities',
  applyAll: 'Apply to all rooms',
  nextSuffix: 'Add Photos',
};

export const VENDOR_PHOTOS_COPY = {
  title: 'Add photos',
  subtitleEmpty: 'Add at least 5 photos',
  subtitleFilled: 'Make changes, edit, choose your cover photo',
  dragHint: 'Drag your photos here',
  uploadLink: 'Upload from device',
  coverBadge: 'Cover Photo',
  makeCover: 'Make cover photo',
  minPhotos: 5,
  nextSuffix: 'Create Title',
};

export const VENDOR_TITLE_COPY = {
  title: 'Create your Title',
  subtitle: 'Provide a good title for your space.',
  titleLabel: 'Title',
  titlePrimaryDefault: 'Opus Homes, Varkala',
  titleSecondaryDefault: 'Place to stay in Varkala, with beach view.',
  titleSecondaryMax: 50,
  highlightsLabel: 'Choose upto 2 highlights',
  highlightsMax: 2,
  descriptionLabel: 'Description',
  descriptionDefault: 'Enjoy a stylish experience at this centrally located place',
  descriptionMax: 500,
  nextSuffix: 'Set Pricing',
};

export const VENDOR_HIGHLIGHTS = [
  { id: 'peaceful', label: 'Peaceful', icon: 'leaf-outline' as const },
  { id: 'unique', label: 'Unique', icon: 'bulb-outline' as const },
  { id: 'central', label: 'Central', icon: 'location-outline' as const },
  { id: 'family', label: 'Family-friendly', icon: 'people-outline' as const },
] as const;

export type VendorHighlightId = (typeof VENDOR_HIGHLIGHTS)[number]['id'];

export type VendorRoomPricing = {
  basePrice: number;
  adultExtra: number;
  childExtra: number;
  discountEnabled: boolean;
};

export const DEFAULT_VENDOR_ROOM_PRICING: VendorRoomPricing = {
  basePrice: 2420,
  adultExtra: 520,
  childExtra: 520,
  discountEnabled: true,
};

export const VENDOR_PRICING_COPY = {
  title: 'Set your pricing',
  applyAll: 'Apply to all rooms',
  basePriceLabel: 'Enter the Base price details',
  extraChargeLabel: 'Extra Charge',
  adultLabel: 'Adult',
  childLabel: 'Child',
  rangeHintPrefix: 'Places like your usually range from',
  rangeMin: 1000,
  rangeMax: 3000,
  discountLabel: 'Offer a 20% discount for your first 2 guests to help you get booked faster',
  nextSuffix: 'Terms & Conditions',
  priceStep: 10,
};

export const VENDOR_PRICING_ROOMS = [
  { id: 'room-0', label: 'Room 1 - Deluxe AC', roomIndex: 1, roomTotal: 2 },
  { id: 'room-1', label: 'Room 2 - Deluxe AC', roomIndex: 2, roomTotal: 2 },
] as const;

export const VENDOR_MOCK_HOST = {
  firstName: 'Ashish',
  fullName: 'Mr. Ashish Kumar',
  avatar: require('../../loginimage.png'),
};

export const DEFAULT_VENDOR_HOST_TERMS = `Host Terms and Conditions
Last Updated: May 2026

1. Eligibility and Account Registration
You must be at least 18 years of age and have the legal authority to list your property on GoTrip holiday.

2. Verification
GoTrip may verify your identity, property ownership, and listing details before your property goes live.

3. Legal Authority
By listing on GoTrip, you confirm that you have the legal right to rent or offer the property described in your listing.

4. Compliance with Local Laws
You agree to comply with all applicable local laws, regulations, and tax requirements related to short-term rentals and hospitality services.

5. Accuracy of Information
You are responsible for ensuring all listing information, including photos, pricing, and amenities, is accurate and up to date.

6. Guest Safety and Conduct
You agree to maintain a safe environment for guests and respond promptly to guest inquiries and issues.

7. Cancellations and Refunds
You agree to honor GoTrip's cancellation and refund policies as communicated to guests at the time of booking.`;

export const VENDOR_TERMS_COPY = {
  title: 'Terms and Conditions',
  subtitle: 'Review and update your host terms below.',
  cardTitle: 'Host Terms and Conditions',
  lastUpdated: 'Last Updated: May 2026',
  agreeLabel: 'I agree with the privacy policy and the terms & conditions',
  nextSuffix: 'Publish your Listing',
};

export const VENDOR_PUBLISH_COPY = {
  title: 'Publish your listing',
  description:
    'This listing will be visible to your guests 24 hours after you publish. You can add more info or make changes anytime.',
  listingTitle: 'Place to stay in Varkala with beach view',
  rating: '4.5',
  customersLabel: '500+ customers',
  priceLabel: 'Total price for one night',
  taxLabel: 'including tax',
  cta: 'Publish Your Listing',
};

export const VENDOR_PREVIEW_TAGS = [
  { id: 'hotel', label: 'Hotel', icon: 'business-outline' as const },
  { id: 'transfer', label: 'Transfer', icon: 'car-outline' as const },
  { id: 'sightseeing', label: 'Sightseeing', icon: 'binoculars-outline' as const },
  { id: 'breakfast', label: 'Breakfast', icon: 'cafe-outline' as const },
];

export const VENDOR_THANKS_COPY = {
  subtitle: 'A small welcome note from team GoTrip.',
  welcomeBody: `We're thrilled to have you join our community of hosts. Your listing is an important step toward welcoming travelers from around the world.

Our team is now reviewing your listing to ensure everything looks great. Once approved, your property will be live on GoTrip and ready for guests to book.

Thank you for choosing GoTrip holiday. We can't wait to see the experiences you'll create for your guests.`,
  signature: '— The GoTrip Team',
  verificationNote: 'Hang tight while our team checks and verifies your listing!',
  cta: 'Start your journey',
};

export type VendorListingPhoto = {
  id: string;
  source: ImageSourcePropType;
  label: string;
};

export const VENDOR_MOCK_PHOTO_SOURCES: ImageSourcePropType[] = [
  require('../../assets/images/backgroundimagehomehotels.jpg'),
  require('../../loginimage.png'),
  require('../../assets/images/glamping.jpg'),
  require('../../assets/images/packageexpanded.jpg'),
  require('../../assets/images/activitybg.jpg'),
  require('../../assets/images/glampingbg.jpg'),
];

export function createDefaultRooms(count: number): VendorRoomConfig[] {
  return Array.from({ length: count }, () => ({ ...DEFAULT_VENDOR_ROOM }));
}
