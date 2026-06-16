export type HomeCategoryTab = 'hotels' | 'packages' | 'glamping' | 'activities';

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
    defaultCheckIn: '2026-04-03',
    defaultCheckOut: '2026-04-05',
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
    defaultCheckIn: '2026-04-10',
    defaultCheckOut: '2026-04-15',
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
    defaultCheckIn: '2026-04-03',
    defaultCheckOut: '2026-04-05',
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
    locationLabel: 'Enter your dream destination',
    defaultLocation: 'Scuba Diving',
    defaultCheckIn: '2026-04-03',
    defaultCheckOut: '2026-04-03',
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
