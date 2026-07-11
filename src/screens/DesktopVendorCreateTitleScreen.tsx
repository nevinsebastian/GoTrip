import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  VENDOR_HIGHLIGHTS,
  VENDOR_MOCK_PHOTO_SOURCES,
  VENDOR_TITLE_COPY,
  type VendorHighlightId,
} from '@/src/constants/vendorListingConstants';
import { getActivityHighlights } from '@/src/api/activity.service';
import { mapActivityTypeToApi } from '@/src/api/mappers/activityListing';
import type { ActivityHighlight } from '@/src/api/types';
import { VENDOR_ACTIVITY_TITLE_COPY } from '@/src/constants/vendorActivityConstants';
import { VENDOR_PACKAGE_TITLE_COPY } from '@/src/constants/vendorPackageConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { saveVendorHotelDraft } from '@/src/utils/vendorHotelDraft';
import { getVendorActivityDraft, saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { getVendorPackageDraft, saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorCreateTitleScreen() {
  const listingCategoryId = useVendorListingCategory();
  const isGlamping = listingCategoryId === 'glamping';
  const isActivity = listingCategoryId === 'activities';
  const isPackage = listingCategoryId === 'packages';

  const [titlePrimary, setTitlePrimary] = useState(isGlamping || isActivity || isPackage ? '' : VENDOR_TITLE_COPY.titlePrimaryDefault);
  const [titleSecondary, setTitleSecondary] = useState(isGlamping || isActivity || isPackage ? '' : VENDOR_TITLE_COPY.titleSecondaryDefault);
  const [highlights, setHighlights] = useState<VendorHighlightId[]>(isGlamping || isActivity || isPackage ? [] : ['peaceful', 'central']);
  const [activityHighlights, setActivityHighlights] = useState<ActivityHighlight[]>([]);
  const [activityHighlightIds, setActivityHighlightIds] = useState<string[]>([]);
  const [description, setDescription] = useState(isGlamping || isActivity || isPackage ? '' : VENDOR_TITLE_COPY.descriptionDefault);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isActivity) return;
    (async () => {
      const draft = await getVendorActivityDraft();
      if (draft?.title) setTitlePrimary(draft.title);
      if (draft?.titleSecondary) setTitleSecondary(draft.titleSecondary);
      if (draft?.description) setDescription(draft.description);
      if (draft?.highlightIds?.length) setActivityHighlightIds(draft.highlightIds);
      const activityType = mapActivityTypeToApi(draft?.activityKindId, draft?.activityTypeId);
      try {
        const res = await getActivityHighlights(activityType);
        setActivityHighlights(res.highlights ?? []);
      } catch {
        // Highlights are optional; listing can still be created without them.
      }
    })();
  }, [isActivity]);

  useEffect(() => {
    if (!isPackage) return;
    (async () => {
      const draft = await getVendorPackageDraft();
      if (draft?.title) setTitlePrimary(draft.title);
      if (draft?.description) setDescription(draft.description);
    })();
  }, [isPackage]);

  const toggleHighlight = (id: VendorHighlightId) => {
    setHighlights((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= VENDOR_TITLE_COPY.highlightsMax) return prev;
      return [...prev, id];
    });
  };

  const toggleActivityHighlight = (id: string) => {
    setActivityHighlightIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= VENDOR_TITLE_COPY.highlightsMax) return prev;
      return [...prev, id];
    });
  };

  const handleNext = async () => {
    const title = titlePrimary.trim();
    if (!title) {
      setSubmitError(
        `Please enter a title for your ${isActivity ? 'activity' : isPackage ? 'package' : isGlamping ? 'glamping listing' : 'hotel'}.`,
      );
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      if (isActivity) {
        if (!description.trim()) {
          setSubmitError('Please add a listing description for your activity.');
          return;
        }
        await saveVendorActivityDraft({
          title,
          titleSecondary: titleSecondary.trim(),
          description: description.trim(),
          highlightIds: activityHighlightIds,
        });
        router.push('/vendor/guest-activity-details');
        return;
      }

      if (isPackage) {
        if (!description.trim()) {
          setSubmitError('Please add a package description.');
          return;
        }
        await saveVendorPackageDraft({
          title,
          description: description.trim(),
        });
        router.push('/vendor/guest-package-details');
        return;
      }

      const combinedDescription = [titleSecondary.trim(), description.trim()]
        .filter(Boolean)
        .join('\n\n');

      await saveVendorHotelDraft({
        title,
        description: combinedDescription,
      });

      router.push('/vendor/select-location');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DesktopVendorOnboardingShell
        layout="split"
        listingCategoryId={listingCategoryId}
        heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.title}
        footer={
          <DesktopVendorOnboardingFooter
            onBack={() => router.back()}
            onNext={handleNext}
            nextSuffix={
              isActivity
                ? VENDOR_ACTIVITY_TITLE_COPY.nextSuffix
                : isPackage
                  ? VENDOR_PACKAGE_TITLE_COPY.nextSuffix
                  : VENDOR_TITLE_COPY.nextSuffix
            }
            isNextLoading={isSaving}
            nextDisabled={isSaving}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.intro}>
            <Text style={styles.pageTitle}>
              {isActivity
                ? VENDOR_ACTIVITY_TITLE_COPY.title
                : isPackage
                  ? VENDOR_PACKAGE_TITLE_COPY.title
                  : VENDOR_TITLE_COPY.title}
            </Text>
            <Text style={styles.pageSubtitle}>
              {isActivity
                ? VENDOR_ACTIVITY_TITLE_COPY.subtitle
                : isPackage
                  ? VENDOR_PACKAGE_TITLE_COPY.subtitle
                  : VENDOR_TITLE_COPY.subtitle}
            </Text>
          </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>
            {isActivity
              ? VENDOR_ACTIVITY_TITLE_COPY.titleLabel
              : isPackage
                ? VENDOR_PACKAGE_TITLE_COPY.titleLabel
                : VENDOR_TITLE_COPY.titleLabel}
          </Text>

          <View style={styles.titlePrimaryRow}>
            <TextInput
              value={titlePrimary}
              onChangeText={setTitlePrimary}
              style={styles.titlePrimaryInput}
              placeholderTextColor={colors.text.placeholder}
            />
            <Ionicons name="pencil-outline" size={16} color="rgba(28, 32, 36, 0.45)" />
          </View>

          {!isPackage ? (
            <>
              <TextInput
                value={titleSecondary}
                onChangeText={(v) =>
                  setTitleSecondary(
                    v.slice(0, isActivity ? VENDOR_ACTIVITY_TITLE_COPY.taglineMax : VENDOR_TITLE_COPY.titleSecondaryMax),
                  )
                }
                multiline
                style={styles.titleSecondaryInput}
                placeholder={isActivity ? VENDOR_ACTIVITY_TITLE_COPY.taglineLabel : undefined}
                placeholderTextColor={colors.text.placeholder}
              />

              <Text style={styles.charCount}>
                {titleSecondary.length}/
                {isActivity ? VENDOR_ACTIVITY_TITLE_COPY.taglineMax : VENDOR_TITLE_COPY.titleSecondaryMax}
              </Text>
            </>
          ) : null}
        </View>

        {!isPackage ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>
            {isActivity ? VENDOR_ACTIVITY_TITLE_COPY.highlightsLabel : VENDOR_TITLE_COPY.highlightsLabel}
          </Text>
          <View style={styles.highlightGrid}>
            {(isActivity ? activityHighlights : VENDOR_HIGHLIGHTS).map((item) => {
              const selected = isActivity
                ? activityHighlightIds.includes(item.id)
                : highlights.includes(item.id as VendorHighlightId);
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.highlightPill,
                    selected && styles.highlightPillSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    isActivity
                      ? toggleActivityHighlight(item.id)
                      : toggleHighlight(item.id as VendorHighlightId)
                  }
                >
                  {!isActivity ? (
                    <Ionicons
                      name={(item as (typeof VENDOR_HIGHLIGHTS)[number]).icon}
                      size={14}
                      color={selected ? colors.accent.main : 'rgba(28, 32, 36, 0.45)'}
                    />
                  ) : null}
                  <Text style={[styles.highlightText, selected && styles.highlightTextSelected]}>
                    {'name' in item ? item.name : item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        ) : null}

        {!isActivity && !isPackage ? (
          <View style={styles.photoRow}>
            <Image
              source={VENDOR_MOCK_PHOTO_SOURCES[0]}
              style={styles.photoPreview}
              resizeMode="cover"
            />
            <Image
              source={VENDOR_MOCK_PHOTO_SOURCES[1]}
              style={styles.photoPreview}
              resizeMode="cover"
            />
          </View>
        ) : null}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>
            {isActivity
              ? VENDOR_ACTIVITY_TITLE_COPY.descriptionLabel
              : isPackage
                ? VENDOR_PACKAGE_TITLE_COPY.descriptionLabel
                : VENDOR_TITLE_COPY.descriptionLabel}
          </Text>
          <TextInput
            value={description}
            onChangeText={(v) =>
              setDescription(
                v.slice(0, isActivity
                  ? VENDOR_ACTIVITY_TITLE_COPY.descriptionMax
                  : isPackage
                    ? VENDOR_PACKAGE_TITLE_COPY.descriptionMax
                    : VENDOR_TITLE_COPY.descriptionMax),
              )
            }
            multiline
            style={styles.descriptionInput}
            placeholderTextColor={colors.text.placeholder}
          />
          <Text style={styles.charCount}>
            {description.length}/
            {isActivity
              ? VENDOR_ACTIVITY_TITLE_COPY.descriptionMax
              : isPackage
                ? VENDOR_PACKAGE_TITLE_COPY.descriptionMax
                : VENDOR_TITLE_COPY.descriptionMax}
          </Text>
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
        </View>
      </DesktopVendorOnboardingShell>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 8,
  },
  intro: {
    gap: 4,
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 26,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 32,
    color: colors.accent.main,
  },
  pageSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  sectionCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface.white,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 20,
    color: colors.text.primary,
  },
  titlePrimaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface.lightPink,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    paddingHorizontal: 12,
    height: 44,
  },
  titlePrimaryInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 0,
    ...Platform.select({
      android: { textAlignVertical: 'center', includeFontPadding: false },
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  titleSecondaryInput: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  highlightPillSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  highlightText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  highlightTextSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  photoPreview: {
    flex: 1,
    height: 110,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  descriptionInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  pressed: { opacity: 0.85 },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.primaryAlt,
  },
});
