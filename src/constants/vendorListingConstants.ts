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
