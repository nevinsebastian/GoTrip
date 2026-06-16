import type { Listing } from '@/src/api/types';

export const GLAMPING_HERO = {
  tagline: 'Pack Your Adventure',
  taglineSub: 'We Handle the Experience',
  promoTitle: 'Budget Camping at Stunning Discounts',
  promoSubtitle: 'Where Every Mood Finds Its Wilderness Escape',
};

export const GLAMPING_MOODS = [
  { id: 'safari', label: 'Safari', icon: 'binoculars-outline' as const },
  { id: 'mountain', label: 'Mountain', icon: 'trail-sign-outline' as const },
  { id: 'forest', label: 'Forest', icon: 'leaf-outline' as const },
];

export const GLAMPING_CAMP_SUGGESTIONS = [
  { title: 'Wildlife safari camps', subtitle: 'National park experiences', short: 'Wildlife safari camps' },
  { title: 'Wayanad forest camps', subtitle: 'Kerala wilderness', short: 'Wayanad' },
  { title: 'Spiti valley camps', subtitle: 'Himachal highlands', short: 'Spiti valley' },
];

export const GLAMPING_POPULAR_CAMPS = ['Wildlife safari camps', 'Wayanad', 'Munnar', 'Coorg', 'Rishikesh', 'Spiti'];

export const GLAMPING_DESTINATIONS = [
  { name: 'Wayanad', subtitle: 'Wildlife sanctuaries and rainforest camps' },
  { name: 'Munnar', subtitle: 'Tea estate glamping under the stars' },
  { name: 'Coorg', subtitle: 'Coffee plantation wilderness retreats' },
  { name: 'Rishikesh', subtitle: 'Riverside camps and adventure stays' },
];

export const MOCK_GLAMPING_LISTINGS: Listing[] = [
  {
    id: 'glamping-mock-1',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Wildlife Safari Camp — Wayanad',
    description: 'Luxury tent stay near Tholpetty Wildlife Sanctuary with campfire dinners.',
    location: 'Wayanad',
    price_start: '8999',
    category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
  },
  {
    id: 'glamping-mock-2',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Mountain View Glamping — Munnar',
    description: 'Elevated dome tents with panoramic valley views and stargazing decks.',
    location: 'Munnar',
    price_start: '12499',
    category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
  },
  {
    id: 'glamping-mock-3',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Riverside Adventure Camp — Rishikesh',
    description: 'Riverside canvas tents with rafting and bonfire experiences.',
    location: 'Rishikesh',
    price_start: '7499',
    category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
  },
  {
    id: 'glamping-mock-4',
    vendor_id: 'mock',
    category_id: 'mock',
    title: 'Forest Canopy Camp — Coorg',
    description: 'Tree-line glamping with coffee estate walks and outdoor dining.',
    location: 'Coorg',
    price_start: '10999',
    category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
  },
];
