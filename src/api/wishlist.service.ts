import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { WishlistsResponse } from './types';

export type BrowseWishlistsParams = {
  page?: number;
  limit?: number;
};

export async function fetchMyWishlists(
  params: BrowseWishlistsParams = {},
): Promise<WishlistsResponse> {
  const response = await apiClient.get<WishlistsResponse>(ENDPOINTS.wishlists.mine, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  });
  return response.data;
}

export async function removeWishlistItem(wishlistId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.wishlists.item(wishlistId));
}
