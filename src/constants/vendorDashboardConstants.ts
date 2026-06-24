import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

/** Figma vendor dashboard palette */
export const VENDOR_DASHBOARD_BRAND_BLUE = '#2C6496';
export const VENDOR_DASHBOARD_HEADER_BORDER = '#2C6693';
export const VENDOR_DASHBOARD_SEARCH_BG = '#E8F0F5';
export const VENDOR_DASHBOARD_CATEGORY_ACTIVE = '#2E74A3';
export const VENDOR_DASHBOARD_CATEGORY_BORDER = '#D1D1D1';
export const VENDOR_DASHBOARD_TITLE = '#121921';
export const VENDOR_DASHBOARD_MARK_RED = '#D32F2F';
export const VENDOR_DASHBOARD_BTN_BLUE = '#34749F';
export const VENDOR_DASHBOARD_BTN_RED = '#D13438';
export const VENDOR_DASHBOARD_BTN_GREEN = '#107C10';
export const VENDOR_DASHBOARD_DATE_BLUE = '#5DA8C2';
export const VENDOR_DASHBOARD_NAV_BLUE = '#2B709B';
export const VENDOR_DASHBOARD_CARD_BORDER = 'rgba(15, 26, 32, 0.15)';
export const VENDOR_DASHBOARD_CARD_RADIUS = 8;
export const VENDOR_DASHBOARD_BTN_RADIUS = 6;

export type VendorDashboardCategoryTab = {
  id: VendorListingCategoryId;
  label: string;
};

export const VENDOR_DASHBOARD_CATEGORIES: VendorDashboardCategoryTab[] = [
  { id: 'property', label: 'Hotels' },
  { id: 'packages', label: 'Packages' },
  { id: 'glamping', label: 'Glamping' },
  { id: 'activities', label: 'Activities' },
];

export const VENDOR_DASHBOARD_PROPERTIES = [
  { id: 'property-1', label: 'Property 1 - Opus Homes, Varkala' },
  { id: 'property-2', label: 'Property 2 - Beach View Cottage' },
];

/** Figma desktop dashboard category chip styles (Frame 5094). */
export const DESKTOP_VENDOR_DASHBOARD_CATEGORY_STYLES: Record<
  VendorListingCategoryId,
  { background: string; borderColor?: string; icon: string }
> = {
  property: {
    background: 'rgba(30, 160, 123, 0.1)',
    borderColor: '#1EA07B',
    icon: 'business-outline',
  },
  packages: {
    background: 'rgba(76, 26, 87, 0.1)',
    icon: 'airplane-outline',
  },
  glamping: {
    background: 'rgba(4, 57, 94, 0.1)',
    icon: 'partly-sunny-outline',
  },
  activities: {
    background: 'rgba(103, 60, 79, 0.1)',
    icon: 'boat-outline',
  },
};

export const VENDOR_DASHBOARD_SORT_OPTIONS = [
  { id: 'date', label: 'Date' },
  { id: 'name', label: 'Guest name' },
  { id: 'status', label: 'Status' },
];

export type VendorBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'simple';

export type VendorBookingListingTheme = 'green' | 'purple';

export type VendorDashboardBooking = {
  id: string;
  guestName: string;
  guests: number;
  dateRange: string;
  status: VendorBookingStatus;
  listingLabel: string;
  listingTheme: VendorBookingListingTheme;
};

export const VENDOR_BOOKING_LISTING_THEME_COLORS: Record<
  VendorBookingListingTheme,
  { bar: string; text: string }
> = {
  green: { bar: '#107C10', text: '#FFFFFF' },
  purple: { bar: '#7C3AED', text: '#FFFFFF' },
};

export const VENDOR_BOOKINGS_COPY = {
  title: 'All Bookings',
  allListings: 'All Listings',
  view: 'View',
  viewBooking: 'View Booking',
  cancel: 'Cancel',
  confirm: 'Confirm',
  contact: 'Contact',
  bookingConfirmed: 'Booking Confirmed',
  bookingCancelled: 'Booking Cancelled',
};

export const VENDOR_DASHBOARD_BOOKINGS: VendorDashboardBooking[] = [
  {
    id: 'b1',
    guestName: 'Ashish Kumar',
    guests: 2,
    dateRange: 'April 3-5 2026',
    status: 'pending',
    listingLabel: 'Property 1 - Opus Homes, Varkala',
    listingTheme: 'green',
  },
  {
    id: 'b2',
    guestName: 'Anjali Pillai',
    guests: 3,
    dateRange: 'April 3-5 2026',
    status: 'confirmed',
    listingLabel: 'Singapore package - 4N 5D',
    listingTheme: 'purple',
  },
  {
    id: 'b3',
    guestName: 'Subhash',
    guests: 1,
    dateRange: 'April 3-5 2026',
    status: 'simple',
    listingLabel: 'Property 1 - Opus Homes, Varkala',
    listingTheme: 'green',
  },
  {
    id: 'b4',
    guestName: 'Vignesh Raja',
    guests: 1,
    dateRange: 'April 3-5 2026',
    status: 'cancelled',
    listingLabel: 'Property 1 - Opus Homes, Varkala',
    listingTheme: 'green',
  },
  {
    id: 'b5',
    guestName: 'Abhinav S N',
    guests: 2,
    dateRange: 'April 3-5 2026',
    status: 'simple',
    listingLabel: 'Property 1 - Opus Homes, Varkala',
    listingTheme: 'green',
  },
];

export const VENDOR_DASHBOARD_COPY = {
  brand: 'Gotrip-vendor',
  dashboardTitle: 'Dashboard',
  markUnavailability: 'Mark Unavailability',
  sortLabel: 'Sort by',
  filterTitle: 'Filter by Date',
  clearSelection: 'Clear selection',
  applyFilter: 'Apply Filter',
  profileName: 'Raja',
  profileLabel: 'Profile',
  logoutLabel: 'Logout',
  homeTab: 'Home',
};

/** @deprecated use VENDOR_DASHBOARD_BRAND_BLUE */
export const VENDOR_DASHBOARD_BLUE = VENDOR_DASHBOARD_BRAND_BLUE;
/** @deprecated use VENDOR_DASHBOARD_BTN_RED */
export const VENDOR_DASHBOARD_RED = VENDOR_DASHBOARD_BTN_RED;
/** @deprecated use VENDOR_DASHBOARD_BTN_GREEN */
export const VENDOR_DASHBOARD_GREEN = VENDOR_DASHBOARD_BTN_GREEN;
