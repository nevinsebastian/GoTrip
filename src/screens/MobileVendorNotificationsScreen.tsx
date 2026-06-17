import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VENDOR_WORKSPACE_BOOKING_DETAILS } from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorNotificationsScreen() {
  const booking = VENDOR_WORKSPACE_BOOKING_DETAILS.b1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.topTitle}>Notifications</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Pressable
            style={styles.notificationCard}
            onPress={() => router.push('/vendor/booking/b1')}
          >
            <View style={styles.iconWrap}>
              <Ionicons name="calendar-outline" size={18} color="#2563EB" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>New booking request</Text>
              <Text style={styles.cardBodyText}>
                {booking.guestName} requested {booking.propertyName} for {booking.checkIn} –{' '}
                {booking.checkOut}.
              </Text>
              <Text style={styles.viewLink}>View Details</Text>
            </View>
          </Pressable>
        </ScrollView>
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
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 14,
    backgroundColor: colors.surface.white,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  cardBodyText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.65)',
    lineHeight: 16,
  },
  viewLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: '#2563EB',
    marginTop: 4,
  },
});
