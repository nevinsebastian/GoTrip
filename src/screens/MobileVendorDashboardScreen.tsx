import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardBookingList } from '@/src/components/vendor/dashboard/VendorDashboardBookingList';
import { VendorDashboardCategoryTabs } from '@/src/components/vendor/dashboard/VendorDashboardCategoryTabs';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import { useVendorTabBarInset } from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import {
  VENDOR_DASHBOARD_BLUE,
  VENDOR_DASHBOARD_CARD_BORDER,
  VENDOR_DASHBOARD_CARD_RADIUS,
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_MARK_RED,
  VENDOR_DASHBOARD_PROPERTIES,
  VENDOR_DASHBOARD_SORT_OPTIONS,
  VENDOR_DASHBOARD_TITLE,
} from '@/src/constants/vendorDashboardConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { useVendorDashboard } from '@/src/hooks/useVendorDashboard';
import { logout } from '@/src/api/auth.service';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const HOST_AVATAR = require('../../loginimage.png');

export function MobileVendorDashboardScreen() {
  const storedCategory = useVendorListingCategory();
  const tabInset = useVendorTabBarInset();
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
  const { data: dashData } = useVendorDashboard();
  const [propertyId, setPropertyId] = useState(VENDOR_DASHBOARD_PROPERTIES[0].id);
  const [sortId, setSortId] = useState('date');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortPickerOpen, setSortPickerOpen] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStart, setFilterStart] = useState<string | null>('2026-04-03');
  const [filterEnd, setFilterEnd] = useState<string | null>('2026-04-05');
  const [filterDraft, setFilterDraft] = useState<{ start: string | null; end: string | null }>({
    start: '2026-04-03',
    end: '2026-04-05',
  });

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const activeProperty =
    VENDOR_DASHBOARD_PROPERTIES.find((p) => p.id === propertyId) ?? VENDOR_DASHBOARD_PROPERTIES[0];

  const markedDates = useMemo(() => {
    if (!filterDraft.start) return {};
    const marks: Record<string, object> = {
      [filterDraft.start]: {
        startingDay: true,
        color: VENDOR_DASHBOARD_BLUE,
        textColor: colors.surface.white,
      },
    };
    if (filterDraft.end && filterDraft.end !== filterDraft.start) {
      marks[filterDraft.end] = {
        endingDay: true,
        color: VENDOR_DASHBOARD_BLUE,
        textColor: colors.surface.white,
      };
    }
    return marks;
  }, [filterDraft.end, filterDraft.start]);

  const onDayPress = (day: DateData) => {
    setFilterDraft((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: day.dateString, end: null };
      }
      if (day.dateString < prev.start) {
        return { start: day.dateString, end: prev.start };
      }
      return { start: prev.start, end: day.dateString };
    });
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.replace('/');
  };

  const filterSummary =
    filterStart && filterEnd
      ? `${filterStart} – ${filterEnd}`
      : filterStart ?? 'April 3, 2026';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar onMenuPress={() => setMenuOpen((v) => !v)} />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset }]}
          showsVerticalScrollIndicator={false}
        >
          {menuOpen ? (
            <View style={styles.menuCard}>
              <View style={styles.menuProfile}>
                <Image source={HOST_AVATAR} style={styles.menuAvatar} resizeMode="cover" />
                <Text style={styles.menuName}>
                  {dashData?.profile?.businessName ?? VENDOR_DASHBOARD_COPY.profileName}
                </Text>
              </View>
              <Pressable style={styles.menuItem} onPress={() => router.push('/vendor/profile')}>
                <Ionicons name="person-outline" size={16} color={colors.text.primary} />
                <Text style={styles.menuItemText}>{VENDOR_DASHBOARD_COPY.profileLabel}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={16} color={colors.text.primary} />
                <Text style={styles.menuItemText}>{VENDOR_DASHBOARD_COPY.logoutLabel}</Text>
              </Pressable>
            </View>
          ) : null}

          <VendorDashboardCategoryTabs selectedId={categoryId} onSelect={setCategoryId} />

          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>{VENDOR_DASHBOARD_COPY.dashboardTitle}</Text>
            <Pressable style={styles.unavailabilityBtn}>
              <Text style={styles.unavailabilityText}>{VENDOR_DASHBOARD_COPY.markUnavailability}</Text>
              <Ionicons name="calendar-outline" size={14} color={colors.surface.white} />
            </Pressable>
          </View>

          <View style={styles.toolbarRow}>
            <Pressable style={styles.propertySelect} onPress={() => setPropertyOpen(true)}>
              <Text style={styles.propertySelectText} numberOfLines={1}>
                {activeProperty.label}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </Pressable>
            <Pressable style={styles.iconToolBtn} onPress={() => setFilterOpen(true)}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.primary} />
            </Pressable>
            <Pressable style={styles.iconToolBtn} onPress={() => setSortPickerOpen(true)}>
              <Ionicons name="funnel-outline" size={16} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.sortCard}>
            <Text style={styles.sortLabel}>{VENDOR_DASHBOARD_COPY.sortLabel}</Text>
            <Pressable style={styles.sortValueRow} onPress={() => setSortPickerOpen(true)}>
              <Text style={styles.sortValue}>
                {VENDOR_DASHBOARD_SORT_OPTIONS.find((o) => o.id === sortId)?.label ?? 'Date'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
            </Pressable>
          </View>

          <VendorDashboardBookingList
            bookings={
              dashData?.recentBookings?.map((b) => ({
                id: b.id,
                guestName: b.guestName ?? 'Guest',
                guests: b.adults ?? b.guests ?? 1,
                dateRange: b.checkIn && b.checkOut ? `${b.checkIn} – ${b.checkOut}` : '',
                status: (['pending', 'confirmed', 'cancelled'].includes(b.status)
                  ? b.status
                  : 'simple') as import('@/src/constants/vendorDashboardConstants').VendorBookingStatus,
                listingLabel: b.listingTitle ?? '',
                listingTheme: 'green' as const,
              })) ?? undefined
            }
          />
        </ScrollView>
      </View>

      <VendorPropertyOptionSheet
        visible={propertyOpen}
        title="Select property"
        options={VENDOR_DASHBOARD_PROPERTIES.map((p) => ({ id: p.id, label: p.label }))}
        selectedId={propertyId}
        onClose={() => setPropertyOpen(false)}
        onSelect={(id) => {
          setPropertyId(id);
          setPropertyOpen(false);
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
          <Pressable style={styles.filterSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.filterTitle}>{VENDOR_DASHBOARD_COPY.filterTitle}</Text>
            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={{
                todayTextColor: VENDOR_DASHBOARD_BLUE,
                arrowColor: VENDOR_DASHBOARD_BLUE,
                selectedDayBackgroundColor: VENDOR_DASHBOARD_BLUE,
              }}
            />
            <View style={styles.filterActions}>
              <Pressable style={styles.filterCancelBtn} onPress={() => setFilterOpen(false)}>
                <Text style={styles.filterCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.filterSelectBtn}
                onPress={() => {
                  setFilterStart(filterDraft.start);
                  setFilterEnd(filterDraft.end);
                  setFilterOpen(false);
                }}
              >
                <Text style={styles.filterSelectText}>Select</Text>
              </Pressable>
            </View>
            <Text style={styles.filterSummary}>{filterSummary}</Text>
            <Pressable
              onPress={() => {
                setFilterDraft({ start: null, end: null });
                setFilterStart(null);
                setFilterEnd(null);
              }}
            >
              <Text style={styles.clearSelection}>{VENDOR_DASHBOARD_COPY.clearSelection}</Text>
            </Pressable>
            <Pressable
              style={styles.applyFilterBtn}
              onPress={() => {
                setFilterStart(filterDraft.start);
                setFilterEnd(filterDraft.end);
                setFilterOpen(false);
              }}
            >
              <Text style={styles.applyFilterText}>{VENDOR_DASHBOARD_COPY.applyFilter}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
  menuCard: {
    alignSelf: 'flex-end',
    width: 180,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.white,
    padding: 12,
    gap: 8,
    marginTop: -8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  menuProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.1)',
  },
  menuAvatar: { width: 32, height: 32, borderRadius: 16 },
  menuName: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  menuItemText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 2,
  },
  dashboardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_DASHBOARD_TITLE,
    flex: 1,
  },
  unavailabilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: VENDOR_DASHBOARD_MARK_RED,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  unavailabilityText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface.white,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
    height: 34,
  },
  propertySelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    height: 34,
    backgroundColor: '#1F2937',
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  propertySelectText: {
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
  sortCard: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface.white,
  },
  sortLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  sortValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sortValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: spacing['4'],
  },
  filterSheet: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 12,
  },
  filterTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 10,
  },
  filterCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterCancelText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  filterSelectBtn: {
    flex: 1,
    backgroundColor: VENDOR_DASHBOARD_BLUE,
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterSelectText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  filterSummary: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
    textAlign: 'center',
  },
  clearSelection: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: VENDOR_DASHBOARD_BLUE,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  applyFilterBtn: {
    backgroundColor: '#9F1239',
    borderRadius: borderRadius.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyFilterText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
