import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeWishlistItem } from '../api/wishlist.service';
import type { APIError } from '../api/types';

export function useRemoveWishlist() {
  const queryClient = useQueryClient();

  return useMutation<void, APIError, { wishlistId: string }>({
    mutationFn: ({ wishlistId }) => removeWishlistItem(wishlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}
