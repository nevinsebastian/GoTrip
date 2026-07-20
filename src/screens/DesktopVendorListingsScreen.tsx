import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorDashboardCategoryTabs } from '@/src/components/desktop/DesktopVendorDashboardCategoryTabs';
import { DesktopVendorListingCard } from '@/src/components/desktop/DesktopVendorListingCard';
import { DesktopVendorWebHeader } from '@/src/components/desktop/DesktopVendorWebHeader';
import { VendorDeleteListingModal } from '@/src/components/vendor/listings/VendorDeleteListingModal';
import { VendorListingsStateViews } from '@/src/components/vendor/listings/VendorListingsStateViews';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
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
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FIGMA_PAGE_WIDTH = 1280;
const FIGMA_CONTENT_WIDTH = 1196;
const FIGMA_TITLE = '#0F1A20';
const FIGMA_PROPERTY_BG = '#0F1A20';

export function DesktopVendorListingsScreen() {
  useVendorWorkspaceAuthGuard();

  const { width } = useResponsive();
  const compact = width > 0 && width < 980;
  const storedCategory = useVendorListingCategory();

  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
  const [statusFilter, setStatusFilter] = useState<VendorListingStatusFilter>('all');
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VendorListingCardData | null>(null);
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
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.pageShell}>
        <DesktopVendorWebHeader compact={compact} />

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyScrollContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          <View style={styles.content}>
            <DesktopVendorDashboardCategoryTabs selectedId={categoryId} onSelect={setCategoryId} />

            <View style={styles.toolbarRow}>
              <Text style={styles.screenTitle}>{VENDOR_LISTINGS_COPY.title}</Text>

              <View style={styles.toolbarActions}>
                <Pressable
                  style={styles.statusSelect}
                  onPress={() => setStatusOpen(true)}
                  accessibilityRole="button"
                >
                  <Ionicons name="filter-outline" size={18} color={colors.surface.white} />
                  <Text style={styles.statusSelectText} numberOfLines={1}>
                    {activeStatus.label}
                  </Text>
                  <Ionicons name="chevron-down" size={24} color={colors.surface.white} />
                </Pressable>
              </View>
            </View>

            {showList ? (
              <View style={[styles.grid, compact && styles.gridCompact]}>
                {listings.map((listing) => (
                  <View
                    key={listing.id}
                    style={[styles.gridItem, compact && styles.gridItemCompact]}
                  >
                    <DesktopVendorListingCard
                      listing={listing}
                      onPricing={() =>
                        router.push({
                          pathname: '/vendor/edit-listing',
                          params: { listingId: listing.id, categoryId: listing.categoryId, mode: 'pricing' },
                        })
                      }
                      onDelete={() => setDeleteTarget(listing)}
                    />
                  </View>
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
          </View>
        </ScrollView>
      </View>

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

      {deleteTarget ? (
        <VendorDeleteListingModal
          listing={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
    position: 'relative',
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
    gap: 18,
    paddingTop: 32,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 25,
    width: '100%',
    minHeight: 42,
    marginTop: 18,
  },
  screenTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    letterSpacing: 0.48,
    color: FIGMA_TITLE,
    flexShrink: 0,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flexShrink: 1,
    justifyContent: 'flex-end',
  },
  statusSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    maxWidth: 240,
    paddingHorizontal: 18,
    backgroundColor: FIGMA_PROPERTY_BG,
    borderRadius: 8,
    ...Platform.select({
      web: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)', cursor: 'pointer' as const },
    }),
  },
  statusSelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 21,
    letterSpacing: 0.28,
    color: colors.surface.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    width: '100%',
    marginTop: 18,
  },
  gridCompact: {
    flexDirection: 'column',
  },
  gridItem: {
    flexBasis: '48%',
    flexGrow: 1,
    maxWidth: '48%',
    minWidth: 280,
  },
  gridItemCompact: {
    flexBasis: '100%',
    maxWidth: '100%',
  },
});
