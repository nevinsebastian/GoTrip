import { colors } from '@/constants/DesignTokens';
import type { Listing } from '@/src/api/types';
import { useListings } from '@/src/hooks/useListings';
import { router } from 'expo-router';
import React from 'react';
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

export function MobileHotelsHome() {
  const { data: listingsRes } = useListings({ page: 1, limit: 20 });
  const { data: economicRes } = useListings({ max_price: 2499, page: 1, limit: 20 });
  const { data: nearYouRes } = useListings({ location: 'varkala', page: 1, limit: 20 });

  const listings = (listingsRes?.data ?? []).filter(
    (l) => (l.category?.type ?? null) !== 'package',
  );
  const economicListings = (economicRes?.data ?? []).filter(
    (l) => (l.category?.type ?? null) !== 'package',
  );
  const nearYouListings = (nearYouRes?.data ?? []).filter(
    (l) => (l.category?.type ?? null) !== 'package',
  );

  const suggested = listings.slice(0, 8);
  const destinations = nearYouListings.length ? nearYouListings : listings;

  const goToListing = (listing: Listing) => {
    router.push({
      pathname: '/resort/[id]',
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
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeroSection />
        <HomePromoCarousel />
        <HomeMoodGrid onMoodPress={() => router.push('/resorts')} />
        <HomeSuggestedSection listings={suggested} onListingPress={goToListing} />
        <HomeDestinationsSection listings={destinations} onListingPress={goToListing} />
        <HomeBudgetGrid listings={economicListings} onListingPress={goToListing} />
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
