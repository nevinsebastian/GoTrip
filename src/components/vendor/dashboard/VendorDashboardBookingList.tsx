import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  VENDOR_DASHBOARD_BOOKINGS,
  VENDOR_DASHBOARD_BTN_BLUE,
  VENDOR_DASHBOARD_BTN_GREEN,
  VENDOR_DASHBOARD_BTN_RADIUS,
  VENDOR_DASHBOARD_BTN_RED,
  VENDOR_DASHBOARD_CARD_BORDER,
  VENDOR_DASHBOARD_CARD_RADIUS,
  VENDOR_DASHBOARD_DATE_BLUE,
  type VendorDashboardBooking,
} from '@/src/constants/vendorDashboardConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

function BookingCard({ booking }: { booking: VendorDashboardBooking }) {
  const goToBooking = () => router.push(`/vendor/booking/${booking.id}` as any);
  const guestsLabel = `${booking.guests} Guest${booking.guests === 1 ? '' : 's'}`;

  return (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.guestName} numberOfLines={1}>
          {booking.guestName}
        </Text>
        <Text style={styles.guestCount}>{guestsLabel}</Text>
        <Text style={styles.dateRange} numberOfLines={1}>
          {booking.dateRange}
        </Text>
      </View>

      {booking.status === 'pending' ? (
        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn} onPress={goToBooking}>
            <Text style={styles.btnTextWhite}>View</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <Pressable style={styles.cancelBtn}>
            <Text style={styles.btnTextWhite}>Cancel</Text>
            <Ionicons name="close-circle" size={12} color={colors.surface.white} />
          </Pressable>
          <Pressable style={styles.confirmBtn}>
            <Text style={styles.btnTextWhite}>Confirm</Text>
            <Ionicons name="checkmark-circle" size={12} color={colors.surface.white} />
          </Pressable>
          <Pressable style={styles.phoneBtn}>
            <Ionicons name="call-outline" size={16} color="#000000" />
          </Pressable>
        </View>
      ) : null}

      {booking.status === 'confirmed' ? (
        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn} onPress={goToBooking}>
            <Text style={styles.btnTextWhite}>View</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <View style={styles.statusWrap}>
            <Ionicons name="checkmark-circle" size={14} color={VENDOR_DASHBOARD_BTN_GREEN} />
            <Text style={styles.statusGreen}>Booking Confirmed</Text>
          </View>
          <Pressable style={styles.phoneBtn}>
            <Ionicons name="call-outline" size={16} color="#000000" />
          </Pressable>
        </View>
      ) : null}

      {booking.status === 'cancelled' ? (
        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn} onPress={goToBooking}>
            <Text style={styles.btnTextWhite}>View</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <View style={styles.statusWrap}>
            <Ionicons name="close-circle" size={14} color={VENDOR_DASHBOARD_BTN_RED} />
            <Text style={styles.statusRed}>Booking Cancelled</Text>
          </View>
          <Pressable style={styles.phoneBtn}>
            <Ionicons name="call-outline" size={16} color="#000000" />
          </Pressable>
        </View>
      ) : null}

      {booking.status === 'simple' ? (
        <View style={styles.simpleRow}>
          <Pressable style={styles.viewBookingBtn} onPress={goToBooking}>
            <Text style={styles.btnTextWhite}>View Booking</Text>
            <Ionicons name="open-outline" size={12} color={colors.surface.white} />
          </Pressable>
          <Pressable style={styles.contactBtn}>
            <Ionicons name="call-outline" size={14} color="#000000" />
            <Text style={styles.contactText}>Contact</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

type VendorDashboardBookingListProps = {
  bookings?: VendorDashboardBooking[];
};

export function VendorDashboardBookingList({
  bookings = VENDOR_DASHBOARD_BOOKINGS,
}: VendorDashboardBookingListProps) {
  return (
    <View style={styles.list}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestName: {
    flex: 1.2,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  guestCount: {
    flex: 0.8,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  dateRange: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: VENDOR_DASHBOARD_DATE_BLUE,
    textAlign: 'right',
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
    backgroundColor: VENDOR_DASHBOARD_BTN_BLUE,
    borderRadius: VENDOR_DASHBOARD_BTN_RADIUS,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: VENDOR_DASHBOARD_BTN_RED,
    borderRadius: VENDOR_DASHBOARD_BTN_RADIUS,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: VENDOR_DASHBOARD_BTN_GREEN,
    borderRadius: VENDOR_DASHBOARD_BTN_RADIUS,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  phoneBtn: {
    width: 34,
    height: 34,
    borderRadius: VENDOR_DASHBOARD_BTN_RADIUS,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  btnTextWhite: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  statusWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 100,
  },
  statusGreen: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: VENDOR_DASHBOARD_BTN_GREEN,
  },
  statusRed: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: VENDOR_DASHBOARD_BTN_RED,
  },
  simpleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBookingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: VENDOR_DASHBOARD_BTN_BLUE,
    borderRadius: VENDOR_DASHBOARD_BTN_RADIUS,
    paddingVertical: 10,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_BTN_RADIUS,
    paddingVertical: 10,
    backgroundColor: colors.surface.white,
  },
  contactText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
