import type { VendorListingCardData } from '@/src/constants/vendorListingsConstants';

export function formatListingPriceDisplay(value: number): string {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function applyListingPriceOverride(
  listing: VendorListingCardData,
  price: number,
): VendorListingCardData {
  const formatted = formatListingPriceDisplay(price);
  return {
    ...listing,
    priceDisplay: formatted,
    priceAmount: formatted,
  };
}

export function applyListingPriceOverrides(
  listings: VendorListingCardData[],
  overrides: Record<string, number>,
): VendorListingCardData[] {
  if (!Object.keys(overrides).length) return listings;
  return listings.map((listing) => {
    const price = overrides[listing.id];
    return price != null ? applyListingPriceOverride(listing, price) : listing;
  });
}
