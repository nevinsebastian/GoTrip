import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  VENDOR_BOOKINGS_COPY,
  VENDOR_DASHBOARD_BOOKINGS,
  type VendorDashboardBooking,
} from '@/src/constants/vendorDashboardConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const FIGMA_BLUE = '#2C6F9C';
const FIGMA_TITLE = '#0F1A20';
const FIGMA_CANCEL = '#D72626';
const FIGMA_CONFIRM = '#0FC872';

function DesktopBookingRow({ booking }: { booking: VendorDashboardBooking }) {
  const goToBooking = () => router.push(`/vendor/booking/${booking.id}` as any);
  const guestsLabel = `${booking.guests} Guest${booking.guests === 1 ? '' : 's'}`;
  const showActions = booking.status === 'pending';
  const contactOnly = booking.status === 'confirmed' || booking.status === 'simple' || booking.status === 'cancelled';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.guestName} numberOfLines={1}>
          {booking.guestName}
        </Text>
        <Text style={styles.guestCount} numberOfLines={1}>
          {guestsLabel}
        </Text>
        <Text style={styles.dateRange} numberOfLines={1}>
          {booking.dateRange}
        </Text>

        <View style={[styles.actions, contactOnly && styles.actionsEnd]}>
          <Pressable style={styles.viewBtn} onPress={goToBooking} accessibilityRole="button">
            <Text style={styles.viewBtnText}>
              {booking.status === 'simple' ? VENDOR_BOOKINGS_COPY.viewBooking : VENDOR_BOOKINGS_COPY.view}
            </Text>
            <Ionicons name="open-outline" size={16} color={colors.surface.white} />
          </Pressable>

          {showActions ? (
            <>
              <Pressable style={styles.cancelBtn} accessibilityRole="button">
                <Text style={styles.smallBtnText}>{VENDOR_BOOKINGS_COPY.cancel}</Text>
                <Ionicons name="close-circle-outline" size={16} color={colors.surface.white} />
              </Pressable>
              <Pressable style={styles.confirmBtn} accessibilityRole="button">
                <Text style={styles.smallBtnText}>{VENDOR_BOOKINGS_COPY.confirm}</Text>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.surface.white} />
              </Pressable>
            </>
          ) : null}

          <Pressable style={styles.contactBtn} accessibilityRole="button">
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={FIGMA_TITLE} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type DesktopVendorDashboardBookingListProps = {
  bookings?: VendorDashboardBooking[];
};

export function DesktopVendorDashboardBookingList({
  bookings = VENDOR_DASHBOARD_BOOKINGS,
}: DesktopVendorDashboardBookingListProps) {
  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {bookings.map((booking) => (
          <DesktopBookingRow key={booking.id} booking={booking} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    height: 372,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.15)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 12,
    minHeight: 56,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  guestName: {
    width: 203,
    flexShrink: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.28,
    color: FIGMA_TITLE,
  },
  guestCount: {
    width: 201,
    flexShrink: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 24,
    letterSpacing: 0.28,
    color: FIGMA_TITLE,
  },
  dateRange: {
    width: 201,
    flexShrink: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.28,
    color: FIGMA_BLUE,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 412,
    flexShrink: 0,
    justifyContent: 'flex-start',
  },
  actionsEnd: {
    justifyContent: 'flex-end',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 32,
    paddingHorizontal: 8,
    minWidth: 127,
    backgroundColor: FIGMA_BLUE,
    borderRadius: 4,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  viewBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.48,
    color: colors.surface.white,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 100,
    height: 32,
    backgroundColor: FIGMA_CANCEL,
    borderRadius: 4,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 100,
    height: 32,
    backgroundColor: FIGMA_CONFIRM,
    borderRadius: 4,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  smallBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.48,
    color: colors.surface.white,
  },
  contactBtn: {
    width: 49,
    height: 32,
    borderWidth: 1,
    borderColor: FIGMA_TITLE,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
});
