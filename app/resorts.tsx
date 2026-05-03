import AccountMultipleIcon from '@/assets/images/account-multiple.svg';
import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import CashMultipleIcon from '@/assets/images/cash-multiple.svg';
import DiamondIcon from '@/assets/images/diamond.svg';
import ForestIcon from '@/assets/images/forest.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import HeartIcon from '@/assets/images/heart.svg';
import FilterHdrIcon from '@/assets/images/image-filter-hdr.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import WavesIcon from '@/assets/images/waves.svg';
import { Button, IconButton, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import type { Category, Listing, ListingMedia } from '@/src/api/types';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { useCategoriesByType } from '@/src/hooks/useCategoriesByType';
import { useListings } from '@/src/hooks/useListings';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

const TICKETS_BG = '#FFF8F6';
const ResortImage = require('../assets/images/resort.jpg');
const WebLogo = require('../assets/images/logogotrip.png');

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

function chipIconForCategory(category: Category, active: boolean): React.ReactNode {
  const blob = `${category.type ?? ''} ${category.name} ${category.slug}`.toLowerCase();
  const brand = colors.primary;
  const onPill = colors.surface.white;
  const iconProps = { width: 18, height: 18, fill: brand };
  if (active) {
    if (/(budget|economy|cheap)/.test(blob)) {
      return <Ionicons name="wallet-outline" size={18} color={onPill} />;
    }
    if (/(private|couple|exclusive)/.test(blob)) {
      return <Ionicons name="people-outline" size={18} color={onPill} />;
    }
    if (/(luxury|premium|deluxe)/.test(blob)) {
      return <Ionicons name="diamond-outline" size={18} color={onPill} />;
    }
    if (/(hill|mountain|station)/.test(blob)) {
      return <Ionicons name="image-outline" size={18} color={onPill} />;
    }
    if (/(beach|sea|coast)/.test(blob)) {
      return <Ionicons name="water-outline" size={18} color={onPill} />;
    }
    if (/(forest|tree|jungle|wood)/.test(blob)) {
      return <Ionicons name="leaf-outline" size={18} color={onPill} />;
    }
    return <Ionicons name="bed-outline" size={18} color={onPill} />;
  }
  if (/(budget|economy|cheap)/.test(blob)) {
    return <CashMultipleIcon {...iconProps} />;
  }
  if (/(private|couple|exclusive)/.test(blob)) {
    return <AccountMultipleIcon {...iconProps} />;
  }
  if (/(luxury|premium|deluxe)/.test(blob)) {
    return <DiamondIcon {...iconProps} />;
  }
  if (/(hill|mountain|station)/.test(blob)) {
    return <FilterHdrIcon {...iconProps} />;
  }
  if (/(beach|sea|coast)/.test(blob)) {
    return <WavesIcon {...iconProps} />;
  }
  if (/(forest|tree|jungle|wood)/.test(blob)) {
    return <ForestIcon {...iconProps} />;
  }
  return <Ionicons name="bed-outline" size={18} color={brand} />;
}

export default function ResortsScreen() {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const maxWidth = width >= 1024 ? 600 : undefined;

  const queryClient = useQueryClient();
  const { data: user, error: profileError } = useUserProfile();
  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;

  const [query, setQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{
    visible: boolean;
    mode: 'login' | 'signup';
  }>({ visible: false, mode: 'login' });

  const { data: categoriesRes } = useCategoriesByType('hotel', true);
  const root = categoriesRes?.data?.[0];
  const children: Category[] = root?.children ?? [];

  const categoryId = root?.id;
  const effectiveCategoryId = selectedChild ?? categoryId;

  const { data: listingsRes } = useListings(
    { page: 1, limit: 20, category_id: effectiveCategoryId },
    Boolean(effectiveCategoryId),
  );

  const listings = listingsRes?.data ?? [];
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) => l.title.toLowerCase().includes(q));
  }, [listings, query]);

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

  if (isDesktopWeb) {
    const suggested = visible.slice(0, 6);
    const topRated = visible.slice(0, 5);
    const cardW = 280;

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

    const sortedChildren = children
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .filter((c) => (c.type == null ? true : String(c.type).trim().length > 0));

    const Section = ({ title, items }: { title: string; items: Listing[] }) => (
      <View style={dw.section}>
        <View style={dw.sectionHeader}>
          <Text variant="bodySemibold" style={dw.sectionTitle}>
            {title}
          </Text>
          <Pressable accessibilityLabel="View all" style={dw.viewAllBtn}>
            <Text variant="caption" style={dw.viewAllText}>
              View all
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dw.row}>
          {items.map((l) => {
            const img = getPrimaryImage(l.media);
            const price =
              l.price_start != null
                ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night`
                : '—';
            return (
              <Pressable
                key={l.id}
                style={[dw.cardWrap, { width: cardW }]}
                onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
                accessibilityLabel={l.title}
              >
                <View style={dw.cardImageWrap}>
                  {img ? (
                    <Image source={{ uri: img }} style={dw.cardImage} resizeMode="cover" />
                  ) : (
                    <View style={dw.cardImagePlaceholder}>
                      <Ionicons name="image-outline" size={22} color={colors.text.caption} />
                    </View>
                  )}
                  <View style={dw.heartBadge}>
                    <HeartIcon width={18} height={18} />
                  </View>
                </View>
                <View style={dw.cardMetaRow}>
                  <Text variant="caption" numberOfLines={2} style={dw.cardTitle}>
                    {l.title}
                  </Text>
                  <View style={dw.cardRating}>
                    <Ionicons name="star-outline" size={14} color={colors.rating.star} />
                    <Text variant="caption" style={dw.cardRatingText}>
                      4.5
                    </Text>
                  </View>
                </View>
                <Text variant="caption" style={dw.cardPrice}>
                  {price}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <SafeAreaView style={dw.page} edges={['top']}>
        <Modal
          visible={webMenuOpen}
          transparent
          animationType="none"
          onRequestClose={() => setWebMenuOpen(false)}
        >
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

        <ScrollView
          style={dw.scroll}
          contentContainerStyle={dw.scrollContent}
          showsVerticalScrollIndicator
        >
          <View style={dw.container}>
            <View style={[dw.header, !isLoggedIn ? dw.headerLoggedOut : null]}>
              <Pressable onPress={() => router.replace('/(tabs)')} accessibilityLabel="Home">
                <Image source={WebLogo} style={dw.logoImg} resizeMode="contain" />
              </Pressable>
              <View style={dw.searchWrap}>
                <Input
                  placeholder="Search"
                  style={[dw.searchInput, !isLoggedIn ? dw.searchInputLoggedOut : null]}
                  placeholderTextColor="rgba(28,32,36,0.7)"
                  value={query}
                  onChangeText={setQuery}
                />
                <View style={dw.searchIcon}>
                  <Ionicons name="search" size={16} color={colors.primary} />
                </View>
              </View>
              {isLoggedIn ? (
                <View style={dw.headerActions}>
                  <Pressable style={[dw.iconBtn, dw.avatarBtn]} accessibilityLabel="Profile">
                    <Ionicons name="person-outline" size={18} color={colors.surface.white} />
                  </Pressable>
                  <Pressable
                    style={dw.menuBtn}
                    accessibilityLabel="Menu"
                    onPress={() => setWebMenuOpen(true)}
                  >
                    <Ionicons name="menu" size={22} color={colors.primary} />
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

            <View style={dw.hotelsBar}>
              <Text variant="heading2" style={dw.hotelsTitle}>
                Hotels
              </Text>
              <View style={dw.chipRowWrap}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={dw.chipScroll}
                >
                  <Pressable
                    onPress={() => setSelectedChild(null)}
                    style={[dw.typeChip, selectedChild === null && dw.typeChipActive]}
                    accessibilityLabel="All hotels"
                    accessibilityState={{ selected: selectedChild === null }}
                  >
                    <Ionicons
                      name="apps-outline"
                      size={18}
                      color={selectedChild === null ? colors.surface.white : colors.primary}
                    />
                    <Text
                      variant="caption"
                      style={[
                        dw.typeChipLabel,
                        selectedChild === null && dw.typeChipLabelActive,
                      ]}
                    >
                      All
                    </Text>
                  </Pressable>
                  {sortedChildren.map((c) => {
                    const active = selectedChild === c.id;
                    return (
                      <Pressable
                        key={c.id}
                        onPress={() => setSelectedChild(c.id)}
                        style={[dw.typeChip, active && dw.typeChipActive]}
                        accessibilityLabel={c.name}
                        accessibilityState={{ selected: active }}
                      >
                        {chipIconForCategory(c, active)}
                        <Text
                          variant="caption"
                          style={[dw.typeChipLabel, active && dw.typeChipLabelActive]}
                        >
                          {c.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <Section title="Suggested for you" items={suggested} />
            <Section title="Top rated stays" items={topRated} />
          </View>

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
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: TICKETS_BG }]} edges={['top']}>
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
          onPress={() => router.back()}
        />
        <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
          Resorts
        </Text>
        <View style={styles.headerEndSpacer} />
      </View>

      <View
        style={[
          styles.searchWrap,
          { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
        ]}
      >
        <Input
          variant="search"
          showSearchIcon
          placeholder="Search resorts"
          placeholderTextColor={colors.text.placeholder}
          value={query}
          onChangeText={setQuery}
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
        {children.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <Pressable
              style={[styles.chip, !selectedChild && styles.chipActive]}
              onPress={() => setSelectedChild(null)}
              accessibilityLabel="All"
            >
              <Text
                variant="caption"
                style={[styles.chipText, !selectedChild && styles.chipTextActive]}
              >
                All
              </Text>
            </Pressable>
            {children
              .slice()
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .filter((c) => (c.type == null ? true : String(c.type).trim().length > 0))
              .map((c) => {
                const active = selectedChild === c.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelectedChild(c.id)}
                    accessibilityLabel={c.name}
                  >
                    <Text
                      variant="caption"
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {c.name}
                    </Text>
                  </Pressable>
                );
              })}
          </ScrollView>
        ) : null}

        <View style={styles.grid}>
          {visible.map((l) => {
            const img = getPrimaryImage(l.media);
            return (
              <Pressable
                key={l.id}
                style={styles.card}
                onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
                accessibilityLabel={l.title}
              >
                <View style={styles.imageWrap}>
                  {img ? (
                    <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
                  ) : (
                    <Image source={ResortImage} style={styles.image} resizeMode="cover" />
                  )}
                </View>
                <Text variant="bodySemibold" numberOfLines={1} style={styles.title}>
                  {l.title}
                </Text>
                <View style={styles.metaRow}>
                  <Text variant="caption" style={styles.price}>
                    {l.price_start ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night` : '—'}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star-outline" size={12} color={colors.rating.star} />
                    <Text variant="caption" style={styles.rating}>
                      4.5
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const dw = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing['5'] },
  container: { width: '100%', paddingHorizontal: 16 },
  header: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['4'],
  },
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
  logoImg: { width: 110, height: 50 },
  searchWrap: { flex: 1, maxWidth: 720, position: 'relative' },
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
  avatarBtn: { backgroundColor: colors.primary },
  menuBtn: {
    width: 22,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  hotelsBar: {
    marginTop: spacing['5'],
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotelsTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 28,
    flexShrink: 0,
    marginRight: spacing['3'],
  },
  chipRowWrap: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
  },
  chipScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing['2'],
    paddingLeft: spacing['2'],
    paddingRight: 0,
    flexGrow: 1,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
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
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  typeChipLabelActive: {
    color: colors.surface.white,
  },
  section: { marginTop: spacing['6'] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
  },
  sectionTitle: { color: colors.text.primary, fontSize: 18, lineHeight: 24 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { color: colors.primary },
  row: { gap: spacing['4'], paddingBottom: spacing['2'] },
  cardWrap: { gap: spacing['2'] },
  cardImageWrap: {
    width: '100%',
    height: 170,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  cardImage: { width: '100%', height: '100%' },
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
  cardTitle: { flex: 1, color: colors.text.primary },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRatingText: { color: colors.text.secondary },
  cardPrice: { color: colors.text.secondary },
  footer: {
    marginTop: spacing['7'],
    backgroundColor: '#FFE8E0',
    paddingVertical: spacing['5'],
    paddingHorizontal: 16,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['5'],
    width: '100%',
  },
  footerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    minWidth: 200,
  },
  footerLink: { color: colors.text.primary },
  footerBrand: {
    color: colors.primary,
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: '700',
  },
  footerCopyright: {
    marginTop: spacing['4'],
    textAlign: 'center',
    color: colors.text.secondary,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3'],
    paddingBottom: spacing['3'],
    minHeight: 56,
  },
  headerTitle: { flex: 1, marginLeft: spacing['1'] },
  headerEndSpacer: { width: 40, height: 40 },
  searchWrap: { marginBottom: spacing['2'] },
  chipsRow: { gap: spacing['2'], paddingBottom: 0, marginBottom: spacing['2'], paddingRight: spacing['4'] },
  chip: {
    height: 32,
    paddingHorizontal: spacing['3'],
    borderRadius: 10,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229,77,46,0.06)',
  },
  chipText: { color: colors.text.secondary },
  chipTextActive: { color: colors.text.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 0, paddingBottom: spacing['8'] },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    padding: spacing['3'],
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing['2'],
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  image: { width: '100%', height: '100%' },
  title: { color: colors.text.primary },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: colors.text.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { color: colors.text.secondary },
});
