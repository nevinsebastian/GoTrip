import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchMyWishlists,
  type BrowseWishlistsParams,
} from '../api/wishlist.service';
import type { APIError, WishlistsResponse } from '../api/types';

export const wishlistsQueryKey = (params: BrowseWishlistsParams) =>
  ['wishlists', params] as const;

export function useWishlists(
  params: BrowseWishlistsParams = {},
  enabled = true,
): UseQueryResult<WishlistsResponse, APIError> {
  return useQuery<WishlistsResponse, APIError>({
    queryKey: wishlistsQueryKey(params),
    queryFn: () => fetchMyWishlists(params),
    enabled,
    staleTime: 60 * 1000,
  });
}
