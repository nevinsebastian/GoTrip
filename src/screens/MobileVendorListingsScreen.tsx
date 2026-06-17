import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorWorkspaceHeader } from '@/src/components/vendor/workspace/VendorWorkspaceHeader';
import {
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_GREEN,
  VENDOR_WORKSPACE_LISTINGS,
  VENDOR_WORKSPACE_PINK,
} from '@/src/constants/vendorWorkspaceConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

const CREATE_LISTING_ROUTE: Record<VendorListingCategoryId, string> = {
  property: '/vendor/describe-property',
  glamping: '/vendor/describe-camp',
  packages: '/vendor/describe-package',
  activities: '/vendor/describe-activity',
};

export function MobileVendorListingsScreen() {
  const categoryId = useVendorListingCategory();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorWorkspaceHeader categoryId={categoryId} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Pressable
            style={styles.createBtn}
            onPress={() => router.push(CREATE_LISTING_ROUTE[categoryId] as any)}
          >
            <Ionicons name="add" size={18} color={colors.surface.white} />
            <Text style={styles.createBtnText}>{VENDOR_WORKSPACE_COPY.createListing}</Text>
          </Pressable>

          <Text style={styles.title}>{VENDOR_WORKSPACE_COPY.allListings}</Text>

          <View style={styles.list}>
            {VENDOR_WORKSPACE_LISTINGS.map((listing) => (
              <View key={listing.id} style={styles.card}>
                <Image source={listing.image} style={styles.thumb} resizeMode="cover" />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.cardMeta}>{listing.location}</Text>
                  <Text style={styles.cardPrice}>{listing.pricePerNight}/night</Text>
                  <View style={styles.cardFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        listing.status === 'live' ? styles.statusLive : styles.statusDraft,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          listing.status === 'live' ? styles.statusLiveText : styles.statusDraftText,
                        ]}
                      >
                        {listing.status === 'live' ? 'Live' : 'Draft'}
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      <Pressable
                        style={styles.editBtn}
                        onPress={() => router.push('/vendor/edit-listing')}
                      >
                        <Text style={styles.editBtnText}>Edit</Text>
                      </Pressable>
                      <Pressable style={styles.deleteBtn}>
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 16,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: VENDOR_WORKSPACE_PINK,
    borderRadius: borderRadius.pill,
    paddingVertical: 14,
  },
  createBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  list: { gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 12,
    backgroundColor: colors.surface.white,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  cardMeta: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  cardPrice: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusLive: { backgroundColor: 'rgba(22, 163, 74, 0.12)' },
  statusDraft: { backgroundColor: 'rgba(28, 32, 36, 0.08)' },
  statusText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
  },
  statusLiveText: { color: VENDOR_WORKSPACE_GREEN },
  statusDraftText: { color: 'rgba(28, 32, 36, 0.55)' },
  cardActions: { flexDirection: 'row', gap: 6 },
  editBtn: {
    backgroundColor: '#2563EB',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: '#DC2626',
  },
});
