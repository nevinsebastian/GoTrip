import type {
  CapacityFitSuggestion,
  CheckAvailabilityResponse,
  HotelRoomType,
} from '@/src/api/types';

/** Infants are hospitality-only — never use in fit checks. */
export function roomFitsGuests(
  room: Pick<HotelRoomType, 'maxAdultOccupancy' | 'maxChildOccupancy'>,
  adults: number,
  children: number,
  unitsBooked = 1,
): boolean {
  const units = Math.max(1, unitsBooked);
  const maxAdults = (room.maxAdultOccupancy ?? 0) * units;
  const maxChildren = (room.maxChildOccupancy ?? 0) * units;
  return adults <= maxAdults && children <= maxChildren;
}

export function formatRoomOccupancyLabel(
  room: Pick<HotelRoomType, 'maxAdultOccupancy' | 'maxChildOccupancy'>,
): string {
  const adults = room.maxAdultOccupancy ?? 0;
  const children = room.maxChildOccupancy ?? 0;
  const parts: string[] = [];
  if (adults > 0) parts.push(`${adults} adult${adults === 1 ? '' : 's'}`);
  if (children > 0) parts.push(`${children} child${children === 1 ? '' : 'ren'}`);
  if (!parts.length) return 'See room details';
  return `Fits up to ${parts.join(', ')}`;
}

export function formatGuestRoomBadge(adults: number, rooms = 1): string {
  const guestLabel = `${adults} Guest${adults === 1 ? '' : 's'}`;
  return `${guestLabel} - ${rooms} Room${rooms === 1 ? '' : 's'}`;
}

export function isCapacityExceededResponse(
  res: CheckAvailabilityResponse | null | undefined,
): boolean {
  return Boolean(res && res.available === false && res.capacityExceeded);
}

export function capacityExceededMessage(
  res: CheckAvailabilityResponse,
  fallback = 'Selected room does not accommodate this many guests.',
): string {
  return res.message?.trim() || fallback;
}

/** Default split for cross_room_type: fill room A to max, rest in room B. */
export function splitGuestsForCombo(
  adults: number,
  children: number,
  roomA: Pick<CapacityFitSuggestion['rooms'][number], 'maxAdultOccupancy' | 'maxChildOccupancy' | 'units'>,
): { a: { adults: number; children: number }; b: { adults: number; children: number } } {
  const aMaxAdults = (roomA.maxAdultOccupancy ?? 0) * Math.max(1, roomA.units ?? 1);
  const aMaxChildren = (roomA.maxChildOccupancy ?? 0) * Math.max(1, roomA.units ?? 1);
  const aAdults = Math.min(adults, aMaxAdults);
  const aChildren = Math.min(children, aMaxChildren);
  return {
    a: { adults: aAdults, children: aChildren },
    b: {
      adults: Math.max(0, adults - aAdults),
      children: Math.max(0, children - aChildren),
    },
  };
}
