import type {
  ActivityDetail,
  GlampingDetail,
  ListingReview,
  PackageDetail,
  PublicListingImage,
} from '@/src/api/types';
import {
  formatInr,
  getHotelCarouselImages,
  mapReviewToDisplay,
  resolveCancellationText,
  type HotelReviewDisplay,
} from '@/src/utils/hotelDetailHelpers';
import {
  itineraryActivities,
  packageBookingMode,
  packageEntityId,
  packageExclusions,
  packageInclusions,
  packageItineraries,
  packagePricePerPerson,
  packageTotalDays,
  packageTotalNights,
  packageWhatsProvided,
  packageBookCtaLabel,
  suggestedPackageTravelDates,
} from '@/src/utils/packageHelpers';
import type { CancellationPolicy } from '@/src/api/types';

export type PackageItineraryDisplay = {
  id: string;
  dayNumber: number;
  title: string;
  description?: string;
  activities: string[];
  mealsCovered: string[];
};

export type CategoryDetailDisplay = {
  title: string;
  locationLabel: string;
  rating: string;
  reviewCountLabel?: string;
  customersLabel?: string;
  description: string;
  priceLabel: string;
  taxLabel: string;
  durationLabel?: string;
  cancellationText?: string;
  carouselImages: string[];
  provides: Array<{ id: string; label: string }>;
  inclusions: string[];
  exclusions: string[];
  reviews: HotelReviewDisplay[];
  bookingMode?: 'direct' | 'enquiry_only';
  bookCtaLabel?: string;
  listingId?: string;
  packageEntityId?: string;
  totalDays?: number;
  totalNights?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  travelCheckIn?: string;
  travelCheckOut?: string;
  itineraries?: PackageItineraryDisplay[];
  /** @deprecated use travelCheckIn/travelCheckOut */
  departures?: Array<{ id: string; startDate: string; endDate: string; label: string }>;
};

function locationLabel(loc?: ActivityDetail['locationJson']): string {
  if (!loc) return '';
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
  return loc.city ?? loc.searchLabel ?? loc.address ?? loc.streetAddress ?? '';
}

function imagesFromListing(images?: PublicListingImage[] | null, cover?: string | null): string[] {
  return getHotelCarouselImages(
    images?.map((img) => ({ url: img.url, isCover: img.isCover, sortOrder: img.sortOrder })),
    cover,
  );
}

function ratingLabel(avg?: number | null, reviewCount?: number): { rating: string; customersLabel?: string } {
  const rating = avg != null ? String(avg) : '—';
  const customersLabel =
    reviewCount != null
      ? `${reviewCount} review${reviewCount === 1 ? '' : 's'}`
      : undefined;
  return { rating, customersLabel };
}

function mapProvides(items?: string[]): Array<{ id: string; label: string }> {
  return (items ?? []).map((label, index) => ({ id: String(index + 1), label }));
}

export function buildActivityDetailDisplay(
  activity: ActivityDetail,
  reviews: ListingReview[],
  policies: CancellationPolicy[],
): CategoryDetailDisplay {
  const { rating, customersLabel } = ratingLabel(activity.avgRating, activity.reviewCount);
  const price =
    activity.basePriceAdult != null ? `${formatInr(activity.basePriceAdult)}/person` : '—';
  const duration =
    activity.slots?.[0]?.durationMinutes != null
      ? `${activity.slots[0].durationMinutes} min`
      : undefined;

  return {
    title: activity.title,
    locationLabel: locationLabel(activity.locationJson),
    rating,
    customersLabel,
    description: activity.aboutExperience ?? activity.description ?? '',
    priceLabel: price,
    taxLabel: 'Including taxes',
    durationLabel: duration,
    cancellationText: resolveCancellationText(activity.cancellationPolicyId, policies),
    carouselImages: imagesFromListing(activity.images, activity.coverImage),
    provides: mapProvides(activity.whatsprovided),
    inclusions: activity.inclusions ?? [],
    exclusions: activity.exclusions ?? [],
    reviews: reviews.map(mapReviewToDisplay),
    bookingMode: 'direct',
  };
}

export function buildGlampingDetailDisplay(
  glamping: GlampingDetail,
  reviews: ListingReview[],
  policies: CancellationPolicy[],
): CategoryDetailDisplay {
  const { rating, customersLabel } = ratingLabel(glamping.avgRating, glamping.reviewCount);
  const price =
    glamping.pricePerCampNight != null
      ? `${formatInr(glamping.pricePerCampNight)}/night`
      : '—';

  return {
    title: glamping.title,
    locationLabel: locationLabel(glamping.locationJson),
    rating,
    customersLabel,
    description: glamping.aboutExperience ?? glamping.description ?? '',
    priceLabel: price,
    taxLabel: 'Including taxes',
    durationLabel: 'Per night',
    cancellationText: resolveCancellationText(glamping.cancellationPolicyId, policies),
    carouselImages: imagesFromListing(glamping.images, glamping.coverImage),
    provides: mapProvides(glamping.whatsprovided),
    inclusions: glamping.inclusions ?? [],
    exclusions: glamping.exclusions ?? [],
    reviews: reviews.map(mapReviewToDisplay),
    bookingMode: 'direct',
  };
}

export function buildPackageDetailDisplay(
  pkg: PackageDetail,
  reviews: ListingReview[],
  policies: CancellationPolicy[],
): CategoryDetailDisplay {
  const { rating, customersLabel } = ratingLabel(pkg.avgRating, pkg.reviewCount);
  const priceVal = packagePricePerPerson(pkg);
  const price = priceVal != null ? `${formatInr(priceVal)}/person` : '—';
  const nights = packageTotalNights(pkg);
  const days = packageTotalDays(pkg);
  const mode = packageBookingMode(pkg);
  const travel = suggestedPackageTravelDates(pkg);
  const product = pkg.package;

  return {
    title: pkg.title,
    locationLabel: locationLabel(pkg.locationJson),
    rating,
    customersLabel,
    description: pkg.description ?? '',
    priceLabel: price,
    taxLabel: 'Including taxes',
    durationLabel:
      nights != null
        ? `${nights} night${nights === 1 ? '' : 's'}`
        : days != null
          ? `${days} day${days === 1 ? '' : 's'}`
          : undefined,
    cancellationText: resolveCancellationText(pkg.cancellationPolicyId, policies),
    carouselImages: imagesFromListing(pkg.images, pkg.coverImage),
    provides: mapProvides(packageWhatsProvided(pkg)),
    inclusions: packageInclusions(pkg),
    exclusions: packageExclusions(pkg),
    reviews: reviews.map(mapReviewToDisplay),
    bookingMode: mode,
    bookCtaLabel: packageBookCtaLabel(mode),
    listingId: pkg.id,
    packageEntityId: packageEntityId(pkg),
    totalDays: days,
    totalNights: nights,
    minGroupSize: product?.minGroupSize,
    maxGroupSize: product?.maxGroupSize,
    travelCheckIn: travel.checkIn,
    travelCheckOut: travel.checkOut,
    itineraries: packageItineraries(pkg).map((day) => ({
      id: day.id ?? `day-${day.dayNumber}`,
      dayNumber: day.dayNumber,
      title: day.title,
      description: day.description,
      activities: itineraryActivities(day),
      mealsCovered: day.mealsCovered ?? [],
    })),
  };
}
