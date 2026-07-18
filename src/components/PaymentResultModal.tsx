import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { useResponsive } from '@/components/ui/useResponsive';
import { browseHotels } from '@/src/api/hotel.service';
import { mapHotelToListing } from '@/src/utils/mapHotelToListing';
import { useQuery } from '@tanstack/react-query';
import type { ListingMedia } from '@/src/api/types';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MobileFloatingTabBar,
  type MobileTabId,
  useMobileTabBarInset,
} from '@/src/components/navigation/MobileFloatingTabBar';

const ACCENT = colors.accent.main;
const SUCCESS = '#19A65B';
const FAIL = '#D53B3B';
const CARD_BG = '#FDF1EF';

type Props = {
  visible: boolean;
  status: 'success' | 'failed';
  bookingId?: string;
  title?: string;
  ratingLabel?: string;
  customersLabel?: string;
  imageSource?: any;
  datesLabel?: string;
  guestsLabel?: string;
  totalPriceLabel?: string;
  originalPriceLabel?: string;
  offerPriceLabel?: string;
  cancellationLabel?: string;
  errorMessage?: string;
  onClose: () => void;
  onRetry?: () => void;
};

function formatBookingIdDisplay(bookingId?: string): string | undefined {
  if (!bookingId) return undefined;
  const ref = bookingId.trim();
  if (/^BK-/i.test(ref)) return ref;
  const compact = ref.replace(/-/g, '');
  if (compact.length >= 6) return `B${compact.slice(-5).toUpperCase()}`;
  return ref;
}

export function PaymentResultModal({
  visible,
  status,
  bookingId,
  title,
  ratingLabel = '4.5',
  customersLabel = '500+ customers',
  imageSource,
  datesLabel,
  guestsLabel,
  totalPriceLabel,
  originalPriceLabel,
  offerPriceLabel,
  cancellationLabel,
  errorMessage,
  onClose,
  onRetry,
}: Props) {
  const isSuccess = status === 'success';
  const { width, isMobile, isTablet } = useResponsive();
  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const tabBarInset = useMobileTabBarInset();
  const bookingIdLabel = formatBookingIdDisplay(bookingId);

  const { data: hotelsRes } = useQuery({
    queryKey: ['payment-result-hotels'],
    queryFn: () => browseHotels({ limit: 20, offset: 0 }),
    enabled: visible,
    staleTime: 60_000,
  });
  const exploreListings = (hotelsRes?.data ?? []).map(mapHotelToListing).slice(0, 6);

  const getPrimaryImage = (media?: ListingMedia[]) => {
    if (!media?.length) return null;
    const isDirectImageUrl = (url: string) => {
      const u = url.toLowerCase();
      if (!u.startsWith('http')) return false;
      if (u.includes('i.ibb.co/')) return true;
      return (
        u.endsWith('.jpg') ||
        u.endsWith('.jpeg') ||
        u.endsWith('.png') ||
        u.endsWith('.webp') ||
        u.endsWith('.gif')
      );
    };
    const primary = [...media]
      .filter((m) => m.media_type === 'image')
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .find((m) => isDirectImageUrl(m.url));
    return primary?.url ?? null;
  };

  const cardGap = spacing['3'];
  const cardWidth = Math.min(220, Math.floor((width - contentPadding * 2 - cardGap) / 2));

  const goTab = (tabId: MobileTabId) => {
    onClose();
    if (tabId === 'index') {
      router.replace('/(tabs)');
      return;
    }
    if (tabId === 'two') {
      router.replace('/(tabs)/two');
      return;
    }
    if (tabId === 'three') {
      router.replace('/(tabs)/three');
      return;
    }
    router.replace('/(tabs)/four');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                onClose();
                router.replace('/(tabs)');
              }}
              style={styles.backBtn}
              hitSlop={8}
              accessibilityLabel="Back to Home"
            >
              <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
            </Pressable>
            <Text variant="bodySemibold" style={styles.headerTitle}>
              Home
            </Text>
          </View>
        </SafeAreaView>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: contentPadding, paddingBottom: tabBarInset + spacing['4'] },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBlock}>
            <Text style={styles.topTitle}>{isSuccess ? 'All Done!' : 'Sorry.'}</Text>
            <View style={styles.statusRow}>
              <Text style={[styles.statusText, isSuccess ? styles.statusSuccess : styles.statusFailed]}>
                {isSuccess ? 'Booking successful!' : 'Booking Failed!'}
              </Text>
              <Ionicons
                name={isSuccess ? 'checkmark-circle' : 'close-circle'}
                size={28}
                color={isSuccess ? SUCCESS : FAIL}
              />
            </View>
          </View>

          <View style={[styles.card, !isSuccess && styles.cardFail]}>
            {isSuccess && bookingIdLabel ? (
              <Text style={styles.bookingId}>
                Booking ID# : <Text style={styles.bookingIdBold}>{bookingIdLabel}</Text>
              </Text>
            ) : null}

            <View style={styles.cardTopRow}>
              <View style={styles.thumbnail}>
                {imageSource ? (
                  <Image source={imageSource} style={styles.thumbnailImg} resizeMode="cover" />
                ) : (
                  <View style={styles.thumbnailPlaceholder} />
                )}
              </View>

              <View style={styles.cardTopRight}>
                <Text style={styles.listingTitle} numberOfLines={3}>
                  {title ?? 'Your booking'}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={ACCENT} />
                  <Text style={styles.ratingText}>
                    {ratingLabel} | {customersLabel}
                  </Text>
                </View>
              </View>
            </View>

            {isSuccess ? (
              <>
                <Pressable style={styles.messageHostBtn} accessibilityLabel="Message Host">
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.text.primary} />
                  <Text style={styles.messageHostText}>Message Host</Text>
                </Pressable>

                <View style={styles.infoGrid}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Dates</Text>
                    <Text style={styles.infoValue}>{datesLabel ?? '—'}</Text>
                  </View>
                  <View style={styles.infoColRight}>
                    <Text style={styles.infoLabel}>Guests</Text>
                    <Text style={styles.infoValue}>{guestsLabel ?? '—'}</Text>
                  </View>
                </View>

                <View style={styles.priceBox}>
                  <View style={styles.priceBoxHeader}>
                    <Text style={styles.priceBoxTitle}>Price summary</Text>
                    <Pressable style={styles.detailsBtn} accessibilityLabel="Details">
                      <Text style={styles.detailsBtnText}>Details</Text>
                      <Ionicons name="chevron-down" size={12} color={colors.text.primary} />
                    </Pressable>
                  </View>
                  {originalPriceLabel ? (
                    <View style={styles.priceLine}>
                      <Text style={styles.priceLineLabel}>Original price</Text>
                      <Text style={styles.priceLineValue}>{originalPriceLabel}</Text>
                    </View>
                  ) : null}
                  {offerPriceLabel ? (
                    <View style={styles.priceLine}>
                      <Text style={styles.priceLineLabel}>Offer price</Text>
                      <Text style={styles.priceLineValue}>{offerPriceLabel}</Text>
                    </View>
                  ) : null}
                  <View style={styles.priceLine}>
                    <Text style={styles.totalPriceLabel}>Total price</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.totalPriceValue}>{totalPriceLabel ?? '—'}</Text>
                      <Text style={styles.includingTax}>including tax</Text>
                    </View>
                  </View>
                  {cancellationLabel ? (
                    <Text style={styles.cancellationText}>{cancellationLabel}</Text>
                  ) : null}
                </View>

                <Pressable
                  style={styles.viewAllRow}
                  onPress={() => {
                    onClose();
                    router.replace('/(tabs)/three');
                  }}
                  accessibilityLabel="View all bookings"
                >
                  <Text style={styles.viewAllText}>View all bookings</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.divider} />
                <View style={styles.failTitleRow}>
                  <Text style={styles.failTitle}>An error occurred</Text>
                  <Ionicons name="alert-circle" size={16} color={FAIL} />
                </View>
                <Text style={styles.failBody}>
                  {errorMessage ??
                    'Your payment transaction was unsuccessful. Please contact our help center for further assistance, or retry payment. You can also return to the homepage.'}
                </Text>

                <View style={styles.failButtonsRow}>
                  <Pressable
                    style={styles.helpBtn}
                    onPress={() => {
                      onClose();
                      router.push('/(tabs)/four');
                    }}
                    accessibilityLabel="Help"
                  >
                    <Ionicons name="help-buoy-outline" size={16} color={colors.text.primary} />
                    <Text style={styles.helpBtnText}>Help</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.retryBtn, !onRetry && styles.retryBtnDisabled]}
                    onPress={onRetry}
                    disabled={!onRetry}
                    accessibilityLabel="Retry Payment"
                  >
                    <Text style={styles.retryBtnText}>Retry Payment</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          <View style={styles.exploreSection}>
            <Text style={styles.exploreTitle}>More budget options</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: cardGap, paddingTop: spacing['3'] }}
            >
              {exploreListings.map((l) => {
                const img = getPrimaryImage(l.media);
                const price =
                  l.price_start != null
                    ? `₹ ${Number(l.price_start).toLocaleString('en-IN')}/night`
                    : '—';
                const loc = typeof l.location === 'string' ? l.location : '';
                return (
                  <Pressable
                    key={l.id}
                    style={[styles.exploreCard, { width: cardWidth }]}
                    onPress={() => {
                      onClose();
                      router.push({ pathname: '/hotels/[id]', params: { id: l.id } });
                    }}
                    accessibilityLabel={l.title}
                  >
                    <View style={styles.exploreImageWrap}>
                      {img ? (
                        <Image source={{ uri: img }} style={styles.exploreImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.exploreImagePlaceholder}>
                          <Ionicons name="image-outline" size={22} color={colors.text.caption} />
                        </View>
                      )}
                      <View style={styles.heartBtn}>
                        <Ionicons name="heart-outline" size={14} color={colors.text.primary} />
                      </View>
                    </View>
                    <Text numberOfLines={2} style={styles.exploreCardTitle}>
                      {l.title}
                    </Text>
                    {loc ? (
                      <Text numberOfLines={1} style={styles.exploreCardLoc}>
                        {loc}
                      </Text>
                    ) : null}
                    <View style={styles.exploreMetaRow}>
                      <View style={styles.exploreRating}>
                        <Ionicons name="star-outline" size={12} color={ACCENT} />
                        <Text style={styles.exploreRatingText}>4.5</Text>
                      </View>
                      <Text style={styles.exploreCardPrice}>{price}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        <MobileFloatingTabBar activeTab="index" onTabPress={goTab} variant="overlay" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  headerSafe: { backgroundColor: colors.surface.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    gap: spacing['3'],
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: ACCENT, fontSize: 16 },
  scrollContent: { paddingBottom: 120 },
  topBlock: { marginTop: spacing['2'], marginBottom: spacing['3'] },
  topTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold as '700',
    fontSize: 28,
    color: colors.text.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['2'],
  },
  statusText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold as '700',
    fontSize: 24,
  },
  statusSuccess: { color: SUCCESS },
  statusFailed: { color: FAIL },
  card: {
    marginTop: spacing['2'],
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.08)',
  },
  cardFail: {
    backgroundColor: CARD_BG,
    borderWidth: 0,
  },
  bookingId: { color: colors.text.secondary, fontSize: 13, marginBottom: spacing['3'] },
  bookingIdBold: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
  },
  cardTopRow: { flexDirection: 'row', gap: spacing['3'] },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  thumbnailImg: { width: '100%', height: '100%' },
  thumbnailPlaceholder: { flex: 1, backgroundColor: colors.gray['2'] },
  cardTopRight: { flex: 1, justifyContent: 'center' },
  listingTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
    fontSize: 14,
    lineHeight: 20,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { color: ACCENT, fontSize: 12 },
  messageHostBtn: {
    marginTop: spacing['4'],
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing['2'],
  },
  messageHostText: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
    fontSize: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing['4'],
  },
  infoCol: { flex: 1 },
  infoColRight: { flex: 1, alignItems: 'flex-end' },
  infoLabel: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
    fontSize: 14,
  },
  infoValue: { color: colors.text.secondary, marginTop: 4, fontSize: 13 },
  priceBox: {
    marginTop: spacing['4'],
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: spacing['4'],
    gap: spacing['2'],
  },
  priceBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['1'],
  },
  priceBoxTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
    color: colors.text.primary,
    fontSize: 14,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    backgroundColor: colors.surface.white,
  },
  detailsBtnText: { color: colors.text.primary, fontSize: 12 },
  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceLineLabel: { color: colors.text.secondary, fontSize: 13 },
  priceLineValue: { color: colors.text.primary, fontSize: 13 },
  totalPriceLabel: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold as '700',
    fontSize: 15,
  },
  totalPriceValue: {
    color: ACCENT,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold as '700',
    fontSize: 16,
  },
  includingTax: { color: colors.text.caption, fontSize: 11, marginTop: 2 },
  cancellationText: {
    color: SUCCESS,
    fontSize: 12,
    marginTop: spacing['2'],
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
  },
  viewAllRow: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewAllText: { color: colors.text.secondary, fontSize: 13 },
  divider: { height: 1, backgroundColor: 'rgba(0, 9, 50, 0.10)', marginVertical: spacing['4'] },
  failTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  failTitle: {
    color: FAIL,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
    fontSize: 14,
  },
  failBody: {
    color: colors.text.secondary,
    marginTop: spacing['2'],
    lineHeight: 20,
    fontSize: 13,
  },
  failButtonsRow: { flexDirection: 'row', gap: spacing['3'], marginTop: spacing['4'] },
  helpBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.15)',
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing['2'],
  },
  helpBtnText: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
  },
  retryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnDisabled: { opacity: 0.5 },
  retryBtnText: {
    color: colors.surface.white,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
  },
  exploreSection: { marginTop: spacing['5'] },
  exploreTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold as '700',
    fontSize: 18,
  },
  exploreCard: { gap: spacing['2'] },
  exploreImageWrap: {
    width: '100%',
    aspectRatio: 1.15,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  exploreImage: { width: '100%', height: '100%' },
  exploreImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray['2'],
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreCardTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold as '600',
    fontSize: 13,
  },
  exploreCardLoc: { color: ACCENT, fontSize: 11 },
  exploreMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exploreRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  exploreRatingText: { color: ACCENT, fontSize: 12 },
  exploreCardPrice: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold as '700',
    fontSize: 13,
  },
});
