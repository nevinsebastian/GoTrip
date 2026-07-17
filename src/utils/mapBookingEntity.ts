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
): BookingEntitySelection | null {
  const slot = selectedSlotId
    ? activity.slots?.find((s) => s.id === selectedSlotId)
    : activity.slots?.[0];
  if (!slot?.id) return null;
  return {
    listingId: activity.id,
    entityType: 'activity_slot',
    entityId: slot.id,
    activitySlotId: slot.id,
    unitsBooked: 1,
  };
}

export function mapGlampingDetailToBookingEntity(
  glamping: GlampingDetail,
  selectedSiteId?: string | null,
  unitsBooked = 1,
): BookingEntitySelection | null {
  const site = selectedSiteId
    ? glamping.sites?.find((s) => s.id === selectedSiteId)
    : glamping.sites?.[0];
  // Some APIs nest site under glampingSite on listing; fall back to listing id only if sites exist
  const siteId = site?.id;
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
