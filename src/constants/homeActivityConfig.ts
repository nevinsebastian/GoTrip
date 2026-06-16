import type { Listing } from '@/src/api/types';

export const ACTIVITY_HERO = {
  tagline: 'Fuel Your Fun, We Handle the Plan',
  promoTitle: 'Budget Activities at Stunning Discounts',
  promoSubtitle: 'Where Every Mood Finds Its Perfect Adventure',
};

export const ACTIVITY_MOODS = [
  { id: 'budget', label: 'Budget', icon: 'cash-outline' as const },
  { id: 'adventure', label: 'Adventure', icon: 'boat-outline' as const },
  { id: 'international', label: 'International', icon: 'airplane-outline' as const },
];

export const ACTIVITY_SUGGESTIONS = [
  { title: 'Scuba Diving', subtitle: 'Underwater exploration', short: 'Scuba Diving' },
  { title: 'Paragliding', subtitle: 'Aerial adventure', short: 'Paragliding' },
  { title: 'Trekking', subtitle: 'Mountain trails', short: 'Trekking' },
];

export const ACTIVITY_POPULAR = ['Scuba Diving', 'Paragliding', 'Rafting', 'Safari', 'Kayaking', 'Snorkeling'];

export const MOCK_ACTIVITY_LISTINGS: Listing[] = [
  {
    id: 'activity-mock-1',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Scuba Diving in Kochi',
    description: 'Guided scuba session with certified instructor, equipment, and underwater photos.',
    location: 'Kochi',
    price_start: '4564',
    category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
  },
  {
    id: 'activity-mock-2',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Paragliding in Varkala',
    description: 'Tandem paragliding over the Arabian Sea cliffs with professional pilots.',
    location: 'Varkala',
    price_start: '3650',
    category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
  },
  {
    id: 'activity-mock-3',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Kayaking in Alleppey',
    description: 'Backwater kayaking experience through serene Kerala canals.',
    location: 'Alleppey',
    price_start: '2450',
    category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
  },
];
