import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

export const VENDOR_WORKSPACE_BLUE = '#2B709B';
export const VENDOR_WORKSPACE_PINK = '#C2185B';
export const VENDOR_WORKSPACE_GREEN = '#16A34A';
export const VENDOR_WORKSPACE_RED = '#DC2626';
export const VENDOR_WORKSPACE_ORANGE = '#EA580C';

export const VENDOR_CATEGORY_PROVIDER_LABEL: Record<VendorListingCategoryId, string> = {
  property: 'Hotel provider',
  glamping: 'Glamping provider',
  packages: 'Package provider',
  activities: 'Activity provider',
};

export type VendorWorkspaceTabId = 'home' | 'listings' | 'bookings' | 'profile';

export const VENDOR_WORKSPACE_TABS: {
  id: VendorWorkspaceTabId;
  label: string;
  icon: 'grid-outline' | 'business-outline' | 'ticket-outline' | 'person-circle-outline';
  route: `/vendor/${string}`;
}[] = [
  { id: 'home', label: 'Home', icon: 'grid-outline', route: '/vendor/home' },
  { id: 'listings', label: 'Listings', icon: 'business-outline', route: '/vendor/listings' },
  { id: 'bookings', label: 'Bookings', icon: 'ticket-outline', route: '/vendor/bookings' },
  { id: 'profile', label: 'Profile', icon: 'person-circle-outline', route: '/vendor/profile' },
];

export type VendorListingStatus = 'live' | 'draft';

export type VendorWorkspaceListing = {
  id: string;
  title: string;
  location: string;
  pricePerNight: string;
  status: VendorListingStatus;
  image: number;
};

export const VENDOR_WORKSPACE_LISTINGS: VendorWorkspaceListing[] = [
  {
    id: 'l1',
    title: 'Luxury Glamping Tent',
    location: 'Varkala, Kerala',
    pricePerNight: '₹4,500',
    status: 'live',
    image: require('../../loginimage.png'),
  },
  {
    id: 'l2',
    title: 'Beach View Cottage',
    location: 'Kovalam, Kerala',
    pricePerNight: '₹3,200',
    status: 'live',
    image: require('../../loginimage.png'),
  },
  {
    id: 'l3',
    title: 'Forest Retreat Camp',
    location: 'Wayanad, Kerala',
    pricePerNight: '₹2,800',
    status: 'draft',
    image: require('../../loginimage.png'),
  },
];

export type VendorWorkspaceBookingDetail = {
  id: string;
  guestName: string;
  guestRating: number;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPayout: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  guestAvatar: number;
  propertyImage: number;
};

export const VENDOR_WORKSPACE_BOOKING_DETAILS: Record<string, VendorWorkspaceBookingDetail> = {
  b1: {
    id: 'b1',
    guestName: 'Ashish Kumar',
    guestRating: 4.8,
    propertyName: 'Luxury Glamping Tent',
    checkIn: '12 May 2024',
    checkOut: '15 May 2024',
    guests: 2,
    totalPayout: '₹13,500',
    status: 'pending',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../loginimage.png'),
  },
  b2: {
    id: 'b2',
    guestName: 'Anjali Pillai',
    guestRating: 4.9,
    propertyName: 'Luxury Glamping Tent',
    checkIn: '3 Apr 2026',
    checkOut: '5 Apr 2026',
    guests: 3,
    totalPayout: '₹9,000',
    status: 'confirmed',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../loginimage.png'),
  },
};

export const VENDOR_WORKSPACE_EARNINGS = {
  total: '₹1,24,500',
  pending: '₹18,200',
  completed: '₹1,06,300',
  chartWeeks: ['W1', 'W2', 'W3', 'W4'],
  chartValues: [12000, 18500, 14200, 22800],
  transactions: [
    { id: 't1', label: 'Ashish Kumar — Luxury Glamping Tent', date: '12 May 2024', amount: '₹13,500' },
    { id: 't2', label: 'Anjali Pillai — Luxury Glamping Tent', date: '3 Apr 2026', amount: '₹9,000' },
    { id: 't3', label: 'Subhash — Beach View Cottage', date: '28 Mar 2026', amount: '₹6,400' },
  ],
};

export const VENDOR_WORKSPACE_PROFILE = {
  name: 'Raja',
  email: 'raja@gotrip.com',
  avatar: require('../../loginimage.png'),
};

export const VENDOR_WORKSPACE_PROFILE_MENU = [
  { id: 'personal', label: 'Personal Information', icon: 'person-outline' as const },
  { id: 'listings', label: 'My Listings', icon: 'business-outline' as const, route: '/vendor/listings' as const },
  { id: 'earnings', label: 'Earnings', icon: 'wallet-outline' as const, route: '/vendor/earnings' as const },
  { id: 'payments', label: 'Payment Methods', icon: 'card-outline' as const },
  { id: 'reviews', label: 'Reviews', icon: 'star-outline' as const },
  { id: 'notifications', label: 'Notification Settings', icon: 'notifications-outline' as const },
  { id: 'help', label: 'Help & Support', icon: 'help-circle-outline' as const },
];

export const VENDOR_WORKSPACE_COPY = {
  createListing: 'Create New Listing',
  addListing: 'Add New Listing',
  allListings: 'All Listings',
  updateAvailability: 'Update Availability',
  calendarLegendAvailable: 'Available',
  calendarLegendBooked: 'Booked',
  calendarLegendBlocked: 'Blocked',
  acceptBooking: 'Accept',
  declineBooking: 'Decline',
  saveChanges: 'Save Changes',
  confirmCancellation: 'Confirm Cancellation',
  cancellationReason: 'Reason for Cancellation',
  totalEarnings: 'Total Earnings',
  pendingPayouts: 'Pending Payouts',
  completedPayouts: 'Completed Payouts',
  editProfile: 'Edit Profile',
  logout: 'Logout',
};

export const VENDOR_CALENDAR_BOOKED_DATES = ['2026-04-03', '2026-04-04', '2026-04-12', '2026-04-13'];
export const VENDOR_CALENDAR_BLOCKED_DATES = ['2026-04-20', '2026-04-21'];

export const VENDOR_CANCELLATION_REASONS = [
  { id: 'unavailable', label: 'Property unavailable' },
  { id: 'maintenance', label: 'Maintenance required' },
  { id: 'guest', label: 'Guest request' },
  { id: 'other', label: 'Other' },
];
