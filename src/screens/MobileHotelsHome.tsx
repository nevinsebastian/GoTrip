import { colors } from '@/constants/DesignTokens';
import type { Listing } from '@/src/api/types';
import { useListings } from '@/src/hooks/useListings';
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
import { HomeSearchProvider, useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { HomeSearchResults } from '@/src/components/home/HomeSearchResults';
import { SearchModeHeader } from '@/src/components/home/SearchModeHeader';
import { MOCK_PACKAGE_LISTINGS } from '@/src/constants/homePackageConfig';

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

function MobileHotelsHomeContent() {
  const scrollRef = useRef<ScrollView>(null);
  const { searchMode, searchParams, activeCategoryTab } = useHomeSearch();
  const isPackages = activeCategoryTab === 'packages';

  const { data: listingsRes } = useListings({ page: 1, limit: 20 });
  const { data: economicRes } = useListings({ max_price: 2499, page: 1, limit: 20 });
  const { data: nearYouRes } = useListings({ location: 'varkala', page: 1, limit: 20 });

  const locationQuery = searchParams?.location?.trim() ?? '';
  const { data: searchRes, isLoading: searchLoading } = useListings(
    { location: locationQuery.toLowerCase(), page: 1, limit: 20 },
    searchMode && Boolean(locationQuery),
  );

  const allListings = listingsRes?.data ?? [];
  const hotelListings = allListings.filter((l) => (l.category?.type ?? null) !== 'package');
  const apiPackageListings = allListings.filter((l) => l.category?.type === 'package');
  const packageListings = apiPackageListings.length ? apiPackageListings : MOCK_PACKAGE_LISTINGS;

  const economicListings = (economicRes?.data ?? []).filter(
    (l) => (l.category?.type ?? null) !== 'package',
  );
  const economicPackages = (economicRes?.data ?? []).filter((l) => l.category?.type === 'package');
  const budgetPackages = economicPackages.length
    ? economicPackages
    : MOCK_PACKAGE_LISTINGS.slice(0, 2);

  const nearYouListings = (nearYouRes?.data ?? []).filter(
    (l) => (l.category?.type ?? null) !== 'package',
  );
  const nearYouPackages = (nearYouRes?.data ?? []).filter((l) => l.category?.type === 'package');
  const packageDestinations = nearYouPackages.length ? nearYouPackages : packageListings;

  const searchListings = useMemo(() => {
    const isPackageSearch = searchParams?.tab === 'packages';
    const apiResults = searchRes?.data ?? [];
    const pool = apiResults.length ? apiResults : isPackageSearch ? packageListings : hotelListings;
    const typed = pool.filter((l) =>
      isPackageSearch ? l.category?.type === 'package' : (l.category?.type ?? null) !== 'package',
    );
    const filtered = filterListingsByLocation(typed, locationQuery);
    if (filtered.length) return filtered;
    if (isPackageSearch) return filterListingsByLocation(packageListings, '');
    return filterListingsByLocation(typed, '');
  }, [searchRes?.data, hotelListings, packageListings, locationQuery, searchParams?.tab]);

  const suggested = isPackages ? packageListings.slice(0, 8) : hotelListings.slice(0, 8);
  const destinations = isPackages
    ? packageDestinations
    : nearYouListings.length
      ? nearYouListings
      : hotelListings;
  const budgetItems = isPackages ? budgetPackages : economicListings;

  useEffect(() => {
    if (searchMode) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [searchMode, locationQuery]);

  const goToListing = (listing: Listing) => {
    const isPackageListing = listing.category?.type === 'package';
    router.push({
      pathname: isPackageListing ? '/package/[id]' : '/resort/[id]',
      params: {
        id: listing.id,
        title: listing.title,
        price: listing.price_start
          ? `₹${Number(listing.price_start).toLocaleString('en-IN')}`
          : '',
        rating: '4.5',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
              locationLabel={locationQuery || (isPackages ? 'Singapore' : 'Varkala')}
              loading={searchLoading}
              variant={searchParams?.tab === 'packages' ? 'packages' : 'hotels'}
              onListingPress={goToListing}
            />
          </>
        ) : (
          <>
            <HomeHeroSection />
            <HomePromoCarousel variant={isPackages ? 'packages' : 'hotels'} />
            <HomeMoodGrid
              variant={isPackages ? 'packages' : 'hotels'}
              onMoodPress={() => (isPackages ? router.push('/packages') : router.push('/resorts'))}
            />
            <HomeSuggestedSection
              listings={suggested}
              variant={isPackages ? 'packages' : 'hotels'}
              onListingPress={goToListing}
            />
            <HomeDestinationsSection
              listings={destinations}
              variant={isPackages ? 'packages' : 'hotels'}
              onListingPress={goToListing}
            />
            <HomeBudgetGrid
              listings={budgetItems}
              variant={isPackages ? 'packages' : 'hotels'}
              onListingPress={goToListing}
            />
          </>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

export function MobileHotelsHome() {
  return (
    <HomeSearchProvider>
      <MobileHotelsHomeContent />
    </HomeSearchProvider>
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
