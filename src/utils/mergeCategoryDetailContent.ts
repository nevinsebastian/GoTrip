import { FIGMA_ACTIVITY_DETAIL } from '@/src/constants/activityDetailConstants';
import { FIGMA_GLAMPING_DETAIL } from '@/src/constants/glampingDetailConstants';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import type { CategoryDetailDisplay } from '@/src/utils/categoryDetailDisplay';

export function mergeActivityDetailContent(display?: CategoryDetailDisplay) {
  if (!display) return FIGMA_ACTIVITY_DETAIL;
  return {
    ...FIGMA_ACTIVITY_DETAIL,
    title: display.title,
    locationLabel: display.locationLabel,
    rating: display.rating,
    customersLabel: display.customersLabel ?? FIGMA_ACTIVITY_DETAIL.customersLabel,
    descriptionBlocks: display.description ? [display.description] : FIGMA_ACTIVITY_DETAIL.descriptionBlocks,
    provides: display.provides.length
      ? display.provides.map((p, i) => ({
          id: p.id,
          label: p.label,
          icon: (FIGMA_ACTIVITY_DETAIL.provides[i] as { icon?: string } | undefined)?.icon ?? 'checkmark-circle-outline',
        }))
      : FIGMA_ACTIVITY_DETAIL.provides,
    inclusions: display.inclusions.length ? display.inclusions : FIGMA_ACTIVITY_DETAIL.inclusions,
    exclusions: display.exclusions.length ? display.exclusions : FIGMA_ACTIVITY_DETAIL.exclusions,
    priceLabel: display.priceLabel,
    taxLabel: display.taxLabel,
    cancellationText: display.cancellationText ?? FIGMA_ACTIVITY_DETAIL.cancellationText,
    durationLabel: display.durationLabel ?? FIGMA_ACTIVITY_DETAIL.durationLabel,
  };
}

export function mergeGlampingDetailContent(display?: CategoryDetailDisplay) {
  if (!display) return FIGMA_GLAMPING_DETAIL;
  return {
    ...FIGMA_GLAMPING_DETAIL,
    title: display.title,
    locationLabel: display.locationLabel,
    rating: display.rating,
    customersLabel: display.customersLabel ?? FIGMA_GLAMPING_DETAIL.customersLabel,
    descriptionBlocks: display.description ? [display.description] : FIGMA_GLAMPING_DETAIL.descriptionBlocks,
    provides: display.provides.length
      ? display.provides.map((p, i) => ({
          id: p.id,
          label: p.label,
          icon: (FIGMA_GLAMPING_DETAIL.provides[i] as { icon?: string } | undefined)?.icon ?? 'leaf-outline',
        }))
      : FIGMA_GLAMPING_DETAIL.provides,
    inclusions: display.inclusions.length ? display.inclusions : FIGMA_GLAMPING_DETAIL.inclusions,
    exclusions: display.exclusions.length ? display.exclusions : FIGMA_GLAMPING_DETAIL.exclusions,
    priceLabel: display.priceLabel,
    taxLabel: display.taxLabel,
    cancellationText: display.cancellationText ?? FIGMA_GLAMPING_DETAIL.cancellationText,
    nightsLabel: display.durationLabel ?? FIGMA_GLAMPING_DETAIL.nightsLabel,
  };
}

export function mergePackageDetailContent(display?: CategoryDetailDisplay) {
  if (!display) return FIGMA_PACKAGE_DETAIL;
  return {
    ...FIGMA_PACKAGE_DETAIL,
    title: display.title,
    rating: display.rating,
    customersLabel: display.customersLabel ?? FIGMA_PACKAGE_DETAIL.customersLabel,
    description: display.description || FIGMA_PACKAGE_DETAIL.description,
    provides: display.provides.length
      ? display.provides.map((p, i) => ({
          id: p.id,
          label: p.label,
          icon: (FIGMA_PACKAGE_DETAIL.provides[i] as { icon?: string } | undefined)?.icon ?? 'checkmark-circle-outline',
        }))
      : FIGMA_PACKAGE_DETAIL.provides,
    priceLabel: display.priceLabel,
    taxLabel: display.taxLabel,
    cancellationText: display.cancellationText ?? FIGMA_PACKAGE_DETAIL.cancellationText,
    nightsLabel: display.durationLabel ?? FIGMA_PACKAGE_DETAIL.nightsLabel,
    nightsShort: display.durationLabel ?? FIGMA_PACKAGE_DETAIL.nightsShort,
  };
}

export function carouselImagesFromDisplay(
  display?: CategoryDetailDisplay,
  fallbackCount = 3,
): Array<{ uri: string } | number> {
  if (display?.carouselImages?.length) {
    return display.carouselImages.map((uri) => ({ uri }));
  }
  return Array.from({ length: fallbackCount }, (_, i) => i);
}

export function reviewsFromDisplay(display?: CategoryDetailDisplay) {
  if (!display?.reviews?.length) return null;
  return display.reviews.map((r) => ({
    id: r.id,
    name: r.name,
    ratingLabel: r.ratingLabel,
    text: r.text,
  }));
}
