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
} from '@/src/constants/vendorDashboardConstants';
import {
  VENDOR_CONFIRM_BOOKING_COPY,
  VENDOR_WORKSPACE_BOOKING_DETAILS,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONFIRM_GREEN = '#22C55E';

export function MobileVendorBookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = VENDOR_WORKSPACE_BOOKING_DETAILS[id ?? 'b1'] ?? VENDOR_WORKSPACE_BOOKING_DETAILS.b1;
  const [note, setNote] = useState(booking.defaultConfirmationNote);
  const tabInset = useVendorTabBarInset();

  const handleConfirm = () => {
    router.replace('/vendor/home');
  };

  const handleCancel = () => {
    router.push('/vendor/cancel-booking');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />

        <View style={styles.screenHeader}>
          <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
          </Pressable>
          <Text style={styles.screenTitle}>{VENDOR_CONFIRM_BOOKING_COPY.title}</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset + 72 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bookingCard}>
            <Text style={styles.bookingId}>
              {VENDOR_CONFIRM_BOOKING_COPY.bookingIdLabel}{' '}
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
                <Text style={styles.guestLabel}>{VENDOR_CONFIRM_BOOKING_COPY.guestLabel}</Text>
                <Text style={styles.guestName}>{booking.guestTitle}</Text>
              </View>
            </View>

            <View style={styles.metaBox}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>{VENDOR_CONFIRM_BOOKING_COPY.datesLabel}</Text>
                <Text style={styles.metaValue}>{booking.dateRangeDisplay}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>{VENDOR_CONFIRM_BOOKING_COPY.guestsLabel}</Text>
                <Text style={styles.metaValue}>{booking.guestsLabel}</Text>
              </View>
            </View>

            <Pressable style={styles.contactBtn}>
              <Ionicons name="call-outline" size={16} color={colors.text.primary} />
              <Text style={styles.contactText}>{VENDOR_CONFIRM_BOOKING_COPY.contact}</Text>
            </Pressable>

            <View style={styles.confirmSection}>
              <Text style={styles.confirmTitle}>{VENDOR_CONFIRM_BOOKING_COPY.promptTitle}</Text>
              <Text style={styles.confirmSubtitle}>
                {VENDOR_CONFIRM_BOOKING_COPY.promptBody(booking.guestFirstName)}
              </Text>

              <Text style={styles.noteLabel}>{VENDOR_CONFIRM_BOOKING_COPY.noteLabel}</Text>
              <View style={styles.noteBox}>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  maxLength={VENDOR_CONFIRM_BOOKING_COPY.noteMaxLength}
                  textAlignVertical="top"
                />
                <Text style={styles.noteCount}>
                  {note.length}/{VENDOR_CONFIRM_BOOKING_COPY.noteMaxLength}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { bottom: tabInset }]}>
          <Pressable style={styles.goBackBtn} onPress={() => router.back()}>
            <View style={styles.goBackIcon}>
              <Ionicons name="chevron-back" size={14} color={colors.surface.white} />
            </View>
            <Text style={styles.goBackText}>{VENDOR_CONFIRM_BOOKING_COPY.goBack}</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>{VENDOR_CONFIRM_BOOKING_COPY.cancelCta}</Text>
            <Ionicons name="close-circle" size={14} color={colors.surface.white} />
          </Pressable>
          <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>{VENDOR_CONFIRM_BOOKING_COPY.confirmCta}</Text>
            <View style={styles.confirmIcon}>
              <Ionicons name="checkmark" size={14} color={CONFIRM_GREEN} />
            </View>
          </Pressable>
        </View>

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
    paddingBottom: spacing['3'],
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
  idDividerRest: {
    flex: 1,
  },
  propertyRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  propertyThumb: {
    width: 56,
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
  contactBtn: {
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
  contactText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  confirmSection: {
    gap: 8,
    paddingTop: 4,
  },
  confirmTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    color: CONFIRM_GREEN,
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: CONFIRM_GREEN,
    textAlign: 'center',
    lineHeight: 16,
  },
  noteLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: 4,
  },
  noteBox: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    padding: 12,
    minHeight: 120,
    backgroundColor: colors.surface.white,
  },
  noteInput: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.primary,
    minHeight: 88,
    padding: 0,
  },
  noteCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.45)',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: VENDOR_DASHBOARD_CARD_BORDER,
    backgroundColor: colors.surface.white,
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.surface.white,
  },
  goBackIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: VENDOR_DASHBOARD_BTN_RED,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: CONFIRM_GREEN,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  confirmBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  confirmIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
