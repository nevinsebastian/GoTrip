import BellIcon from '@/assets/images/bell.svg';
import { IconButton, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { useBookings } from '@/src/hooks/useBookings';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Light peach/orange background from Figma Ticket details screen
const TICKETS_BG = '#FFF8F6';
const ResortImage = require('../../assets/images/resort.jpg');

type TabKey = 'active' | 'past';

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { width, isMobile, isTablet } = useResponsive();
  const { height } = useWindowDimensions();

  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;
  const { data: bookingsRes, isLoading, error } = useBookings({ page: 1, limit: 20 });

  const toDateOnly = (input: string) => {
    const d = new Date(input);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const bookings = bookingsRes?.data ?? [];
  const filteredByDate = bookings.filter((b) => {
    const start = toDateOnly(b.start_date);
    return activeTab === 'active' ? start.getTime() >= todayOnly.getTime() : start.getTime() < todayOnly.getTime();
  });

  const search = searchQuery.trim().toLowerCase();
  const visibleBookings = filteredByDate.filter((b) => {
    if (!search) return true;
    const title = (b.listing?.title ?? '').toLowerCase();
    const location = (b.listing?.location ?? '').toLowerCase();
    return b.id.toLowerCase().includes(search) || title.includes(search) || location.includes(search);
  });

  const formatDateRange = (start: string, end: string) => {
    // Input: YYYY-MM-DD
    const fmt = (d: string) => {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return d;
      return dt.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const bookingCode = (id: string) => {
    // Figma shows like B27641; generate a stable short code.
    const digits = id.replace(/\D/g, '');
    const tail = (digits || id.replace(/-/g, '')).slice(-5);
    return `B${tail.toUpperCase()}`;
  };

  const moneyLabel = (value?: string | null) => {
    const num = Number(value ?? '');
    if (!Number.isFinite(num)) return null;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  const emptyState = activeTab === 'active'
    ? {
        title: 'No Active tickets found',
        subtitle: 'Your active tickets & booking details will appear here.',
      }
    : {
        title: 'No Bookings yet',
        subtitle: 'Your past tickets & booking details will appear here.',
      };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: TICKETS_BG }]} edges={['top']}>
      <View style={styles.bgWrap} pointerEvents="none">
        <LinearGradient
          colors={['#FCFCFC', '#FFDCD3']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.bgGradient}
        />
      </View>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
        <IconButton
          icon="chevron-back"
          size={isMobile ? 24 : 26}
          color={colors.primary}
          onPress={() => router.replace('/(tabs)')}
        />
        <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
          Ticket details
        </Text>
        <Pressable
          style={styles.bellWrap}
          onPress={() => {}}
          hitSlop={12}
          accessibilityLabel="Notifications"
        >
          <BellIcon width={bellIconSize} height={bellIconSize} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={[styles.searchWrap, { paddingHorizontal: contentPadding }]}>
        <Input
          variant="search"
          showSearchIcon
          placeholder="Search your bookings"
          placeholderTextColor={colors.text.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { paddingHorizontal: contentPadding }]}>
        <View style={styles.tabsPill}>
          <Pressable
            style={styles.tabPillBtn}
            onPress={() => setActiveTab('active')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'active' }}
          >
            <Text
              variant="bodySemibold"
              style={[styles.tabLabel, activeTab === 'active' && styles.tabLabelActive]}
            >
              Active tickets
            </Text>
            {activeTab === 'active' ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
          <Pressable
            style={styles.tabPillBtn}
            onPress={() => setActiveTab('past')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'past' }}
          >
            <Text
              variant="bodySemibold"
              style={[styles.tabLabel, activeTab === 'past' && styles.tabLabelActive]}
            >
              Past bookings
            </Text>
            {activeTab === 'past' ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
        </View>
        <Pressable style={styles.sortBtn} accessibilityLabel="Sort">
          <Ionicons name="swap-vertical" size={18} color={colors.text.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentWrap,
          {
            minHeight: height * 0.35,
            paddingHorizontal: contentPadding,
            maxWidth: width >= 1024 ? 600 : undefined,
            alignSelf: width >= 1024 ? 'center' : 'stretch',
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <View style={styles.emptyState}>
            <Text variant="heading2" style={styles.emptyTitle}>
              Unable to load bookings
            </Text>
            <Text variant="body" style={styles.emptySubtitle}>
              {getErrorMessage(error)}
            </Text>
          </View>
        ) : isLoading ? (
          <View style={styles.emptyState}>
            <Text variant="body" style={styles.emptySubtitle}>
              Loading bookings...
            </Text>
          </View>
        ) : visibleBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="heading2" style={styles.emptyTitle}>
              {emptyState.title}
            </Text>
            <Text variant="body" style={styles.emptySubtitle}>
              {emptyState.subtitle}
            </Text>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {visibleBookings.map((b) => (
              <View key={b.id} style={styles.bookingCard}>
                <Pressable
                  style={styles.bookingHeaderRow}
                  onPress={() => setExpandedId((prev) => (prev === b.id ? null : b.id))}
                  accessibilityLabel="Toggle booking details"
                >
                  <Text variant="caption" style={styles.bookingId}>
                    Booking ID# : <Text variant="caption" style={styles.bookingIdBold}>{bookingCode(b.id)}</Text>
                  </Text>
                  <Ionicons
                    name={expandedId === b.id ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.text.secondary}
                  />
                </Pressable>

                <View style={styles.separator} />

                <View style={styles.bookingBodyRow}>
                  <View style={styles.thumbWrap}>
                    <Image source={ResortImage} style={styles.thumbImg} resizeMode="cover" />
                  </View>
                  <View style={styles.bookingBodyRight}>
                    <Text variant="bodySemibold" numberOfLines={2} style={styles.bookingTitle}>
                      {b.listing?.title ?? 'Booking'}
                    </Text>
                    <Text variant="caption" style={styles.bookingMeta}>
                      {formatDateRange(b.start_date, b.end_date)}
                    </Text>
                  </View>
                </View>

                {expandedId === b.id ? (
                  <>
                    <View style={styles.metaLineRow}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color={colors.primary} />
                        <Text variant="caption" style={styles.ratingText}>
                          4.5
                        </Text>
                      </View>
                      <Text variant="caption" style={styles.customersText}>
                        500+ customers
                      </Text>
                    </View>

                    <Pressable style={styles.messageBtn} accessibilityLabel="Message host">
                      <Ionicons name="chatbubbles-outline" size={14} color={colors.text.primary} />
                      <Text variant="caption" style={styles.messageBtnText}>
                        Message Host
                      </Text>
                    </Pressable>

                    <View style={styles.separator} />

                    <View style={styles.detailsGrid}>
                      <View style={styles.detailCol}>
                        <Text variant="bodySemibold" style={styles.detailLabel}>
                          Dates
                        </Text>
                        <Text variant="caption" style={styles.detailValue}>
                          {formatDateRange(b.start_date, b.end_date)}
                        </Text>
                      </View>
                      <View style={styles.detailColRight}>
                        <Text variant="bodySemibold" style={styles.detailLabel}>
                          Guests
                        </Text>
                        <Text variant="caption" style={styles.detailValue}>
                          {b.guests} adults
                        </Text>
                      </View>
                    </View>

                    <View style={styles.totalRow}>
                      <View>
                        <Text variant="bodySemibold" style={styles.detailLabel}>
                          Total price
                        </Text>
                        <Text variant="caption" style={styles.totalValue}>
                          {(moneyLabel(b.total_amount) ?? '—') + ' including tax'}
                        </Text>
                      </View>
                      <Pressable style={styles.detailsBtn} accessibilityLabel="Details">
                        <Text variant="caption" style={styles.detailsBtnText}>
                          Details
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: spacing['2'],
  },
  headerTitle: {
    flex: 1,
    marginLeft: spacing['1'],
  },
  bellWrap: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  searchWrap: {
    marginBottom: spacing['4'],
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing['2'],
    gap: spacing['3'],
  },
  tabsPill: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  tabPillBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    color: '#B9BBC6',
    fontSize: 12,
  },
  tabLabelActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  sortBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  contentWrap: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingVertical: spacing['8'],
  },
  listWrap: {
    gap: spacing['3'],
    paddingVertical: spacing['2'],
  },
  bookingCard: {
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 8,
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
  },
  thumbWrap: {
    width: 103,
    height: 63,
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
    justifyContent: 'space-between',
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
  totalValue: {
    color: 'rgba(0,7,20,0.62)',
    fontSize: 10,
    marginTop: 4,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['6'],
  },
  emptyTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
});
