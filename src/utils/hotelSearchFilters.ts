import type { PublicHotel } from '@/src/api/types';

/** First segment before comma — e.g. "Varkala, Kerala" → "Varkala". */
export function cityQueryFromLocation(location: string): string | undefined {
  const trimmed = location.trim();
  if (!trimmed) return undefined;
  const first = trimmed.split(',')[0]?.trim();
  return first || undefined;
}

export function isValidStayRange(checkIn: string, checkOut: string): boolean {
  const inDate = new Date(`${checkIn}T12:00:00`);
  const outDate = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return outDate > inDate && inDate >= today;
}

export function stayNights(checkIn: string, checkOut: string): number {
  const inDate = new Date(`${checkIn}T12:00:00`);
  const outDate = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return 0;
  return Math.max(0, Math.round((outDate.getTime() - inDate.getTime()) / 86_400_000));
}

export type HotelSearchCriteria = {
  checkIn?: string;
  checkOut?: string;
  /** When set, further narrows API city results client-side. */
  locationQuery?: string;
  starRatingMin?: number;
  starRatingMax?: number;
};

function hotelCityLabel(hotel: PublicHotel): string {
  const loc = hotel.locationJson;
  return (loc?.city ?? loc?.searchLabel ?? loc?.address ?? '').trim().toLowerCase();
}

function matchesLocationQuery(hotel: PublicHotel, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const cityPart = (cityQueryFromLocation(query) ?? query).toLowerCase();
  const city = hotelCityLabel(hotel);
  const title = hotel.title.toLowerCase();
  const description = (hotel.description ?? '').toLowerCase();
  const state = (hotel.locationJson?.state ?? '').toLowerCase();
  return (
    city.includes(cityPart) ||
    cityPart.includes(city) ||
    city.includes(q) ||
    title.includes(q) ||
    title.includes(cityPart) ||
    description.includes(q) ||
    description.includes(cityPart) ||
    state.includes(q) ||
    state.includes(cityPart) ||
    q.includes(city)
  );
}

/** Client-side filters when the public hotels API has no date/availability params. */
export function filterHotelsForSearch(
  hotels: PublicHotel[],
  criteria: HotelSearchCriteria = {},
): PublicHotel[] {
  const { checkIn, checkOut, locationQuery, starRatingMin, starRatingMax } = criteria;

  return hotels.filter((hotel) => {
    if (hotel.isPublished === false) return false;
    if (hotel.status && hotel.status !== 'active') return false;

    const stars = hotel.hotelProperty?.starRating;
    if (stars != null && starRatingMin != null && stars < starRatingMin) return false;
    if (stars != null && starRatingMax != null && stars > starRatingMax) return false;

    if (locationQuery && !matchesLocationQuery(hotel, locationQuery)) return false;

    return true;
  });
}

export function formatStayDateLabel(checkIn: string, checkOut: string): string {
  const fmt = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  const nights = stayNights(checkIn, checkOut);
  return `${fmt(checkIn)} – ${fmt(checkOut)}${nights ? ` · ${nights} night${nights === 1 ? '' : 's'}` : ''}`;
}
