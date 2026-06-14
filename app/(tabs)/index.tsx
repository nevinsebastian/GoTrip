import {
  Button,
  Input,
  Text
} from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowTopRight from '@/assets/images/arrow-top-right.svg';
import BagIll from '@/assets/images/bag ill 1.svg';
import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import HeartIcon from '@/assets/images/heart.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import HillIll from '@/assets/images/hill ill 1.svg';
import Logo from '@/assets/images/logogotrip.svg';
import RoomsIll from '@/assets/images/Rooms ill 1.svg';
import type { Listing, ListingMedia } from '@/src/api/types';
import { logout } from '@/src/api/auth.service';
import { useListings } from '@/src/hooks/useListings';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { MobileHotelsHome } from '@/src/screens/MobileHotelsHome';
import { useQueryClient } from '@tanstack/react-query';

const WebLogo = require('../../assets/images/logogotrip.png');

type CategoryIconKey = 'rooms' | 'packages' | 'glamping' | 'activities';

function CategoryIcon({ iconKey, size }: { iconKey: CategoryIconKey; size: number }) {
  switch (iconKey) {
    case 'rooms':
      return <RoomsIll width={size} height={size} />;
    case 'packages':
      return <BagIll width={size} height={size} />;
    case 'glamping':
      return <HillIll width={size} height={size} />;
    case 'activities':
      return <ArrowTopRight width={size} height={size} />;
    default:
      return null;
  }
}

const CATEGORIES: Array<{ title: string; subtitle: string; bg: string; iconKey: CategoryIconKey }> = [
  { title: 'Rooms/hotels', subtitle: 'Book Resorts & Stays', bg: '#F3E5F5', iconKey: 'rooms' },
  { title: 'Packages', subtitle: 'Travel with Gotrip', bg: colors.surface.lightPink, iconKey: 'packages' },
  { title: 'Glamping', subtitle: 'Glamorous camping', bg: '#E8F5E9', iconKey: 'glamping' },
  { title: 'Activities', subtitle: 'Other experiences', bg: '#FFE0B2', iconKey: 'activities' },
];

function routeForCategory(iconKey: CategoryIconKey) {
  switch (iconKey) {
    case 'rooms':
      return '/resorts';
    case 'packages':
      return '/packages';
    default:
      return null;
  }
}

function CategoryCard({
  title,
  subtitle,
  bg,
  onPress,
  iconKey,
}: {
  title: string;
  subtitle: string;
  bg: string;
  onPress: () => void;
  iconKey: CategoryIconKey;
}) {
  const { width, isMobile, isTablet } = useResponsive();
  
  const illustrationSize = isMobile 
    ? Math.min(72, width * 0.18) 
    : isTablet 
    ? Math.min(80, width * 0.12)
    : Math.min(96, width * 0.1);
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
        { backgroundColor: bg },
        pressed && styles.categoryPressed,
      ]}
    >
      <View style={[styles.categoryIllustrationWrap, { width: illustrationSize, height: illustrationSize }]} pointerEvents="none">
        <CategoryIcon iconKey={iconKey} size={illustrationSize} />
      </View>
      <View style={styles.categoryTextWrap}>
        <Text variant="bodySemibold" style={styles.categoryTitle}>
          {title}
        </Text>
        <Text variant="caption" style={styles.categorySubtitle}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (!isDesktopWeb) {
    return <MobileHotelsHome />;
  }

  return <DesktopHomeScreen />;
}

function DesktopHomeScreen() {
  const queryClient = useQueryClient();
  const { data: user, error: profileError } = useUserProfile();
  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{
    visible: boolean;
    mode: 'login' | 'signup';
  }>({ visible: false, mode: 'login' });

  const { data: listingsRes } = useListings({ page: 1, limit: 20 });
  const { data: economicRes } = useListings({ max_price: 2499, page: 1, limit: 20 });

  const getPrimaryImage = (media?: ListingMedia[]) => {
    if (!media?.length) return null;
    const isDirectImageUrl = (url: string) => {
      const u = url.toLowerCase();
      if (!u.startsWith('http')) return false;
      // accept common direct image URLs; reject HTML page links like https://ibb.co/<code>
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
  };

  const handleWebMenuLogout = async () => {
    setWebMenuOpen(false);
    try {
      await logout();
    } catch {
      // still clear local session
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
            node: (
              <Ionicons name="log-in-outline" size={22} color={colors.primary} />
            ),
            onPress: () => {
              setWebMenuOpen(false);
              router.push('/login');
            },
            labelPrimary: true,
          },
    ];

    const listings = listingsRes?.data ?? [];
    const suggested = listings.slice(0, 6);
    const topRated = listings.slice(0, 5);
    const budget = (economicRes?.data ?? listings).slice(0, 5);
    const luxury = listings.slice(0, 5);

    // Desktop scale-up so layout feels filled (Figma desktop).
    const cardW = 280;

    const DesktopSection = ({
      title,
      items,
    }: {
      title: string;
      items: Listing[];
    }) => (
      <View style={stylesWeb.section}>
        <View style={stylesWeb.sectionHeader}>
          <Text variant="bodySemibold" style={stylesWeb.sectionTitle}>
            {title}
          </Text>
          <Pressable accessibilityLabel="View all" style={stylesWeb.viewAllBtn}>
            <Text variant="caption" style={stylesWeb.viewAllText}>
              View all
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stylesWeb.row}>
          {items.map((l) => {
            const img = getPrimaryImage(l.media);
            const price =
              l.price_start != null ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night` : '—';
            return (
              <Pressable
                key={l.id}
                style={[stylesWeb.cardWrap, { width: cardW }]}
                onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
                accessibilityLabel={l.title}
              >
                <View style={stylesWeb.cardImageWrap}>
                  {img ? (
                    <Image source={{ uri: img }} style={stylesWeb.cardImage} resizeMode="cover" />
                  ) : (
                    <View style={stylesWeb.cardImagePlaceholder}>
                      <Ionicons name="image-outline" size={22} color={colors.text.caption} />
                    </View>
                  )}
                  <View style={stylesWeb.heartBadge}>
                    <HeartIcon width={18} height={18} />
                  </View>
                </View>
                <View style={stylesWeb.cardMetaRow}>
                  <Text variant="caption" numberOfLines={2} style={stylesWeb.cardTitle}>
                    {l.title}
                  </Text>
                  <View style={stylesWeb.cardRating}>
                    <Ionicons name="star-outline" size={14} color={colors.rating.star} />
                    <Text variant="caption" style={stylesWeb.cardRatingText}>
                      4.5
                    </Text>
                  </View>
                </View>
                <Text variant="caption" style={stylesWeb.cardPrice}>
                  {price}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );

  return (
      <SafeAreaView style={stylesWeb.page} edges={['top']}>
        <Modal
          visible={webMenuOpen}
          transparent
          animationType="none"
          onRequestClose={() => setWebMenuOpen(false)}
        >
          <Pressable style={stylesWeb.menuOverlay} onPress={() => setWebMenuOpen(false)}>
            <Pressable style={stylesWeb.menuPanel} onPress={(e) => e.stopPropagation()}>
              {webMenuItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  {index > 0 ? <View style={stylesWeb.menuDivider} /> : null}
                  <Pressable
                    style={({ pressed }) => [
                      stylesWeb.menuRow,
                      pressed && stylesWeb.menuRowPressed,
                    ]}
                    onPress={item.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                  >
                    <View style={stylesWeb.menuIconBox}>{item.node}</View>
                    <Text
                      variant="body"
                      style={[
                        stylesWeb.menuLabel,
                        item.labelPrimary ? stylesWeb.menuLabelLogout : null,
                      ]}
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

        <ScrollView
          style={stylesWeb.scroll}
          contentContainerStyle={stylesWeb.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={stylesWeb.container}>
            {/* Header */}
            <View
              style={[stylesWeb.header, !isLoggedIn ? stylesWeb.headerLoggedOut : null]}
            >
              {Platform.OS === 'web' ? (
                <Image source={WebLogo} style={stylesWeb.logoImg} resizeMode="contain" />
              ) : (
                <Logo width={90} height={42} />
              )}
              <View style={stylesWeb.searchWrap}>
                <Input
                  placeholder="Search"
                  style={[
                    stylesWeb.searchInput,
                    !isLoggedIn ? stylesWeb.searchInputLoggedOut : null,
                  ]}
                  placeholderTextColor="rgba(28,32,36,0.7)"
                />
                <View style={stylesWeb.searchIcon}>
                  <Ionicons name="search" size={16} color={colors.primary} />
                </View>
              </View>
              {isLoggedIn ? (
                <View style={stylesWeb.headerActions}>
                  <Pressable
                    style={[stylesWeb.iconBtn, stylesWeb.avatarBtn]}
                    accessibilityLabel="Profile"
                  >
                    <Ionicons name="person-outline" size={18} color={colors.surface.white} />
                  </Pressable>
                  <Pressable
                    style={stylesWeb.menuBtn}
                    accessibilityLabel="Menu"
                    onPress={() => setWebMenuOpen(true)}
                  >
                    <Ionicons name="menu" size={22} color={colors.primary} />
                  </Pressable>
                </View>
              ) : (
                <View style={stylesWeb.headerAuthActions}>
                  <Button
                    variant="outline"
                    size="compact"
                    onPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
                    accessibilityLabel="Log in"
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    size="compact"
                    onPress={() => setWebAuthModal({ visible: true, mode: 'signup' })}
                    accessibilityLabel="Sign up"
                  >
                    Sign Up
                  </Button>
                </View>
              )}
            </View>

            {/* Category tiles */}
            <View style={stylesWeb.tilesRow}>
              {CATEGORIES.map((c) => (
                <View key={c.title} style={stylesWeb.tileOuter}>
                  <CategoryCard
                    title={c.title}
                    subtitle={c.subtitle}
                    bg={c.bg}
                    iconKey={c.iconKey}
                  onPress={() => {
                    const r = routeForCategory(c.iconKey);
                    if (r) router.push(r as any);
                  }}
                  />
                </View>
              ))}
            </View>

            <DesktopSection title="Suggested for you" items={suggested} />
            <DesktopSection title="Top rated stays" items={topRated} />
            <DesktopSection title="Budget options" items={budget} />
            <DesktopSection title="Luxury resorts" items={luxury} />
          </View>

          {/* Footer */}
          <View style={stylesWeb.footer}>
            <View style={stylesWeb.footerInner}>
              <View style={stylesWeb.footerGroup}>
                <Text variant="caption" style={stylesWeb.footerLink}>
                  More info
                </Text>
                <Text variant="caption" style={stylesWeb.footerLink}>
                  Link 1
                </Text>
                <Text variant="caption" style={stylesWeb.footerLink}>
                  Link 2
                </Text>
              </View>
              <Text variant="caption" style={stylesWeb.footerBrand}>
                GOTRIP HOLIDAY
              </Text>
              <View style={stylesWeb.footerGroup}>
                <Text variant="caption" style={stylesWeb.footerLink}>
                  More info
                </Text>
                <Text variant="caption" style={stylesWeb.footerLink}>
                  Link 1
                </Text>
                <Text variant="caption" style={stylesWeb.footerLink}>
                  Link 2
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    flex: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing['4'],
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border.gray6,
  },
  categoryIllustrationWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    opacity: 0.9,
  },
  categoryTextWrap: {
    position: 'relative',
    zIndex: 1,
  },
  categoryPressed: {
    opacity: 0.9,
  },
  categoryTitle: {
    color: colors.text.primary,
  },
  categorySubtitle: {
    color: colors.text.secondary,
    marginTop: 2,
  },
});

// Desktop web-only styles (do not affect native/mobile web).
const stylesWeb = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    // Keep footer visually “attached” (avoid huge bottom whitespace).
    paddingBottom: spacing['5'],
  },
  container: {
    width: '100%',
    // IMPORTANT: Desktop web should feel “filled” (no large side gutters).
    // So we avoid a hard maxWidth here and instead use a modest fixed padding.
    paddingHorizontal: 16,
  },
  header: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['4'],
  },
  // Logged-out desktop nav (Figma 179-3423): full-width bottom divider; auth CTAs replace bell/profile/menu.
  headerLoggedOut: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: spacing['4'],
    marginBottom: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerAuthActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    flexShrink: 0,
  },
  searchWrap: {
    flex: 1,
    maxWidth: 720,
    position: 'relative',
  },
  searchInput: {
    height: 40,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(229,77,46,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    backgroundColor: colors.primary,
  },
  menuBtn: {
    width: 22,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    // Slight darkening; light blur only (heavy blur = jank on some GPUs).
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 12px 40px rgba(0,0,0,0.18)' },
    }),
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.light,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    gap: spacing['3'],
  },
  menuRowPressed: {
    backgroundColor: 'rgba(229,77,46,0.05)',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 0,
    backgroundColor: 'rgba(255, 92, 55, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: colors.text.primary,
  },
  menuLabelLogout: {
    color: colors.primary,
    fontWeight: '600',
  },
  tilesRow: {
    marginTop: spacing['5'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['6'],
  },
  tileOuter: {
    flex: 1,
  },
  section: {
    marginTop: spacing['6'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 18,
    lineHeight: 24,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: colors.primary,
  },
  row: {
    gap: spacing['4'],
    paddingBottom: spacing['2'],
  },
  cardWrap: {
    gap: spacing['2'],
  },
  cardImageWrap: {
    width: '100%',
    height: 170,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray['2'],
  },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing['2'],
  },
  cardTitle: {
    flex: 1,
    color: colors.text.primary,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardRatingText: {
    color: colors.text.secondary,
  },
  cardPrice: {
    color: colors.text.secondary,
  },
  footer: {
    marginTop: spacing['7'],
    backgroundColor: colors.primary,
    paddingVertical: spacing['5'],
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['5'],
    width: '100%',
    paddingHorizontal: 16,
  },
  footerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    minWidth: 260,
  },
  footerLink: {
    color: colors.surface.white,
  },
  footerBrand: {
    color: colors.surface.white,
    letterSpacing: 4,
    fontSize: 12,
  },
  logoImg: {
    width: 110,
    height: 50,
  },
});
