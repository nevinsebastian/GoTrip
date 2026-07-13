import { colors } from '@/constants/DesignTokens';
import type { Listing } from '@/src/api/types';
import { useHotelListings } from '@/src/hooks/useHotelListings';
import { useCategoryListings } from '@/src/hooks/useCategoryListing';
import { cityQueryFromLocation, formatStayDateLabel } from '@/src/utils/hotelSearchFilters';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  HomeBudgetGrid,
  HomeDestinationsSection,
  HomeMoodGrid,
  HomePromoCarousel,
  HomeSuggestedSection,
} from '@/src/components/home/HomeListingSections';
import { HomeHeroSection } from '@/src/components/home/HomeHeroSection';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { HomeSearchResults } from '@/src/components/home/HomeSearchResults';
import { SearchModeHeader } from '@/src/components/home/SearchModeHeader';
import { AppTopHeader } from '@/src/components/navigation/AppTopHeader';

function filterListingsByLocation(listings: Listing[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return listings;
  return listings.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      (l.location?.toLowerCase().includes(q) ?? false) ||
      (l.description?.toLowerCase().includes(q) ?? false),
  );
}

export function MobileHotelsHome() {
  const scrollRef = useRef<ScrollView>(null);
  const { searchMode, searchParams, activeCategoryTab } = useHomeSearch();
  const searchTab = searchMode ? (searchParams?.tab ?? activeCategoryTab) : activeCategoryTab;
  const isPackages = searchTab === 'packages';
  const isGlamping = searchTab === 'glamping';
  const isActivities = searchTab === 'activities';
  const isHotels = searchTab === 'hotels';

  const locationQuery = searchParams?.location?.trim() ?? '';
  const checkIn = searchParams?.checkIn;
  const checkOut = searchParams?.checkOut;
  const cityQuery = cityQueryFromLocation(locationQuery);

  const { listings: hotelListings, isLoading: hotelsLoading } = useHotelListings({
    page: 1,
    limit: 20,
    city: searchMode ? cityQuery : isHotels ? undefined : cityQuery,
    locationQuery: searchMode ? cityQuery ?? locationQuery : undefined,
    checkIn: searchMode ? checkIn : undefined,
    checkOut: searchMode ? checkOut : undefined,
    enabled: searchMode ? searchTab === 'hotels' : isHotels,
  });

  const { listings: varkalaHotels } = useHotelListings({
    page: 1,
    limit: 20,
    city: 'Varkala',
    enabled: isHotels,
  });

  const { listings: packageListings, isLoading: packagesLoading } = useCategoryListings('packages', {
    page: 1,
    limit: 20,
    city: searchMode ? cityQuery : undefined,
    enabled: searchMode ? searchTab === 'packages' : isPackages,
  });

  const { listings: glampingListings, isLoading: glampingLoading } = useCategoryListings('glamping', {
    page: 1,
    limit: 20,
    city: searchMode ? cityQuery : undefined,
    enabled: searchMode ? searchTab === 'glamping' : isGlamping,
  });

  const { listings: activityListings, isLoading: activitiesLoading } = useCategoryListings('activities', {
    page: 1,
    limit: 20,
    city: searchMode ? cityQuery : undefined,
    enabled: searchMode ? searchTab === 'activities' : isActivities,
  });

  const categorySearchLoading =
    (searchTab === 'packages' && packagesLoading) ||
    (searchTab === 'glamping' && glampingLoading) ||
    (searchTab === 'activities' && activitiesLoading);

  const nearYouListings = varkalaHotels.length ? varkalaHotels : hotelListings;
  const budgetHotels = useMemo(
    () => hotelListings.filter((_, index) => index < 4),
    [hotelListings],
  );

  const searchListings = useMemo(() => {
    const isPackageSearch = searchParams?.tab === 'packages';
    const isGlampingSearch = searchParams?.tab === 'glamping';
    const isActivitySearch = searchParams?.tab === 'activities';
    const isHotelSearch = searchParams?.tab === 'hotels' || !searchParams?.tab;

    if (isHotelSearch) {
      return hotelListings;
    }

    const pool = isPackageSearch
      ? packageListings
      : isGlampingSearch
        ? glampingListings
        : isActivitySearch
          ? activityListings
          : hotelListings;

    const typed = pool.filter((l) => {
      if (isPackageSearch) return l.category?.type === 'package';
      if (isGlampingSearch) return l.category?.type === 'camping';
      if (isActivitySearch) return l.category?.type === 'activity';
      return (
        (l.category?.type ?? null) !== 'package' &&
        (l.category?.type ?? null) !== 'camping' &&
        (l.category?.type ?? null) !== 'activity'
      );
    });
    return filterListingsByLocation(typed, locationQuery);
  }, [
    hotelListings,
    packageListings,
    glampingListings,
    activityListings,
    locationQuery,
    searchParams?.tab,
  ]);

  const listingVariant = isPackages ? 'packages' : isGlamping ? 'glamping' : isActivities ? 'activities' : 'hotels';
  const suggested = isPackages
    ? packageListings.slice(0, 8)
    : isGlamping
      ? glampingListings.slice(0, 8)
      : isActivities
        ? activityListings.slice(0, 8)
        : hotelListings.slice(0, 8);
  const destinations = isPackages
    ? packageListings
    : isGlamping
      ? glampingListings
      : isActivities
        ? activityListings
        : nearYouListings;
  const budgetItems = isPackages
    ? packageListings.slice(0, 2)
    : isGlamping
      ? glampingListings.slice(0, 2)
      : isActivities
        ? activityListings.slice(0, 2)
        : budgetHotels;

  const searchDateLabel =
    checkIn && checkOut ? formatStayDateLabel(checkIn, checkOut) : undefined;

  useEffect(() => {
    if (searchMode) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [searchMode, locationQuery, checkIn, checkOut]);

  const goToListing = (listing: Listing) => {
    const isPackageListing = listing.category?.type === 'package';
    const isCampingListing = listing.category?.type === 'camping';
    const isActivityListing = listing.category?.type === 'activity';
    router.push({
      pathname: isPackageListing
        ? '/package/[id]'
        : isCampingListing
          ? '/glamping/[id]'
          : isActivityListing
            ? '/activity/[id]'
            : '/hotels/[id]',
      params: {
        id: listing.id,
        title: listing.title,
        price: listing.price_start
          ? `₹${Number(listing.price_start).toLocaleString('en-IN')}`
          : '',
        rating: '4.5',
        ...(checkIn ? { checkIn } : {}),
        ...(checkOut ? { checkOut } : {}),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {searchMode ? (
          <>
            <SearchModeHeader />
            <HomeSearchResults
              listings={searchListings}
              locationLabel={
                locationQuery ||
                (isPackages ? 'Singapore' : isGlamping ? 'Wildlife safari camps' : isActivities ? 'Scuba Diving' : 'Varkala')
              }
              dateLabel={searchDateLabel}
              loading={
                (searchTab === 'hotels' && hotelsLoading) ||
                (searchMode && categorySearchLoading)
              }
              variant={listingVariant}
              onListingPress={goToListing}
            />
          </>
        ) : (
          <>
            <AppTopHeader />
            <HomeHeroSection />
            <HomePromoCarousel variant={listingVariant} />
            <HomeMoodGrid
              variant={listingVariant}
              onMoodPress={() => {
                if (isPackages) router.push('/packages');
                else router.push('/resorts');
              }}
            />
            <HomeSuggestedSection
              listings={suggested}
              variant={listingVariant}
              onListingPress={goToListing}
            />
            <HomeDestinationsSection
              listings={destinations}
              variant={listingVariant}
              onListingPress={goToListing}
            />
            <HomeBudgetGrid
              listings={budgetItems}
              variant={listingVariant}
              onListingPress={goToListing}
            />
          </>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 0,
  },
  bottomSpacer: {
    height: 16,
  },
});
