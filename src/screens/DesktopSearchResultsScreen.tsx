import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopSearchResultsHeader } from '@/src/components/desktop/DesktopSearchResultsHeader';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import {
  DESKTOP_SEARCH_CATEGORY_TITLES,
  DESKTOP_SEARCH_FILTER_CHIPS,
  DESKTOP_SEARCH_LISTING_IMAGES,
  DESKTOP_SEARCH_SECTION_COPY,
  resolveDesktopSearchListings,
  type DesktopSearchListingMeta,
} from '@/src/constants/desktopSearchConstants';
import { useListings } from '@/src/hooks/useListings';
import { DesktopSearchListingDetail } from '@/src/screens/DesktopSearchListingDetail';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import HeartIcon from '@/assets/images/heart.svg';

type DesktopSearchResultsScreenProps = {
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
};

function HotelResultCard({
  listing,
  onPress,
}: {
  listing: DesktopSearchListingMeta;
  onPress: (listing: DesktopSearchListingMeta) => void;
}) {
  const image = DESKTOP_SEARCH_LISTING_IMAGES.hotels;
  const price =
    listing.price_start != null
      ? Number(listing.price_start).toLocaleString('en-IN')
      : '—';

  return (
    <Pressable style={styles.hotelCard} onPress={() => onPress(listing)}>
      <View style={styles.hotelImageWrap}>
        <Image source={image} style={styles.hotelImage} resizeMode="cover" />
        <View style={styles.hotelHeart}>
          <HeartIcon width={14} height={14} />
        </View>
        <View style={styles.coupleBadge}>
          <Ionicons name="heart-outline" size={12} color={colors.surface.white} />
          <Text style={styles.coupleBadgeText}>COUPLE FRIENDLY</Text>
        </View>
      </View>

      <View style={styles.hotelBody}>
        <View style={styles.hotelTitleRow}>
          <Text style={styles.hotelTitle} numberOfLines={2}>
            {listing.title}
          </Text>
          <View style={styles.hotelRating}>
            <Ionicons name="star" size={16} color={colors.accent.main} />
            <Text style={styles.hotelRatingText}>4.5</Text>
          </View>
        </View>
        <View style={styles.hotelFooter}>
          <Text style={styles.hotelPrice}>₹ {price}/night</Text>
          <View style={styles.viewRoomsBtn}>
            <Text style={styles.viewRoomsText}>View Rooms</Text>
            <View style={styles.viewRoomsIcon}>
              <Ionicons name="water-outline" size={16} color={colors.accent.main} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function CategoryResultCard({
  listing,
  tab,
  onPress,
}: {
  listing: DesktopSearchListingMeta;
  tab: HomeCategoryTab;
  onPress: (listing: DesktopSearchListingMeta) => void;
}) {
  const copy = DESKTOP_SEARCH_SECTION_COPY[tab];
  const price =
    listing.price_start != null
      ? Number(listing.price_start).toLocaleString('en-IN')
      : '—';
  const image = DESKTOP_SEARCH_LISTING_IMAGES[tab];
  const tag = listing.tag ?? 'COUPLE';
  const duration =
    listing.nights != null
      ? `${listing.nights} ${copy.durationSuffix}`
      : copy.durationSuffix;

  return (
    <Pressable style={styles.resultCard} onPress={() => onPress(listing)}>
      <View style={styles.resultImageWrap}>
        <Image source={image} style={styles.resultImage} resizeMode="cover" />
        <View style={styles.resultHeart}>
          <HeartIcon width={14} height={14} />
        </View>
      </View>
      <View style={styles.resultBody}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {listing.title}
        </Text>
        <View style={styles.resultMetaRow}>
          <View style={[styles.tagPill, tag === 'FAMILY' && styles.tagPillFamily]}>
            <Text style={[styles.tagText, tag === 'FAMILY' && styles.tagTextFamily]}>{tag}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.accent.main} />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>
        <Text style={styles.resultPrice}>₹{price}</Text>
        <Text style={styles.resultDuration}>{duration}</Text>
      </View>
    </Pressable>
  );
}

function CategorySection({
  title,
  listings,
  tab,
  onListingPress,
}: {
  title: string;
  listings: DesktopSearchListingMeta[];
  tab: HomeCategoryTab;
  onListingPress: (listing: DesktopSearchListingMeta) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable style={styles.viewAllLink}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
        </Pressable>
      </View>
      <View style={styles.cardRow}>
        {listings.slice(0, 5).map((listing) => (
          <CategoryResultCard
            key={listing.id}
            listing={listing}
            tab={tab}
            onPress={onListingPress}
          />
        ))}
      </View>
    </View>
  );
}

export function DesktopSearchResultsScreen({
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
}: DesktopSearchResultsScreenProps) {
  const {
    searchParams,
    activeCategoryTab,
    setActiveCategoryTab,
    exitSearchMode,
    selectedSearchListing,
    openSearchListing,
    closeSearchListing,
  } = useHomeSearch();
  const tab = searchParams?.tab ?? activeCategoryTab;
  const locationQuery = searchParams?.location?.trim() ?? '';
  const [selectedChip, setSelectedChip] = useState(
    searchParams?.packageMood ?? searchParams?.activityMood ?? 'budget',
  );

  const { data: hotelListingsRes } = useListings(
    { page: 1, limit: 20 },
    tab === 'hotels',
  );

  useEffect(() => {
    setSelectedChip(searchParams?.packageMood ?? searchParams?.activityMood ?? 'budget');
  }, [searchParams?.packageMood, searchParams?.activityMood, tab]);

  const openListing = (listing: DesktopSearchListingMeta) => {
    openSearchListing({
      id: listing.id,
      title: listing.title,
      price_start: listing.price_start,
      location: listing.location,
      tab,
    });
  };

  const mockListings = useMemo(
    () => resolveDesktopSearchListings(tab, locationQuery),
    [tab, locationQuery],
  );

  const hotelListings = useMemo(() => {
    const api = hotelListingsRes?.data ?? [];
    if (api.length) {
      return api.map((l) => ({ ...l, tag: 'COUPLE' as const })) as DesktopSearchListingMeta[];
    }
    return mockListings;
  }, [hotelListingsRes?.data, mockListings]);

  const categoryListings = mockListings;
  const filterChips = DESKTOP_SEARCH_FILTER_CHIPS[tab];
  const copy = DESKTOP_SEARCH_SECTION_COPY[tab];
  const categoryTitle = DESKTOP_SEARCH_CATEGORY_TITLES[tab];
  const isHotels = tab === 'hotels';

  const locationLabel = locationQuery || (isHotels ? 'Varkala, Kerala' : locationQuery);
  const propertyCount = isHotels ? hotelListings.length * 33 || 133 : categoryListings.length;

  if (selectedSearchListing) {
    return (
      <View style={styles.detailShell}>
        <DesktopSearchListingDetail
          listing={selectedSearchListing}
          tab={selectedSearchListing.tab}
          onBack={closeSearchListing}
          isLoggedIn={isLoggedIn}
          onMenuPress={onMenuPress}
          onProfilePress={onProfilePress}
          onLoginPress={onLoginPress}
          onTabChange={(next) => {
            closeSearchListing();
            setActiveCategoryTab(next);
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator>
      <View style={styles.contentShell}>
        <View style={styles.navWrap}>
          <DesktopSearchResultsHeader
            activeTab={activeCategoryTab}
            onTabChange={(next) => {
              setActiveCategoryTab(next);
              exitSearchMode();
            }}
            isLoggedIn={isLoggedIn}
            onMenuPress={onMenuPress}
            onProfilePress={onProfilePress}
            onLoginPress={onLoginPress}
          />
        </View>

        <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {filterChips.map((chip) => {
            const selected = selectedChip === chip.id;
            const Icon = chip.Icon;
            return (
              <Pressable
                key={chip.id}
                style={[styles.filterChip, selected && styles.filterChipActive]}
                onPress={() => setSelectedChip(chip.id)}
              >
                {Icon ? <Icon width={16} height={16} /> : null}
                <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.main}>
        {isHotels ? (
          <>
            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsCount}>
                  {propertyCount} Properties found Nearby {locationLabel}
                </Text>
                <Text style={styles.resultsSubtitle}>Curated Travel Experiences</Text>
              </View>
              <Pressable style={styles.sortBtn}>
                <Ionicons name="swap-vertical" size={16} color={colors.text.primary} />
                <Text style={styles.sortLabel}>Price</Text>
                <Text style={styles.sortValue}>High to Low</Text>
                <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
              </Pressable>
            </View>

            <View style={styles.hotelGrid}>
              {hotelListings.map((listing) => (
                <HotelResultCard key={listing.id} listing={listing} onPress={openListing} />
              ))}
              {hotelListings.map((listing) => (
                <HotelResultCard key={`${listing.id}-dup`} listing={listing} onPress={openListing} />
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.titleRow}>
              <Text style={styles.pageTitle}>{categoryTitle}</Text>
              <Pressable style={styles.backBtn} onPress={exitSearchMode}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </Pressable>
            </View>
            <CategorySection
              title={copy.suggested}
              listings={categoryListings}
              tab={tab}
              onListingPress={openListing}
            />
            <CategorySection
              title={copy.topRated}
              listings={[...categoryListings].reverse()}
              tab={tab}
              onListingPress={openListing}
            />
          </>
        )}
      </View>
      </View>

      <DesktopSiteFooter />
    </ScrollView>
  );
}

const HOTEL_CARD_W = 290;
const CATEGORY_CARD_W = 240;

const styles = StyleSheet.create({
  detailShell: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.surface.white,
  },
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  pageContent: {
    paddingBottom: 48,
  },
  contentShell: {
    ...desktopContentShellStyle,
  },
  navWrap: {
    width: '100%',
    paddingTop: 24,
    zIndex: 100,
  },
  chipsWrap: {
    width: '100%',
    paddingTop: 24,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
    justifyContent: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    backgroundColor: colors.surface.white,
  },
  filterChipActive: {
    backgroundColor: colors.accent.main,
    borderColor: colors.accent.main,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  filterChipTextActive: {
    color: colors.surface.white,
  },
  main: {
    width: '100%',
    paddingTop: 24,
    gap: 32,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  resultsCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 28,
  },
  resultsSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 8,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface.white,
  },
  sortLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  sortValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  hotelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  hotelCard: {
    width: HOTEL_CARD_W,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
    padding: 12,
    gap: 16,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
      default: {},
    }),
  },
  hotelImageWrap: {
    width: '100%',
    height: 132,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.gray?.['2'] ?? '#eee',
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  hotelHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupleBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(229, 77, 46, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    letterSpacing: 0.3,
  },
  hotelBody: {
    gap: 12,
  },
  hotelTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  hotelTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 20,
  },
  hotelRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hotelRatingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  hotelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hotelPrice: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewRoomsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 100,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
  },
  viewRoomsText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  viewRoomsIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 32,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    lineHeight: 40,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  resultCard: {
    width: CATEGORY_CARD_W,
    gap: 12,
  },
  resultImageWrap: {
    width: CATEGORY_CARD_W,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.gray?.['2'] ?? '#eee',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBody: {
    gap: 8,
  },
  resultTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 20,
    minHeight: 40,
  },
  resultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: {
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagPillFamily: {
    backgroundColor: 'rgba(229, 77, 46, 0.12)',
  },
  tagText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: '#D63384',
    letterSpacing: 0.5,
  },
  tagTextFamily: {
    color: colors.accent.main,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  resultPrice: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  resultDuration: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
  },
});
