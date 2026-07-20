import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardCategoryTabs } from '@/src/components/vendor/dashboard/VendorDashboardCategoryTabs';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import { VendorDeleteListingModal } from '@/src/components/vendor/listings/VendorDeleteListingModal';
import { VendorListingCard } from '@/src/components/vendor/listings/VendorListingCard';
import { VendorListingsStateViews } from '@/src/components/vendor/listings/VendorListingsStateViews';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import {
  VENDOR_LISTING_API_CATEGORY,
  VENDOR_LISTINGS_COPY,
  VENDOR_LISTINGS_STATUS_OPTIONS,
  type VendorListingCardData,
  type VendorListingStatusFilter,
} from '@/src/constants/vendorListingsConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useVendorMyListings } from '@/src/hooks/useVendorMyListings';
import { useVendorWorkspaceAuthGuard } from '@/src/hooks/useVendorWorkspaceAuthGuard';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorListingsScreen() {
  useVendorWorkspaceAuthGuard();

  const storedCategory = useVendorListingCategory();
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
  const [statusFilter, setStatusFilter] = useState<VendorListingStatusFilter>('all');
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VendorListingCardData | null>(null);
  const tabInset = useVendorTabBarInset();
  const { data: profile } = useUserProfile();

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const hostName = profile?.full_name ?? profile?.name;

  const {
    listings: apiListings,
    total,
    hasMore,
    isLoading,
    isError,
    errorMessage,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = useVendorMyListings({
    category: VENDOR_LISTING_API_CATEGORY[categoryId],
    status: statusFilter === 'all' ? undefined : statusFilter,
    hostName,
  });

  const listings = useMemo(() => apiListings, [apiListings]);

  const activeStatus =
    VENDOR_LISTINGS_STATUS_OPTIONS.find((item) => item.id === statusFilter) ??
    VENDOR_LISTINGS_STATUS_OPTIONS[0];

  const showList = !isLoading && !isError && listings.length > 0;
  const showEmpty = !isLoading && !isError && listings.length === 0;

  const handleConfirmDelete = () => setDeleteTarget(null);

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
            <Pressable style={styles.statusFilter} onPress={() => setStatusOpen(true)}>
              <Ionicons name="filter-outline" size={14} color={colors.surface.white} />
              <Text style={styles.statusFilterText} numberOfLines={1}>
                {activeStatus.label}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </Pressable>
          </View>

          {showList ? (
            <View style={styles.list}>
              {listings.map((listing) => (
                <VendorListingCard
                  key={listing.id}
                  listing={listing}
                  onPricing={() =>
                    router.push({
                      pathname: '/vendor/edit-listing',
                      params: { listingId: listing.id, categoryId: listing.categoryId, mode: 'pricing' },
                    })
                  }
                  onDelete={() => setDeleteTarget(listing)}
                />
              ))}
            </View>
          ) : null}

          {showEmpty || isLoading || isError ? (
            <VendorListingsStateViews
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              isEmpty={showEmpty}
              emptyFiltered={statusFilter !== 'all'}
              onRetry={() => void refetch()}
            />
          ) : (
            <VendorListingsStateViews
              isLoading={false}
              isError={false}
              isEmpty={false}
              hasMore={hasMore}
              isFetchingNextPage={isFetchingNextPage}
              shownCount={listings.length}
              totalCount={total}
              onLoadMore={() => void fetchNextPage()}
            />
          )}
        </ScrollView>

        <VendorPropertyOptionSheet
          visible={statusOpen}
          title="Filter by status"
          options={VENDOR_LISTINGS_STATUS_OPTIONS.map((item) => ({
            id: item.id,
            label: item.label,
          }))}
          selectedId={statusFilter}
          onClose={() => setStatusOpen(false)}
          onSelect={(id) => {
            setStatusFilter(id as VendorListingStatusFilter);
            setStatusOpen(false);
          }}
        />

        <VendorWorkspaceFloatingTabBar activeTab="listings" />
      </View>

      {deleteTarget ? (
        <VendorDeleteListingModal
          listing={deleteTarget}
          variant="sheet"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white, position: 'relative' },
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
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 148,
    backgroundColor: colors.text.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusFilterText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  list: { gap: 14 },
});
