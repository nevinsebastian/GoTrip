import type { CreatePackageRequest } from '@/src/api/types';
import type { VendorPackageDayItinerary } from '@/src/constants/vendorPackageConstants';
import type { VendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';

export function validatePackageDraft(draft: VendorPackageDraft | null): string | null {
  if (!draft?.title?.trim()) return 'Please add a package title before continuing.';
  if (!draft?.description?.trim()) return 'Please add a package description before continuing.';
  if (!draft?.locationJson) return 'Location not found. Please select a location first.';
  const totalDays = Number(draft.totalDays ?? 0);
  if (!totalDays || totalDays < 1) return 'Please set the number of days (at least 1).';
  const totalNights = Number(draft.totalNights ?? -1);
  if (totalNights < 0) return 'Please set the number of nights.';
  const pricePerPerson = Number(draft.pricePerPerson ?? 0);
  if (!pricePerPerson || pricePerPerson <= 0) {
    return 'Please set a price per person before continuing.';
  }
  const minGroupSize = Number(draft.minGroupSize ?? 0);
  if (!minGroupSize || minGroupSize < 1) return 'Please set the minimum group size.';
  const maxGroupSize = Number(draft.maxGroupSize ?? 0);
  if (!maxGroupSize || maxGroupSize < minGroupSize) {
    return 'Maximum group size must be at least the minimum group size.';
  }
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

export function buildPackageCreatePayload(draft: VendorPackageDraft): CreatePackageRequest {
  const inclusions = parseGlampingTextList(draft.inclusionsText ?? '');
  const exclusions = parseGlampingTextList(draft.exclusionsText ?? '');
  const whatsprovided = parseGlampingTextList(draft.whatsprovidedText ?? '');

  const payload: CreatePackageRequest = {
    title: draft.title!.trim(),
    description: draft.description!.trim(),
    totalDays: Number(draft.totalDays),
    totalNights: Number(draft.totalNights),
    pricePerPerson: Number(draft.pricePerPerson),
    locationJson: draft.locationJson!,
    minGroupSize: Number(draft.minGroupSize),
    maxGroupSize: Number(draft.maxGroupSize),
    inclusions,
    exclusions,
    whatsprovided,
    bookingMode: draft.bookingMode ?? 'enquiry_only',
  };

  return payload;
}

export function buildPackageItineraryPayloads(
  days: VendorPackageDayItinerary[] | undefined,
): import('@/src/api/types').UpsertPackageItineraryRequest[] {
  if (!Array.isArray(days)) return [];

  return days
    .map((day, index) => {
      const title = day.title?.trim();
      if (!title) return null;

      const payload: import('@/src/api/types').UpsertPackageItineraryRequest = {
        dayNumber: index + 1,
        title,
      };

      const description = day.aboutExperience?.trim();
      if (description) payload.description = description;

      const hotelName = day.hotelPrimary?.trim();
      if (hotelName) payload.hotelName = hotelName;

      const hotelDescription = day.hotelSecondary?.trim();
      if (hotelDescription) payload.hotelDescription = hotelDescription;

      const activityName = day.activityPrimary?.trim();
      if (activityName) payload.activityName = activityName;

      const activityDescription = day.activitySecondary?.trim();
      if (activityDescription) payload.activityDescription = activityDescription;

      return payload;
    })
    .filter((item): item is import('@/src/api/types').UpsertPackageItineraryRequest => Boolean(item));
}
