import type {
  Listing,
  ListingMedia,
  PublicActivity,
  PublicGlamping,
  PublicPackage,
  PublicListingBase,
} from '@/src/api/types';
import { packagePricePerPerson } from '@/src/utils/packageHelpers';

function locationLabelFromJson(loc?: PublicListingBase['locationJson']): string {
  if (!loc) return '';
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
  return loc.city ?? loc.searchLabel ?? loc.address ?? loc.streetAddress ?? '';
}

function coverMedia(item: PublicListingBase): ListingMedia[] {
  const images = item.images ?? [];
  const sorted = [...images].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(b.isCover) - Number(a.isCover),
  );
  const url = sorted[0]?.url ?? item.coverImage;
  if (!url?.trim()) return [];
  return [
    {
      id: `${item.id}-cover`,
      listing_id: item.id,
      url,
      media_type: 'image',
      sort_order: 0,
      created_at: item.createdAt ?? '',
      updated_at: item.updatedAt ?? '',
    },
  ];
}

function priceFromMeta(item: PublicListingBase): string | null {
  const meta = item.metaJson;
  if (meta && typeof meta === 'object') {
    const price = meta.price_start ?? meta.basePrice ?? meta.priceStart;
    if (price != null) return String(price);
  }
  return null;
}

function baseListing(
  item: PublicListingBase,
  category: { id: string; name: string; slug: string; type: string },
  priceStart: string | null,
): Listing {
  const vendorId = item.vendorId ?? item.vendor_id ?? '';
  const rating = item.avgRating ?? undefined;
  return {
    id: item.id,
    vendor_id: vendorId,
    category_id: category.id,
    title: item.title,
    description: item.description,
    location: locationLabelFromJson(item.locationJson),
    price_start: priceStart,
    status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    category,
    media: coverMedia(item),
    ...(rating != null ? { rating } : {}),
  } as Listing & { rating?: number };
}

export function mapActivityToListing(activity: PublicActivity): Listing {
  const price =
    activity.basePriceAdult != null
      ? String(activity.basePriceAdult)
      : priceFromMeta(activity);
  return baseListing(
    activity,
    { id: 'activity', name: 'Activity', slug: 'activity', type: 'activity' },
    price,
  );
}

export function mapGlampingToListing(glamping: PublicGlamping): Listing {
  const price =
    glamping.pricePerCampNight != null
      ? String(glamping.pricePerCampNight)
      : priceFromMeta(glamping);
  return baseListing(
    glamping,
    { id: 'camping', name: 'Glamping', slug: 'glamping', type: 'camping' },
    price,
  );
}

export function mapPackageToListing(pkg: PublicPackage): Listing {
  const priceVal = packagePricePerPerson(pkg);
  const price = priceVal != null ? String(priceVal) : priceFromMeta(pkg);
  return baseListing(
    pkg,
    { id: 'package', name: 'Package', slug: 'package', type: 'package' },
    price,
  );
}

export function mapActivitiesToListings(items: PublicActivity[]): Listing[] {
  return items.map(mapActivityToListing);
}

export function mapGlampingToListings(items: PublicGlamping[]): Listing[] {
  return items.map(mapGlampingToListing);
}

export function mapPackagesToListings(items: PublicPackage[]): Listing[] {
  return items.map(mapPackageToListing);
}
