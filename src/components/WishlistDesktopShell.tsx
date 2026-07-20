/**
 * Desktop web-only wishlist (Figma node 197:2448).
 * Not used on native iOS/Android or on mobile web — parent gates with Platform.OS === 'web' && isDesktop.
 */

import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import ChipActivitiesIcon from '@/assets/images/wishlist-desktop-figma/chip-activities.svg';
import ChipGlampingIcon from '@/assets/images/wishlist-desktop-figma/chip-glamping.svg';
import ChipHotelIcon from '@/assets/images/wishlist-desktop-figma/chip-hotel.svg';
import ChipPackageIcon from '@/assets/images/wishlist-desktop-figma/chip-package.svg';
import FilterIcon from '@/assets/images/wishlist-desktop-figma/filter-icon.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import HeartIcon from '@/assets/images/heart.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import { Button, Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import type { CategoryType, ListingMedia, User, WishlistListing } from '@/src/api/types';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { USER_PROFILE_QUERY_KEY } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { listingDetailHref } from '@/src/utils/listingNavigation';
import type { QueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';

import { DESKTOP_WEB_IMAGES } from '@/src/constants/desktopHomeConstants';
const FALLBACK_PLACEHOLDER = RESORT_PLACEHOLDER_IMAGE;

const COLUMNS = 5;
/** Match home desktop horizontal rhythm (`stylesWeb.container`). */
const PAGE_PAD = 16;
/** Figma wishlist cards ~225px; home desktop cards use 280 — cap so slots never become ultra-wide strips. */
const CARD_MAX_WIDTH = 280;
const CARD_IMAGE_ASPECT = 225 / 163;

const CHIPS: { type: CategoryType; label: string; Icon: React.ComponentType<{ width?: number; height?: number }> }[] =
  [
    { type: 'hotel', label: 'Hotels', Icon: ChipHotelIcon },
    { type: 'package', label: 'Packages', Icon: ChipPackageIcon },
    { type: 'camping', label: 'Glamping', Icon: ChipGlampingIcon },
    { type: 'activity', label: 'Activities', Icon: ChipActivitiesIcon },
  ];

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

export type WishlistDesktopShellProps = {
  profileLoading: boolean;
  profileError: unknown;
  refetchProfile: () => void;
  user: User | undefined;
  wishlistLoading: boolean;
  wishlistError: unknown;
  refetchWishlists: () => void;
  items: WishlistListing[];
  canFetchWishlist: boolean;
  isUnauthorized: boolean;
  profileFetchError: boolean;
  isRemoving: boolean;
  onRemoveHeart: (wishlistId: string) => void;
  itemCountLabel: string;
  showWishlistCount: boolean;
  queryClient: QueryClient;
};

export function WishlistDesktopShell({
  profileLoading,
  profileError,
  refetchProfile,
  user,
  wishlistLoading,
  wishlistError,
  refetchWishlists,
  items,
  canFetchWishlist,
  isUnauthorized,
  profileFetchError,
  isRemoving,
  onRemoveHeart,
  itemCountLabel,
  showWishlistCount,
  queryClient,
}: WishlistDesktopShellProps) {
  const { width: viewportW } = useWindowDimensions();
  const [wishCategory, setWishCategory] = useState<CategoryType>('hotel');
  const [wishlistLocalQuery, setWishlistLocalQuery] = useState('');
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{
    visible: boolean;
    mode: 'login' | 'signup';
  }>({ visible: false, mode: 'login' });

  const isLoggedIn = Boolean(user) && !isUnauthorized;

  /** Fixed-width slots (Figma-style grid); avoids one card stretching edge-to-edge. */
  const cardSlotWidth = useMemo(() => {
    const gap = spacing['4'];
    const inner = Math.max(0, viewportW - 2 * PAGE_PAD);
    const equal = (inner - (COLUMNS - 1) * gap) / COLUMNS;
    return Math.min(CARD_MAX_WIDTH, Math.max(160, Math.floor(equal)));
  }, [viewportW]);

  const filtered = useMemo(() => {
    let list = items.filter((l) => l.category?.type === wishCategory);
    const q = wishlistLocalQuery.trim().toLowerCase();
    if (q) list = list.filter((l) => l.title.toLowerCase().includes(q));
    return list;
  }, [items, wishCategory, wishlistLocalQuery]);

  const handleWebMenuLogout = async () => {
    setWebMenuOpen(false);
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      queryClient.clear();
      router.replace('/(tabs)');
    }
  };

  const webMenuItems: {
    key: string;
    label: string;
    node: React.ReactNode;
    onPress: () => void;
    labelPrimary?: boolean;
  }[] = [
    {
      key: 'notifications',
      label: 'Notifications',
      node: <BellBadgeIcon width={22} height={22} />,
      onPress: () => setWebMenuOpen(false),
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      node: <HeartFilledIcon width={22} height={22} />,
      onPress: () => {
        setWebMenuOpen(false);
        router.push('/(tabs)/two');
      },
    },
    {
      key: 'tickets',
      label: 'Tickets',
      node: <TicketConfirmationIcon width={22} height={22} />,
      onPress: () => {
        setWebMenuOpen(false);
        router.push('/(tabs)/three');
      },
    },
    isLoggedIn
      ? {
          key: 'logout',
          label: 'Logout',
          node: <LogoutIcon width={22} height={22} />,
          onPress: () => {
            void handleWebMenuLogout();
          },
          labelPrimary: true,
        }
      : {
          key: 'login',
          label: 'Login',
          node: <Ionicons name="log-in-outline" size={22} color={colors.primary} />,
          onPress: () => {
            setWebMenuOpen(false);
            setWebAuthModal({ visible: true, mode: 'login' });
          },
          labelPrimary: true,
        },
  ];

  const renderCard = (l: WishlistListing) => {
    const img = getPrimaryImage(l.media);
    const priceNum = l.price_start != null ? Number(l.price_start) : NaN;
    const priceLabel =
      Number.isFinite(priceNum) && priceNum >= 0
        ? `₹${priceNum.toLocaleString('en-IN')}${priceSuffix(l)}`
        : '—';
    const goToListing = () => {
      const type = l.category?.type;
      const tab =
        type === 'package'
          ? 'packages'
          : type === 'camping' || type === 'glamping'
            ? 'glamping'
            : type === 'activity'
              ? 'activities'
              : 'hotels';
      router.push(listingDetailHref(tab, l));
    };

    return (
      <View key={l.wishlist_id} style={[dw.cardCell, { width: cardSlotWidth }]}>
        <View style={dw.cardCol}>
          <View style={dw.cardImageShell}>
            <Pressable onPress={goToListing} style={StyleSheet.absoluteFill} accessibilityLabel={l.title}>
              {img ? (
                <Image source={{ uri: img }} style={dw.cardImage} resizeMode="cover" />
              ) : (
                <Image source={FALLBACK_PLACEHOLDER} style={dw.cardImage} resizeMode="cover" />
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [dw.heartFab, pressed && { opacity: 0.9 }]}
              onPress={() => onRemoveHeart(l.wishlist_id)}
              disabled={isRemoving}
              accessibilityLabel="Remove from wishlist"
            >
              <HeartIcon width={16} height={16} />
            </Pressable>
          </View>
          <Pressable onPress={goToListing} accessibilityRole="button">
            <Text variant="bodySemibold" numberOfLines={2} style={dw.cardTitle}>
              {l.title}
            </Text>
            <View style={dw.cardMeta}>
              <Text variant="body" style={dw.cardPrice} numberOfLines={1}>
                {priceLabel}
              </Text>
              <View style={dw.cardRating}>
                <Ionicons name="star-outline" size={14} color={colors.text.secondary} />
                <Text variant="body" style={dw.cardRatingText}>
                  {formatRating(l)}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  const firstRow = filtered.slice(0, COLUMNS);
  const secondRow = filtered.slice(COLUMNS, COLUMNS * 2);

  const mainBody = () => {
    if (profileLoading) {
      return (
        <View style={dw.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (isUnauthorized) {
      return (
        <View style={dw.centerBlock}>
          <View style={dw.messageCard}>
            <Text variant="heading2" style={dw.messageTitle}>
              {"You're not logged in"}
            </Text>
            <Text variant="body" style={dw.messageBody}>
              Log in to add stays and packages to your wishlist.
            </Text>
            <Button variant="primary" size="default" onPress={() => setWebAuthModal({ visible: true, mode: 'login' })}>
              Log in
            </Button>
          </View>
        </View>
      );
    }
    if (profileFetchError) {
      return (
        <View style={dw.centerBlock}>
          <Text variant="body" style={dw.errorText}>
            {getErrorMessage(profileError as Error)}
          </Text>
          <Button variant="primary" size="default" onPress={() => refetchProfile()}>
            Try again
          </Button>
        </View>
      );
    }
    if (wishlistLoading) {
      return (
        <View style={dw.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (wishlistError) {
      return (
        <View style={dw.centerBlock}>
          <Text variant="body" style={dw.errorText}>
            {getErrorMessage(wishlistError as Error)}
          </Text>
          <Button variant="primary" size="default" onPress={() => refetchWishlists()}>
            Try again
          </Button>
        </View>
      );
    }
    if (canFetchWishlist && items.length === 0) {
      return (
        <View style={dw.centerBlock}>
          <View style={dw.messageCard}>
            <Text variant="heading2" style={dw.messageTitle}>
              Added nothing
            </Text>
            <Text variant="body" style={dw.messageBody}>
              Explore Rooms, Trip packages, Glamping, and other activities.
            </Text>
            <Button variant="primary" size="default" onPress={() => router.push('/(tabs)')}>
              Explore now
            </Button>
          </View>
        </View>
      );
    }
    if (canFetchWishlist && filtered.length === 0) {
      return (
        <View style={dw.centerBlock}>
          <Text variant="body" style={dw.messageBody}>
            No saved stays in this category yet.
          </Text>
        </View>
      );
    }
    if (canFetchWishlist && filtered.length > 0) {
      return (
        <View style={dw.mainStack}>
          <View style={dw.cardRow}>{firstRow.map((l) => renderCard(l))}</View>
          {secondRow.length > 0 ? (
            <>
              <View style={dw.sectionHead}>
                <Text variant="bodySemibold" style={dw.sectionTitle}>
                  Top rated stays
                </Text>
                <Pressable style={dw.viewAll} accessibilityLabel="View all">
                  <Text variant="caption" style={dw.viewAllText}>
                    View all
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </Pressable>
              </View>
              <View style={dw.cardRow}>{secondRow.map((l) => renderCard(l))}</View>
            </>
          ) : null}
        </View>
      );
    }
    return (
      <View style={dw.centerBlock}>
        <Text variant="body" style={dw.errorText}>
          Something went wrong loading your wishlist.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={dw.page} edges={['top']}>
      <Modal visible={webMenuOpen} transparent animationType="none" onRequestClose={() => setWebMenuOpen(false)}>
        <Pressable style={dw.menuOverlay} onPress={() => setWebMenuOpen(false)}>
          <Pressable style={dw.menuPanel} onPress={(e) => e.stopPropagation()}>
            {webMenuItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {index > 0 ? <View style={dw.menuDivider} /> : null}
                <Pressable
                  style={({ pressed }) => [dw.menuRow, pressed && dw.menuRowPressed]}
                  onPress={item.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View style={dw.menuIconBox}>{item.node}</View>
                  <Text
                    variant="body"
                    style={[dw.menuLabel, item.labelPrimary ? dw.menuLabelLogout : null]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </React.Fragment>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <AuthWebModal
        visible={webAuthModal.visible}
        mode={webAuthModal.mode}
        onClose={() => setWebAuthModal((s) => ({ ...s, visible: false }))}
        onSwitchMode={(m) => setWebAuthModal({ visible: true, mode: m })}
        onAuthenticated={() =>
          queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
        }
      />

      <View style={dw.columnFill}>
        <ScrollView
          style={dw.scrollFlex}
          contentContainerStyle={dw.scrollContent}
          showsVerticalScrollIndicator
        >
          <View style={dw.container}>
          <View style={[dw.header, !isLoggedIn ? dw.headerLoggedOut : null]}>
            <Pressable onPress={() => router.replace('/(tabs)')} accessibilityLabel="Home">
              <Image source={DESKTOP_WEB_IMAGES.logo} style={dw.logoImg} resizeMode="contain" />
            </Pressable>
            <View style={dw.searchWrap}>
              <Input
                placeholder="Search"
                style={[dw.searchInput, !isLoggedIn ? dw.searchInputLoggedOut : null]}
                placeholderTextColor="rgba(28,32,36,0.7)"
                editable={false}
              />
              <View style={dw.searchIcon}>
                <Ionicons name="search" size={18} color={colors.primary} />
              </View>
            </View>
            {isLoggedIn ? (
              <View style={dw.headerActions}>
                <Pressable style={[dw.iconBtn, dw.avatarBtn]} accessibilityLabel="Profile">
                  <Ionicons name="person-outline" size={20} color={colors.surface.white} />
                </Pressable>
                <Pressable style={dw.menuBtn} accessibilityLabel="Menu" onPress={() => setWebMenuOpen(true)}>
                  <Ionicons name="menu" size={24} color={colors.primary} />
                </Pressable>
              </View>
            ) : (
              <View style={dw.headerAuthActions}>
                <Button
                  variant="outline"
                  size="compact"
                  onPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="compact"
                  onPress={() => setWebAuthModal({ visible: true, mode: 'signup' })}
                >
                  Sign Up
                </Button>
              </View>
            )}
          </View>

          <Text variant="heading2" style={dw.pageTitle}>
            Your Wishlist
          </Text>
          {showWishlistCount ? (
            <Text variant="caption" style={dw.pageSubtitle}>
              {itemCountLabel}
            </Text>
          ) : null}

          <View style={dw.filterBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={dw.chipTray}
              style={dw.chipTrayScroll}
            >
              {CHIPS.map((c) => {
                const active = wishCategory === c.type;
                const Icon = c.Icon;
                const on = colors.surface.white;
                const chipIcon =
                  c.type === 'hotel' && active ? (
                    <Ionicons name="business" size={26} color={on} />
                  ) : c.type === 'package' && active ? (
                    <Ionicons name="airplane" size={24} color={on} />
                  ) : c.type === 'camping' && active ? (
                    <Ionicons name="image-outline" size={24} color={on} />
                  ) : c.type === 'activity' && active ? (
                    <Ionicons name="boat-outline" size={24} color={on} />
                  ) : (
                    <Icon width={26} height={26} />
                  );
                return (
                  <Pressable
                    key={c.type}
                    onPress={() => setWishCategory(c.type)}
                    style={[dw.typeChip, active && dw.typeChipActive]}
                    accessibilityState={{ selected: active }}
                  >
                    {chipIcon}
                    <Text style={[dw.typeChipLabel, active && dw.typeChipLabelActive]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={dw.searchFilterRight}>
              <View style={dw.inlineSearchWrap}>
                <Input
                  placeholder="Search"
                  value={wishlistLocalQuery}
                  onChangeText={setWishlistLocalQuery}
                  style={dw.inlineSearchInput}
                  placeholderTextColor="rgba(28,32,36,0.7)"
                />
                <View style={dw.inlineSearchIcon}>
                  <Ionicons name="search" size={18} color={colors.primary} />
                </View>
              </View>
              <Pressable style={dw.filterBtn} accessibilityLabel="Filter">
                <FilterIcon width={22} height={22} />
              </Pressable>
            </View>
          </View>

          {mainBody()}
          </View>
        </ScrollView>

        <View style={dw.footer}>
          <View style={dw.footerInner}>
            <View style={dw.footerGroup}>
              <Text variant="caption" style={dw.footerLink}>
                More info
              </Text>
              <Text variant="caption" style={dw.footerLink}>
                Link 1
              </Text>
              <Text variant="caption" style={dw.footerLink}>
                Link 2
              </Text>
            </View>
            <Text variant="caption" style={dw.footerBrand}>
              GOTRIP HOLIDAY
            </Text>
            <View style={dw.footerGroup}>
              <Text variant="caption" style={dw.footerLink}>
                More info
              </Text>
              <Text variant="caption" style={dw.footerLink}>
                Link 1
              </Text>
              <Text variant="caption" style={dw.footerLink}>
                Link 2
              </Text>
            </View>
          </View>
          <Text variant="caption" style={dw.footerCopyright}>
            © Copyright 2026 Gotrip Holiday - All Rights Reserved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const dw = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface.white },
  /** Fills viewport under safe area; footer sits at bottom like a sticky chrome bar. */
  columnFill: { flex: 1, flexDirection: 'column', minHeight: 0 },
  scrollFlex: { flex: 1, minHeight: 0 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing['8'],
  },
  /** Same as home desktop `stylesWeb.container`: full width, modest side padding. */
  container: {
    width: '100%',
    paddingHorizontal: PAGE_PAD,
  },
  header: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['4'],
    marginBottom: spacing['5'],
  },
  headerLoggedOut: {
    marginHorizontal: -PAGE_PAD,
    paddingHorizontal: PAGE_PAD,
    paddingBottom: spacing['4'],
    marginBottom: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  logoImg: { width: 120, height: 54 },
  searchWrap: { flex: 1, maxWidth: 720, position: 'relative' },
  searchInput: {
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(229,77,46,0.10)',
    borderWidth: 0,
    paddingLeft: spacing['4'],
    paddingRight: 44,
  },
  searchInputLoggedOut: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    backgroundColor: colors.surface.lightPink,
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'] },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(229,77,46,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: { backgroundColor: colors.primary },
  menuBtn: { width: 22, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerAuthActions: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'] },
  pageTitle: {
    color: colors.primary,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: spacing['2'],
  },
  pageSubtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing['5'],
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['3'],
    marginBottom: spacing['6'],
    width: '100%',
  },
  chipTrayScroll: { flex: 1, minWidth: 0 },
  chipTray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    backgroundColor: 'rgba(223,38,0,0.05)',
    borderRadius: borderRadius.pill,
    padding: spacing['3'],
    paddingRight: spacing['2'],
  },
  typeChip: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface.white,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  typeChipLabelActive: { color: colors.surface.white },
  searchFilterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    flexShrink: 0,
    width: 380,
    maxWidth: '38%',
  },
  inlineSearchWrap: { flex: 1, position: 'relative' },
  inlineSearchInput: {
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(229,77,46,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0,7,20,0.25)',
    paddingLeft: spacing['4'],
    paddingRight: 40,
  },
  inlineSearchIcon: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(28,32,36,0.25)',
    backgroundColor: 'rgba(229,77,46,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainStack: { gap: spacing['6'], marginBottom: spacing['6'], width: '100%' },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing['4'],
    width: '100%',
    alignSelf: 'stretch',
  },
  cardCell: { flexShrink: 0 },
  cardCol: { gap: spacing['2'], width: '100%' },
  cardImageShell: {
    width: '100%',
    aspectRatio: CARD_IMAGE_ASPECT,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
    borderWidth: 1,
    borderColor: colors.surface.white,
    ...Platform.select({
      web: { boxShadow: '0px 4px 12.5px rgba(0,0,0,0.25)' },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  cardImage: { width: '100%', height: '100%' },
  heartFab: {
    position: 'absolute',
    top: spacing['2'],
    right: spacing['2'],
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 4px 12.5px rgba(0,0,0,0.25)' },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing['1'],
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardPrice: { color: colors.text.secondary, fontSize: 15, fontWeight: '500' },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRatingText: { color: colors.text.secondary, fontSize: 15 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionTitle: { color: colors.text.primary, fontSize: 18, lineHeight: 24 },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { color: colors.primary, fontSize: 14 },
  centerBlock: {
    flexGrow: 1,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['7'],
    width: '100%',
  },
  messageCard: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing['6'],
    maxWidth: 440,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  messageTitle: { marginBottom: spacing['2'], textAlign: 'center' },
  messageBody: { marginBottom: spacing['5'], textAlign: 'center', color: colors.text.secondary },
  errorText: { color: colors.primaryAlt, marginBottom: spacing['4'], textAlign: 'center' },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 16,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        } as Record<string, string>)
      : {}),
  },
  menuPanel: {
    width: 280,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.08)',
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 12px 40px rgba(0,0,0,0.18)' } }),
  },
  menuDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border.light },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    gap: spacing['3'],
  },
  menuRowPressed: { backgroundColor: 'rgba(229,77,46,0.05)' },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 92, 55, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, color: colors.text.primary },
  menuLabelLogout: { color: colors.primary, fontWeight: '600' },
  footer: {
    marginTop: 0,
    backgroundColor: colors.primary,
    paddingVertical: spacing['5'],
    paddingBottom: spacing['6'],
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['5'],
    width: '100%',
    paddingHorizontal: PAGE_PAD,
  },
  footerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    minWidth: 200,
    flexWrap: 'wrap',
  },
  footerLink: { color: colors.surface.white, fontSize: 14 },
  footerBrand: {
    color: colors.surface.white,
    letterSpacing: 4,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  footerCopyright: {
    marginTop: spacing['4'],
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    paddingHorizontal: PAGE_PAD,
  },
});
