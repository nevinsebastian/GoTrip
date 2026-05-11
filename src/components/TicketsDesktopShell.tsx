/**
 * Desktop web-only tickets / bookings (Figma go-man ~197:2719).
 * Gated by parent: Platform.OS === 'web' && isDesktop — native and mobile web unchanged.
 */

import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import FilterIcon from '@/assets/images/wishlist-desktop-figma/filter-icon.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import { Button, Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import type { Booking } from '@/src/api/types';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { useBookings } from '@/src/hooks/useBookings';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useQueryClient } from '@tanstack/react-query';
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

const WebLogo = require('@/assets/images/logogotrip.png');
const ResortImage = require('@/assets/images/resort.jpg');

const PAGE_PAD = 16;
const GRID_COLS = 3;
const CARD_MAX_WIDTH = 400;
const THUMB_W = 145;
const THUMB_H = 95;

type TabKey = 'active' | 'past';

function toDateOnly(input: string) {
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  return `${fmt(start)} - ${fmt(end)}`;
}

function bookingCode(id: string) {
  const digits = id.replace(/\D/g, '');
  const tail = (digits || id.replace(/-/g, '')).slice(-5);
  return `B${tail.toUpperCase()}`;
}

function moneyLabel(value?: string | null) {
  const num = Number(value ?? '');
  if (!Number.isFinite(num)) return null;
  return `₹ ${num.toLocaleString('en-IN')}`;
}

export function TicketsDesktopShell() {
  const queryClient = useQueryClient();
  const { width: viewportW } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{ visible: boolean; mode: 'login' | 'signup' }>({
    visible: false,
    mode: 'login',
  });

  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile();

  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const profileFetchError = Boolean(profileError && !isUnauthorized);
  const canFetchBookings = Boolean(user) && !isUnauthorized && !profileFetchError;

  const {
    data: bookingsRes,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
  } = useBookings({ page: 1, limit: 20 }, canFetchBookings);

  const isLoggedIn = Boolean(user) && !isUnauthorized;

  const cardSlotWidth = useMemo(() => {
    const gap = spacing['4'];
    const inner = Math.max(0, viewportW - 2 * PAGE_PAD);
    const equal = (inner - (GRID_COLS - 1) * gap) / GRID_COLS;
    return Math.min(CARD_MAX_WIDTH, Math.max(200, Math.floor(equal)));
  }, [viewportW]);

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const bookings = bookingsRes?.data ?? [];
  const filteredByDate = bookings.filter((b) => {
    const start = toDateOnly(b.start_date);
    return activeTab === 'active'
      ? start.getTime() >= todayOnly.getTime()
      : start.getTime() < todayOnly.getTime();
  });

  const search = searchQuery.trim().toLowerCase();
  const visibleBookings = filteredByDate.filter((b) => {
    if (!search) return true;
    const title = (b.listing?.title ?? '').toLowerCase();
    const location = (b.listing?.location ?? '').toLowerCase();
    return b.id.toLowerCase().includes(search) || title.includes(search) || location.includes(search);
  });

  const emptyState =
    activeTab === 'active'
      ? {
          title: 'No Active tickets found',
          subtitle: 'Your active tickets & booking details will appear here.',
        }
      : {
          title: 'No Bookings yet',
          subtitle: 'Your past tickets & booking details will appear here.',
        };

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
      onPress: () => setWebMenuOpen(false),
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

  const renderBookingCard = (b: Booking) => {
    const loc = b.listing?.location?.trim();
    const descParts = [b.listing?.title ?? 'Booking', b.guests ? `${b.guests} ${b.guests === 1 ? 'guest' : 'guests'}` : null, loc || null].filter(
      Boolean,
    ) as string[];
    const descLine = descParts.join(' | ');

    return (
      <View key={b.id} style={[dt.card, { width: cardSlotWidth }]}>
        <View style={dt.bookingHeaderRow}>
          <Text variant="caption" style={dt.bookingId}>
            Booking ID# : <Text style={dt.bookingIdBold}>{bookingCode(b.id)}</Text>
          </Text>
        </View>

        <View style={dt.separator} />

        <View style={dt.bookingBodyRow}>
          <View style={dt.thumbWrap}>
            <Image source={ResortImage} style={dt.thumbImg} resizeMode="cover" />
          </View>
          <View style={dt.bookingBodyRight}>
            <Text variant="bodySemibold" numberOfLines={3} style={dt.bookingTitle}>
              {descLine}
            </Text>
            <Text variant="caption" style={dt.bookingMeta}>
              {formatDateRange(b.start_date, b.end_date)}
            </Text>
          </View>
        </View>

        <View style={dt.metaLineRow}>
          <View style={dt.ratingRow}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text variant="caption" style={dt.ratingText}>
              4.5
            </Text>
          </View>
          <Text variant="caption" style={dt.customersText}>
            500+ customers
          </Text>
        </View>

        <Pressable style={dt.messageBtn} accessibilityLabel="Message host">
          <Ionicons name="chatbubbles-outline" size={14} color={colors.text.primary} />
          <Text variant="caption" style={dt.messageBtnText}>
            Message Host
          </Text>
        </Pressable>

        <View style={dt.separator} />

        <View style={dt.detailsGrid}>
          <View style={dt.detailCol}>
            <Text variant="bodySemibold" style={dt.detailLabel}>
              Dates
            </Text>
            <Text variant="caption" style={dt.detailValue}>
              {formatDateRange(b.start_date, b.end_date)}
            </Text>
          </View>
          <View style={dt.detailColRight}>
            <Text variant="bodySemibold" style={dt.detailLabel}>
              Guests
            </Text>
            <Text variant="caption" style={dt.detailValue}>
              {b.guests} adults
            </Text>
          </View>
        </View>

        <View style={dt.totalRow}>
          <View style={dt.totalLeft}>
            <Text variant="bodySemibold" style={dt.detailLabel}>
              Total price
            </Text>
            <Text variant="caption" style={dt.totalValue}>
              <Text style={dt.totalRupee}>{moneyLabel(b.total_amount) ?? '—'}</Text>
              {' including tax'}
            </Text>
          </View>
          <Pressable style={dt.detailsBtn} accessibilityLabel="Details">
            <Text variant="caption" style={dt.detailsBtnText}>
              Details
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const mainBody = () => {
    if (profileLoading) {
      return (
        <View style={dt.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (isUnauthorized) {
      return (
        <View style={dt.centerBlock}>
          <View style={dt.messageCard}>
            <Text variant="heading2" style={dt.messageTitle}>
              {"You're not logged in"}
            </Text>
            <Text variant="body" style={dt.messageBody}>
              Log in to see your tickets and booking details.
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
        <View style={dt.centerBlock}>
          <Text variant="body" style={dt.errorText}>
            {getErrorMessage(profileError as Error)}
          </Text>
          <Button variant="primary" size="default" onPress={() => refetchProfile()}>
            Try again
          </Button>
        </View>
      );
    }
    if (bookingsLoading) {
      return (
        <View style={dt.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (bookingsError) {
      return (
        <View style={dt.centerBlock}>
          <Text variant="body" style={dt.errorText}>
            {getErrorMessage(bookingsError as Error)}
          </Text>
          <Button variant="primary" size="default" onPress={() => refetchBookings()}>
            Try again
          </Button>
        </View>
      );
    }
    if (visibleBookings.length === 0) {
      return (
        <View style={dt.centerBlock}>
          <Text variant="heading2" style={dt.messageTitle}>
            {emptyState.title}
          </Text>
          <Text variant="body" style={dt.messageBody}>
            {emptyState.subtitle}
          </Text>
        </View>
      );
    }
    return <View style={dt.cardRow}>{visibleBookings.map((b) => renderBookingCard(b))}</View>;
  };

  return (
    <SafeAreaView style={dt.page} edges={['top']}>
      <Modal visible={webMenuOpen} transparent animationType="none" onRequestClose={() => setWebMenuOpen(false)}>
        <Pressable style={dt.menuOverlay} onPress={() => setWebMenuOpen(false)}>
          <Pressable style={dt.menuPanel} onPress={(e) => e.stopPropagation()}>
            {webMenuItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {index > 0 ? <View style={dt.menuDivider} /> : null}
                <Pressable
                  style={({ pressed }) => [dt.menuRow, pressed && dt.menuRowPressed]}
                  onPress={item.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View style={dt.menuIconBox}>{item.node}</View>
                  <Text variant="body" style={[dt.menuLabel, item.labelPrimary ? dt.menuLabelLogout : null]}>
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

      <View style={dt.columnFill}>
        <ScrollView style={dt.scrollFlex} contentContainerStyle={dt.scrollContent} showsVerticalScrollIndicator>
          <View style={dt.container}>
            <View style={[dt.header, !isLoggedIn ? dt.headerLoggedOut : null]}>
              <Pressable onPress={() => router.replace('/(tabs)')} accessibilityLabel="Home">
                <Image source={WebLogo} style={dt.logoImg} resizeMode="contain" />
              </Pressable>
              <View style={dt.searchWrap}>
                <Input
                  placeholder="Search"
                  style={[dt.searchInput, !isLoggedIn ? dt.searchInputLoggedOut : null]}
                  placeholderTextColor="rgba(28,32,36,0.7)"
                  editable={false}
                />
                <View style={dt.searchIcon}>
                  <Ionicons name="search" size={18} color={colors.primary} />
                </View>
              </View>
              {isLoggedIn ? (
                <View style={dt.headerActions}>
                  <Pressable style={[dt.iconBtn, dt.avatarBtn]} accessibilityLabel="Profile">
                    <Ionicons name="person-outline" size={20} color={colors.surface.white} />
                  </Pressable>
                  <Pressable style={dt.menuBtn} accessibilityLabel="Menu" onPress={() => setWebMenuOpen(true)}>
                    <Ionicons name="menu" size={24} color={colors.primary} />
                  </Pressable>
                </View>
              ) : (
                <View style={dt.headerAuthActions}>
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

            <Text variant="heading2" style={dt.pageTitle}>
              Ticket details
            </Text>

            <View style={dt.filterBar}>
              <View style={dt.tabGroup}>
                <Pressable
                  onPress={() => setActiveTab('active')}
                  style={[dt.tabChip, activeTab === 'active' && dt.tabChipActive]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeTab === 'active' }}
                >
                  <Ionicons
                    name="ticket-outline"
                    size={18}
                    color={activeTab === 'active' ? colors.surface.white : colors.primary}
                  />
                  <Text style={[dt.tabChipLabel, activeTab === 'active' && dt.tabChipLabelActive]}>Active tickets</Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('past')}
                  style={[dt.tabChip, activeTab === 'past' && dt.tabChipActive]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeTab === 'past' }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={activeTab === 'past' ? colors.surface.white : colors.primary}
                  />
                  <Text style={[dt.tabChipLabel, activeTab === 'past' && dt.tabChipLabelActive]}>Past bookings</Text>
                </Pressable>
              </View>
              <View style={dt.searchFilterRight}>
                <View style={dt.inlineSearchWrap}>
                  <Input
                    placeholder="Search your bookings"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={dt.inlineSearchInput}
                    placeholderTextColor="rgba(28,32,36,0.7)"
                  />
                  <View style={dt.inlineSearchIcon}>
                    <Ionicons name="search" size={18} color={colors.primary} />
                  </View>
                </View>
                <Pressable style={dt.filterBtn} accessibilityLabel="Filter">
                  <FilterIcon width={22} height={22} />
                </Pressable>
              </View>
            </View>

            {mainBody()}
          </View>
        </ScrollView>

        <View style={dt.footer}>
          <View style={dt.footerInner}>
            <View style={dt.footerGroup}>
              <Text variant="caption" style={dt.footerLink}>
                More info
              </Text>
              <Text variant="caption" style={dt.footerLink}>
                Link 1
              </Text>
              <Text variant="caption" style={dt.footerLink}>
                Link 2
              </Text>
            </View>
            <Text variant="caption" style={dt.footerBrand}>
              GOTRIP HOLIDAY
            </Text>
            <View style={dt.footerGroup}>
              <Text variant="caption" style={dt.footerLink}>
                More info
              </Text>
              <Text variant="caption" style={dt.footerLink}>
                Link 1
              </Text>
              <Text variant="caption" style={dt.footerLink}>
                Link 2
              </Text>
            </View>
          </View>
          <Text variant="caption" style={dt.footerCopyright}>
            © Copyright 2026 Gotrip Holiday - All Rights Reserved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const dt = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface.white },
  columnFill: { flex: 1, flexDirection: 'column', minHeight: 0 },
  scrollFlex: { flex: 1, minHeight: 0 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing['8'],
  },
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
    marginBottom: spacing['5'],
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['3'],
    marginBottom: spacing['6'],
    width: '100%',
    flexWrap: 'wrap',
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    flexShrink: 0,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['4'],
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface.white,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabChipLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  tabChipLabelActive: { color: colors.surface.white },
  searchFilterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    flexShrink: 0,
    width: 380,
    maxWidth: '38%',
    minWidth: 200,
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
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing['4'],
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: spacing['6'],
  },
  card: {
    flexShrink: 0,
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,32,36,0.15)',
    gap: spacing['2'],
    ...Platform.select({
      web: { boxShadow: '0px 4px 20px rgba(0,0,0,0.06)' },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },
  bookingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingId: {
    color: 'rgba(0,7,20,0.62)',
  },
  bookingIdBold: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,9,50,0.12)',
  },
  bookingBodyRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  thumbWrap: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.gray['2'],
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  bookingBodyRight: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'flex-start',
    gap: 4,
  },
  bookingTitle: {
    color: colors.text.primary,
    fontSize: 12,
    lineHeight: 16,
  },
  bookingMeta: {
    color: 'rgba(28,32,36,0.6)',
    fontSize: 10,
  },
  metaLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.primary,
    fontSize: 10,
  },
  customersText: {
    color: colors.primary,
    fontSize: 10,
  },
  messageBtn: {
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,9,50,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.surface.white,
  },
  messageBtnText: {
    color: colors.text.primary,
    fontSize: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    color: colors.text.primary,
    fontSize: 12,
  },
  detailValue: {
    color: 'rgba(0,7,20,0.62)',
    fontSize: 10,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  totalLeft: { flex: 1, minWidth: 0, paddingRight: spacing['2'] },
  totalValue: {
    color: 'rgba(0,7,20,0.62)',
    fontSize: 10,
    marginTop: 4,
  },
  totalRupee: {
    color: colors.primary,
    fontWeight: '700',
  },
  detailsBtn: {
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,9,50,0.12)',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  detailsBtnText: {
    color: colors.text.primary,
    fontSize: 10,
  },
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
