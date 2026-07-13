import type {
  PackageDetail,
  PackageItineraryDay,
  PackageProductInfo,
  PublicPackage,
} from '@/src/api/types';

export function getPackageProduct(item: PublicPackage | PackageDetail): PackageProductInfo | undefined {
  return item.package;
}

export function packagePricePerPerson(item: PublicPackage | PackageDetail): number | undefined {
  return getPackageProduct(item)?.pricePerPerson ?? item.pricePerPerson;
}

export function packageBookingMode(item: PublicPackage | PackageDetail): 'direct' | 'enquiry_only' {
  return getPackageProduct(item)?.bookingMode ?? item.bookingMode ?? 'enquiry_only';
}

export function packageEntityId(item: PublicPackage | PackageDetail): string | undefined {
  return getPackageProduct(item)?.id;
}

export function packageItineraries(item: PublicPackage | PackageDetail): PackageItineraryDay[] {
  const fromProduct = getPackageProduct(item)?.itineraries;
  if (fromProduct?.length) return fromProduct;
  return item.itineraries ?? [];
}

export function packageInclusions(item: PublicPackage | PackageDetail): string[] {
  return getPackageProduct(item)?.inclusions ?? item.inclusions ?? [];
}

export function packageExclusions(item: PublicPackage | PackageDetail): string[] {
  return getPackageProduct(item)?.exclusions ?? item.exclusions ?? [];
}

export function packageWhatsProvided(item: PublicPackage | PackageDetail): string[] {
  return getPackageProduct(item)?.whatsprovided ?? item.whatsprovided ?? [];
}

export function packageTotalNights(item: PublicPackage | PackageDetail): number | undefined {
  return getPackageProduct(item)?.totalNights ?? item.totalNights ?? getPackageProduct(item)?.totalDays ?? item.totalDays;
}

export function packageTotalDays(item: PublicPackage | PackageDetail): number | undefined {
  return getPackageProduct(item)?.totalDays ?? item.totalDays;
}

export function itineraryActivities(day: PackageItineraryDay): string[] {
  if (day.activitiesJson?.length) return day.activitiesJson;
  return day.activities ?? [];
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Suggested travel window when package has no fixed departures. */
export function suggestedPackageTravelDates(
  item: PublicPackage | PackageDetail,
  travelDate?: string,
): { checkIn: string; checkOut: string } {
  const nights = packageTotalNights(item) ?? packageTotalDays(item) ?? 4;
  const checkIn = travelDate ?? addDays(new Date().toISOString().slice(0, 10), 30);
  const checkOut = addDays(checkIn, Math.max(1, nights));
  return { checkIn, checkOut };
}

export function packageBookCtaLabel(mode: 'direct' | 'enquiry_only'): string {
  return mode === 'direct' ? 'Book Now' : 'Send Enquiry';
}
