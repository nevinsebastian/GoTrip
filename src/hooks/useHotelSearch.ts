import type { SearchType } from '@/src/api/types';
import { useUnifiedSearch, type UnifiedSearchFilters } from '@/src/hooks/useUnifiedSearch';

export type HotelSearchFilters = {
  q?: string;
  /** @deprecated use q */
  city?: string;
  minRating?: number;
  limit?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  guests?: number;
  adults?: number;
  children?: number;
  starRatingMin?: number;
  starRatingMax?: number;
};

export const hotelSearchQueryKey = (filters: HotelSearchFilters) =>
  ['search', 'hotel', filters] as const;

export function useHotelSearch(filters: HotelSearchFilters = {}, enabled = true) {
  const q = filters.q ?? filters.city;
  const unified: UnifiedSearchFilters = {
    type: 'hotel',
    q,
    checkIn: filters.checkIn,
    checkOut: filters.checkOut,
    rooms: filters.rooms,
    guests: filters.guests,
    adults: filters.adults,
    children: filters.children,
    limit: filters.limit,
    starRatingMin: filters.starRatingMin,
    starRatingMax: filters.starRatingMax,
  };

  const result = useUnifiedSearch(unified, enabled);

  return {
    ...result,
    hotels: result.items,
  };
}

export type { SearchType };
