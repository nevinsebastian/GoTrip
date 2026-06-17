import { Text } from '@/components/ui';
import { spacing, colors, borderRadius } from '@/constants/DesignTokens';
import { DesktopHomeHero } from '@/src/components/desktop/DesktopHomeHero';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import { DesktopWebNav } from '@/src/components/desktop/DesktopWebNav';
import { HomeSearchProvider, useHomeSearch } from '@/src/components/home/HomeSearchContext';
import type { Listing, ListingMedia } from '@/src/api/types';
import { logout } from '@/src/api/auth.service';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { useListings } from '@/src/hooks/useListings';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import HeartIcon from '@/assets/images/heart.svg';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
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

import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';

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

function DesktopHomeContent() {
  const queryClient = useQueryClient();
  const { data: user, error: profileError } = useUserProfile();
  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;
  const { activeCategoryTab, setActiveCategoryTab } = useHomeSearch();

  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{
    visible: boolean;
    mode: 'login' | 'signup';
  }>({ visible: false, mode: 'login' });

  const { data: listingsRes } = useListings({ page: 1, limit: 20 });
  const { data: economicRes } = useListings({ max_price: 2499, page: 1, limit: 20 });

  const listings = listingsRes?.data ?? [];
  const suggested = listings.slice(0, 6);
  const topRated = listings.slice(0, 5);
  const budget = (economicRes?.data ?? listings).slice(0, 5);
  const luxury = listings.slice(0, 5);
  const cardW = 280;

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

  const webMenuItems = [
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
          onPress: () => void handleWebMenuLogout(),
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

  const DesktopSection = ({ title, items }: { title: string; items: Listing[] }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="bodySemibold" style={styles.sectionTitle}>
          {title}
        </Text>
        <Pressable accessibilityLabel="View all" style={styles.viewAllBtn}>
          <Text variant="caption" style={styles.viewAllText}>
            View all
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((l) => {
          const img = getPrimaryImage(l.media);
          const price =
            l.price_start != null ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night` : '—';
          return (
            <Pressable
              key={l.id}
              style={[styles.cardWrap, { width: cardW }]}
              onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
              accessibilityLabel={l.title}
            >
              <View style={styles.cardImageWrap}>
                {img ? (
                  <Image source={{ uri: img }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.cardImagePlaceholder}>
                    <Ionicons name="image-outline" size={22} color={colors.text.caption} />
                  </View>
                )}
                <View style={styles.heartBadge}>
                  <HeartIcon width={18} height={18} />
                </View>
              </View>
              <View style={styles.cardMetaRow}>
                <Text variant="caption" numberOfLines={2} style={styles.cardTitle}>
                  {l.title}
                </Text>
                <View style={styles.cardRating}>
                  <Ionicons name="star-outline" size={14} color={colors.rating.star} />
                  <Text variant="caption" style={styles.cardRatingText}>
                    4.5
                  </Text>
                </View>
              </View>
              <Text variant="caption" style={styles.cardPrice}>
                {price}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <Modal visible={webMenuOpen} transparent animationType="none" onRequestClose={() => setWebMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setWebMenuOpen(false)}>
          <Pressable style={styles.menuPanel} onPress={(e) => e.stopPropagation()}>
            {webMenuItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {index > 0 ? <View style={styles.menuDivider} /> : null}
                <Pressable
                  style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuIconBox}>{item.node}</View>
                  <Text
                    variant="body"
                    style={[styles.menuLabel, item.labelPrimary ? styles.menuLabelLogout : null]}
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
        onAuthenticated={() => queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })}
      />

      <DesktopWebNav
        activeTab={activeCategoryTab}
        onTabChange={setActiveCategoryTab}
        isLoggedIn={isLoggedIn}
        onMenuPress={() => setWebMenuOpen(true)}
        onProfilePress={() => router.push('/(tabs)/four')}
        onLoginPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
        <DesktopHomeHero />

        <View style={styles.listings}>
          <DesktopSection title="Suggested for you" items={suggested} />
          <DesktopSection title="Top rated stays" items={topRated} />
          <DesktopSection title="Budget options" items={budget} />
          <DesktopSection title="Luxury resorts" items={luxury} />
        </View>

        <DesktopSiteFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

export function DesktopHomeScreen() {
  return (
    <HomeSearchProvider>
      <DesktopHomeContent />
    </HomeSearchProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing['5'],
  },
  listings: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 32,
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 24,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } as Record<string, string>)
      : {}),
  },
  menuPanel: {
    width: 280,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.08)',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 12px 40px rgba(0,0,0,0.18)' } : {}),
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
});
