import type { Listing, VendorListingApiStatus } from '@/src/api/types';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { VENDOR_LISTING_CATEGORIES } from '@/src/constants/vendorOnboardingConstants';
import type {
  VendorListingAmenity,
  VendorListingCardData,
  VendorListingCardTheme,
} from '@/src/constants/vendorListingsConstants';
import { getPrimaryImage } from '@/src/utils/getPrimaryImage';
import type { ImageSourcePropType } from 'react-native';

const DEFAULT_HOST_AVATAR = require('../../loginimage.png');

const CATEGORY_THEME: Record<VendorListingCategoryId, VendorListingCardTheme> = {
  property: 'blue',
  packages: 'maroon',
  glamping: 'green',
  activities: 'blue',
};

const CATEGORY_TYPE_LABEL: Record<VendorListingCategoryId, string> = {
  property: 'Property',
  packages: 'Package',
  glamping: 'Glamping',
  activities: 'Activity',
};

const CATEGORY_REF_PREFIX: Record<VendorListingCategoryId, string> = {
  property: 'P',
  packages: 'PK',
  glamping: 'G',
  activities: 'A',
};

function formatListingPrice(price?: string | null): string {
  if (!price?.trim()) return '—';
  const amount = Number(price);
  if (Number.isFinite(amount)) {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  }
  return `₹ ${price}`;
}

function amenityIconFor(label: string): VendorListingAmenity['icon'] {
  const value = label.toLowerCase();
  if (value.includes('wifi')) return 'wifi-outline';
  if (value.includes('park') || value.includes('car')) return 'car-outline';
  if (value.includes('air') || value.includes('condition')) return 'snow-outline';
  if (value.includes('breakfast') || value.includes('cafe') || value.includes('meal')) {
    return 'cafe-outline';
  }
  if (value.includes('flight') || value.includes('airport')) return 'airplane-outline';
  if (value.includes('service') || value.includes('hour')) return 'time-outline';
  return 'leaf-outline';
}

export function vendorCategoryIdFromListing(listing: Listing): VendorListingCategoryId {
  const slug = listing.category?.slug?.toLowerCase() ?? '';
  const type = listing.category?.type?.toLowerCase() ?? '';

  if (slug.includes('hotel') || type === 'hotel') return 'property';
  if (slug.includes('package') || type === 'package') return 'packages';
  if (slug.includes('glamp') || slug.includes('camp') || type === 'camping') return 'glamping';
  if (slug.includes('activ') || type === 'activity') return 'activities';
  return 'property';
}

function categoryFallbackImage(categoryId: VendorListingCategoryId): number {
  const match = VENDOR_LISTING_CATEGORIES.find((item) => item.id === categoryId);
  return match?.thumbnail ?? VENDOR_LISTING_CATEGORIES[0].thumbnail;
}

function listingRefFromId(id: string, categoryId: VendorListingCategoryId): string {
  const compact = id.replace(/-/g, '').slice(0, 5).toUpperCase();
  return `${CATEGORY_REF_PREFIX[categoryId]}${compact}`;
}

function normalizeStatus(status?: string | null): VendorListingApiStatus | undefined {
  if (
    status === 'draft' ||
    status === 'pending_approval' ||
    status === 'active' ||
    status === 'suspended' ||
    status === 'archived'
  ) {
    return status;
  }
  return undefined;
}

function buildImageSource(
  listing: Listing,
  categoryId: VendorListingCategoryId,
): ImageSourcePropType {
  const remoteUrl = getPrimaryImage(listing.media);
  if (remoteUrl) return { uri: remoteUrl };
  return categoryFallbackImage(categoryId);
}

function buildAmenities(listing: Listing): VendorListingAmenity[] {
  const labels = (listing.amenities ?? []).filter(Boolean).slice(0, 4);
  if (!labels.length) {
    return [{ id: 'default', label: 'Amenities on request', icon: 'leaf-outline' }];
  }
  return labels.map((label, index) => ({
    id: `${index}-${label}`,
    label,
    icon: amenityIconFor(label),
  }));
}

export function mapVendorListingToCard(
  listing: Listing,
  options?: { hostName?: string; hostAvatar?: ImageSourcePropType },
): VendorListingCardData {
  const categoryId = vendorCategoryIdFromListing(listing);
  const priceDisplay = formatListingPrice(listing.price_start);
  const title = listing.title?.trim() || 'Untitled listing';
  const locationPill = listing.location?.trim() || 'Location not set';
  const hostName = options?.hostName?.trim() || 'Vendor';

  return {
    id: listing.id,
    categoryId,
    listingRef: listingRefFromId(listing.id, categoryId),
    typeLabel: CATEGORY_TYPE_LABEL[categoryId],
    locationPill,
    description: listing.description?.trim() || title,
    hostName,
    hostAvatar: options?.hostAvatar ?? DEFAULT_HOST_AVATAR,
    image: buildImageSource(listing, categoryId),
    amenities: buildAmenities(listing),
    priceDisplay,
    priceRowLabel: 'Total price for one night',
    priceAmount: priceDisplay,
    priceTaxNote: 'including tax',
    theme: CATEGORY_THEME[categoryId],
    cardTitle: title,
    status: normalizeStatus(listing.status),
  };
}
