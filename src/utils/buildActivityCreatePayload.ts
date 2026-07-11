import type { CreateActivityRequest } from '@/src/api/types';
import { mapActivityTypeToApi } from '@/src/api/mappers/activityListing';
import type { VendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';

export function validateActivityDraft(draft: VendorActivityDraft | null): string | null {
  if (!draft?.title?.trim()) return 'Please add a title before continuing.';
  if (!draft?.description?.trim()) return 'Please add a listing description before continuing.';
  if (!draft?.locationJson) return 'Location not found. Please select a location first.';
  const basePriceAdult = Number(draft.basePriceAdult ?? 0);
  if (!basePriceAdult || basePriceAdult <= 0) {
    return 'Please set a price for this activity before continuing.';
  }
  const guests = Number(draft.guests ?? 0);
  if (!guests || guests <= 0) return 'Please set the maximum number of participants.';
  const hours = Number(draft.hours ?? 0);
  if (!hours || hours <= 0) return 'Please set the activity duration in hours.';
  const totalSlotsPerDay = Number(draft.totalSlotsPerDay ?? 0);
  if (!totalSlotsPerDay || totalSlotsPerDay <= 0) return 'Please set slots per day.';
  if (!draft.aboutExperience?.trim()) return 'Please describe the experience before continuing.';
  if (!draft.thingsToCarry?.trim()) return 'Please add things to carry before continuing.';
  if (!draft.howToReach?.trim()) return 'Please add how to reach information before continuing.';
  if (!parseGlampingTextList(draft.inclusionsText ?? '').length) {
    return 'Please add at least one inclusion.';
  }
  if (!parseGlampingTextList(draft.exclusionsText ?? '').length) {
    return 'Please add at least one exclusion.';
  }
  if (!parseGlampingTextList(draft.whatsprovidedText ?? '').length) {
    return 'Please add at least one item under what is provided.';
  }
  return null;
}

export function buildActivityCreatePayload(draft: VendorActivityDraft): CreateActivityRequest {
  const descriptionParts = [draft.titleSecondary?.trim(), draft.description?.trim()].filter(Boolean);
  const description = descriptionParts.join('\n\n') || draft.title!.trim();
  const inclusions = parseGlampingTextList(draft.inclusionsText ?? '');
  const exclusions = parseGlampingTextList(draft.exclusionsText ?? '');
  const whatsprovided = parseGlampingTextList(draft.whatsprovidedText ?? '');
  const thingsToCarry = parseGlampingTextList(draft.thingsToCarry ?? '');

  const payload: CreateActivityRequest = {
    title: draft.title!.trim(),
    activityType: mapActivityTypeToApi(draft.activityKindId, draft.activityTypeId),
    basePriceAdult: Number(draft.basePriceAdult),
    locationJson: draft.locationJson!,
    description,
    aboutExperience: draft.aboutExperience!.trim(),
    inclusions,
    exclusions,
    whatsprovided,
    thingsToCarry,
    howToReach: draft.howToReach!.trim(),
    totalSlotsPerDay: Number(draft.totalSlotsPerDay),
  };

  const basePriceInfant = Number(draft.basePriceInfant ?? 0);
  if (basePriceInfant > 0) {
    payload.basePriceInfant = basePriceInfant;
  }

  const minAge = Number(draft.minAge ?? 0);
  if (minAge > 0) {
    payload.minAge = minAge;
  }

  if (Array.isArray(draft.highlightIds) && draft.highlightIds.length) {
    payload.highlightIds = draft.highlightIds;
  }

  return payload;
}
