import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  VENDOR_CANCELLATION_REASONS,
  VENDOR_WORKSPACE_BOOKING_DETAILS,
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_PINK,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorCancelBookingScreen() {
  const booking = VENDOR_WORKSPACE_BOOKING_DETAILS.b1;
  const [reasonId, setReasonId] = useState('unavailable');
  const [reasonOpen, setReasonOpen] = useState(false);

  const activeReason =
    VENDOR_CANCELLATION_REASONS.find((r) => r.id === reasonId) ?? VENDOR_CANCELLATION_REASONS[0];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.topTitle}>Cancel Booking</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <Text style={styles.guestName}>{booking.guestName}</Text>
            <Text style={styles.summaryMeta}>
              {booking.checkIn} – {booking.checkOut} · {booking.guests} guests
            </Text>
            <Text style={styles.propertyName}>{booking.propertyName}</Text>
          </View>

          <Text style={styles.label}>{VENDOR_WORKSPACE_COPY.cancellationReason}</Text>
          <Pressable style={styles.reasonSelect} onPress={() => setReasonOpen(true)}>
            <Text style={styles.reasonText}>{activeReason.label}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.confirmBtn} onPress={() => router.replace('/vendor/home')}>
            <Text style={styles.confirmText}>{VENDOR_WORKSPACE_COPY.confirmCancellation}</Text>
          </Pressable>
        </View>
      </View>

      <VendorPropertyOptionSheet
        visible={reasonOpen}
        title={VENDOR_WORKSPACE_COPY.cancellationReason}
        options={VENDOR_CANCELLATION_REASONS.map((r) => ({ id: r.id, label: r.label }))}
        selectedId={reasonId}
        onClose={() => setReasonOpen(false)}
        onSelect={(id) => {
          setReasonId(id);
          setReasonOpen(false);
        }}
      />
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
  summaryCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 6,
  },
  guestName: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  summaryMeta: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  propertyName: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  reasonSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  reasonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  footer: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
  },
  confirmBtn: {
    backgroundColor: VENDOR_WORKSPACE_PINK,
    borderRadius: borderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
