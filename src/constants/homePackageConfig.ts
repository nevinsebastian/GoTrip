import type { Listing } from '@/src/api/types';

export const PACKAGE_HERO = {
  tagline: 'Pack Your Dreams, We Handle the Rest',
  promoTitle: 'Budget packages at Stunning Discounts',
  promoSubtitle: 'Where Every Mood Finds Its Perfect Escape',
};

export const PACKAGE_MOODS = [
  { id: 'budget', label: 'Budget', icon: 'cash-outline' as const },
  { id: 'adventure', label: 'Adventure', icon: 'boat-outline' as const },
  { id: 'international', label: 'International', icon: 'airplane-outline' as const },
];

export const PACKAGE_DESTINATION_SUGGESTIONS = [
  { title: 'Singapore', subtitle: 'City in Southeast Asia', short: 'Singapore' },
  { title: 'Bali, Indonesia', subtitle: 'Island getaway', short: 'Bali' },
  { title: 'Dubai, UAE', subtitle: 'Luxury desert escape', short: 'Dubai' },
];

export const PACKAGE_POPULAR_DESTINATIONS = ['Singapore', 'Bali', 'Dubai', 'Thailand', 'Maldives', 'Kerala'];

export const PACKAGE_DESTINATIONS = [
  { name: 'Singapore', subtitle: 'City skyline, food tours, and iconic attractions' },
  { name: 'Bali', subtitle: 'Beaches, temples, and adventure experiences' },
  { name: 'Dubai', subtitle: 'Luxury shopping, desert safari, and marina cruises' },
  { name: 'Kerala', subtitle: 'Backwaters, hill stations, and cultural heritage' },
];

export const MOCK_PACKAGE_LISTINGS: Listing[] = [
  {
    id: 'package-mock-1',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Singapore City Explorer Package',
    description: '4 nights in Singapore with city tours, airport transfers, and breakfast included.',
    location: 'Singapore',
    price_start: '24999',
    category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
  },
  {
    id: 'package-mock-2',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Kerala Backwaters Retreat',
    description: 'Relaxing houseboat stay with meals, guided village walk, and private cab transfers.',
    location: 'Kerala',
    price_start: '18999',
    category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
  },
  {
    id: 'package-mock-3',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Dubai Luxury Escape',
    description: 'Premium stay with desert safari, marina cruise, and curated sightseeing experiences.',
    location: 'Dubai',
    price_start: '45999',
    category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
  },
  {
    id: 'package-mock-4',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Bali Adventure Package',
    description: 'Surf lessons, waterfall trek, and boutique villa stay for thrill-seeking travelers.',
    location: 'Bali',
    price_start: '32999',
    category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
  },
];
