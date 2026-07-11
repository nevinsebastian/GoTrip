import {
  VENDOR_GLAMPING_MEAL_OPTIONS,
  type VendorGlampingMealInclusions,
} from '@/src/constants/vendorGlampingConstants';
import type { VendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';

export function formatGlampingLocationPreview(locationJson?: Record<string, unknown>): string {
  if (!locationJson) return '—';
  const parts = [locationJson.address, locationJson.city, locationJson.state, locationJson.country]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean);
  const lat = locationJson.lat;
  const lng = locationJson.lng;
  const coords =
    typeof lat === 'number' && typeof lng === 'number'
      ? ` (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      : '';
  return parts.length ? `${parts.join(', ')}${coords}` : coords.trim() || '—';
}

export function formatGlampingMealPreview(inclusions?: VendorGlampingMealInclusions): string {
  if (!inclusions) return '—';
  const selected = VENDOR_GLAMPING_MEAL_OPTIONS.filter((option) => inclusions[option.key]).map(
    (option) => option.label,
  );
  return selected.length ? selected.join(', ') : '—';
}

function formatRupee(value?: number): string {
  const amount = Number(value ?? 0);
  return amount > 0 ? `₹ ${amount.toLocaleString('en-IN')}` : '—';
}

function formatTextPreview(value?: string, maxLength = 180): string {
  const trimmed = value?.trim();
  if (!trimmed) return '—';
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}…`;
}

function formatListPreview(value?: string): string {
  const items = parseGlampingTextList(value ?? '');
  return items.length ? items.join(', ') : '—';
}

export type GlampingPreviewData = {
  title: string;
  description: string;
  totalCamps: number;
  adultsPerCamp: number;
  infantsPerCamp: number;
  location: string;
  meals: string;
  pricePerCampNight: string;
  extraAdultCharge: string;
  extraInfantCharge: string;
  aboutExperience: string;
  thingsToCarry: string;
  howToReach: string;
  inclusions: string;
  exclusions: string;
  whatsprovided: string;
  images: string[];
};

export function buildGlampingPreviewData(
  draft: VendorGlampingDraft | null,
  images: string[] = Array.isArray(draft?.images) ? draft.images : [],
): GlampingPreviewData {
  return {
    title: draft?.title?.trim() ?? '',
    description: draft?.description?.trim() ?? '',
    totalCamps: Number(draft?.totalCamps ?? 0),
    adultsPerCamp: Number(draft?.adultsPerCamp ?? 0),
    infantsPerCamp: Number(draft?.infantsPerCamp ?? 0),
    location: formatGlampingLocationPreview(draft?.locationJson),
    meals: formatGlampingMealPreview(draft?.mealPlanInclusions),
    pricePerCampNight: formatRupee(draft?.pricePerCampNight),
    extraAdultCharge: formatRupee(draft?.extraAdultCharge),
    extraInfantCharge: formatRupee(draft?.extraInfantCharge),
    aboutExperience: formatTextPreview(draft?.aboutExperience),
    thingsToCarry: formatTextPreview(draft?.thingsToCarry),
    howToReach: formatTextPreview(draft?.howToReach),
    inclusions: formatListPreview(draft?.inclusionsText),
    exclusions: formatListPreview(draft?.exclusionsText),
    whatsprovided: formatListPreview(draft?.whatsprovidedText),
    images,
  };
}
