import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  DEFAULT_VENDOR_ROOM_PRICING,
  VENDOR_MOCK_HOST,
  VENDOR_MOCK_PHOTO_SOURCES,
  VENDOR_PREVIEW_TAGS,
  VENDOR_PUBLISH_COPY,
} from '@/src/constants/vendorListingConstants';
import { VENDOR_GLAMPING_PUBLISH_TITLE } from '@/src/constants/vendorGlampingConstants';
import { VENDOR_PACKAGE_PUBLISH_TITLE } from '@/src/constants/vendorPackageConstants';
import { VENDOR_ACTIVITY_PUBLISH_TITLE } from '@/src/constants/vendorActivityConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function formatRupee(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function DesktopVendorPublishListingScreen() {
  const listingCategoryId = useVendorListingCategory();
  const price = DEFAULT_VENDOR_ROOM_PRICING.basePrice;
  const listingTitle =
    listingCategoryId === 'glamping'
      ? VENDOR_GLAMPING_PUBLISH_TITLE
      : listingCategoryId === 'packages'
        ? VENDOR_PACKAGE_PUBLISH_TITLE
        : listingCategoryId === 'activities'
          ? VENDOR_ACTIVITY_PUBLISH_TITLE
          : VENDOR_PUBLISH_COPY.listingTitle;
  const thumbnail =
    listingCategoryId === 'glamping'
      ? VENDOR_MOCK_PHOTO_SOURCES[2]
      : listingCategoryId === 'packages'
        ? VENDOR_MOCK_PHOTO_SOURCES[3]
        : listingCategoryId === 'activities'
          ? VENDOR_MOCK_PHOTO_SOURCES[4]
          : VENDOR_MOCK_PHOTO_SOURCES[0];

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId={listingCategoryId}
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.publish}
      footer={
        <Pressable
          style={({ pressed }) => [styles.publishButton, pressed && styles.pressed]}
          onPress={() => router.push('/vendor/thanks')}
          accessibilityRole="button"
        >
          <Text style={styles.publishText}>{VENDOR_PUBLISH_COPY.cta}</Text>
        </Pressable>
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{VENDOR_PUBLISH_COPY.title}</Text>
        <Text style={styles.description}>{VENDOR_PUBLISH_COPY.description}</Text>

        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
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
                <View style={styles.tagIconWrap}>
                  <Ionicons name={tag.icon} size={14} color={colors.accent.main} />
                </View>
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
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  previewCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  previewTop: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 120,
    height: 84,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  previewInfo: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  listingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 18,
    color: colors.text.primary,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  hostText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
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
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(28, 32, 36, 0.03)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(232, 84, 51, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    paddingTop: 12,
    gap: 8,
  },
  priceLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.main,
  },
  taxLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  publishButton: {
    width: '100%',
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  publishText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
  },
  pressed: { opacity: 0.85 },
});

