/**
 * Desktop web-only tickets / bookings (Figma ticket details).
 * Gated by parent: Platform.OS === 'web' && isDesktop.
 */

import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import FilterIcon from '@/assets/images/wishlist-desktop-figma/filter-icon.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import { Button, Input, Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import type { Booking } from '@/src/api/types';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { DesktopNavFrame } from '@/src/components/desktop/DesktopNavFrame';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import { DesktopWebNav } from '@/src/components/desktop/DesktopWebNav';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { DESKTOP_LAYOUT, desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_VENDOR_LANDING } from '@/src/constants/desktopWebConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { useBookings } from '@/src/hooks/useBookings';
import { useMyPackageEnquiries } from '@/src/hooks/usePackageUser';
import { PackageEnquiryCard } from '@/src/components/package/PackageEnquiryCard';
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

const ResortImage = RESORT_PLACEHOLDER_IMAGE;
const GRID_COLS = 3;
const GRID_GAP = 24;
const THUMB_W = 145;
const THUMB_H = 95;

type TabKey = 'active' | 'past' | 'enquiries';

function toDateOnly(input: string) {
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatCompactDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    return `${start} - ${end}`;
  }
  const month = s.toLocaleString('en-US', { month: 'long' });
  const year = s.getFullYear();
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}-${e.getDate()} ${month} ${year}`;
  }
  const fmt = (d: Date) =>
    d.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${fmt(s)} - ${fmt(e)}`;
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
  const { activeCategoryTab, setActiveCategoryTab, exitSearchMode } = useHomeSearch();

  const [activeTab, setActiveTab] = useState<TabKey>('past');
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
  } = useBookings({ limit: 20, offset: 0 }, canFetchBookings);

  const {
    data: enquiriesRes,
    isLoading: enquiriesLoading,
    error: enquiriesError,
    refetch: refetchEnquiries,
  } = useMyPackageEnquiries({ limit: 20, offset: 0 }, canFetchBookings);

  const isLoggedIn = Boolean(user) && !isUnauthorized;

  const cardSlotWidth = useMemo(() => {
    const contentWidth = Math.min(viewportW, DESKTOP_LAYOUT.maxWidth) - DESKTOP_LAYOUT.gutter * 2;
    const equal = (contentWidth - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS;
    return Math.max(280, Math.floor(equal));
  }, [viewportW]);

  const todayOnly = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);

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

  const enquiries = enquiriesRes?.data ?? [];
  const filteredEnquiries = enquiries.filter((e) => {
    if (!search) return true;
    const title = (e.listing?.title ?? '').toLowerCase();
    return e.id.toLowerCase().includes(search) || title.includes(search);
  });

  const emptyState =
    activeTab === 'enquiries'
      ? {
          title: 'No package enquiries',
          subtitle: 'Enquiries you send from package pages will appear here.',
        }
      : activeTab === 'active'
      ? {
          title: 'No Active tickets found',
          subtitle: 'Your active tickets & booking details will appear here.',
        }
      : {
          title: 'No Bookings yet',
          subtitle: 'Your past tickets & booking details will appear here.',
        };

  const handleTabChange = (tab: HomeCategoryTab) => {
    setActiveCategoryTab(tab);
    exitSearchMode();
    router.replace('/(tabs)');
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
    const title = b.listing?.title ?? 'Booking';
    const dateLabel = formatCompactDateRange(b.start_date, b.end_date);

    return (
      <View key={b.id} style={[dt.card, { width: cardSlotWidth }]}>
        <View style={dt.bookingHeaderRow}>
          <Text style={dt.bookingId}>
            Booking ID# : <Text style={dt.bookingIdBold}>{bookingCode(b.id)}</Text>
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.text.primary} />
        </View>

        <View style={dt.bookingBodyRow}>
          <View style={dt.thumbWrap}>
            <Image source={ResortImage} style={dt.thumbImg} resizeMode="cover" />
          </View>
          <View style={dt.bookingBodyRight}>
            <Text numberOfLines={3} style={dt.bookingTitle}>
              {title}
            </Text>
            <View style={dt.ratingRow}>
              <Ionicons name="star" size={12} color={colors.accent.main} />
              <Text style={dt.ratingText}>4.5</Text>
              <Text style={dt.ratingDivider}>|</Text>
              <Text style={dt.ratingText}>500+ customers</Text>
            </View>
          </View>
        </View>

        <Pressable style={dt.messageBtn} accessibilityLabel="Message host">
          <Ionicons name="chatbubbles-outline" size={14} color={colors.text.primary} />
          <Text style={dt.messageBtnText}>Message Host</Text>
        </Pressable>

        <View style={dt.detailsBox}>
          <View style={dt.detailsGrid}>
            <View style={dt.detailCol}>
              <Text style={dt.detailLabel}>Dates</Text>
              <Text style={dt.detailValue}>{dateLabel}</Text>
            </View>
            <View style={dt.detailColRight}>
              <Text style={dt.detailLabel}>Guests</Text>
              <Text style={dt.detailValue}>{b.guests} adults</Text>
            </View>
          </View>

          <View style={dt.totalRow}>
            <View style={dt.totalLeft}>
              <Text style={dt.detailLabel}>Total price</Text>
              <Text style={dt.totalValue}>
                <Text style={dt.totalRupee}>{moneyLabel(b.total_amount) ?? '—'}</Text>
                {' including tax'}
              </Text>
            </View>
            <Pressable style={dt.detailsBtn} accessibilityLabel="Details">
              <Text style={dt.detailsBtnText}>Details</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const mainBody = () => {
    if (profileLoading) {
      return (
        <View style={dt.centerBlock}>
          <ActivityIndicator size="large" color={colors.accent.main} />
        </View>
      );
    }
    if (isUnauthorized) {
      return (
        <View style={dt.centerBlock}>
          <View style={dt.messageCard}>
            <Text style={dt.messageTitle}>{"You're not logged in"}</Text>
            <Text style={dt.messageBody}>Log in to see your tickets and booking details.</Text>
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
          <Text style={dt.errorText}>{getErrorMessage(profileError as Error)}</Text>
          <Button variant="primary" size="default" onPress={() => refetchProfile()}>
            Try again
          </Button>
        </View>
      );
    }
    if (activeTab === 'enquiries') {
      if (enquiriesLoading) {
        return (
          <View style={dt.centerBlock}>
            <ActivityIndicator size="large" color={colors.accent.main} />
          </View>
        );
      }
      if (enquiriesError) {
        return (
          <View style={dt.centerBlock}>
            <Text style={dt.errorText}>{getErrorMessage(enquiriesError as Error)}</Text>
            <Button variant="primary" size="default" onPress={() => refetchEnquiries()}>
              Try again
            </Button>
          </View>
        );
      }
      if (filteredEnquiries.length === 0) {
        return (
          <View style={dt.centerBlock}>
            <Text style={dt.messageTitle}>{emptyState.title}</Text>
            <Text style={dt.messageBody}>{emptyState.subtitle}</Text>
          </View>
        );
      }
      return (
        <View style={dt.enquiryList}>
          {filteredEnquiries.map((enquiry) => (
            <PackageEnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              onViewPackage={() =>
                router.push({ pathname: '/package/[id]', params: { id: enquiry.listingId } })
              }
            />
          ))}
        </View>
      );
    }
    if (bookingsLoading) {
      return (
        <View style={dt.centerBlock}>
          <ActivityIndicator size="large" color={colors.accent.main} />
        </View>
      );
    }
    if (bookingsError) {
      return (
        <View style={dt.centerBlock}>
          <Text style={dt.errorText}>{getErrorMessage(bookingsError as Error)}</Text>
          <Button variant="primary" size="default" onPress={() => refetchBookings()}>
            Try again
          </Button>
        </View>
      );
    }
    if (visibleBookings.length === 0) {
      return (
        <View style={dt.centerBlock}>
          <Text style={dt.messageTitle}>{emptyState.title}</Text>
          <Text style={dt.messageBody}>{emptyState.subtitle}</Text>
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
                  <Text style={[dt.menuLabel, item.labelPrimary ? dt.menuLabelLogout : null]}>{item.label}</Text>
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

      <ScrollView style={dt.scroll} contentContainerStyle={dt.scrollContent} showsVerticalScrollIndicator>
        <View style={dt.contentShell}>
          <DesktopNavFrame>
            <DesktopWebNav
              embedded
              activeTab={activeCategoryTab}
              onTabChange={handleTabChange}
              isLoggedIn={isLoggedIn}
              onMenuPress={() => setWebMenuOpen(true)}
              onProfilePress={() => router.push('/(tabs)/four')}
              onLoginPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
            />
          </DesktopNavFrame>

          <Text style={dt.pageTitle}>Ticket details</Text>

          <View style={dt.filterBar}>
            <View style={dt.tabGroup}>
              <Pressable
                onPress={() => setActiveTab('active')}
                style={[dt.tabChip, activeTab === 'active' && dt.tabChipActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === 'active' }}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={activeTab === 'active' ? colors.surface.white : colors.accent.main}
                />
                <Text style={[dt.tabChipLabel, activeTab === 'active' && dt.tabChipLabelActive]}>Active Tickets</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('past')}
                style={[dt.tabChip, activeTab === 'past' && dt.tabChipActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === 'past' }}
              >
                <Ionicons
                  name="clipboard-outline"
                  size={16}
                  color={activeTab === 'past' ? colors.surface.white : colors.accent.main}
                />
                <Text style={[dt.tabChipLabel, activeTab === 'past' && dt.tabChipLabelActive]}>Past Bookings</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('enquiries')}
                style={[dt.tabChip, activeTab === 'enquiries' && dt.tabChipActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === 'enquiries' }}
              >
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={activeTab === 'enquiries' ? colors.surface.white : colors.accent.main}
                />
                <Text style={[dt.tabChipLabel, activeTab === 'enquiries' && dt.tabChipLabelActive]}>
                  Enquiries
                </Text>
              </Pressable>
            </View>

            <View style={dt.searchFilterRight}>
              <View style={dt.inlineSearchWrap}>
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={dt.inlineSearchInput}
                  placeholderTextColor="rgba(28,32,36,0.5)"
                />
                <View style={dt.inlineSearchIcon}>
                  <Ionicons name="search" size={18} color={colors.accent.main} />
                </View>
              </View>
              <Pressable style={dt.filterBtn} accessibilityLabel="Filter">
                <FilterIcon width={22} height={22} />
              </Pressable>
            </View>
          </View>

          {mainBody()}

          <Text style={dt.introText}>{DESKTOP_VENDOR_LANDING.discoverBody}</Text>
        </View>

        <DesktopSiteFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const dt = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  contentShell: {
    ...desktopContentShellStyle,
    paddingTop: 24,
    gap: 24,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['3'],
    flexWrap: 'wrap',
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
  },
  tabChipActive: {
    backgroundColor: colors.accent.main,
    borderColor: colors.accent.main,
  },
  tabChipLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  tabChipLabelActive: {
    color: colors.surface.white,
  },
  searchFilterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 280,
    maxWidth: 420,
    justifyContent: 'flex-end',
  },
  inlineSearchWrap: {
    flex: 1,
    position: 'relative',
  },
  inlineSearchInput: {
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    paddingLeft: 16,
    paddingRight: 40,
  },
  inlineSearchIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    width: '100%',
  },
  enquiryList: {
    width: '100%',
    gap: 12,
    maxWidth: 720,
  },
  card: {
    flexShrink: 0,
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    gap: 12,
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
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  bookingIdBold: {
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  bookingBodyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumbWrap: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.gray['2'],
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  bookingBodyRight: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  bookingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 18,
    color: colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.accent.main,
  },
  ratingDivider: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.accent.main,
  },
  messageBtn: {
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.surface.white,
  },
  messageBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    backgroundColor: 'rgba(28, 32, 36, 0.02)',
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
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  detailValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.65)',
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  totalLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  totalValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.65)',
    marginTop: 4,
  },
  totalRupee: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.main,
  },
  detailsBtn: {
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  detailsBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.primary,
  },
  centerBlock: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['7'],
    width: '100%',
  },
  messageCard: {
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: spacing['6'],
    maxWidth: 440,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    gap: 12,
  },
  messageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  messageBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.primaryAlt,
    marginBottom: spacing['4'],
    textAlign: 'center',
  },
  introText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.7)',
    textAlign: 'center',
    paddingVertical: 8,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 32,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } as Record<string, string>)
      : {}),
  },
  menuPanel: {
    width: 280,
    borderRadius: 16,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 12px 40px rgba(0,0,0,0.18)' } }),
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    gap: spacing['3'],
  },
  menuRowPressed: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 92, 55, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  menuLabelLogout: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.semibold,
  },
});
