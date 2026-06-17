import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  VENDOR_DASHBOARD_BLUE,
  VENDOR_DASHBOARD_BOOKINGS,
  VENDOR_DASHBOARD_CATEGORIES,
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_GREEN,
  VENDOR_DASHBOARD_PROPERTIES,
  VENDOR_DASHBOARD_RED,
  VENDOR_DASHBOARD_SORT_OPTIONS,
  type VendorDashboardBooking,
} from '@/src/constants/vendorDashboardConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { clearVendorSession, getStoredVendorListingCategory } from '@/src/utils/vendorSession';
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

function BookingCard({ booking }: { booking: VendorDashboardBooking }) {
  const meta = `${booking.guests} Guest${booking.guests === 1 ? '' : 's'} | ${booking.dateRange}`;

  if (booking.status === 'pending') {
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingTop}>
          <Text style={styles.guestName}>{booking.guestName}</Text>
          <Text style={styles.bookingMeta}>{meta}</Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <Pressable style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.confirmBtn}>
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </Pressable>
          <Pressable style={styles.phoneBtn}>
            <Ionicons name="call-outline" size={16} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>
    );
  }

  if (booking.status === 'confirmed') {
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingTop}>
          <Text style={styles.guestName}>{booking.guestName}</Text>
          <Text style={styles.bookingMeta}>{meta}</Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <View style={styles.statusBadgeGreen}>
            <Ionicons name="checkmark-circle" size={14} color={VENDOR_DASHBOARD_GREEN} />
            <Text style={styles.statusGreenText}>Booking Confirmed</Text>
          </View>
          <Pressable style={styles.phoneBtn}>
            <Ionicons name="call-outline" size={16} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>
    );
  }

  if (booking.status === 'cancelled') {
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingTop}>
          <Text style={styles.guestName}>{booking.guestName}</Text>
          <Text style={styles.bookingMeta}>{meta}</Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <View style={styles.statusBadgeRed}>
            <Ionicons name="close-circle" size={14} color={VENDOR_DASHBOARD_RED} />
            <Text style={styles.statusRedText}>Booking Cancelled</Text>
          </View>
          <Pressable style={styles.phoneBtn}>
            <Ionicons name="call-outline" size={16} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingTop}>
        <Text style={styles.guestName}>{booking.guestName}</Text>
        <Text style={styles.bookingMeta}>{meta}</Text>
      </View>
      <View style={styles.simpleRow}>
        <Pressable style={styles.viewBookingBtn}>
          <Text style={styles.viewBookingText}>View Booking</Text>
        </Pressable>
        <Pressable style={styles.contactBtn}>
          <Ionicons name="call-outline" size={14} color={colors.text.primary} />
          <Text style={styles.contactBtnText}>Contact</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function MobileVendorDashboardScreen() {
  const storedCategory = useVendorListingCategory();
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
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
    await clearVendorSession();
    router.replace('/');
  };

  const filterSummary =
    filterStart && filterEnd
      ? `${filterStart} – ${filterEnd}`
      : filterStart ?? 'April 3, 2026';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.brand}>{VENDOR_DASHBOARD_COPY.brand}</Text>
            <View style={styles.headerActions}>
              <Ionicons name="search-outline" size={20} color={colors.text.primary} />
              <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
              <Pressable onPress={() => setMenuOpen((v) => !v)} hitSlop={8}>
                <Ionicons name="menu" size={22} color={colors.text.primary} />
              </Pressable>
            </View>
          </View>

          {menuOpen ? (
            <View style={styles.menuCard}>
              <View style={styles.menuProfile}>
                <Image source={HOST_AVATAR} style={styles.menuAvatar} resizeMode="cover" />
                <Text style={styles.menuName}>{VENDOR_DASHBOARD_COPY.profileName}</Text>
              </View>
              <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
                <Ionicons name="person-outline" size={16} color={colors.text.primary} />
                <Text style={styles.menuItemText}>{VENDOR_DASHBOARD_COPY.profileLabel}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={16} color={colors.text.primary} />
                <Text style={styles.menuItemText}>{VENDOR_DASHBOARD_COPY.logoutLabel}</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.categoryRow}>
            {VENDOR_DASHBOARD_CATEGORIES.map((tab) => {
              const selected = tab.id === categoryId;
              return (
                <Pressable
                  key={tab.id}
                  style={[styles.categoryTab, selected && styles.categoryTabSelected]}
                  onPress={() => setCategoryId(tab.id)}
                >
                  <Ionicons
                    name={tab.icon}
                    size={16}
                    color={selected ? VENDOR_DASHBOARD_BLUE : 'rgba(28, 32, 36, 0.45)'}
                  />
                  <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>{VENDOR_DASHBOARD_COPY.dashboardTitle}</Text>
            <Pressable style={styles.unavailabilityBtn}>
              <Ionicons name="calendar-outline" size={14} color={colors.surface.white} />
              <Text style={styles.unavailabilityText}>{VENDOR_DASHBOARD_COPY.markUnavailability}</Text>
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
              <Ionicons name="calendar-outline" size={18} color={colors.text.primary} />
            </Pressable>
            <Pressable style={styles.iconToolBtn} onPress={() => setSortPickerOpen(true)}>
              <Ionicons name="funnel-outline" size={18} color={colors.text.primary} />
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

          <View style={styles.bookingList}>
            {VENDOR_DASHBOARD_BOOKINGS.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <View style={styles.homeTabActive}>
            <Ionicons name="grid-outline" size={16} color={colors.surface.white} />
            <Text style={styles.homeTabText}>{VENDOR_DASHBOARD_COPY.homeTab}</Text>
          </View>
          <Pressable style={styles.navIconBtn}>
            <Ionicons name="business-outline" size={20} color="rgba(28, 32, 36, 0.45)" />
          </Pressable>
          <Pressable style={styles.navIconBtn}>
            <Ionicons name="ticket-outline" size={20} color="rgba(28, 32, 36, 0.45)" />
          </Pressable>
          <Pressable style={styles.navIconBtn}>
            <Ionicons name="person-circle-outline" size={22} color="rgba(28, 32, 36, 0.45)" />
          </Pressable>
        </View>
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
    paddingTop: spacing['3'],
    paddingBottom: spacing['4'],
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_DASHBOARD_BLUE,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.lg,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.surface.white,
  },
  categoryTabSelected: {
    borderColor: VENDOR_DASHBOARD_BLUE,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  categoryLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    color: 'rgba(28, 32, 36, 0.55)',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: VENDOR_DASHBOARD_BLUE,
    fontWeight: typography.fontWeight.semibold,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dashboardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
  },
  unavailabilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: VENDOR_DASHBOARD_RED,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  unavailabilityText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  propertySelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#1F2937',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  propertySelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  iconToolBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  sortCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.lg,
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
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sortValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  bookingList: { gap: 10 },
  bookingCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 10,
    backgroundColor: colors.surface.white,
  },
  bookingTop: { gap: 4 },
  guestName: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  bookingMeta: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: VENDOR_DASHBOARD_BLUE,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_RED,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: VENDOR_DASHBOARD_RED,
  },
  confirmBtn: {
    backgroundColor: VENDOR_DASHBOARD_GREEN,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  confirmBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  phoneBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  statusBadgeGreen: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  statusGreenText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: VENDOR_DASHBOARD_GREEN,
  },
  statusBadgeRed: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  statusRedText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: VENDOR_DASHBOARD_RED,
  },
  simpleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBookingBtn: {
    flex: 1,
    backgroundColor: VENDOR_DASHBOARD_BLUE,
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewBookingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
  },
  contactBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
  },
  homeTabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: VENDOR_DASHBOARD_BLUE,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  homeTabText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
