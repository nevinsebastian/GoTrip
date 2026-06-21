import type { Listing } from '@/src/api/types';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import CashMultipleIcon from '@/assets/images/cash-multiple.svg';
import DiamondIcon from '@/assets/images/diamond.svg';
import FilterHdrIcon from '@/assets/images/image-filter-hdr.svg';
import ForestIcon from '@/assets/images/forest.svg';
import WavesIcon from '@/assets/images/waves.svg';
import type React from 'react';

export const DESKTOP_SEARCH_BAR_MOODS = [
  { id: 'budget', label: 'Budget', icon: 'cash-outline' as const },
  { id: 'adventure', label: 'Adventure', icon: 'boat-outline' as const },
  { id: 'international', label: 'International', icon: 'airplane-outline' as const },
];

export const DESKTOP_SEARCH_FILTER_CHIPS: Record<
  HomeCategoryTab,
  Array<{ id: string; label: string; Icon?: React.ComponentType<{ width?: number; height?: number }> }>
> = {
  hotels: [
    { id: 'budget', label: 'Budget', Icon: CashMultipleIcon },
    { id: 'private', label: 'Private' },
    { id: 'luxury', label: 'Luxury', Icon: DiamondIcon },
    { id: 'hill', label: 'Hill Station', Icon: FilterHdrIcon },
    { id: 'beach', label: 'Beach', Icon: WavesIcon },
    { id: 'forest', label: 'Forest', Icon: ForestIcon },
  ],
  packages: [
    { id: 'budget', label: 'Budget', Icon: CashMultipleIcon },
    { id: 'adventure', label: 'Adventure' },
    { id: 'family', label: 'Family' },
    { id: 'international', label: 'International' },
    { id: 'culture', label: 'Culture' },
    { id: 'forest', label: 'Forest', Icon: ForestIcon },
  ],
  glamping: [
    { id: 'budget', label: 'Budget', Icon: CashMultipleIcon },
    { id: 'adventure', label: 'Adventure' },
    { id: 'international', label: 'International' },
  ],
  activities: [
    { id: 'budget', label: 'Budget', Icon: CashMultipleIcon },
    { id: 'adventure', label: 'Adventure' },
    { id: 'family', label: 'Family' },
    { id: 'international', label: 'International' },
  ],
};

export const DESKTOP_SEARCH_CATEGORY_TITLES: Record<HomeCategoryTab, string> = {
  hotels: 'Hotels',
  packages: 'Packages',
  glamping: 'Glamping',
  activities: 'Activities',
};

export const DESKTOP_SEARCH_SECTION_COPY: Record<
  HomeCategoryTab,
  { suggested: string; topRated: string; priceSuffix: string; durationSuffix: string }
> = {
  hotels: {
    suggested: 'Suggested for you',
    topRated: 'Top rated stays',
    priceSuffix: '/night',
    durationSuffix: 'per night',
  },
  packages: {
    suggested: 'Suggested for you',
    topRated: 'Top rated packages',
    priceSuffix: '/person',
    durationSuffix: 'nights / person',
  },
  glamping: {
    suggested: 'Suggested for you',
    topRated: 'Top rated camps',
    priceSuffix: '/night',
    durationSuffix: 'nights / tent',
  },
  activities: {
    suggested: 'Suggested for you',
    topRated: 'Top rated activities',
    priceSuffix: '/person',
    durationSuffix: 'per person',
  },
};

export type DesktopSearchListingMeta = Listing & {
  tag?: 'COUPLE' | 'FAMILY';
  nights?: number;
};

const packageImg = require('../../assets/images/packageexpanded.jpg');
const glampingImg = require('../../assets/images/glamping.jpg');
const activityImg = require('../../assets/images/activityoffer.jpg');
const hotelImg = require('../../assets/webassets/hotelsbg.jpg');

export const DESKTOP_SEARCH_MOCK_LISTINGS: Record<HomeCategoryTab, DesktopSearchListingMeta[]> = {
  packages: [
    {
      id: 'desktop-pkg-1',
      vendor_id: 'mock',
      category_id: 'mock',
      title: '4N Singapore City & Sentosa Highlights',
      description: 'City tours, Sentosa Island, and curated food experiences.',
      location: 'Singapore',
      price_start: '48654',
      tag: 'COUPLE',
      nights: 4,
      category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
    },
    {
      id: 'desktop-pkg-2',
      vendor_id: 'mock',
      category_id: 'mock',
      title: '6D 5N Kazakhstan Snow Escape',
      description: 'Snow adventures, city tours, and cozy alpine stays.',
      location: 'Kazakhstan',
      price_start: '62499',
      tag: 'COUPLE',
      nights: 6,
      category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
    },
    {
      id: 'desktop-pkg-3',
      vendor_id: 'mock',
      category_id: 'mock',
      title: '5D 4N Manali Alpine Adventure',
      description: 'Mountain treks, river rafting, and family-friendly resorts.',
      location: 'Manali',
      price_start: '38999',
      tag: 'FAMILY',
      nights: 5,
      category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
    },
    {
      id: 'desktop-pkg-4',
      vendor_id: 'mock',
      category_id: 'mock',
      title: '5D 4N Malaysia City & Nature Tour',
      description: 'Kuala Lumpur skyline, Batu Caves, and Langkawi beaches.',
      location: 'Malaysia',
      price_start: '45200',
      tag: 'FAMILY',
      nights: 5,
      category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
    },
    {
      id: 'desktop-pkg-5',
      vendor_id: 'mock',
      category_id: 'mock',
      title: '4N Andaman Island Explorer',
      description: 'Snorkeling, white-sand beaches, and island hopping.',
      location: 'Andaman',
      price_start: '52100',
      tag: 'COUPLE',
      nights: 4,
      category: { id: 'mock', name: 'Packages', slug: 'packages', type: 'package' },
    },
  ],
  glamping: [
    {
      id: 'desktop-glm-1',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Wildlife Safari Camp — Wayanad',
      description: 'Luxury tent stay near Tholpetty Wildlife Sanctuary.',
      location: 'Wayanad',
      price_start: '8999',
      tag: 'COUPLE',
      nights: 2,
      category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
    },
    {
      id: 'desktop-glm-2',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Mountain View Glamping — Munnar',
      description: 'Elevated dome tents with panoramic valley views.',
      location: 'Munnar',
      price_start: '12499',
      tag: 'FAMILY',
      nights: 3,
      category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
    },
    {
      id: 'desktop-glm-3',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Riverside Adventure Camp — Rishikesh',
      description: 'Riverside canvas tents with rafting experiences.',
      location: 'Rishikesh',
      price_start: '7499',
      tag: 'COUPLE',
      nights: 2,
      category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
    },
    {
      id: 'desktop-glm-4',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Forest Canopy Camp — Coorg',
      description: 'Tree-line glamping with coffee estate walks.',
      location: 'Coorg',
      price_start: '10999',
      tag: 'FAMILY',
      nights: 3,
      category: { id: 'mock', name: 'Glamping', slug: 'glamping', type: 'camping' },
    },
  ],
  activities: [
    {
      id: 'desktop-act-1',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Scuba Diving in Kochi',
      description: 'Guided scuba session with certified instructor.',
      location: 'Kochi',
      price_start: '4564',
      tag: 'COUPLE',
      category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
    },
    {
      id: 'desktop-act-2',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Paragliding in Varkala',
      description: 'Tandem paragliding over the Arabian Sea cliffs.',
      location: 'Varkala',
      price_start: '3650',
      tag: 'COUPLE',
      category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
    },
    {
      id: 'desktop-act-3',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'White Water Rafting — Rishikesh',
      description: 'Half-day rafting on the Ganges with safety crew.',
      location: 'Rishikesh',
      price_start: '2800',
      tag: 'FAMILY',
      category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
    },
    {
      id: 'desktop-act-4',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Kayaking in Alleppey',
      description: 'Backwater kayaking through serene Kerala canals.',
      location: 'Alleppey',
      price_start: '2450',
      tag: 'FAMILY',
      category: { id: 'mock', name: 'Activities', slug: 'activities', type: 'activity' },
    },
  ],
  hotels: [
    {
      id: 'desktop-htl-1',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Luxury stay in Varkala',
      description: 'Elegant villa with beach views and private pool.',
      location: 'Varkala',
      price_start: '1199',
      tag: 'COUPLE',
      category: { id: 'mock', name: 'Hotels', slug: 'hotels', type: 'hotel' },
    },
    {
      id: 'desktop-htl-2',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Opus Homes, Varkala',
      description: 'Place to stay in Varkala with cliff-side views.',
      location: 'Varkala',
      price_start: '2499',
      tag: 'FAMILY',
      category: { id: 'mock', name: 'Hotels', slug: 'hotels', type: 'hotel' },
    },
    {
      id: 'desktop-htl-3',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Kochi Heritage Hotel',
      description: 'Boutique stay in Fort Kochi with colonial charm.',
      location: 'Kochi',
      price_start: '1899',
      tag: 'COUPLE',
      category: { id: 'mock', name: 'Hotels', slug: 'hotels', type: 'hotel' },
    },
    {
      id: 'desktop-htl-4',
      vendor_id: 'mock',
      category_id: 'mock',
      title: 'Munnar Hill Resort',
      description: 'Tea estate views and cozy mountain rooms.',
      location: 'Munnar',
      price_start: '3299',
      tag: 'FAMILY',
      category: { id: 'mock', name: 'Hotels', slug: 'hotels', type: 'hotel' },
    },
  ],
};

export const DESKTOP_SEARCH_LISTING_IMAGES: Record<HomeCategoryTab, number> = {
  packages: packageImg,
  glamping: glampingImg,
  activities: activityImg,
  hotels: hotelImg,
};

export function resolveDesktopSearchListings(tab: HomeCategoryTab, query: string): DesktopSearchListingMeta[] {
  const pool = DESKTOP_SEARCH_MOCK_LISTINGS[tab];
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  const filtered = pool.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      (l.location?.toLowerCase().includes(q) ?? false) ||
      (l.description?.toLowerCase().includes(q) ?? false),
  );
  return filtered.length ? filtered : pool;
}
