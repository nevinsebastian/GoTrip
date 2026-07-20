import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorBookingCard } from '@/src/components/vendor/bookings/VendorBookingCard';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import {
  VENDOR_BOOKINGS_COPY,
  VENDOR_DASHBOARD_CARD_BORDER,
  VENDOR_DASHBOARD_CARD_RADIUS,
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_SORT_OPTIONS,
  type VendorBookingStatus,
} from '@/src/constants/vendorDashboardConstants';
import { useVendorBookings } from '@/src/hooks/useVendorBookings';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const LISTINGS_FILTER_BG = '#9F1239';

export function MobileVendorBookingsScreen() {
  const tabInset = useVendorTabBarInset();
  const [listingFilterId, setListingFilterId] = useState('all');
  const [listingOpen, setListingOpen] = useState(false);
  const [sortPickerOpen, setSortPickerOpen] = useState(false);
  const [sortId, setSortId] = useState('date');
  const [filterOpen, setFilterOpen] = useState(false);

  const { bookings, isLoading } = useVendorBookings();

  const listingOptions = [{ id: 'all', label: VENDOR_BOOKINGS_COPY.allListings }];
  const activeListing = listingOptions[0];

  const displayBookings = bookings
    .filter((b) => listingFilterId === 'all' || b.listingId === listingFilterId)
    .map((b) => ({
      id: b.id,
      guestName: b.guestName ?? 'Guest',
      guests: b.adults ?? b.guests ?? 1,
      dateRange: b.checkIn && b.checkOut ? `${b.checkIn} – ${b.checkOut}` : '',
      status: (['pending', 'confirmed', 'cancelled'].includes(b.status)
        ? b.status
        : 'simple') as VendorBookingStatus,
      listingLabel: b.listingTitle ?? '',
      listingTheme: 'green' as const,
    }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.screenHeader}>
            <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
            </Pressable>
            <Text style={styles.screenTitle}>{VENDOR_BOOKINGS_COPY.title}</Text>
          </View>

          <View style={styles.toolbarRow}>
            <Pressable style={styles.listingsFilter} onPress={() => setListingOpen(true)}>
              <Ionicons name="business-outline" size={14} color={colors.surface.white} />
              <Text style={styles.listingsFilterText} numberOfLines={1}>
                {activeListing.label}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </Pressable>
            <Pressable style={styles.iconToolBtn} onPress={() => setFilterOpen(true)}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.primary} />
            </Pressable>
            <Pressable style={styles.iconToolBtn} onPress={() => setSortPickerOpen(true)}>
              <Ionicons name="swap-vertical-outline" size={16} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.list}>
            {isLoading ? (
              <Text style={{ textAlign: 'center', color: colors.text.secondary, marginTop: 24 }}>
                Loading bookings…
              </Text>
            ) : displayBookings.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.text.secondary, marginTop: 24 }}>
                No bookings found.
              </Text>
            ) : (
              displayBookings.map((booking) => (
                <VendorBookingCard key={booking.id} booking={booking} />
              ))
            )}
          </View>
        </ScrollView>

        <VendorPropertyOptionSheet
          visible={listingOpen}
          title={VENDOR_BOOKINGS_COPY.allListings}
          options={listingOptions}
          selectedId={listingFilterId}
          onClose={() => setListingOpen(false)}
          onSelect={(id) => {
            setListingFilterId(id);
            setListingOpen(false);
          }}
        />

        <VendorPropertyOptionSheet
          visible={sortPickerOpen}
          title={VENDOR_DASHBOARD_COPY.sortLabel}
          options={VENDOR_DASHBOARD_SORT_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
          selectedId={sortId}
          onClose={() => setSortPickerOpen(false)}
          onSelect={(id) => {
            setSortId(id);
            setSortPickerOpen(false);
          }}
        />

        <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)}>
            <View style={styles.filterSheet}>
              <Text style={styles.filterTitle}>{VENDOR_DASHBOARD_COPY.filterTitle}</Text>
              <Pressable style={styles.filterCloseBtn} onPress={() => setFilterOpen(false)}>
                <Text style={styles.filterCloseText}>{VENDOR_DASHBOARD_COPY.applyFilter}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        <VendorWorkspaceFloatingTabBar activeTab="bookings" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    gap: 14,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 34,
  },
  listingsFilter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 34,
    backgroundColor: LISTINGS_FILTER_BG,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 12,
  },
  listingsFilterText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  iconToolBtn: {
    width: 34,
    height: 34,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  list: { gap: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 12,
  },
  filterTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  filterCloseBtn: {
    alignSelf: 'flex-end',
    backgroundColor: LISTINGS_FILTER_BG,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterCloseText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
