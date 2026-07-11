import { VENDOR_PACKAGE_PUBLISH_TITLE } from '@/src/constants/vendorPackageConstants';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';
import type { VendorPackageDraft } from '@/src/utils/vendorPackageDraft';

export type PackagePublishPreview = {
  title: string;
  locationLabel: string;
  durationLabel: string;
  metaLabel: string;
  price: number;
  tags: { id: string; label: string }[];
  thumbnail: string | null;
};

export function buildPackagePublishPreview(
  draft: VendorPackageDraft | null,
): PackagePublishPreview {
  const location = draft?.locationJson;
  const city = typeof location?.city === 'string' ? location.city : '';
  const state = typeof location?.state === 'string' ? location.state : '';
  const locationLabel = [city, state].filter(Boolean).join(', ') || 'Location not set';

  const totalDays = Number(draft?.totalDays ?? 0);
  const totalNights = Number(draft?.totalNights ?? 0);
  const durationLabel =
    totalDays > 0
      ? `${totalDays} day${totalDays === 1 ? '' : 's'} / ${totalNights} night${totalNights === 1 ? '' : 's'}`
      : 'Duration not set';

  const minGroup = Number(draft?.minGroupSize ?? 0);
  const maxGroup = Number(draft?.maxGroupSize ?? 0);
  const metaLabel =
    minGroup > 0 && maxGroup > 0
      ? `Group size ${minGroup}–${maxGroup}`
      : minGroup > 0
        ? `Min group ${minGroup}`
        : 'Group size not set';

  const inclusions = parseGlampingTextList(draft?.inclusionsText ?? '').slice(0, 4);
  const tags =
    inclusions.length > 0
      ? inclusions.map((label, index) => ({ id: `inclusion-${index}`, label }))
      : [{ id: 'package', label: 'Travel package' }];

  return {
    title: draft?.title?.trim() || VENDOR_PACKAGE_PUBLISH_TITLE,
    locationLabel,
    durationLabel,
    metaLabel,
    price: Number(draft?.pricePerPerson ?? 0),
    tags,
    thumbnail: Array.isArray(draft?.images) ? draft.images[0] ?? null : null,
  };
}
