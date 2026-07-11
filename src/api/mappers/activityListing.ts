import type { ActivityTypeEnum, CreateActivitySlotRequest } from '@/src/api/types';
import type { VendorActivityDraft } from '@/src/utils/vendorActivityDraft';

export function mapActivityTypeToApi(
  activityKindId?: string,
  activityTypeId?: string,
): ActivityTypeEnum {
  if (activityTypeId === 'trekking' || activityKindId === 'trekking') {
    return 'trekking';
  }
  if (activityKindId === 'water') {
    return 'water_sports';
  }
  if (activityKindId === 'adventure') {
    return 'adventure';
  }
  return 'sightseeing';
}

export function buildActivitySlotFromDraft(draft: VendorActivityDraft): CreateActivitySlotRequest {
  const guests = Number(draft.guests ?? 0);
  const hours = Number(draft.hours ?? 0);
  const slot: CreateActivitySlotRequest = {
    label: draft.slotLabel?.trim() || 'Standard Batch',
  };
  if (draft.slotStartTime?.trim()) {
    slot.startTime = draft.slotStartTime.trim();
  } else {
    slot.startTime = '09:00';
  }
  if (hours > 0) {
    slot.durationMinutes = Math.round(hours * 60);
  }
  if (guests > 0) {
    slot.maxParticipants = guests;
  }
  return slot;
}
