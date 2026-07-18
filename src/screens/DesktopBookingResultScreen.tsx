import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopSearchResultsHeader } from '@/src/components/desktop/DesktopSearchResultsHeader';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { HOST_NAME } from '@/src/components/resort/resortConstants';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { browseHotels } from '@/src/api/hotel.service';
import type { Listing } from '@/src/api/types';
import { mapHotelToListing } from '@/src/utils/mapHotelToListing';
import { getPrimaryImage } from '@/src/utils/getPrimaryImage';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const ACCENT = DESKTOP_HERO_SPECS.accent;
const FAIL = '#D53B3B';
const SUCCESS = '#19A65B';
const MUTED = 'rgba(0, 7, 20, 0.62)';

type SuggestCardProps = {
  listing: Listing;
  onPress: () => void;
};

function SuggestCard({ listing, onPress }: SuggestCardProps) {
  const img = getPrimaryImage(listing.media);
  const price =
    listing.price_start != null
      ? `₹${Number(listing.price_start).toLocaleString('en-IN')}/night`
      : '—';
  const rating = (listing as Listing & { rating?: number }).rating ?? 4.5;

  return (
    <Pressable style={styles.suggestCard} onPress={onPress} accessibilityLabel={listing.title}>
      <View style={styles.suggestImageWrap}>
        {img ? (
          <Image source={{ uri: img }} style={styles.suggestImage} resizeMode="cover" />
        ) : (
          <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.suggestImage} resizeMode="cover" />
        )}
        <View style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={14} color={colors.text.primary} />
        </View>
      </View>
      <Text style={styles.suggestTitle} numberOfLines={2}>
        {listing.title}
      </Text>
      <View style={styles.suggestMeta}>
        <Text style={styles.suggestPrice}>{price}</Text>
        <View style={styles.suggestRating}>
          <Ionicons name="star" size={12} color={ACCENT} />
          <Text style={styles.suggestRatingText}>{String(rating)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

type DesktopBookingResultScreenProps = {
  status: 'success' | 'failed';
  propertyTitle: string;
  rating?: string;
  customersLabel?: string;
  hostName?: string;
  imageSource?: ImageSourcePropType | null;
  bookingId?: string;
  datesLabel?: string;
  guestsLabel?: string;
  totalPriceLabel?: string;
  errorMessage?: string | null;
  activeTab?: HomeCategoryTab;
  isLoggedIn?: boolean;
  onTabChange?: (tab: HomeCategoryTab) => void;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
  onHelp?: () => void;
  onRetry?: () => void;
  onViewBookings?: () => void;
  onHome?: () => void;
};

export function DesktopBookingResultScreen({
  status,
  propertyTitle,
  rating = '4.5',
  customersLabel = '500+ customers',
  hostName = HOST_NAME,
  imageSource,
  bookingId,
  datesLabel,
  guestsLabel,
  totalPriceLabel,
  errorMessage,
  activeTab = 'hotels',
  isLoggedIn,
  onTabChange,
  onMenuPress,
  onProfilePress,
  onLoginPress,
  onHelp,
  onRetry,
  onViewBookings,
  onHome,
}: DesktopBookingResultScreenProps) {
  const isSuccess = status === 'success';
  const { data: hotelsRes } = useQuery({
    queryKey: ['booking-result-hotels'],
    queryFn: () => browseHotels({ limit: 8, offset: 0 }),
    staleTime: 60_000,
  });
  const listings = useMemo(
    () => (hotelsRes?.data ?? []).map(mapHotelToListing),
    [hotelsRes?.data],
  );
  const suggested = listings.slice(0, 2);
  const topRated = listings.slice(2, 4);

  const openListing = (id: string) => {
    router.push({ pathname: '/hotels/[id]', params: { id } });
  };

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
          <View style={styles.titleRow}>
            <Text style={styles.titleLead}>{isSuccess ? 'All Done.' : 'Sorry.'}</Text>
            <Text style={[styles.titleStatus, { color: isSuccess ? SUCCESS : FAIL }]}>
              {isSuccess ? 'Booking successful!' : 'Booking Failed!'}
            </Text>
            <Ionicons
              name={isSuccess ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={isSuccess ? SUCCESS : FAIL}
            />
          </View>

          <View style={styles.columns}>
            <View style={styles.leftCard}>
              <View style={styles.heroImageWrap}>
                <Image
                  source={imageSource ?? RESORT_PLACEHOLDER_IMAGE}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.propertyTitle}>{propertyTitle}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={ACCENT} />
                <Text style={styles.ratingText}>{rating}</Text>
                <Text style={styles.ratingDivider}>|</Text>
                <Text style={styles.ratingText}>{customersLabel}</Text>
              </View>

              <View style={styles.hostRow}>
                <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.hostAvatar} resizeMode="cover" />
                <Text style={styles.hostLabel}>Host: {hostName}</Text>
              </View>

              {bookingId ? (
                <Text style={styles.bookingId}>
                  Booking ID# : <Text style={styles.bookingIdBold}>{bookingId}</Text>
                </Text>
              ) : null}

              {isSuccess ? (
                <>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Dates</Text>
                      <Text style={styles.infoValue}>{datesLabel ?? '—'}</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Guests</Text>
                      <Text style={styles.infoValue}>{guestsLabel ?? '—'}</Text>
                    </View>
                  </View>
                  <View style={styles.totalBlock}>
                    <Text style={styles.infoLabel}>Total price</Text>
                    <Text style={styles.totalValue}>{totalPriceLabel ?? '—'}</Text>
                  </View>
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.secondaryBtn}
                      onPress={onHome ?? (() => router.replace('/'))}
                      accessibilityLabel="Go home"
                    >
                      <Text style={styles.secondaryBtnText}>Home</Text>
                    </Pressable>
                    <Pressable
                      style={styles.primaryBtn}
                      onPress={onViewBookings ?? (() => router.push('/(tabs)/three'))}
                      accessibilityLabel="View bookings"
                    >
                      <Text style={styles.primaryBtnText}>View bookings</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.errorTitle}>
                    An error occurred{' '}
                    <Ionicons name="information-circle" size={16} color={FAIL} />
                  </Text>
                  <Text style={styles.errorBody}>
                    {errorMessage?.trim() ||
                      'Your payment transaction was unsuccessful. Please contact our help center for further assistance, or retry payment. You can also return to the homepage.'}
                  </Text>
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.helpBtn}
                      onPress={onHelp ?? onHome ?? (() => router.replace('/'))}
                      accessibilityLabel="Help"
                    >
                      <Ionicons name="headset-outline" size={18} color={colors.text.primary} />
                      <Text style={styles.helpBtnText}>Help</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.primaryBtn, styles.retryBtn]}
                      onPress={onRetry}
                      disabled={!onRetry}
                      accessibilityLabel="Retry Payment"
                    >
                      <Text style={styles.primaryBtnText}>Retry Payment</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>

            <View style={styles.rightColumn}>
              <SuggestSection
                title="Suggested for you"
                listings={suggested}
                onOpen={openListing}
              />
              <SuggestSection
                title="Top rated stays"
                listings={topRated.length ? topRated : suggested}
                onOpen={openListing}
              />
            </View>
          </View>
        </View>

        <DesktopSiteFooter />
      </ScrollView>
    </View>
  );
}

function SuggestSection({
  title,
  listings,
  onOpen,
}: {
  title: string;
  listings: Listing[];
  onOpen: (id: string) => void;
}) {
  return (
    <View style={styles.suggestSection}>
      <View style={styles.suggestHeader}>
        <Text style={styles.suggestSectionTitle}>{title}</Text>
        <Pressable onPress={() => router.push('/resorts')} hitSlop={8}>
          <Text style={styles.viewAll}>View all {'>'}</Text>
        </Pressable>
      </View>
      <View style={styles.suggestGrid}>
        {listings.map((l) => (
          <SuggestCard key={`${title}-${l.id}`} listing={l} onPress={() => onOpen(l.id)} />
        ))}
      </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleLead: {
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  titleStatus: {
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.semibold,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  leftCard: {
    flex: 1.2,
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  heroImageWrap: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F3F3',
  },
  heroImage: { width: '100%', height: '100%' },
  propertyTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: 4,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: MUTED,
  },
  ratingDivider: { color: MUTED, fontSize: 13 },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  hostAvatar: { width: 36, height: 36, borderRadius: 18 },
  hostLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  bookingId: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
  },
  bookingIdBold: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  infoGrid: { flexDirection: 'row', gap: 24, marginTop: 8 },
  infoCol: { flex: 1, gap: 4 },
  infoLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  infoValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: MUTED,
  },
  totalBlock: { gap: 4, marginTop: 4 },
  totalValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
  },
  errorTitle: {
    marginTop: 8,
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: FAIL,
  },
  errorBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: MUTED,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.35)',
    backgroundColor: colors.surface.white,
  },
  helpBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  secondaryBtn: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtn: { flex: 1.4 },
  primaryBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  rightColumn: { flex: 0.8, minWidth: 280, gap: 28 },
  suggestSection: { gap: 12 },
  suggestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestSectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewAll: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: ACCENT,
  },
  suggestGrid: { gap: 14 },
  suggestCard: {
    backgroundColor: colors.surface.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  suggestImageWrap: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F3F3',
  },
  suggestImage: { width: '100%', height: '100%' },
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
  suggestTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  suggestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  suggestPrice: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  suggestRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suggestRatingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: MUTED,
  },
});
