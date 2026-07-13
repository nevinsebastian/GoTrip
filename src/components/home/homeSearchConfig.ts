export type HomeCategoryTab = 'hotels' | 'packages' | 'glamping' | 'activities';

function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Rolling defaults so search dates stay in the future after hard-coded config goes stale. */
export function getDefaultStayDates(checkInDaysFromNow = 7, nights = 2) {
  const checkIn = new Date();
  checkIn.setHours(12, 0, 0, 0);
  checkIn.setDate(checkIn.getDate() + checkInDaysFromNow);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + nights);
  return { checkIn: isoDate(checkIn), checkOut: isoDate(checkOut) };
}

const DEFAULT_HOTEL_STAY = getDefaultStayDates(7, 2);
const DEFAULT_PACKAGE_STAY = getDefaultStayDates(14, 5);
const DEFAULT_GLAMPING_STAY = getDefaultStayDates(7, 2);
const DEFAULT_ACTIVITY_STAY = getDefaultStayDates(7, 0);

export type HomeSearchConfig = {
  locationLabel: string;
  defaultLocation: string;
  defaultCheckIn: string;
  defaultCheckOut: string;
  guestsLabel: string;
  guestUnit: string;
  roomUnit: string;
  defaultAdults: number;
  defaultChildren: number;
  defaultInfants: number;
  defaultRooms: number;
  showPriceFilter: boolean;
  searchRoute: '/resorts' | '/packages';
};

export const HOME_SEARCH_BY_TAB: Record<HomeCategoryTab, HomeSearchConfig> = {
  hotels: {
    locationLabel: 'City Name, Location, or Hotel',
    defaultLocation: 'Varkala',
    defaultCheckIn: DEFAULT_HOTEL_STAY.checkIn,
    defaultCheckOut: DEFAULT_HOTEL_STAY.checkOut,
    guestsLabel: 'Rooms and Guests',
    guestUnit: 'Guests',
    roomUnit: 'Room',
    defaultAdults: 2,
    defaultChildren: 0,
    defaultInfants: 0,
    defaultRooms: 1,
    showPriceFilter: true,
    searchRoute: '/resorts',
  },
  packages: {
    locationLabel: 'Enter your dream destination',
    defaultLocation: 'Singapore',
    defaultCheckIn: DEFAULT_PACKAGE_STAY.checkIn,
    defaultCheckOut: DEFAULT_PACKAGE_STAY.checkOut,
    guestsLabel: 'Travelers',
    guestUnit: 'Travelers',
    roomUnit: 'Package',
    defaultAdults: 2,
    defaultChildren: 0,
    defaultInfants: 0,
    defaultRooms: 1,
    showPriceFilter: true,
    searchRoute: '/packages',
  },
  glamping: {
    locationLabel: 'Find Your Dream Campfire',
    defaultLocation: 'Wildlife safari camps',
    defaultCheckIn: DEFAULT_GLAMPING_STAY.checkIn,
    defaultCheckOut: DEFAULT_GLAMPING_STAY.checkOut,
    guestsLabel: 'Guests and Tents',
    guestUnit: 'Guests',
    roomUnit: 'Tent',
    defaultAdults: 2,
    defaultChildren: 0,
    defaultInfants: 0,
    defaultRooms: 1,
    showPriceFilter: true,
    searchRoute: '/resorts',
  },
  activities: {
    locationLabel: 'Enter Your Dream Adventure',
    defaultLocation: 'Scuba Diving',
    defaultCheckIn: DEFAULT_ACTIVITY_STAY.checkIn,
    defaultCheckOut: DEFAULT_ACTIVITY_STAY.checkIn,
    guestsLabel: 'Participants',
    guestUnit: 'People',
    roomUnit: 'Group',
    defaultAdults: 2,
    defaultChildren: 0,
    defaultInfants: 0,
    defaultRooms: 1,
    showPriceFilter: true,
    searchRoute: '/resorts',
  },
};

export const LOCATION_SUGGESTIONS = [
  { title: 'Varkala, Thiruvananthapuram', subtitle: 'City in Kerala', short: 'Varkala' },
  { title: 'Varkala Sivagiri, Kerala', subtitle: null, short: 'Varkala Sivagiri' },
  { title: 'Varkala Cliff , Kerala', subtitle: null, short: 'Varkala Cliff' },
];

export const POPULAR_DESTINATIONS = [
  'Varkala',
  'Kozhikode',
  'Kollam',
  'Kochi',
  'Palakkad',
  'Alappey',
  'Thrissur',
  'Thiruvnanthapuram',
];

export function formatSearchDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return {
    date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    day: d.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

export function getDatesInRange(startIso: string, endIso: string) {
  const out: string[] = [];
  const a = new Date(`${startIso}T12:00:00`);
  const b = new Date(`${endIso}T12:00:00`);
  const cur = new Date(a);
  while (cur.getTime() <= b.getTime()) {
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, '0');
    const dd = String(cur.getDate()).padStart(2, '0');
    out.push(`${yyyy}-${mm}-${dd}`);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export type ExpandedSection = 'location' | 'dates' | 'guests' | null;

export type GuestCounts = {
  adults: number;
  children: number;
  infants: number;
  rooms: number;
};

export function totalGuests(counts: GuestCounts) {
  return counts.adults + counts.children;
}
