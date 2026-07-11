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
import { VENDOR_PACKAGE_PUBLISH_TITLE, VENDOR_PACKAGE_PUBLISH_COPY } from '@/src/constants/vendorPackageConstants';
import { VENDOR_ACTIVITY_PUBLISH_COPY, VENDOR_ACTIVITY_PUBLISH_TITLE } from '@/src/constants/vendorActivityConstants';
import { buildActivityPublishPreview, type ActivityPublishPreview } from '@/src/utils/buildActivityPublishPreview';
import { buildPackagePublishPreview, type PackagePublishPreview } from '@/src/utils/buildPackagePublishPreview';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitVendorGlampingListingForApproval } from '@/src/api/vendorGlampingOnboarding.service';
import { submitVendorActivityListingForApproval } from '@/src/api/vendorActivityOnboarding.service';
import { submitVendorPackageListingForApproval } from '@/src/api/vendorPackageOnboarding.service';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { getVendorHotelDraft } from '@/src/utils/vendorHotelDraft';
import { getVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { getVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { getVendorPackageDraft } from '@/src/utils/vendorPackageDraft';

const DESIGN_WIDTH = 402;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function formatRupee(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function MobileVendorPublishListingScreen() {
  const categoryId = useVendorListingCategory();
  const price = DEFAULT_VENDOR_ROOM_PRICING.basePrice;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftThumbnail, setDraftThumbnail] = useState<string | null>(null);
  const [activityPreview, setActivityPreview] = useState<ActivityPublishPreview | null>(null);
  const [packagePreview, setPackagePreview] = useState<PackagePublishPreview | null>(null);
  useEffect(() => {
    (async () => {
      if (categoryId === 'glamping') {
        const hotelDraft = await getVendorHotelDraft();
        const glampingDraft = await getVendorGlampingDraft();
        setDraftTitle(hotelDraft?.title ?? '');
        const firstImage = Array.isArray(glampingDraft?.images) ? glampingDraft.images[0] : null;
        setDraftThumbnail(firstImage ?? null);
        setActivityPreview(null);
        setPackagePreview(null);
        return;
      }
      if (categoryId === 'activities') {
        const activityDraft = await getVendorActivityDraft();
        const preview = buildActivityPublishPreview(activityDraft);
        setActivityPreview(preview);
        setPackagePreview(null);
        setDraftTitle(preview.title);
        setDraftThumbnail(preview.thumbnail);
        return;
      }
      if (categoryId === 'packages') {
        const packageDraft = await getVendorPackageDraft();
        const preview = buildPackagePublishPreview(packageDraft);
        setPackagePreview(preview);
        setActivityPreview(null);
        setDraftTitle(preview.title);
        setDraftThumbnail(preview.thumbnail);
        return;
      }
      setActivityPreview(null);
      setPackagePreview(null);
    })();
  }, [categoryId]);

  const isActivity = categoryId === 'activities';
  const isPackage = categoryId === 'packages';
  const isDraftPreview = isActivity || isPackage;
  const activePreview = isActivity ? activityPreview : isPackage ? packagePreview : null;
  const previewPrice = activePreview ? activePreview.price : price;
  const previewPriceLabel = isActivity
    ? VENDOR_ACTIVITY_PUBLISH_COPY.priceLabel
    : isPackage
      ? VENDOR_PACKAGE_PUBLISH_COPY.priceLabel
      : VENDOR_PUBLISH_COPY.priceLabel;
  const previewTaxLabel = isActivity
    ? VENDOR_ACTIVITY_PUBLISH_COPY.taxLabel
    : isPackage
      ? VENDOR_PACKAGE_PUBLISH_COPY.taxLabel
      : VENDOR_PUBLISH_COPY.taxLabel;

  const listingTitle =
    categoryId === 'glamping'
      ? draftTitle || 'Your glamping listing'
      : categoryId === 'activities'
        ? draftTitle || VENDOR_ACTIVITY_PUBLISH_TITLE
        : categoryId === 'packages'
          ? draftTitle || VENDOR_PACKAGE_PUBLISH_TITLE
          : VENDOR_PUBLISH_COPY.listingTitle;
  const thumbnail =
    (categoryId === 'glamping' || isDraftPreview) && draftThumbnail
      ? ({ uri: draftThumbnail } as const)
      : categoryId === 'glamping'
        ? VENDOR_MOCK_PHOTO_SOURCES[2]
        : categoryId === 'packages'
          ? VENDOR_MOCK_PHOTO_SOURCES[3]
          : categoryId === 'activities'
            ? VENDOR_MOCK_PHOTO_SOURCES[4]
            : VENDOR_MOCK_PHOTO_SOURCES[0];

  const handlePublish = async () => {
    setSubmitError(null);
    if (categoryId === 'activities') {
      setIsSubmitting(true);
      try {
        const res = await submitVendorActivityListingForApproval();
        if (res.success) {
          router.push('/vendor/thanks');
          return;
        }
        setSubmitError(res.message ?? 'Could not submit listing for approval.');
      } catch (e) {
        setSubmitError(getErrorMessage(e));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (categoryId === 'packages') {
      setIsSubmitting(true);
      try {
        const res = await submitVendorPackageListingForApproval();
        if (res.success) {
          router.push('/vendor/thanks');
          return;
        }
        setSubmitError(res.message ?? 'Could not submit listing for approval.');
      } catch (e) {
        setSubmitError(getErrorMessage(e));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (categoryId !== 'glamping') {
      router.push('/vendor/thanks');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitVendorGlampingListingForApproval();
      if (res.success) {
        router.push('/vendor/thanks');
        return;
      }
      setSubmitError(res.message ?? 'Could not submit listing for approval.');
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId={categoryId} />
          <Text style={styles.title}>{VENDOR_PUBLISH_COPY.title}</Text>
          <Text style={styles.description}>
            {isActivity
              ? VENDOR_ACTIVITY_PUBLISH_COPY.description
              : isPackage
                ? VENDOR_PACKAGE_PUBLISH_COPY.description
                : VENDOR_PUBLISH_COPY.description}
          </Text>
          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

          <View style={styles.previewCard}>
            <View style={styles.previewTop}>
              <Image
                source={thumbnail}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.previewInfo}>
                <Text style={styles.listingTitle}>{listingTitle}</Text>
                {isDraftPreview && activePreview ? (
                  <>
                    <View style={styles.hostRow}>
                      <Ionicons name="location-outline" size={14} color={colors.accent.main} />
                      <Text style={styles.hostText}>{activePreview.locationLabel}</Text>
                    </View>
                    <View style={styles.ratingRow}>
                      <Ionicons name="time-outline" size={12} color={colors.accent.main} />
                      <Text style={styles.ratingText}>
                        {activePreview.durationLabel} | {activePreview.metaLabel}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </View>
            </View>

            <View style={styles.tagsGrid}>
              {isDraftPreview && activePreview
                ? activePreview.tags.map((tag) => (
                    <View key={tag.id} style={styles.tagPill}>
                      <Ionicons name="checkmark-circle-outline" size={12} color={colors.accent.main} />
                      <Text style={styles.tagText}>{tag.label}</Text>
                    </View>
                  ))
                : VENDOR_PREVIEW_TAGS.map((tag) => (
                    <View key={tag.id} style={styles.tagPill}>
                      <Ionicons name={tag.icon} size={12} color="rgba(28, 32, 36, 0.5)" />
                      <Text style={styles.tagText}>{tag.label}</Text>
                    </View>
                  ))}
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{previewPriceLabel}</Text>
              <View style={styles.priceCol}>
                <Text style={styles.priceValue}>
                  {previewPrice > 0
                    ? formatRupee(previewPrice)
                    : VENDOR_ACTIVITY_PUBLISH_COPY.pendingPriceLabel}
                </Text>
                <Text style={styles.taxLabel}>{previewTaxLabel}</Text>
                {isActivity && activityPreview && activityPreview.infantPrice > 0 ? (
                  <Text style={styles.infantPriceText}>
                    {VENDOR_ACTIVITY_PUBLISH_COPY.infantPriceLabel}: {formatRupee(activityPreview.infantPrice)}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.publishButton,
              pressed && !isSubmitting && styles.pressed,
              isSubmitting && styles.disabled,
            ]}
            onPress={handlePublish}
            disabled={isSubmitting}
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
  infantPriceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    color: 'rgba(28, 32, 36, 0.55)',
    marginTop: 2,
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
  disabled: { opacity: 0.6 },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
