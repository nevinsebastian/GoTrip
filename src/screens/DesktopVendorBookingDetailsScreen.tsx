import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorWebHeader } from '@/src/components/desktop/DesktopVendorWebHeader';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_PROPERTIES,
} from '@/src/constants/vendorDashboardConstants';
import {
  VENDOR_VIEW_BOOKING_COPY,
  VENDOR_WORKSPACE_BOOKING_DETAILS,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FIGMA_PAGE_WIDTH = 1280;
const FIGMA_CONTENT_WIDTH = 1196;
const FIGMA_TITLE = '#0F1A20';
const FIGMA_PROPERTY_BG = '#0F1A20';
const FIGMA_CANCEL = '#D72626';
const FIGMA_CONFIRM = '#0FC872';
const FIGMA_BLUE = '#2C6F9C';
const FIGMA_MUTED = 'rgba(0, 7, 20, 0.623529)';

export function DesktopVendorBookingDetailsScreen() {
  const { width } = useResponsive();
  const compact = width > 0 && width < 980;
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = VENDOR_WORKSPACE_BOOKING_DETAILS[id ?? 'b1'] ?? VENDOR_WORKSPACE_BOOKING_DETAILS.b1;

  const [propertyId, setPropertyId] = useState(VENDOR_DASHBOARD_PROPERTIES[0].id);
  const [propertyOpen, setPropertyOpen] = useState(false);

  const activeProperty =
    VENDOR_DASHBOARD_PROPERTIES.find((p) => p.id === propertyId) ?? VENDOR_DASHBOARD_PROPERTIES[0];
  const isPending = booking.status === 'pending';

  const propertyDescription =
    booking.id === 'b1'
      ? 'Luxury stay in Varkala | 2 floors, 4 rooms | with private pool'
      : booking.propertyDescription;

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.pageShell}>
        <DesktopVendorWebHeader compact={compact} />

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyScrollContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          <View style={styles.content}>
            <View style={styles.toolbarRow}>
              <Text style={styles.dashboardTitle}>{VENDOR_DASHBOARD_COPY.dashboardTitle}</Text>
              <Pressable
                style={styles.propertySelect}
                onPress={() => setPropertyOpen(true)}
                accessibilityRole="button"
              >
                <Text style={styles.propertySelectText} numberOfLines={1}>
                  {activeProperty.label}
                </Text>
                <Ionicons name="chevron-down" size={24} color={colors.surface.white} />
              </Pressable>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.bookingId}>
                  {VENDOR_VIEW_BOOKING_COPY.bookingIdLabel} {booking.bookingRef}
                </Text>
                {isPending ? (
                  <View style={styles.headerActions}>
                    <Pressable
                      style={styles.cancelPill}
                      onPress={() => router.push('/vendor/cancel-booking')}
                      accessibilityRole="button"
                    >
                      <Ionicons name="close-circle-outline" size={24} color={colors.surface.white} />
                      <Text style={styles.pillText}>{VENDOR_VIEW_BOOKING_COPY.cancel}</Text>
                    </Pressable>
                    <Pressable
                      style={styles.confirmPill}
                      onPress={() => router.replace('/vendor/(workspace)/bookings')}
                      accessibilityRole="button"
                    >
                      <Ionicons name="checkmark-circle-outline" size={24} color={colors.surface.white} />
                      <Text style={styles.pillText}>{VENDOR_VIEW_BOOKING_COPY.confirm}</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>

              <View style={styles.separator} />

              <View style={styles.propertyRow}>
                <View style={styles.propertyImageWrap}>
                  <Image source={booking.propertyImage} style={styles.propertyImage} resizeMode="cover" />
                </View>
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyDescription}>{propertyDescription}</Text>

                  <View style={styles.guestRow}>
                    <Image source={booking.guestAvatar} style={styles.guestAvatar} resizeMode="cover" />
                    <Text style={styles.guestText}>
                      {VENDOR_VIEW_BOOKING_COPY.guestLabel}
                      {'\n'}
                      <Text style={styles.guestName}>{booking.guestTitle}</Text>
                    </Text>
                  </View>

                  <View style={styles.commRow}>
                    <Pressable style={styles.commBtn} accessibilityRole="button">
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color={FIGMA_TITLE} />
                      <Text style={styles.commBtnText}>{VENDOR_VIEW_BOOKING_COPY.contact}</Text>
                    </Pressable>
                    <Pressable style={styles.commBtn} accessibilityRole="button">
                      <Ionicons name="chatbubble-outline" size={16} color={FIGMA_TITLE} />
                      <Text style={styles.commBtnText}>{VENDOR_VIEW_BOOKING_COPY.message}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>{VENDOR_VIEW_BOOKING_COPY.datesLabel}</Text>
                  <Text style={styles.metaValue}>{booking.dateRangeDisplay}</Text>
                </View>
                <View style={[styles.metaCol, styles.metaColEnd]}>
                  <Text style={[styles.metaLabel, styles.metaLabelEnd]}>
                    {VENDOR_VIEW_BOOKING_COPY.guestsLabel}
                  </Text>
                  <Text style={[styles.metaValue, styles.metaValueEnd]}>{booking.guestsLabel}</Text>
                </View>
              </View>

              <View style={styles.priceBanner}>
                <Text style={styles.priceLabel}>{VENDOR_VIEW_BOOKING_COPY.totalPrice}</Text>
                <Text style={styles.priceValue}>
                  ₹ 10,420{'\n'}
                  <Text style={styles.priceSub}>including tax</Text>
                </Text>
              </View>
            </View>
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  pageShell: {
    flex: 1,
    width: '100%',
    maxWidth: FIGMA_PAGE_WIDTH,
    alignSelf: 'center',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    paddingHorizontal: 42,
    paddingBottom: 48,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: FIGMA_CONTENT_WIDTH,
    gap: 25,
    paddingTop: 32,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 25,
    width: '100%',
  },
  dashboardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    letterSpacing: 0.48,
    color: FIGMA_TITLE,
  },
  propertySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    maxWidth: 281,
    paddingHorizontal: 18,
    backgroundColor: FIGMA_PROPERTY_BG,
    borderRadius: 8,
    ...Platform.select({
      web: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)', cursor: 'pointer' as const },
    }),
  },
  propertySelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 21,
    letterSpacing: 0.28,
    color: colors.surface.white,
  },
  detailCard: {
    width: '100%',
    minHeight: 480,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.25)',
    borderRadius: 24,
    backgroundColor: colors.surface.white,
    padding: 24,
    gap: 18,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    minHeight: 42,
  },
  bookingId: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    lineHeight: 24,
    color: FIGMA_MUTED,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    paddingLeft: 12,
    paddingRight: 24,
    backgroundColor: FIGMA_CANCEL,
    borderRadius: 24,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  confirmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    paddingLeft: 12,
    paddingRight: 24,
    backgroundColor: FIGMA_CONFIRM,
    borderRadius: 24,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  pillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 24,
    letterSpacing: 0.32,
    color: colors.surface.white,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(15, 26, 32, 0.15)',
    width: '100%',
  },
  propertyRow: {
    flexDirection: 'row',
    gap: 18,
    minHeight: 160,
  },
  propertyImageWrap: {
    width: 438,
    maxWidth: '38%',
    height: 160,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 160,
  },
  propertyDescription: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    lineHeight: 18,
    color: '#1C2024',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  guestAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  guestText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: '#1C2024',
  },
  guestName: {
    fontWeight: typography.fontWeight.medium,
  },
  commRow: {
    flexDirection: 'row',
    gap: 15,
  },
  commBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 32,
    borderWidth: 1,
    borderColor: FIGMA_TITLE,
    borderRadius: 8,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  commBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.48,
    color: FIGMA_TITLE,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
    gap: 14,
  },
  metaCol: {
    gap: 4,
  },
  metaColEnd: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: '#1C2024',
  },
  metaLabelEnd: {
    textAlign: 'right',
  },
  metaValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_MUTED,
  },
  metaValueEnd: {
    textAlign: 'right',
  },
  priceBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: 'rgba(44, 111, 156, 0.05)',
    borderRadius: 12,
    gap: 4,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: '#1C2024',
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 16,
    letterSpacing: 0.04,
    textAlign: 'right',
    color: FIGMA_BLUE,
  },
  priceSub: {
    fontWeight: typography.fontWeight.bold,
    fontSize: 14,
    lineHeight: 16,
    color: FIGMA_BLUE,
  },
});
