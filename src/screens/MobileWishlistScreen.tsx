import { Button, Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import type { WishlistListing } from '@/src/api/types';
import { LoginSheetModal } from '@/src/components/LoginSheetModal';
import { HomeCategoryTabs } from '@/src/components/home/HomeCategoryTabs';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { WishlistGridCard } from '@/src/components/wishlist/WishlistGridCard';
import { useRemoveWishlist } from '@/src/hooks/useRemoveWishlist';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { useWishlists } from '@/src/hooks/useWishlists';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WISHLIST_PAGE_SIZE = 50;
const GRID_GAP = 12;

function matchesCategory(listing: WishlistListing, tab: HomeCategoryTab) {
  const type = listing.category?.type ?? null;
  if (tab === 'packages') return type === 'package';
  if (tab === 'glamping') return type === 'camping';
  if (tab === 'activities') return type === 'activity';
  return type !== 'package' && type !== 'camping' && type !== 'activity';
}

function matchesSearch(listing: WishlistListing, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    listing.title.toLowerCase().includes(q) ||
    (listing.location?.toLowerCase().includes(q) ?? false) ||
    (listing.description?.toLowerCase().includes(q) ?? false)
  );
}

export function MobileWishlistScreen() {
  const { s } = useHomeScale();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<HomeCategoryTab>('hotels');
  const [searchQuery, setSearchQuery] = useState('');

  const contentPadding = s(16);
  const columnWidth = (width - contentPadding * 2 - GRID_GAP) / 2;

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

  const items = wishlistsRes?.data ?? [];
  const filteredItems = useMemo(
    () => items.filter((item) => matchesCategory(item, activeCategoryTab) && matchesSearch(item, searchQuery)),
    [items, activeCategoryTab, searchQuery],
  );

  const handleRemoveHeart = (wishlistId: string) => {
    removeWishlist(
      { wishlistId },
      {
        onError: (err) => {
          Alert.alert('Could not update wishlist', getErrorMessage(err));
        },
      },
    );
  };

  const goToListing = (listing: WishlistListing) => {
    const isPackage = listing.category?.type === 'package';
    const isGlamping = listing.category?.type === 'camping';
    const isActivity = listing.category?.type === 'activity';
    router.push({
      pathname: isPackage
        ? '/package/[id]'
        : isGlamping
          ? '/glamping/[id]'
          : isActivity
            ? '/activity/[id]'
            : '/resort/[id]',
      params: {
        id: listing.id,
        title: listing.title,
        price: listing.price_start
          ? `₹${Number(listing.price_start).toLocaleString('en-IN')}`
          : '',
        rating: '4.5',
      },
    });
  };

  const renderContent = () => {
    if (profileLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent.main} />
        </View>
      );
    }

    if (isUnauthorized) {
      return (
        <View style={[styles.stateWrap, { paddingHorizontal: contentPadding }]}>
          <Text style={[styles.stateTitle, { fontSize: s(18) }]}>{"You're not logged in"}</Text>
          <Text style={[styles.stateBody, { fontSize: s(14), marginTop: s(8), marginBottom: s(20) }]}>
            Log in to add stays and packages to your wishlist.
          </Text>
          <Button variant="primary" size="default" onPress={() => setLoginModalVisible(true)}>
            Log in
          </Button>
        </View>
      );
    }

    if (profileFetchError) {
      return (
        <View style={[styles.stateWrap, { paddingHorizontal: contentPadding }]}>
          <Text style={[styles.stateBody, { fontSize: s(14), marginBottom: s(16) }]}>
            {getErrorMessage(profileError!)}
          </Text>
          <Button variant="primary" size="default" onPress={() => refetchProfile()}>
            Try again
          </Button>
        </View>
      );
    }

    if (wishlistLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent.main} />
        </View>
      );
    }

    if (wishlistError) {
      return (
        <View style={[styles.stateWrap, { paddingHorizontal: contentPadding }]}>
          <Text style={[styles.stateBody, { fontSize: s(14), marginBottom: s(16) }]}>
            {getErrorMessage(wishlistError)}
          </Text>
          <Button variant="primary" size="default" onPress={() => refetchWishlists()}>
            Try again
          </Button>
        </View>
      );
    }

    if (canFetchWishlist && filteredItems.length === 0) {
      return (
        <View style={[styles.stateWrap, { paddingHorizontal: contentPadding }]}>
          <Text style={[styles.stateTitle, { fontSize: s(18) }]}>
            {items.length === 0 ? 'Added nothing' : 'No items in this category'}
          </Text>
          <Text style={[styles.stateBody, { fontSize: s(14), marginTop: s(8), marginBottom: s(20) }]}>
            {items.length === 0
              ? 'Explore Rooms, Trip packages, Glamping, and other activities.'
              : 'Try another category or search term.'}
          </Text>
          {items.length === 0 ? (
            <Button variant="primary" size="default" onPress={() => router.push('/(tabs)')}>
              Explore now
            </Button>
          ) : null}
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: contentPadding,
          paddingBottom: s(100),
          gap: GRID_GAP,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.grid}>
          {filteredItems.map((listing) => (
            <WishlistGridCard
              key={listing.wishlist_id}
              listing={listing}
              width={columnWidth}
              onPress={() => goToListing(listing)}
              onRemove={() => handleRemoveHeart(listing.wishlist_id)}
              removing={isRemoving}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: contentPadding, paddingTop: s(8), gap: s(16) }]}>
        <View style={[styles.headerRow, { gap: s(12) }]}>
          <Pressable
            style={[styles.backBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}
            onPress={() => router.replace('/(tabs)')}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={s(22)} color={colors.surface.white} />
          </Pressable>
          <Text style={[styles.headerTitle, { fontSize: s(24), lineHeight: s(32) }]}>Wishlist</Text>
        </View>

        <HomeCategoryTabs activeTab={activeCategoryTab} onTabChange={setActiveCategoryTab} />

        <View style={[styles.searchRow, { gap: s(8) }]}>
          <View
            style={[
              styles.searchPill,
              {
                borderRadius: s(9999),
                paddingHorizontal: s(16),
                minHeight: s(44),
              },
            ]}
          >
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search your bookings"
              placeholderTextColor="rgba(28, 32, 36, 0.4)"
              style={[styles.searchInput, { fontSize: s(14), lineHeight: s(20) }]}
              returnKeyType="search"
            />
            <Ionicons name="search" size={s(18)} color={colors.text.primary} />
          </View>

          <Pressable
            style={[styles.iconAction, { width: s(44), height: s(44), borderRadius: s(12) }]}
            accessibilityLabel="Filter"
          >
            <Ionicons name="filter-outline" size={s(18)} color={colors.accent.main} />
          </Pressable>
          <Pressable
            style={[styles.iconAction, { width: s(44), height: s(44), borderRadius: s(12) }]}
            accessibilityLabel="Sort"
          >
            <Ionicons name="reorder-three-outline" size={s(18)} color={colors.accent.main} />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      <LoginSheetModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onAuthenticated={async () => {
          await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
          await queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  header: {
    backgroundColor: colors.surface.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  iconAction: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GRID_GAP,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  stateTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  stateBody: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
