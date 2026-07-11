import { VENDOR_ACTIVITY_PUBLISH_TITLE } from '@/src/constants/vendorActivityConstants';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';
import type { VendorActivityDraft } from '@/src/utils/vendorActivityDraft';

export type ActivityPublishPreview = {
  title: string;
  locationLabel: string;
  durationLabel: string;
  metaLabel: string;
  price: number;
  infantPrice: number;
  tags: { id: string; label: string }[];
  thumbnail: string | null;
};

export function buildActivityPublishPreview(
  draft: VendorActivityDraft | null,
): ActivityPublishPreview {
  const location = draft?.locationJson;
  const city = typeof location?.city === 'string' ? location.city : '';
  const state = typeof location?.state === 'string' ? location.state : '';
  const locationLabel = [city, state].filter(Boolean).join(', ') || 'Location not set';

  const hours = Number(draft?.hours ?? 0);
  const durationLabel =
    hours > 0 ? `${hours} hour${hours === 1 ? '' : 's'}` : 'Duration not set';

  const minAge = Number(draft?.minAge ?? 0);
  const guests = Number(draft?.guests ?? 0);
  const metaLabel =
    minAge > 0
      ? `Min age ${minAge}+`
      : guests > 0
        ? `Up to ${guests} guests`
        : 'Capacity not set';

  const inclusions = parseGlampingTextList(draft?.inclusionsText ?? '').slice(0, 4);
  const tags =
    inclusions.length > 0
      ? inclusions.map((label, index) => ({ id: `inclusion-${index}`, label }))
      : [{ id: 'activity', label: 'Activity experience' }];

  return {
    title: draft?.title?.trim() || VENDOR_ACTIVITY_PUBLISH_TITLE,
    locationLabel,
    durationLabel,
    metaLabel,
    price: Number(draft?.basePriceAdult ?? 0),
    infantPrice: Number(draft?.basePriceInfant ?? 0),
    tags,
    thumbnail: Array.isArray(draft?.images) ? draft.images[0] ?? null : null,
  };
}
