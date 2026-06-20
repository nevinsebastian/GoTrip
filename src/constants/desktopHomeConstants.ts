import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import type { Listing } from '@/src/api/types';
import AccountMultipleIcon from '@/assets/images/account-multiple.svg';
import CashMultipleIcon from '@/assets/images/cash-multiple.svg';
import DiamondIcon from '@/assets/images/diamond.svg';
import ForestIcon from '@/assets/images/forest.svg';
import HdrIcon from '@/assets/images/image-filter-hdr.svg';
import WavesIcon from '@/assets/images/waves.svg';
import AccountCircleIcon from '@/assets/webassets/account-circle.svg';
import HeartCircleIcon from '@/assets/webassets/heart-circle.svg';
import OfficeBuildingMarkerIcon from '@/assets/webassets/office-building-marker.svg';
import MagnifyingGlassIcon from '@/assets/webassets/Objects/magnifying-glass.svg';
import SofaSingleOutlineIcon from '@/assets/webassets/sofa-single-outline.svg';
import CalendarClockIcon from '@/assets/webassets/Vector.svg';
import type React from 'react';

export const DESKTOP_HERO_SPECS = {
  framePadding: 18,
  frameBorderRadius: 24,
  frameBorderWidth: 4,
  frameBorderColor: 'rgba(255, 255, 255, 0.2)',
  frameMinHeight: 468,
  navHeight: 82,
  searchHeight: 112,
  searchBorderTopLeft: 18,
  searchBorderTopRight: 100,
  searchBorderBottomLeft: 18,
  searchBorderBottomRight: 100,
  accent: '#E54D2E',
  valueBoxBg: 'rgba(28, 32, 36, 0.05)',
  fieldBorder: 'rgba(28, 32, 36, 0.1)',
} as const;

export type DesktopHeroTabConfig = {
  background: number;
  tagline: string;
  promoTitle: string;
  promoSubtitle: string;
  promoImage: number;
};

export const DESKTOP_HERO_BY_TAB: Record<HomeCategoryTab, DesktopHeroTabConfig> = {
  hotels: {
    background: require('../../assets/webassets/hotelsbg.jpg'),
    tagline: 'Stay Anywhere, Feel at Home',
    promoTitle: 'Luxury Hotels at Stunning Discounts',
    promoSubtitle: 'Where Every Mood Meets Its Perfect Stay',
    promoImage: require('../../assets/images/desktop-web/promo-hotels-thumb.jpg'),
  },
  packages: {
    background: require('../../assets/images/packagebackground.jpg'),
    tagline: 'Travel Beyond Borders',
    promoTitle: 'Curated Packages for Every Journey',
    promoSubtitle: 'Handpicked destinations, seamless planning',
    promoImage: require('../../assets/images/offerpackage.jpg'),
  },
  glamping: {
    background: require('../../assets/images/glampingbg.jpg'),
    tagline: 'Sleep Under the Stars',
    promoTitle: 'Glamping Escapes Await',
    promoSubtitle: 'Nature meets comfort in scenic retreats',
    promoImage: require('../../assets/images/glampingoffer.jpg'),
  },
  activities: {
    background: require('../../assets/images/activitybg.jpg'),
    tagline: 'Adventure Starts Here',
    promoTitle: 'Unforgettable Local Experiences',
    promoSubtitle: 'Trekking, sightseeing, and more',
    promoImage: require('../../assets/images/activityoffer.jpg'),
  },
};

export const DESKTOP_WEB_ICONS: Record<
  'heart' | 'account' | 'building' | 'calendar' | 'sofa' | 'search',
  React.ComponentType<{ width?: number; height?: number }>
> = {
  heart: HeartCircleIcon,
  account: AccountCircleIcon,
  building: OfficeBuildingMarkerIcon,
  calendar: CalendarClockIcon,
  sofa: SofaSingleOutlineIcon,
  search: MagnifyingGlassIcon,
};

export const DESKTOP_WEB_IMAGES = {
  logo: require('../../assets/images/desktop-web/logo.png'),
  promoCarouselBg: require('../../assets/images/desktop-web/promo-carousel-bg.jpg'),
} as const;

export const DESKTOP_MOODS: Array<{
  id: string;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
}> = [
  { id: 'budget', label: 'Budget', Icon: CashMultipleIcon },
  { id: 'private', label: 'Private', Icon: AccountMultipleIcon },
  { id: 'luxury', label: 'Luxury', Icon: DiamondIcon },
  { id: 'hill', label: 'Hill Station', Icon: HdrIcon },
  { id: 'beach', label: 'Beach', Icon: WavesIcon },
  { id: 'forest', label: 'Forest', Icon: ForestIcon },
];

export const DESKTOP_DESTINATIONS = [
  {
    name: 'Varkala',
    subtitle: 'Cliff-side beach, spiritual vibe',
    image: require('../../assets/images/desktop-web/promo-hotels-thumb.jpg'),
  },
  {
    name: 'Munnar',
    subtitle: 'Tea plantations, Eravikulam National Park',
    image: require('../../assets/images/offerpackage.jpg'),
  },
  {
    name: 'Wayanad',
    subtitle: 'Waterfalls, wildlife, scenic hills',
    image: require('../../assets/images/glampingoffer.jpg'),
  },
  {
    name: 'Alappuzha',
    subtitle: 'Houseboat cruises, Kerala backwater capital',
    image: require('../../assets/images/activityoffer.jpg'),
  },
  {
    name: 'Kochi',
    subtitle: 'Fort Kochi, Chinese fishing nets, colonial heritage',
    image: require('../../assets/images/home-figma/promo-discount.png'),
  },
  {
    name: 'Sabarimala',
    subtitle: 'Major Hindu pilgrimage site',
    image: require('../../assets/images/packagebackground.jpg'),
  },
] as const;

export const DESKTOP_LISTING_FALLBACK_IMAGE = require('../../assets/webassets/hotelsbg.jpg');

const DESKTOP_MOCK_LISTING_COPY = {
  title: 'Luxury stay in Varkala',
  description:
    'Experience refined comfort in this elegant two-floor villa featuring four spacious bedrooms and a private pool.',
  location: 'Varkala',
  price_start: '1199',
} as const;

export function createDesktopMockListings(count: number): Listing[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `desktop-mock-${index + 1}`,
    vendor_id: 'mock',
    category_id: 'mock',
    title: DESKTOP_MOCK_LISTING_COPY.title,
    description: DESKTOP_MOCK_LISTING_COPY.description,
    location: DESKTOP_MOCK_LISTING_COPY.location,
    price_start: DESKTOP_MOCK_LISTING_COPY.price_start,
  }));
}

export function resolveDesktopListings(listings: Listing[], count: number): Listing[] {
  if (listings.length >= count) {
    return listings.slice(0, count);
  }
  const mocks = createDesktopMockListings(count - listings.length);
  return [...listings, ...mocks].slice(0, count);
}
