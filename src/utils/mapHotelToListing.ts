import type { Listing, ListingMedia, PublicHotel } from '@/src/api/types';

function hotelLocationLabel(hotel: PublicHotel): string {
  const loc = hotel.locationJson;
  if (!loc) return '';
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
  return loc.city ?? loc.searchLabel ?? loc.address ?? loc.streetAddress ?? '';
}

function hotelCoverMedia(hotel: PublicHotel): ListingMedia[] {
  if (!hotel.coverImage?.trim()) return [];
  return [
    {
      id: `${hotel.id}-cover`,
      listing_id: hotel.id,
      url: hotel.coverImage,
      media_type: 'image',
      sort_order: 0,
      created_at: hotel.createdAt ?? '',
      updated_at: hotel.updatedAt ?? '',
    },
  ];
}

function hotelPriceStart(hotel: PublicHotel): string | null {
  const meta = hotel.metaJson;
  if (!meta || typeof meta !== 'object') return null;
  const price = meta.price_start ?? meta.basePrice ?? meta.priceStart;
  if (price == null) return null;
  return String(price);
}

export function mapHotelToListing(hotel: PublicHotel): Listing {
  const vendorId = hotel.vendorId ?? hotel.vendor_id ?? '';
  const rating = hotel.avgRating ?? undefined;

  return {
    id: hotel.id,
    vendor_id: vendorId,
    category_id: 'hotel',
    title: hotel.title,
    description: hotel.description,
    location: hotelLocationLabel(hotel),
    price_start: hotelPriceStart(hotel),
    status: hotel.status,
    created_at: hotel.createdAt,
    updated_at: hotel.updatedAt,
    category: {
      id: 'hotel',
      name: 'Hotel',
      slug: 'hotel',
      type: 'hotel',
    },
    media: hotelCoverMedia(hotel),
    ...(rating != null ? { rating } : {}),
  } as Listing & { rating?: number };
}

export function mapHotelsToListings(hotels: PublicHotel[]): Listing[] {
  return hotels.map(mapHotelToListing);
}
