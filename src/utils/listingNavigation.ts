import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import type { Listing } from '@/src/api/types';

export function listingDetailHref(
  tab: HomeCategoryTab,
  listing: Pick<Listing, 'id' | 'title' | 'price_start'>,
) {
  const price =
    listing.price_start != null
      ? `₹${Number(listing.price_start).toLocaleString('en-IN')}`
      : '';
  const params = {
    id: String(listing.id),
    title: listing.title ?? '',
    price,
    rating: '4.5',
  };

  if (tab === 'packages') return { pathname: '/package/[id]' as const, params };
  if (tab === 'glamping') return { pathname: '/glamping/[id]' as const, params };
  if (tab === 'activities') return { pathname: '/activity/[id]' as const, params };
  return { pathname: '/resort/[id]' as const, params };
}

export function getDirectImageUrl(url?: string | null) {
  if (!url) return null;
  const u = url.toLowerCase();
  if (!u.startsWith('http')) return null;
  if (u.includes('i.ibb.co/')) return url;
  if (
    u.endsWith('.jpg') ||
    u.endsWith('.jpeg') ||
    u.endsWith('.png') ||
    u.endsWith('.webp') ||
    u.endsWith('.gif')
  ) {
    return url;
  }
  return null;
}

export function getListingCarouselImages(
  media?: Array<{ media_type?: string; url?: string | null; sort_order?: number | null }>,
) {
  const imgs = (media ?? [])
    .filter((m) => m.media_type === 'image')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((m) => getDirectImageUrl(m.url))
    .filter(Boolean) as string[];
  return imgs;
}
