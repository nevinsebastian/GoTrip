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
  bookingRef: string;
  guestName: string;
  guestTitle: string;
  guestFirstName: string;
  guestRating: number;
  propertyName: string;
  propertyDescription: string;
  dateRangeDisplay: string;
  guestsLabel: string;
  priceDisplay: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPayout: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  guestAvatar: number;
  propertyImage: number;
  defaultConfirmationNote: string;
};

export const VENDOR_VIEW_BOOKING_COPY = {
  title: 'View Booking',
  bookingIdLabel: 'Booking ID# :',
  guestLabel: 'Guest',
  datesLabel: 'Dates',
  guestsLabel: 'Guests',
  contact: 'Contact',
  message: 'Message',
  totalPrice: 'Total Price',
  cancel: 'Cancel',
  confirm: 'Confirm',
};

export const VENDOR_CONFIRM_BOOKING_COPY = {
  title: 'Confirm Booking',
  bookingIdLabel: 'Booking ID# :',
  guestLabel: 'Guest',
  datesLabel: 'Dates',
  guestsLabel: 'Guests',
  contact: 'Contact',
  promptTitle: 'Confirm booking?',
  promptBody: (name: string) => `Are you sure you want to confirm ${name}'s booking?`,
  noteLabel: 'Send a confirmation note',
  goBack: 'Go back',
  cancelCta: 'Cancel',
  confirmCta: 'Confirm Booking',
  noteMaxLength: 500,
};

const DEFAULT_NOTE =
  "Hi Ashish, Your reservation has been successfully confirmed. We're delighted to have you with us and look forward to hosting you.";

export const VENDOR_WORKSPACE_BOOKING_DETAILS: Record<string, VendorWorkspaceBookingDetail> = {
  b1: {
    id: 'b1',
    bookingRef: 'B27641',
    guestName: 'Ashish Kumar',
    guestTitle: 'Mr. Ashish Kumar',
    guestFirstName: 'Ashish',
    guestRating: 4.8,
    propertyName: 'Luxury Glamping Tent',
    propertyDescription: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    dateRangeDisplay: '3-5 April 2026',
    guestsLabel: '2 adults',
    priceDisplay: '₹ 10,420/night',
    checkIn: '3 Apr 2026',
    checkOut: '5 Apr 2026',
    guests: 2,
    totalPayout: '₹13,500',
    status: 'pending',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../assets/images/glamping.jpg'),
    defaultConfirmationNote: DEFAULT_NOTE,
  },
  b2: {
    id: 'b2',
    bookingRef: 'B27642',
    guestName: 'Anjali Pillai',
    guestTitle: 'Ms. Anjali Pillai',
    guestFirstName: 'Anjali',
    guestRating: 4.9,
    propertyName: 'Luxury Glamping Tent',
    propertyDescription: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    dateRangeDisplay: '3-5 April 2026',
    guestsLabel: '3 adults',
    priceDisplay: '₹ 10,420/night',
    checkIn: '3 Apr 2026',
    checkOut: '5 Apr 2026',
    guests: 3,
    totalPayout: '₹9,000',
    status: 'confirmed',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../assets/images/glamping.jpg'),
    defaultConfirmationNote: DEFAULT_NOTE,
  },
  b3: {
    id: 'b3',
    bookingRef: 'B27643',
    guestName: 'Subhash',
    guestTitle: 'Mr. Subhash',
    guestFirstName: 'Subhash',
    guestRating: 4.5,
    propertyName: 'Luxury Glamping Tent',
    propertyDescription: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    dateRangeDisplay: '3-5 April 2026',
    guestsLabel: '1 adult',
    priceDisplay: '₹ 10,420/night',
    checkIn: '3 Apr 2026',
    checkOut: '5 Apr 2026',
    guests: 1,
    totalPayout: '₹6,400',
    status: 'confirmed',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../assets/images/glamping.jpg'),
    defaultConfirmationNote: DEFAULT_NOTE,
  },
  b4: {
    id: 'b4',
    bookingRef: 'B27644',
    guestName: 'Vignesh Raja',
    guestTitle: 'Mr. Vignesh Raja',
    guestFirstName: 'Vignesh',
    guestRating: 4.2,
    propertyName: 'Luxury Glamping Tent',
    propertyDescription: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    dateRangeDisplay: '3-5 April 2026',
    guestsLabel: '1 adult',
    priceDisplay: '₹ 10,420/night',
    checkIn: '3 Apr 2026',
    checkOut: '5 Apr 2026',
    guests: 1,
    totalPayout: '₹6,400',
    status: 'cancelled',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../assets/images/glamping.jpg'),
    defaultConfirmationNote: DEFAULT_NOTE,
  },
  b5: {
    id: 'b5',
    bookingRef: 'B27645',
    guestName: 'Abhinav S N',
    guestTitle: 'Mr. Abhinav S N',
    guestFirstName: 'Abhinav',
    guestRating: 4.7,
    propertyName: 'Luxury Glamping Tent',
    propertyDescription: 'Luxury stay in Kodaikanal | 2 rooms | with a valley view',
    dateRangeDisplay: '3-5 April 2026',
    guestsLabel: '2 adults',
    priceDisplay: '₹ 10,420/night',
    checkIn: '3 Apr 2026',
    checkOut: '5 Apr 2026',
    guests: 2,
    totalPayout: '₹8,200',
    status: 'confirmed',
    guestAvatar: require('../../loginimage.png'),
    propertyImage: require('../../assets/images/glamping.jpg'),
    defaultConfirmationNote: DEFAULT_NOTE,
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
