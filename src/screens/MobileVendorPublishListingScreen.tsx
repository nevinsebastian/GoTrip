import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import {
  DEFAULT_VENDOR_ROOM_PRICING,
  VENDOR_MOCK_HOST,
  VENDOR_MOCK_PHOTO_SOURCES,
  VENDOR_PREVIEW_TAGS,
  VENDOR_PUBLISH_COPY,
} from '@/src/constants/vendorListingConstants';
import { VENDOR_GLAMPING_PUBLISH_TITLE } from '@/src/constants/vendorGlampingConstants';
import { VENDOR_PACKAGE_PUBLISH_TITLE } from '@/src/constants/vendorPackageConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function formatRupee(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function MobileVendorPublishListingScreen() {
  const categoryId = useVendorListingCategory();
  const price = DEFAULT_VENDOR_ROOM_PRICING.basePrice;
  const listingTitle =
    categoryId === 'glamping'
      ? VENDOR_GLAMPING_PUBLISH_TITLE
      : categoryId === 'packages'
        ? VENDOR_PACKAGE_PUBLISH_TITLE
        : VENDOR_PUBLISH_COPY.listingTitle;
  const thumbnail =
    categoryId === 'glamping'
      ? VENDOR_MOCK_PHOTO_SOURCES[2]
      : categoryId === 'packages'
        ? VENDOR_MOCK_PHOTO_SOURCES[3]
        : VENDOR_MOCK_PHOTO_SOURCES[0];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId={categoryId} />
          <Text style={styles.title}>{VENDOR_PUBLISH_COPY.title}</Text>
          <Text style={styles.description}>{VENDOR_PUBLISH_COPY.description}</Text>

          <View style={styles.previewCard}>
            <View style={styles.previewTop}>
              <Image
                source={thumbnail}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.previewInfo}>
                <Text style={styles.listingTitle}>{listingTitle}</Text>
                <View style={styles.hostRow}>
                  <Image source={VENDOR_MOCK_HOST.avatar} style={styles.hostAvatar} resizeMode="cover" />
                  <Text style={styles.hostText}>
                    Host <Text style={styles.hostName}>{VENDOR_MOCK_HOST.fullName}</Text>
                  </Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={colors.accent.main} />
                  <Text style={styles.ratingText}>
                    {VENDOR_PUBLISH_COPY.rating} | {VENDOR_PUBLISH_COPY.customersLabel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tagsGrid}>
              {VENDOR_PREVIEW_TAGS.map((tag) => (
                <View key={tag.id} style={styles.tagPill}>
                  <Ionicons name={tag.icon} size={12} color="rgba(28, 32, 36, 0.5)" />
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{VENDOR_PUBLISH_COPY.priceLabel}</Text>
              <View style={styles.priceCol}>
                <Text style={styles.priceValue}>{formatRupee(price)}</Text>
                <Text style={styles.taxLabel}>{VENDOR_PUBLISH_COPY.taxLabel}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.publishButton, pressed && styles.pressed]}
            onPress={() => router.push('/vendor/thanks')}
            accessibilityRole="button"
          >
            <Text style={styles.publishText}>{VENDOR_PUBLISH_COPY.cta}</Text>
            <View style={styles.publishIcon}>
              <Ionicons name="arrow-forward" size={16} color={colors.accent.main} />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 14,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  previewCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  previewTop: {
    flexDirection: 'row',
    gap: 10,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  previewInfo: {
    flex: 1,
    gap: 6,
  },
  listingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  hostText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  hostName: {
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    paddingTop: 10,
    gap: 8,
  },
  priceLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.main,
  },
  taxLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  footer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    paddingTop: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
  },
  publishButton: {
    height: 48,
    borderRadius: 28,
    backgroundColor: colors.accent.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['4'],
    gap: 10,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  publishText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
  },
  publishIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});
