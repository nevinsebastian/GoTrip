import type { CreateGlampingRequest } from '@/src/api/types';
import { GLAMPING_LISTING_DEFAULTS } from '@/src/constants/vendorGlampingConstants';
import type { VendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';

export function validateGlampingDraft(draft: VendorGlampingDraft | null): string | null {
  if (!draft?.title?.trim()) return 'Please add a title before continuing.';
  if (!draft?.locationJson) return 'Location not found. Please select a location first.';
  const totalCamps = Number(draft.totalCamps ?? 0);
  if (!totalCamps || totalCamps <= 0) return 'Please add total camps before continuing.';
  const adultsPerCamp = Number(draft.adultsPerCamp ?? 0);
  if (!adultsPerCamp || adultsPerCamp <= 0) return 'Please set adults per camp before continuing.';
  const pricePerCampNight = Number(draft.pricePerCampNight ?? 0);
  if (!pricePerCampNight || pricePerCampNight <= 0) return 'Please set price per camp night before continuing.';
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

export function buildGlampingCreatePayload(draft: VendorGlampingDraft): CreateGlampingRequest {
  const totalCamps = Number(draft.totalCamps ?? 0);
  return {
    title: draft.title!.trim(),
    description: draft.description?.trim() || draft.title!.trim(),
    locationJson: draft.locationJson!,
    cancellationPolicyId: draft.cancellationPolicyId ?? GLAMPING_LISTING_DEFAULTS.cancellationPolicyId,
    totalCamps,
    adultsPerCamp: Number(draft.adultsPerCamp ?? 0),
    infantsPerCamp: Number(draft.infantsPerCamp ?? 0),
    pricePerCampNight: Number(draft.pricePerCampNight ?? 0),
    extraAdultCharge: Number(draft.extraAdultCharge ?? 0),
    extraInfantCharge: Number(draft.extraInfantCharge ?? 0),
    aboutExperience: draft.aboutExperience!.trim(),
    inclusions: parseGlampingTextList(draft.inclusionsText ?? ''),
    exclusions: parseGlampingTextList(draft.exclusionsText ?? ''),
    whatsprovided: parseGlampingTextList(draft.whatsprovidedText ?? ''),
    thingsToCarry: parseGlampingTextList(draft.thingsToCarry ?? ''),
    howToReach: draft.howToReach!.trim(),
  };
}
