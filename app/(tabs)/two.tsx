import BellIcon from '@/assets/images/bell.svg';
import { Button, IconButton, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, shadows, spacing } from '@/constants/DesignTokens';
import type { ListingMedia, WishlistListing } from '@/src/api/types';
import { LoginSheetModal } from '@/src/components/LoginSheetModal';
import { useRemoveWishlist } from '@/src/hooks/useRemoveWishlist';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { useWishlists } from '@/src/hooks/useWishlists';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FALLBACK_PLACEHOLDER = require('@/assets/images/resort.jpg');
const GRID_GAP = spacing['3'];
const WISHLIST_PAGE_SIZE = 50;

/** Full-screen gradient — matches Tickets / Packages (Figma wishlist). */
const GRADIENT_TOP = '#FCFCFC';
const GRADIENT_BOTTOM = '#FFDCD3';
const SCREEN_TINT = '#FFF8F6';

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
  } = useWishlists(
    { page: 1, limit: WISHLIST_PAGE_SIZE },
    canFetchWishlist,
  );

  const { mutate: removeWishlist, isPending: isRemoving } = useRemoveWishlist();

  const items = wishlistsRes?.data ?? [];
  const totalFromApi = wishlistsRes?.meta?.total;
  const showWishlistCount =
    items.length > 0 || (typeof totalFromApi === 'number' && totalFromApi > 0);
  const itemCountLabel =
    typeof totalFromApi === 'number'
      ? `${totalFromApi} item${totalFromApi === 1 ? '' : 's'} added in wishlist`
      : `${items.length} item${items.length === 1 ? '' : 's'} added in wishlist`;

  /** White sheet has marginHorizontal + ScrollView paddingHorizontal — grid spans inner width */
  const sheetOuterWidth = maxWidth
    ? Math.min(maxWidth, width - 2 * contentPadding)
    : width - 2 * contentPadding;
  const gridInnerWidth = sheetOuterWidth - 2 * contentPadding;
  const columnWidth = (gridInnerWidth - GRID_GAP) / 2;

  const showLoggedOut = !profileLoading && isUnauthorized;

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

  const headerBlock = (
    <View
      style={[
        styles.headerBlock,
        { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
      ]}
    >
      <View style={styles.headerTopRow}>
        <IconButton
          icon="chevron-back"
          size={isMobile ? 24 : 26}
          color={colors.primary}
          onPress={() => router.replace('/(tabs)')}
        />
        <Pressable style={styles.bellWrap} onPress={() => {}} accessibilityLabel="Notifications">
          <BellIcon width={bellIconSize} height={bellIconSize} />
        </Pressable>
      </View>
      <View style={styles.headerTextColumn}>
        <Text variant="header" color="primaryBrand" style={styles.headerMainTitle}>
          Your wishlist
        </Text>
        {showWishlistCount ? (
          <Text variant="caption" style={styles.headerSubtitle}>
            {itemCountLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: SCREEN_TINT }]} edges={['top']}>
      <View style={styles.screenFill}>
        <View style={styles.bgWrap} pointerEvents="none">
          <LinearGradient
            colors={[GRADIENT_TOP, GRADIENT_BOTTOM]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.bgGradient}
          />
        </View>

        {headerBlock}

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
          <View
            style={[
              styles.whiteSheet,
              { marginHorizontal: contentPadding },
              maxWidth
                ? {
                    alignSelf: 'center',
                    width: Math.min(maxWidth, width - 2 * contentPadding),
                  }
                : null,
            ]}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.grid}>
                {items.map((l) => {
                  const img = getPrimaryImage(l.media);
                  const priceNum = l.price_start != null ? Number(l.price_start) : NaN;
                  const priceLabel =
                    Number.isFinite(priceNum) && priceNum >= 0
                      ? `₹${priceNum.toLocaleString('en-IN')}${priceSuffix(l)}`
                      : '—';

                  const goToListing = () =>
                    router.push({ pathname: '/resort/[id]', params: { id: l.id } });

                  return (
                    <View key={l.wishlist_id} style={[styles.gridCell, { width: columnWidth }]}>
                      <View style={styles.wishCard}>
                        <View style={styles.imageShadowWrap}>
                          <View style={styles.imageClip}>
                            <Pressable
                              onPress={goToListing}
                              style={styles.imagePressable}
                              accessibilityLabel={l.title}
                              accessibilityRole="imagebutton"
                            >
                              {img ? (
                                <Image
                                  source={{ uri: img }}
                                  style={styles.wishImage}
                                  resizeMode="cover"
                                />
                              ) : (
                                <Image
                                  source={FALLBACK_PLACEHOLDER}
                                  style={styles.wishImage}
                                  resizeMode="cover"
                                />
                              )}
                            </Pressable>
                          </View>
                          <Pressable
                            style={({ pressed }) => [
                              styles.heartSquare,
                              pressed && styles.heartSquarePressed,
                              isRemoving && styles.heartSquareDisabled,
                            ]}
                            onPress={() => handleRemoveHeart(l.wishlist_id)}
                            disabled={isRemoving}
                            hitSlop={8}
                            accessibilityLabel="Remove from wishlist"
                          >
                            <Ionicons name="heart" size={18} color={colors.primary} />
                          </Pressable>
                        </View>

                        <View style={styles.wishCardBody}>
                          <Pressable onPress={goToListing} accessibilityRole="button" style={styles.wishCardPress}>
                            <Text variant="bodySemibold" numberOfLines={2} style={styles.wishTitle}>
                              {l.title}
                            </Text>
                            <View style={styles.metaRow}>
                              <Text variant="caption" style={styles.priceText}>
                                {priceLabel}
                              </Text>
                              <View style={styles.ratingRow}>
                                <Ionicons
                                  name="star-outline"
                                  size={12}
                                  color={colors.text.caption}
                                />
                                <Text variant="caption" style={styles.ratingText}>
                                  {formatRating(l)}
                                </Text>
                              </View>
                            </View>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={{ height: 28 }} />
            </ScrollView>
          </View>
        ) : (
          <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
            <Text variant="body" style={styles.errorText}>
              Something went wrong loading your wishlist.
            </Text>
          </View>
        )}
      </View>

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
  },
  screenFill: {
    flex: 1,
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerBlock: {
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['4'],
  },
  headerTextColumn: {
    alignItems: 'flex-start',
  },
  headerMainTitle: {
    textAlign: 'left',
  },
  headerSubtitle: {
    marginTop: spacing['1'],
    color: colors.text.caption,
    textAlign: 'left',
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
  whiteSheet: {
    flex: 1,
    minHeight: 200,
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: borderRadius['4xl'],
    borderTopRightRadius: borderRadius['4xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
      web: {
        boxShadow: '0 -4px 24px rgba(0, 9, 50, 0.08)',
      },
    }),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing['5'],
    paddingBottom: spacing['6'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GRID_GAP,
  },
  gridCell: {
    marginBottom: 0,
  },
  wishCard: {
    width: '100%',
  },
  /** Shadow lives here; inner `imageClip` clips the photo so the shadow is not cut off. */
  imageShadowWrap: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0, 9, 50, 0.12)',
      },
    }),
  },
  imageClip: {
    width: '100%',
    aspectRatio: 1.12,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  imagePressable: {
    ...StyleSheet.absoluteFillObject,
  },
  wishImage: {
    width: '100%',
    height: '100%',
  },
  heartSquare: {
    position: 'absolute',
    top: spacing['2'],
    right: spacing['2'],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
    }),
  },
  heartSquarePressed: {
    opacity: 0.85,
  },
  heartSquareDisabled: {
    opacity: 0.5,
  },
  wishCardBody: {
    width: '100%',
    marginTop: spacing['2'],
  },
  wishCardPress: {
    width: '100%',
  },
  wishTitle: {
    color: colors.text.primary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: spacing['3'],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceText: {
    flex: 1,
    flexShrink: 1,
    marginRight: spacing['2'],
    color: colors.text.secondary,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  ratingText: {
    color: colors.text.secondary,
  },
});
