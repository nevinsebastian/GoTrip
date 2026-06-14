export type HomeCategoryTab = 'hotels' | 'packages' | 'glamping' | 'activities';

export type HomeSearchConfig = {
  locationLabel: string;
  locationValue: string;
  checkIn: string;
  checkInDay: string;
  checkOut: string;
  checkOutDay: string;
  guestsLabel: string;
  guestCount: string;
  guestUnit: string;
  roomCount: string;
  roomUnit: string;
  showPriceFilter: boolean;
  searchRoute: '/resorts' | '/packages';
};

export const HOME_SEARCH_BY_TAB: Record<HomeCategoryTab, HomeSearchConfig> = {
  hotels: {
    locationLabel: 'City Name, Location, or Hotel',
    locationValue: 'Varkala',
    checkIn: 'April 3, 2026',
    checkInDay: 'Tuesday',
    checkOut: 'April 5, 2026',
    checkOutDay: 'Thursday',
    guestsLabel: 'Rooms and Guests',
    guestCount: '2',
    guestUnit: 'Guests',
    roomCount: '1',
    roomUnit: 'Room',
    showPriceFilter: true,
    searchRoute: '/resorts',
  },
  packages: {
    locationLabel: 'Destination or Package',
    locationValue: 'Kerala',
    checkIn: 'April 10, 2026',
    checkInDay: 'Friday',
    checkOut: 'April 15, 2026',
    checkOutDay: 'Wednesday',
    guestsLabel: 'Travelers',
    guestCount: '2',
    guestUnit: 'Travelers',
    roomCount: '1',
    roomUnit: 'Package',
    showPriceFilter: false,
    searchRoute: '/packages',
  },
  glamping: {
    locationLabel: 'Glamping Location',
    locationValue: 'Wayanad',
    checkIn: 'April 3, 2026',
    checkInDay: 'Tuesday',
    checkOut: 'April 5, 2026',
    checkOutDay: 'Thursday',
    guestsLabel: 'Guests and Tents',
    guestCount: '2',
    guestUnit: 'Guests',
    roomCount: '1',
    roomUnit: 'Tent',
    showPriceFilter: true,
    searchRoute: '/resorts',
  },
  activities: {
    locationLabel: 'Activity or City',
    locationValue: 'Varkala',
    checkIn: 'April 3, 2026',
    checkInDay: 'Tuesday',
    checkOut: 'April 3, 2026',
    checkOutDay: 'Tuesday',
    guestsLabel: 'Participants',
    guestCount: '2',
    guestUnit: 'People',
    roomCount: '1',
    roomUnit: 'Group',
    showPriceFilter: false,
    searchRoute: '/resorts',
  },
};

export const LOCATION_SUGGESTIONS = [
  { title: 'Varkala, Thiruvananthapuram', subtitle: 'City in Kerala' },
  { title: 'Varkala Sivagiri, Kerala', subtitle: null },
  { title: 'Varkala Cliff , Kerala', subtitle: null },
];

export const POPULAR_DESTINATIONS = ['Varkala', 'Kochi', 'Alappey', 'Thrissur'];
