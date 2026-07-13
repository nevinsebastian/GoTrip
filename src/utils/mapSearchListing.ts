import type { Listing, ListingMedia, SearchListing, SearchType } from '@/src/api/types';

function locationLabel(loc?: SearchListing['locationJson']): string {
  if (!loc) return '';
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
  return loc.city ?? loc.searchLabel ?? loc.address ?? loc.streetAddress ?? '';
}

function coverMedia(item: SearchListing): ListingMedia[] {
  const url = item.coverImage?.trim();
  if (!url) return [];
  return [
    {
      id: `${item.id}-cover`,
      listing_id: item.id,
      url,
      media_type: 'image',
      sort_order: 0,
      created_at: '',
      updated_at: '',
    },
  ];
}

function categoryForType(type: SearchType) {
  switch (type) {
    case 'hotel':
      return { id: 'hotel', name: 'Hotel', slug: 'hotel', type: 'hotel' as const };
    case 'package':
      return { id: 'package', name: 'Package', slug: 'package', type: 'package' as const };
    case 'activity':
      return { id: 'activity', name: 'Activity', slug: 'activity', type: 'activity' as const };
    case 'glamping':
      return { id: 'camping', name: 'Glamping', slug: 'glamping', type: 'camping' as const };
  }
}

function priceFromSearchListing(item: SearchListing): string | null {
  switch (item.category) {
    case 'hotel': {
      const hp = item.hotelProperty as { pricePerNight?: number; basePrice?: number } | undefined;
      const val = hp?.pricePerNight ?? hp?.basePrice;
      return val != null ? String(val) : null;
    }
    case 'package': {
      const pkg = item.package as { pricePerPerson?: number } | undefined;
      return pkg?.pricePerPerson != null ? String(pkg.pricePerPerson) : null;
    }
    case 'activity': {
      const act = item.activity as { basePriceAdult?: number } | undefined;
      return act?.basePriceAdult != null ? String(act.basePriceAdult) : null;
    }
    case 'glamping': {
      const site = item.glampingSite as { pricePerCampNight?: number } | undefined;
      return site?.pricePerCampNight != null ? String(site.pricePerCampNight) : null;
    }
    default:
      return null;
  }
}

export function mapSearchListingToListing(item: SearchListing): Listing {
  const rating = item.avgRating ?? undefined;
  return {
    id: item.id,
    vendor_id: '',
    category_id: categoryForType(item.category).id,
    title: item.title,
    description: item.description,
    location: locationLabel(item.locationJson),
    price_start: priceFromSearchListing(item),
    status: 'active',
    category: categoryForType(item.category),
    media: coverMedia(item),
    ...(rating != null ? { rating } : {}),
  } as Listing & { rating?: number };
}

export function mapSearchListingsToListings(items: SearchListing[]): Listing[] {
  return items.map(mapSearchListingToListing);
}

export type HotelSearchResultFilter = {
  starRatingMin?: number;
  starRatingMax?: number;
};

export function filterHotelSearchListings(
  items: SearchListing[],
  criteria: HotelSearchResultFilter = {},
): SearchListing[] {
  const { starRatingMin, starRatingMax } = criteria;
  if (starRatingMin == null && starRatingMax == null) return items;

  return items.filter((item) => {
    if (item.category !== 'hotel') return true;
    const stars = (item.hotelProperty as { starRating?: number } | undefined)?.starRating;
    if (stars == null) return true;
    if (starRatingMin != null && stars < starRatingMin) return false;
    if (starRatingMax != null && stars > starRatingMax) return false;
    return true;
  });
}
