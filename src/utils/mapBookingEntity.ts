import type {
  ActivityDetail,
  AvailabilityEntityType,
  GlampingDetail,
  HotelDetail,
  PackageDetail,
} from '@/src/api/types';
import { getBookingEntity, isFullPropertyHotel } from '@/src/utils/hotelDetailHelpers';
import { packageEntityId } from '@/src/utils/packageHelpers';

export type BookingEntitySelection = {
  listingId: string;
  entityType: AvailabilityEntityType;
  entityId: string;
  mealPlanId?: string;
  activitySlotId?: string;
  unitsBooked?: number;
};

export function mapHotelDetailToBookingEntity(
  hotel: HotelDetail,
  selectedRoomTypeId?: string | null,
  mealPlanId?: string | null,
): BookingEntitySelection | null {
  const { entityType, entityId } = getBookingEntity(hotel, selectedRoomTypeId);
  if (!entityId) return null;
  return {
    listingId: hotel.id,
    entityType,
    entityId,
    mealPlanId: mealPlanId ?? undefined,
    unitsBooked: 1,
  };
}

export function mapActivityDetailToBookingEntity(
  activity: ActivityDetail,
  selectedSlotId?: string | null,
  adults = 1,
): BookingEntitySelection | null {
  const nestedSlots =
    (activity as ActivityDetail & { activity?: { slots?: ActivityDetail['slots'] } }).activity
      ?.slots;
  const slots = activity.slots?.length ? activity.slots : nestedSlots;
  const slot = selectedSlotId
    ? slots?.find((s) => s.id === selectedSlotId)
    : slots?.[0];
  if (!slot?.id) return null;
  const participants = Math.max(1, adults);
  return {
    listingId: activity.id,
    entityType: 'activity_slot',
    entityId: slot.id,
    activitySlotId: slot.id,
    // Backend inventory checks unitsBooked; price uses adults — keep them equal.
    unitsBooked: participants,
  };
}

export function mapGlampingDetailToBookingEntity(
  glamping: GlampingDetail,
  selectedSiteId?: string | null,
  unitsBooked = 1,
): BookingEntitySelection | null {
  const nestedSiteId = glamping.glampingSite?.id;
  const site = selectedSiteId
    ? glamping.sites?.find((s) => s.id === selectedSiteId)
    : glamping.sites?.[0];
  const siteId = site?.id ?? (selectedSiteId && nestedSiteId === selectedSiteId ? nestedSiteId : undefined) ?? nestedSiteId;
  if (!siteId) return null;
  return {
    listingId: glamping.id,
    entityType: 'glamping_site',
    entityId: siteId,
    unitsBooked: Math.max(1, unitsBooked),
  };
}

export function mapPackageDetailToBookingEntity(
  pkg: PackageDetail,
): BookingEntitySelection | null {
  const entityId = packageEntityId(pkg);
  if (!entityId) return null;
  return {
    listingId: pkg.id,
    entityType: 'package',
    entityId,
    unitsBooked: 1,
  };
}

export function supportsAvailabilityCalendar(entityType: AvailabilityEntityType): boolean {
  return (
    entityType === 'room_type' ||
    entityType === 'full_property' ||
    entityType === 'activity_slot' ||
    entityType === 'glamping_site'
  );
}

export function supportsCheckAvailability(entityType: AvailabilityEntityType): boolean {
  return entityType !== 'package';
}

export { isFullPropertyHotel };
