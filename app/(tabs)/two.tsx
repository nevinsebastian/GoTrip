import { useResponsive } from '@/components/ui/useResponsive';
import { WishlistDesktopShell } from '@/src/components/WishlistDesktopShell';
import { MobileWishlistScreen } from '@/src/screens/MobileWishlistScreen';
import { useRemoveWishlist } from '@/src/hooks/useRemoveWishlist';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useWishlists } from '@/src/hooks/useWishlists';
import { useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';
import React from 'react';

const WISHLIST_PAGE_SIZE = 50;

export default function WishlistScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile();

  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const profileFetchError = Boolean(profileError && !isUnauthorized);
  const canFetchWishlist = Boolean(user) && !isUnauthorized && !profileFetchError;

  const {
    data: wishlistsRes,
    isLoading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlists,
  } = useWishlists({ page: 1, limit: WISHLIST_PAGE_SIZE }, canFetchWishlist);

  const { mutate: removeWishlist, isPending: isRemoving } = useRemoveWishlist();

  if (!isDesktopWeb) {
    return <MobileWishlistScreen />;
  }

  const items = wishlistsRes?.data ?? [];
  const totalFromApi = wishlistsRes?.meta?.total;
  const showWishlistCount =
    items.length > 0 || (typeof totalFromApi === 'number' && totalFromApi > 0);
  const itemCountLabel =
    typeof totalFromApi === 'number'
      ? `${totalFromApi} item${totalFromApi === 1 ? '' : 's'} added in wishlist`
      : `${items.length} item${items.length === 1 ? '' : 's'} added in wishlist`;

  return (
    <WishlistDesktopShell
      profileLoading={profileLoading}
      profileError={profileError}
      refetchProfile={refetchProfile}
      user={user}
      wishlistLoading={wishlistLoading}
      wishlistError={wishlistError}
      refetchWishlists={refetchWishlists}
      items={items}
      canFetchWishlist={canFetchWishlist}
      isUnauthorized={isUnauthorized}
      profileFetchError={profileFetchError}
      isRemoving={isRemoving}
      onRemoveHeart={(wishlistId) => removeWishlist({ wishlistId })}
      itemCountLabel={itemCountLabel}
      showWishlistCount={showWishlistCount}
      queryClient={queryClient}
    />
  );
}
