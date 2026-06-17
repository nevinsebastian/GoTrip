import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardCategoryTabs } from '@/src/components/vendor/dashboard/VendorDashboardCategoryTabs';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import { VendorDeleteListingModal } from '@/src/components/vendor/listings/VendorDeleteListingModal';
import { VendorListingCard } from '@/src/components/vendor/listings/VendorListingCard';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import {
  VENDOR_LISTING_CARDS,
  VENDOR_LISTINGS_COPY,
  type VendorListingCardData,
} from '@/src/constants/vendorListingsConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorListingsScreen() {
  const storedCategory = useVendorListingCategory();
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
  const [listingItems, setListingItems] = useState(VENDOR_LISTING_CARDS);
  const [deleteTarget, setDeleteTarget] = useState<VendorListingCardData | null>(null);
  const tabInset = useVendorTabBarInset();

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const filteredListings = useMemo(
    () => listingItems.filter((listing) => listing.categoryId === categoryId),
    [categoryId, listingItems],
  );

  const listings = filteredListings.length > 0 ? filteredListings : listingItems;

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setListingItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset }]}
          showsVerticalScrollIndicator={false}
        >
          <VendorDashboardCategoryTabs selectedId={categoryId} onSelect={setCategoryId} />

          <View style={styles.screenHeader}>
            <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
            </Pressable>
            <Text style={styles.screenTitle}>{VENDOR_LISTINGS_COPY.title}</Text>
            <Pressable style={styles.locationFilter}>
              <Ionicons name="location-outline" size={14} color={colors.surface.white} />
              <Text style={styles.locationFilterText} numberOfLines={1}>
                {VENDOR_LISTINGS_COPY.locationFilter}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </Pressable>
          </View>

          <View style={styles.list}>
            {listings.map((listing) => (
              <VendorListingCard
                key={listing.id}
                listing={listing}
                onDelete={() => setDeleteTarget(listing)}
              />
            ))}
          </View>
        </ScrollView>

        {deleteTarget ? (
          <VendorDeleteListingModal
            listing={deleteTarget}
            bottomInset={tabInset}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        ) : null}

        <VendorWorkspaceFloatingTabBar activeTab="listings" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    gap: 14,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
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
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  locationFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 148,
    backgroundColor: colors.text.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  locationFilterText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  list: { gap: 14 },
});
