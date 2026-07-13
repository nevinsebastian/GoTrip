import type { SearchType, SuggestionListing } from '@/src/api/types';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';

export function homeTabToSearchType(tab: HomeCategoryTab): SearchType {
  switch (tab) {
    case 'hotels':
      return 'hotel';
    case 'packages':
      return 'package';
    case 'glamping':
      return 'glamping';
    case 'activities':
      return 'activity';
  }
}

export function searchListingPath(category: SearchType, id: string) {
  switch (category) {
    case 'hotel':
      return { pathname: '/hotels/[id]' as const, params: { id } };
    case 'package':
      return { pathname: '/package/[id]' as const, params: { id } };
    case 'activity':
      return { pathname: '/activity/[id]' as const, params: { id } };
    case 'glamping':
      return { pathname: '/glamping/[id]' as const, params: { id } };
  }
}

export function suggestionListingPath(listing: Pick<SuggestionListing, 'id' | 'category'>) {
  return searchListingPath(listing.category, listing.id);
}

export function formatSuggestionLocation(city: string, state?: string | null) {
  return state ? `${city}, ${state}` : city;
}
