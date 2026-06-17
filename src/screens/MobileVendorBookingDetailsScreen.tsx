import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_WORKSPACE_BOOKING_DETAILS,
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_GREEN,
  VENDOR_WORKSPACE_RED,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorBookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = VENDOR_WORKSPACE_BOOKING_DETAILS[id ?? 'b1'] ?? VENDOR_WORKSPACE_BOOKING_DETAILS.b1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.topTitle}>Booking Details</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Image source={booking.propertyImage} style={styles.heroImage} resizeMode="cover" />

          <View style={styles.guestRow}>
            <Image source={booking.guestAvatar} style={styles.guestAvatar} resizeMode="cover" />
            <View style={styles.guestInfo}>
              <Text style={styles.guestName}>{booking.guestName}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{booking.guestRating}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.propertyName}>{booking.propertyName}</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{booking.checkIn}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{booking.checkOut}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>{booking.guests}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Total payout</Text>
              <Text style={styles.payoutValue}>{booking.totalPayout}</Text>
            </View>
          </View>
        </ScrollView>

        {booking.status === 'pending' ? (
          <View style={styles.footer}>
            <Pressable style={styles.declineBtn} onPress={() => router.push('/vendor/cancel-booking')}>
              <Text style={styles.declineText}>{VENDOR_WORKSPACE_COPY.declineBooking}</Text>
            </Pressable>
            <Pressable style={styles.acceptBtn} onPress={() => router.back()}>
              <Text style={styles.acceptText}>{VENDOR_WORKSPACE_COPY.acceptBooking}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  topTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.xl,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestAvatar: { width: 48, height: 48, borderRadius: 24 },
  guestInfo: { gap: 4 },
  guestName: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  propertyName: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.65)',
  },
  detailCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.08)',
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  detailValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  payoutValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
  },
  declineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: VENDOR_WORKSPACE_RED,
    borderRadius: borderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  declineText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: VENDOR_WORKSPACE_RED,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: VENDOR_WORKSPACE_GREEN,
    borderRadius: borderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
