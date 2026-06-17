import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

export const VENDOR_DASHBOARD_BLUE = '#2563EB';
export const VENDOR_DASHBOARD_RED = '#DC2626';
export const VENDOR_DASHBOARD_GREEN = '#16A34A';

export type VendorDashboardCategoryTab = {
  id: VendorListingCategoryId;
  label: string;
  icon: 'business-outline' | 'airplane-outline' | 'leaf-outline' | 'bulb-outline';
};

export const VENDOR_DASHBOARD_CATEGORIES: VendorDashboardCategoryTab[] = [
  { id: 'property', label: 'Hotels', icon: 'business-outline' },
  { id: 'packages', label: 'Packages', icon: 'airplane-outline' },
  { id: 'glamping', label: 'Glamping', icon: 'leaf-outline' },
  { id: 'activities', label: 'Activities', icon: 'bulb-outline' },
];

export const VENDOR_DASHBOARD_PROPERTIES = [
  { id: 'property-1', label: 'Property 1 - Opus Homes, Varkala' },
  { id: 'property-2', label: 'Property 2 - Beach View Cottage' },
];

export const VENDOR_DASHBOARD_SORT_OPTIONS = [
  { id: 'date', label: 'Date' },
  { id: 'name', label: 'Guest name' },
  { id: 'status', label: 'Status' },
];

export type VendorBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'simple';

export type VendorDashboardBooking = {
  id: string;
  guestName: string;
  guests: number;
  dateRange: string;
  status: VendorBookingStatus;
};

export const VENDOR_DASHBOARD_BOOKINGS: VendorDashboardBooking[] = [
  {
    id: 'b1',
    guestName: 'Ashish Kumar',
    guests: 2,
    dateRange: 'April 3-5 2026',
    status: 'pending',
  },
  {
    id: 'b2',
    guestName: 'Anjali Pillai',
    guests: 3,
    dateRange: 'April 3-5 2026',
    status: 'confirmed',
  },
  {
    id: 'b3',
    guestName: 'Subhash',
    guests: 1,
    dateRange: 'April 3-5 2026',
    status: 'simple',
  },
  {
    id: 'b4',
    guestName: 'Vignesh Raja',
    guests: 1,
    dateRange: 'April 3-5 2026',
    status: 'cancelled',
  },
  {
    id: 'b5',
    guestName: 'Abhinav S N',
    guests: 2,
    dateRange: 'April 3-5 2026',
    status: 'simple',
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
