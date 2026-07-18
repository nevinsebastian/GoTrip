import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopSearchResultsHeader } from '@/src/components/desktop/DesktopSearchResultsHeader';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import {
  HOST_DESCRIPTION,
  HOST_NAME,
} from '@/src/components/resort/resortConstants';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import type { BookingPriceBreakdown } from '@/src/api/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const ACCENT = DESKTOP_HERO_SPECS.accent;
const MUTED = 'rgba(0, 7, 20, 0.62)';

function formatInr(amount?: number | null): string {
  if (amount == null || !Number.isFinite(amount)) return '—';
  return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
}

function nightsLabel(nights?: number | null, checkIn?: string, checkOut?: string): string {
  if (nights != null && nights > 0) {
    return `${nights} night${nights === 1 ? '' : 's'}`;
  }
  if (checkIn && checkOut) {
    const a = new Date(`${checkIn}T12:00:00`).getTime();
    const b = new Date(`${checkOut}T12:00:00`).getTime();
    const n = Math.max(1, Math.round((b - a) / 86_400_000));
    return `${n} night${n === 1 ? '' : 's'}`;
  }
  return '—';
}

function formatDateRange(checkIn: string, checkOut: string): string {
  const a = new Date(`${checkIn}T12:00:00`);
  const b = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return `${checkIn} – ${checkOut}`;
  const monthYear = b.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  return `${a.getDate()}-${b.getDate()} ${monthYear}`;
}

function guestsLabel(adults: number, children: number, infants: number): string {
  const parts: string[] = [];
  if (adults > 0) parts.push(`${adults} adult${adults === 1 ? '' : 's'}`);
  if (children > 0) parts.push(`${children} child${children === 1 ? '' : 'ren'}`);
  if (infants > 0) parts.push(`${infants} infant${infants === 1 ? '' : 's'}`);
  return parts.join(', ') || '—';
}

type DesktopBookingPriceSummaryScreenProps = {
  propertyTitle: string;
  roomName: string;
  guestRoomLabel: string;
  description: string;
  imageSource?: ImageSourcePropType | null;
  hostName?: string;
  hostBio?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  priceBreakdown: BookingPriceBreakdown | null;
  cancellationText: string;
  paying?: boolean;
  errorMessage?: string | null;
  activeTab?: HomeCategoryTab;
  isLoggedIn?: boolean;
  onTabChange?: (tab: HomeCategoryTab) => void;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
  onChangeSelection: () => void;
  onProceedToPay: () => void;
};

function SelectionRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: () => void;
}) {
  return (
    <View style={styles.selectionRow}>
      <View style={styles.selectionLeft}>
        <Text style={styles.selectionLabel}>{label}</Text>
        <Text style={styles.selectionValue}>{value}</Text>
      </View>
      <Pressable onPress={onChange} hitSlop={8} accessibilityLabel={`Change ${label}`}>
        <Text style={styles.changeLink}>Change</Text>
      </Pressable>
    </View>
  );
}

export function DesktopBookingPriceSummaryScreen({
  propertyTitle,
  roomName,
  guestRoomLabel,
  description,
  imageSource,
  hostName = HOST_NAME,
  hostBio = HOST_DESCRIPTION,
  checkIn,
  checkOut,
  adults,
  children,
  infants,
  priceBreakdown,
  cancellationText,
  paying = false,
  errorMessage,
  activeTab = 'hotels',
  isLoggedIn,
  onTabChange,
  onMenuPress,
  onProfilePress,
  onLoginPress,
  onChangeSelection,
  onProceedToPay,
}: DesktopBookingPriceSummaryScreenProps) {
  const originalPrice = useMemo(() => {
    const base = priceBreakdown?.basePrice ?? priceBreakdown?.subtotal;
    const discount = priceBreakdown?.discountAmount ?? 0;
    if (base == null) return null;
    return discount > 0 ? base + discount : base;
  }, [priceBreakdown]);

  const offerPrice = priceBreakdown?.subtotal ?? priceBreakdown?.taxableAmount ?? priceBreakdown?.basePrice;
  const totalPrice = priceBreakdown?.totalAmount;

  const freeCancelLead =
    cancellationText.toLowerCase().includes('free') ? 'Free cancellation' : 'Cancellation';
  const cancelDetail = cancellationText.replace(/^Free\s*cancellation\s*[-–:]?\s*/i, '').trim();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={styles.headerWrap}>
          <DesktopSearchResultsHeader
            activeTab={activeTab}
            onTabChange={onTabChange ?? (() => undefined)}
            isLoggedIn={isLoggedIn}
            onMenuPress={onMenuPress}
            onProfilePress={onProfilePress}
            onLoginPress={onLoginPress}
          />
        </View>

        <View style={styles.mainShell}>
          <Text style={styles.pageTitle}>Confirm dates and Guest Details</Text>

          <View style={styles.columns}>
            <View style={styles.leftCard}>
              <Text style={styles.propertyTitle}>{propertyTitle}</Text>
              <View style={styles.roomRow}>
                <Text style={styles.roomName}>{roomName}</Text>
                <Text style={styles.guestRoomLabel}>{guestRoomLabel}</Text>
              </View>

              <View style={styles.imageWrap}>
                <Image
                  source={imageSource ?? RESORT_PLACEHOLDER_IMAGE}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.description}>{description}</Text>

              <View style={styles.hostBlock}>
                <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.hostAvatar} resizeMode="cover" />
                <View style={styles.hostCopy}>
                  <Text style={styles.hostName}>{hostName}</Text>
                  <Text style={styles.hostBio} numberOfLines={3}>
                    {hostBio}
                  </Text>
                </View>
                <Pressable style={styles.hostBtn} accessibilityLabel="View host profile">
                  <Text style={styles.hostBtnText}>View host profile</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.rightCard}>
              <SelectionRow
                label="You selected"
                value={nightsLabel(priceBreakdown?.nights, checkIn, checkOut)}
                onChange={onChangeSelection}
              />
              <SelectionRow
                label="Dates"
                value={formatDateRange(checkIn, checkOut)}
                onChange={onChangeSelection}
              />
              <SelectionRow
                label="Guests"
                value={guestsLabel(adults, children, infants)}
                onChange={onChangeSelection}
              />

              <View style={styles.priceBox}>
                <Text style={styles.priceBoxTitle}>Your price summary</Text>
                <View style={styles.priceLine}>
                  <Text style={styles.priceLineLabel}>Original price</Text>
                  <Text style={styles.priceLineValue}>{formatInr(originalPrice)}</Text>
                </View>
                <View style={styles.priceLine}>
                  <Text style={styles.priceLineLabel}>Offer price</Text>
                  <Text style={styles.priceLineValue}>{formatInr(offerPrice)}</Text>
                </View>
                <View style={[styles.priceLine, styles.totalLine]}>
                  <View>
                    <Text style={styles.totalLabel}>Total price</Text>
                    <Text style={styles.taxHint}>including tax</Text>
                  </View>
                  <Text style={styles.totalValue}>{formatInr(totalPrice)}</Text>
                </View>
                <Text style={styles.cancelLead}>{freeCancelLead}</Text>
                {cancelDetail ? <Text style={styles.cancelDetail}>{cancelDetail}</Text> : null}
              </View>

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <Pressable
                style={[styles.payBtn, paying && styles.payBtnDisabled]}
                onPress={onProceedToPay}
                disabled={paying}
                accessibilityLabel="Proceed to pay"
              >
                {paying ? (
                  <ActivityIndicator color={colors.surface.white} />
                ) : (
                  <Text style={styles.payBtnText}>Proceed to pay</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>

        <DesktopSiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.white },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  headerWrap: { width: '100%' },
  mainShell: {
    ...desktopContentShellStyle,
    paddingTop: 28,
    paddingBottom: 48,
    gap: 24,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  leftCard: {
    flex: 1.15,
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  propertyTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  roomRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  roomName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
  },
  guestRoomLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: MUTED,
  },
  imageWrap: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F3F3',
  },
  image: { width: '100%', height: '100%' },
  description: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: MUTED,
  },
  hostBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  hostAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEE',
  },
  hostCopy: { flex: 1, gap: 2 },
  hostName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  hostBio: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 18,
    color: MUTED,
  },
  hostBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
  },
  hostBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  rightCard: {
    flex: 0.85,
    minWidth: 320,
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectionLeft: { flex: 1, gap: 2 },
  selectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: MUTED,
  },
  selectionValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  changeLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: ACCENT,
  },
  priceBox: {
    marginTop: 4,
    backgroundColor: '#F7F7F8',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  priceBoxTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceLineLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: MUTED,
  },
  priceLineValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  totalLine: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  totalLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  taxHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: MUTED,
  },
  totalValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
  },
  cancelLead: {
    marginTop: 6,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: '#1B8A4A',
  },
  cancelDetail: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: ACCENT,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: '#D53B3B',
  },
  payBtn: {
    marginTop: 4,
    height: 52,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnDisabled: { opacity: 0.7 },
  payBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
