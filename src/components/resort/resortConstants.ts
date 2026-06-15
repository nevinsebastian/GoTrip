export const RESORT_AMENITIES = [
  { id: 'pool', label: 'Private pool', icon: 'water-outline' as const },
  { id: 'service', label: '24/7 Room service', icon: 'time-outline' as const },
  { id: 'parking', label: 'Free Parking', icon: 'car-outline' as const },
  { id: 'ac', label: 'Air conditioning', icon: 'snow-outline' as const },
];

export const RESORT_FOOTER_TEXT =
  'GoTrip offers curated hotels, travel packages, exciting activities, and immersive glamping experiences — all blended into one seamless journey. Whether it’s a relaxing getaway, an adventurous escape, or a unique outdoor retreat, every option is carefully crafted to make your travels meaningful, personalized, and hassle‑free.\n\nFrom cozy stays to thrilling adventures under the stars, GoTrip ensures every trip resonates with your mood, style, and curiosity.';

export const FIGMA_PROPERTY = {
  searchLabel: 'Varkala',
  title: 'Opus Homes, Varkala',
  address:
    'Palachira, 133/B Marakkadamukku, Po, Varkala, Vettoor-Cherunniyoor, Kerala 69514',
  viewLocationLabel: 'View Location',
  rating: '4.5',
  customersLabel: '500+ customers',
};

export const HOST_NAME = 'Mr. Ashish Kumar';

export const HOST_DESCRIPTION =
  'Mr. Ashish Kumar is an experienced host with 5 years of managing multiple luxury resorts in Wayanad.';

export const INSTRUCTIONS_TEXT =
  'Experience refined comfort in this elegant two-floor villa featuring four spacious bedrooms and a private pool. Nestled in the lush greenery of Wayanad, the property offers complete privacy, serene views, and thoughtfully designed interiors—perfect for families or groups seeking a premium getaway in nature.';

export const ROOM_DESCRIPTION =
  'Discover refined comfort in this elegant two-floor villa featuring four spacious bedrooms and a private pool.';

export const CANCELLATION_TEXT = 'Free Cancellation Before : 15-Jun-2026';

export type ResortRoomVariant = 'featured' | 'special' | 'breakfast' | 'compact';

export type ResortRoomConfig = {
  id: string;
  name: string;
  guests: number;
  rooms: number;
  variant: ResortRoomVariant;
  priceLabel: string;
  showImages: boolean;
};

export const DEFAULT_ROOM_CONFIGS: ResortRoomConfig[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    guests: 2,
    rooms: 1,
    variant: 'featured',
    priceLabel: '₹ 2,420',
    showImages: false,
  },
  {
    id: 'deluxe-alt',
    name: 'Deluxe Room',
    guests: 2,
    rooms: 1,
    variant: 'special',
    priceLabel: '₹ 2,420',
    showImages: true,
  },
  {
    id: 'executive',
    name: 'Executive Room',
    guests: 2,
    rooms: 1,
    variant: 'breakfast',
    priceLabel: '₹ 4,350',
    showImages: true,
  },
  {
    id: 'deluxe-compact',
    name: 'Deluxe Room',
    guests: 2,
    rooms: 1,
    variant: 'compact',
    priceLabel: '₹ 4,350',
    showImages: true,
  },
];

export const MOCK_REVIEWS = [
  {
    id: '1',
    name: 'Mr. Ashish Kumar',
    rating: 4,
    ratingLabel: '4.0/5',
    text: 'I had a pleasant stay at the hotel. The rooms were clean and comfortable, with all the basic amenities needed for a relaxing visit.',
  },
  {
    id: '2',
    name: 'Mr. Ashish Kumar',
    rating: 5,
    ratingLabel: '5.0/5',
    text: 'Beautiful property with excellent service. The pool and room were spotless. Would definitely book again.',
  },
];

export const FIGMA_EXPLORE_HOTELS = [
  {
    id: 'explore-1',
    title: 'Luxury stay in Varkala',
    location: 'Kerala > Varkala',
    rating: '4.5',
    price: '₹ 1199/night',
  },
  {
    id: 'explore-2',
    title: 'Luxury stay in Varkala',
    location: 'Kerala > Varkala',
    rating: '4.5',
    price: '₹ 1199/night',
  },
  {
    id: 'explore-3',
    title: 'Luxury stay in Varkala',
    location: 'Kerala > Varkala',
    rating: '4.5',
    price: '₹ 1199/night',
  },
  {
    id: 'explore-4',
    title: 'Luxury stay in Varkala',
    location: 'Kerala > Varkala',
    rating: '4.5',
    price: '₹ 1199/night',
  },
];
