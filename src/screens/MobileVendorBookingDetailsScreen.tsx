import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import {
  VENDOR_DASHBOARD_BRAND_BLUE,
  VENDOR_DASHBOARD_BTN_RED,
  VENDOR_DASHBOARD_CARD_BORDER,
  VENDOR_DASHBOARD_CARD_RADIUS,
  VENDOR_DASHBOARD_PROPERTIES,
} from '@/src/constants/vendorDashboardConstants';
import {
  VENDOR_VIEW_BOOKING_COPY,
  VENDOR_WORKSPACE_BOOKING_DETAILS,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONFIRM_GREEN = '#22C55E';
const PRICE_BANNER_BG = 'rgba(44, 100, 150, 0.08)';

export function MobileVendorBookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = VENDOR_WORKSPACE_BOOKING_DETAILS[id ?? 'b1'] ?? VENDOR_WORKSPACE_BOOKING_DETAILS.b1;
  const tabInset = useVendorTabBarInset();
  const [propertyIndex, setPropertyIndex] = useState(0);

  const properties = useMemo(
    () => VENDOR_DASHBOARD_PROPERTIES.map((p) => p.label),
    [],
  );
  const activeProperty = properties[propertyIndex] ?? properties[0];
  const isPending = booking.status === 'pending';

  const handlePrevProperty = () => {
    setPropertyIndex((i) => (i === 0 ? properties.length - 1 : i - 1));
  };

  const handleNextProperty = () => {
    setPropertyIndex((i) => (i === properties.length - 1 ? 0 : i + 1));
  };

  const handleCancel = () => {
    router.push('/vendor/cancel-booking');
  };

  const handleConfirm = () => {
    router.replace('/vendor/bookings');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />

        <View style={styles.screenHeader}>
          <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
          </Pressable>
          <Text style={styles.screenTitle}>{VENDOR_VIEW_BOOKING_COPY.title}</Text>
        </View>

        <View style={styles.propertyNavRow}>
          <View style={styles.propertyPill}>
            <Text style={styles.propertyPillText} numberOfLines={1}>
              {activeProperty}
            </Text>
          </View>
          <Pressable style={styles.navArrowBtn} onPress={handlePrevProperty}>
            <Ionicons name="chevron-back" size={16} color={colors.text.primary} />
          </Pressable>
          <Pressable style={styles.navArrowBtn} onPress={handleNextProperty}>
            <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bookingCard}>
            <Text style={styles.bookingId}>
              {VENDOR_VIEW_BOOKING_COPY.bookingIdLabel}{' '}
              <Text style={styles.bookingIdValue}>{booking.bookingRef}</Text>
            </Text>
            <View style={styles.idDivider}>
              <View style={styles.idDividerActive} />
              <View style={styles.idDividerRest} />
            </View>

            <View style={styles.propertyRow}>
              <Image source={booking.propertyImage} style={styles.propertyThumb} resizeMode="cover" />
              <Text style={styles.propertyDescription}>{booking.propertyDescription}</Text>
            </View>

            <View style={styles.guestRow}>
              <Image source={booking.guestAvatar} style={styles.guestAvatar} resizeMode="cover" />
              <View>
                <Text style={styles.guestLabel}>{VENDOR_VIEW_BOOKING_COPY.guestLabel}</Text>
                <Text style={styles.guestName}>{booking.guestTitle}</Text>
              </View>
            </View>

            <View style={styles.commRow}>
              <Pressable style={styles.commBtn}>
                <Ionicons name="call-outline" size={16} color={colors.text.primary} />
                <Text style={styles.commText}>{VENDOR_VIEW_BOOKING_COPY.contact}</Text>
              </Pressable>
              <Pressable style={styles.commBtn}>
                <Ionicons name="chatbubble-outline" size={16} color={colors.text.primary} />
                <Text style={styles.commText}>{VENDOR_VIEW_BOOKING_COPY.message}</Text>
              </Pressable>
            </View>

            <View style={styles.metaBox}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>{VENDOR_VIEW_BOOKING_COPY.datesLabel}</Text>
                <Text style={styles.metaValue}>{booking.dateRangeDisplay}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>{VENDOR_VIEW_BOOKING_COPY.guestsLabel}</Text>
                <Text style={styles.metaValue}>{booking.guestsLabel}</Text>
              </View>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>{VENDOR_VIEW_BOOKING_COPY.totalPrice}</Text>
              <Text style={styles.priceValue}>{booking.priceDisplay}</Text>
            </View>

            {isPending ? (
              <View style={styles.pendingActions}>
                <Pressable style={styles.cancelBtn} onPress={handleCancel}>
                  <View style={styles.actionIconCircle}>
                    <Ionicons name="close" size={14} color={VENDOR_DASHBOARD_BTN_RED} />
                  </View>
                  <Text style={styles.cancelBtnText}>{VENDOR_VIEW_BOOKING_COPY.cancel}</Text>
                </Pressable>
                <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                  <View style={styles.actionIconCircle}>
                    <Ionicons name="checkmark" size={14} color={CONFIRM_GREEN} />
                  </View>
                  <Text style={styles.confirmBtnText}>{VENDOR_VIEW_BOOKING_COPY.confirm}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.contactOnlyBtn}>
                <Ionicons name="call-outline" size={16} color={colors.text.primary} />
                <Text style={styles.contactOnlyText}>{VENDOR_VIEW_BOOKING_COPY.contact}</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <VendorWorkspaceFloatingTabBar activeTab="bookings" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['2'],
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
  propertyNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['3'],
  },
  propertyPill: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  propertyPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    padding: 12,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  bookingId: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  bookingIdValue: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  idDivider: {
    flexDirection: 'row',
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
  },
  idDividerActive: {
    width: '28%',
    backgroundColor: VENDOR_DASHBOARD_BRAND_BLUE,
  },
  idDividerRest: { flex: 1 },
  propertyRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  propertyThumb: {
    width: 72,
    height: 56,
    borderRadius: 8,
  },
  propertyDescription: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 18,
    color: colors.text.primary,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  guestAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  guestLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  guestName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  commRow: {
    flexDirection: 'row',
    gap: 8,
  },
  commBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingVertical: 10,
    backgroundColor: colors.surface.white,
  },
  commText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  metaBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    padding: 12,
  },
  metaCol: { flex: 1, gap: 4 },
  metaLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  metaValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PRICE_BANNER_BG,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_DASHBOARD_BRAND_BLUE,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: VENDOR_DASHBOARD_BTN_RED,
    borderRadius: 24,
    paddingVertical: 12,
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: CONFIRM_GREEN,
    borderRadius: 24,
    paddingVertical: 12,
  },
  confirmBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  actionIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactOnlyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: 24,
    paddingVertical: 12,
    backgroundColor: colors.surface.white,
  },
  contactOnlyText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
