import BellIcon from '@/assets/images/bell.svg';
import { LoginSheetModal } from '@/src/components/LoginSheetModal';
import { Button, IconButton, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, shadows, spacing } from '@/constants/DesignTokens';
import type { ListingMedia, WishlistListing } from '@/src/api/types';
import { USER_PROFILE_QUERY_KEY } from '@/src/hooks/useUserProfile';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { wishlistsQueryKey, useWishlists } from '@/src/hooks/useWishlists';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FALLBACK_PLACEHOLDER = require('@/assets/images/resort.jpg');

function getPrimaryImage(media?: ListingMedia[]) {
  if (!media?.length) return null;
  const isDirectImageUrl = (url: string) => {
    const u = url.toLowerCase();
    if (!u.startsWith('http')) return false;
    return (
      u.includes('i.ibb.co/') ||
      u.endsWith('.jpg') ||
      u.endsWith('.jpeg') ||
      u.endsWith('.png') ||
      u.endsWith('.webp') ||
      u.endsWith('.gif') ||
      u.includes('cloudfront') ||
      u.includes('amazonaws.com') ||
      u.includes('cdn')
    );
  };

  const images = media.filter((m) => m.media_type === 'image' && !!m.url && isDirectImageUrl(m.url));
  const first = images.find((m) => m.sort_order === 0) ?? images[0];
  return first?.url ?? null;
}

function priceSuffix(listing: WishlistListing) {
  return listing.category?.type === 'package' ? '/person' : '/night';
}

function formatRating(listing: WishlistListing) {
  const r = listing.rating;
  if (typeof r === 'number' && Number.isFinite(r) && r > 0) return String(r);
  return '4.5';
}

export default function WishlistScreen() {
  const { width, isMobile, isTablet } = useResponsive();
  const queryClient = useQueryClient();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;
  const cardMaxWidth = Math.min(400, width * 0.9);
  const cardPadding = isMobile ? spacing['5'] : spacing['6'];
  const maxWidth = width >= 1024 ? 600 : undefined;

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
  } = useWishlists({ page: 1, limit: 20 }, canFetchWishlist);

  const items = wishlistsRes?.data ?? [];
  const visibleItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((l) => {
      const title = (l.title ?? '').toLowerCase();
      const loc = (l.location ?? '').toLowerCase();
      return title.includes(q) || loc.includes(q);
    });
  }, [items, searchQuery]);

  const showLoggedOut = !profileLoading && isUnauthorized;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.surface.lightPink, colors.surface.background]}
        style={styles.gradient}
      >
        <View
          style={[
            styles.header,
            { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
          ]}
        >
          <IconButton
            icon="chevron-back"
            size={isMobile ? 24 : 26}
            color={colors.primary}
            onPress={() => router.replace('/(tabs)')}
          />
          <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
            Your wishlist
          </Text>
          <Pressable style={styles.bellWrap} onPress={() => {}} accessibilityLabel="Notifications">
            <BellIcon width={bellIconSize} height={bellIconSize} />
          </Pressable>
        </View>

        {profileLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : showLoggedOut ? (
          <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
            <View style={[styles.card, { maxWidth: cardMaxWidth, padding: cardPadding }]}>
              <Text variant="heading2" style={styles.cardTitle}>
                {"You're not logged in"}
              </Text>
              <Text variant="body" style={styles.cardDescription}>
                Log in to add stays and packages to your wishlist.
              </Text>
              <Button
                variant="primary"
                size="default"
                onPress={() => setLoginModalVisible(true)}
                style={styles.exploreButton}
              >
                Log in
              </Button>
            </View>
          </View>
        ) : profileFetchError ? (
          <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
            <Text variant="body" style={styles.errorText}>
              {getErrorMessage(profileError!)}
            </Text>
            <Button variant="primary" size="default" onPress={() => refetchProfile()}>
              Try again
            </Button>
          </View>
        ) : wishlistLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : wishlistError ? (
          <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
            <Text variant="body" style={styles.errorText}>
              {getErrorMessage(wishlistError)}
            </Text>
            <Button variant="primary" size="default" onPress={() => refetchWishlists()}>
              Try again
            </Button>
          </View>
        ) : canFetchWishlist && items.length === 0 ? (
          <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
            <View style={[styles.card, { maxWidth: cardMaxWidth, padding: cardPadding }]}>
              <Text variant="heading2" style={styles.cardTitle}>
                Added nothing
              </Text>
              <Text variant="body" style={styles.cardDescription}>
                Explore Rooms, Trip packages, Glamping, and other activities.
              </Text>
              <Button
                variant="primary"
                size="default"
                onPress={() => router.push('/(tabs)')}
                style={styles.exploreButton}
              >
                Explore now
              </Button>
            </View>
          </View>
        ) : canFetchWishlist && items.length > 0 ? (
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.searchWrap,
                { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
              ]}
            >
              <Input
                variant="search"
                showSearchIcon
                placeholder="Search saved listings"
                placeholderTextColor={colors.text.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <Text variant="bodySemibold" style={styles.sectionLabel}>
                Saved for you
              </Text>

              {visibleItems.length === 0 ? (
                <Text variant="caption" style={styles.noMatch}>
                  No listings match your search.
                </Text>
              ) : (
                <View style={styles.list}>
                  {visibleItems.map((l) => {
                    const img = getPrimaryImage(l.media);
                    const priceNum = l.price_start != null ? Number(l.price_start) : NaN;
                    const priceLabel =
                      Number.isFinite(priceNum) && priceNum >= 0
                        ? `₹${priceNum.toLocaleString('en-IN')}${priceSuffix(l)}`
                        : '—';

                    return (
                      <Pressable
                        key={l.wishlist_id}
                        style={styles.wishCard}
                        onPress={() =>
                          router.push({ pathname: '/resort/[id]', params: { id: l.id } })
                        }
                        accessibilityLabel={l.title}
                      >
                        <View style={styles.wishImageWrap}>
                          {img ? (
                            <Image source={{ uri: img }} style={styles.wishImage} resizeMode="cover" />
                          ) : (
                            <Image
                              source={FALLBACK_PLACEHOLDER}
                              style={styles.wishImage}
                              resizeMode="cover"
                            />
                          )}
                          <View style={styles.heartBadge}>
                            <Ionicons name="heart" size={20} color={colors.surface.white} />
                          </View>
                        </View>
                        <Text variant="bodySemibold" numberOfLines={2} style={styles.wishTitle}>
                          {l.title}
                        </Text>
                        {l.location ? (
                          <View style={styles.locRow}>
                            <Ionicons name="location-outline" size={14} color={colors.text.caption} />
                            <Text variant="caption" numberOfLines={1} style={styles.locText}>
                              {l.location}
                            </Text>
                          </View>
                        ) : null}
                        <View style={styles.metaRow}>
                          <Text variant="caption" style={styles.priceText}>
                            {priceLabel}
                          </Text>
                          <View style={styles.ratingRow}>
                            <Ionicons name="star" size={12} color={colors.rating.star} />
                            <Text variant="caption" style={styles.ratingText}>
                              {formatRating(l)}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        ) : (
          <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
            <Text variant="body" style={styles.errorText}>
              Something went wrong loading your wishlist.
            </Text>
          </View>
        )}
      </LinearGradient>

      <LoginSheetModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onAuthenticated={async () => {
          await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
          await queryClient.invalidateQueries({ queryKey: wishlistsQueryKey({ page: 1, limit: 20 }) });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.lightPink,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3'],
    paddingBottom: spacing['3'],
    minHeight: 56,
  },
  headerTitle: {
    flex: 1,
    marginLeft: spacing['1'],
  },
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,32,0,0.03)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['6'],
  },
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: shadows.card,
      android: shadows.card,
      web: shadows.card,
    }),
  },
  cardTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  cardDescription: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['6'],
    paddingHorizontal: spacing['2'],
  },
  exploreButton: {
    width: '100%',
    minWidth: 160,
  },
  errorText: {
    color: colors.primaryAlt,
    textAlign: 'center',
    marginBottom: spacing['4'],
  },
  searchWrap: {
    marginBottom: spacing['3'],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['6'],
  },
  sectionLabel: {
    color: colors.text.primary,
    marginBottom: spacing['3'],
  },
  noMatch: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing['2'],
  },
  list: {
    gap: spacing['4'],
  },
  wishCard: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingBottom: spacing['3'],
    ...Platform.select({
      ios: shadows.card,
      android: shadows.card,
      web: shadows.card,
    }),
  },
  wishImageWrap: {
    width: '100%',
    height: 180,
    backgroundColor: colors.gray['2'],
    marginBottom: spacing['3'],
  },
  wishImage: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    top: spacing['3'],
    right: spacing['3'],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishTitle: {
    color: colors.text.primary,
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['1'],
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['2'],
  },
  locText: {
    flex: 1,
    color: colors.text.caption,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
  },
  priceText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.text.secondary,
  },
});
