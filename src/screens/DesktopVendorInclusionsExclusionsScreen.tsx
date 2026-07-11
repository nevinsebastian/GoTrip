import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  EMPTY_CAMPING_EXCLUSIONS,
  EMPTY_CAMPING_INCLUSIONS,
  EMPTY_CAMPING_WHATS_PROVIDED,
  VENDOR_INCLUSIONS_EXCLUSIONS_COPY,
} from '@/src/constants/vendorGlampingConstants';
import {
  EMPTY_ACTIVITY_EXCLUSIONS,
  EMPTY_ACTIVITY_INCLUSIONS,
  EMPTY_ACTIVITY_WHATS_PROVIDED,
  VENDOR_ACTIVITY_INCLUSIONS_COPY,
} from '@/src/constants/vendorActivityConstants';
import {
  DEFAULT_PACKAGE_EXCLUSIONS,
  DEFAULT_PACKAGE_INCLUSIONS,
  EMPTY_PACKAGE_WHATS_PROVIDED,
  VENDOR_PACKAGE_INCLUSIONS_COPY,
} from '@/src/constants/vendorPackageConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { ensureVendorGlampingListingCreated } from '@/src/api/vendorGlampingOnboarding.service';
import { createVendorActivityListingWithSlots } from '@/src/api/vendorActivityOnboarding.service';
import { createVendorPackageListingWithItineraries } from '@/src/api/vendorPackageOnboarding.service';
import { getVendorGlampingDraft, saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { getVendorActivityDraft, saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { getVendorPackageDraft, saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { parseGlampingTextList } from '@/src/utils/parseGlampingTextList';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function ListSection({
  title,
  value,
  onChange,
  maxLength,
  headerStyle,
  headerTextStyle,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  headerStyle: object;
  headerTextStyle: object;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={[styles.sectionHeader, headerStyle]}>
        <Text style={[styles.sectionHeaderText, headerTextStyle]}>{title}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, maxLength))}
        multiline
        style={styles.textArea}
        textAlignVertical="top"
      />
      <Text style={styles.charCount}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

export function DesktopVendorInclusionsExclusionsScreen() {
  const categoryId = useVendorListingCategory();
  const isPackage = categoryId === 'packages';
  const isActivity = categoryId === 'activities';
  const copy = isPackage
    ? VENDOR_PACKAGE_INCLUSIONS_COPY
    : isActivity
      ? VENDOR_ACTIVITY_INCLUSIONS_COPY
      : VENDOR_INCLUSIONS_EXCLUSIONS_COPY;

  const [inclusions, setInclusions] = useState(EMPTY_CAMPING_INCLUSIONS);
  const [exclusions, setExclusions] = useState(EMPTY_CAMPING_EXCLUSIONS);
  const [whatsprovided, setWhatsprovided] = useState(EMPTY_CAMPING_WHATS_PROVIDED);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoryId === 'packages') {
      (async () => {
        const draft = await getVendorPackageDraft();
        setInclusions(draft?.inclusionsText ?? DEFAULT_PACKAGE_INCLUSIONS);
        setExclusions(draft?.exclusionsText ?? DEFAULT_PACKAGE_EXCLUSIONS);
        setWhatsprovided(draft?.whatsprovidedText ?? EMPTY_PACKAGE_WHATS_PROVIDED);
      })();
      return;
    }
    if (categoryId === 'glamping') {
      (async () => {
        const draft = await getVendorGlampingDraft();
        setInclusions(draft?.inclusionsText ?? EMPTY_CAMPING_INCLUSIONS);
        setExclusions(draft?.exclusionsText ?? EMPTY_CAMPING_EXCLUSIONS);
        setWhatsprovided(draft?.whatsprovidedText ?? EMPTY_CAMPING_WHATS_PROVIDED);
      })();
      return;
    }
    if (isActivity) {
      (async () => {
        const draft = await getVendorActivityDraft();
        setInclusions(draft?.inclusionsText ?? EMPTY_ACTIVITY_INCLUSIONS);
        setExclusions(draft?.exclusionsText ?? EMPTY_ACTIVITY_EXCLUSIONS);
        setWhatsprovided(draft?.whatsprovidedText ?? EMPTY_ACTIVITY_WHATS_PROVIDED);
      })();
    }
  }, [categoryId, isActivity]);

  const handleNext = async () => {
    if (isActivity) {
      if (!parseGlampingTextList(inclusions).length) {
        setSubmitError('Please add at least one inclusion.');
        return;
      }
      if (!parseGlampingTextList(exclusions).length) {
        setSubmitError('Please add at least one exclusion.');
        return;
      }
      if (!parseGlampingTextList(whatsprovided).length) {
        setSubmitError('Please add at least one item under what is provided.');
        return;
      }
      setSubmitError(null);
      const prev = (await getVendorActivityDraft()) ?? {};
      await saveVendorActivityDraft({
        ...prev,
        inclusionsText: inclusions.trim(),
        exclusionsText: exclusions.trim(),
        whatsprovidedText: whatsprovided.trim(),
      });

      setIsSubmitting(true);
      try {
        const createRes = await createVendorActivityListingWithSlots();
        if (!createRes.success) {
          setSubmitError(createRes.message ?? 'Could not create activity listing.');
          return;
        }
        router.push('/vendor/photos');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (categoryId === 'glamping') {
      if (!parseGlampingTextList(inclusions).length) {
        setSubmitError('Please add at least one inclusion.');
        return;
      }
      if (!parseGlampingTextList(exclusions).length) {
        setSubmitError('Please add at least one exclusion.');
        return;
      }
      if (!parseGlampingTextList(whatsprovided).length) {
        setSubmitError('Please add at least one item under what is provided.');
        return;
      }
      setSubmitError(null);
      const prev = (await getVendorGlampingDraft()) ?? {};
      await saveVendorGlampingDraft({
        ...prev,
        inclusionsText: inclusions.trim(),
        exclusionsText: exclusions.trim(),
        whatsprovidedText: whatsprovided.trim(),
      });

      setIsSubmitting(true);
      try {
        const createRes = await ensureVendorGlampingListingCreated();
        if (!createRes.success) {
          setSubmitError(createRes.message ?? 'Could not create glamping listing.');
          return;
        }
        router.push('/vendor/glamping/photos');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (isPackage) {
      if (!parseGlampingTextList(inclusions).length) {
        setSubmitError('Please add at least one inclusion.');
        return;
      }
      if (!parseGlampingTextList(exclusions).length) {
        setSubmitError('Please add at least one exclusion.');
        return;
      }
      if (!parseGlampingTextList(whatsprovided).length) {
        setSubmitError('Please add at least one item under what is provided.');
        return;
      }
      setSubmitError(null);
      const prev = (await getVendorPackageDraft()) ?? {};
      await saveVendorPackageDraft({
        ...prev,
        inclusionsText: inclusions.trim(),
        exclusionsText: exclusions.trim(),
        whatsprovidedText: whatsprovided.trim(),
      });

      setIsSubmitting(true);
      try {
        const createRes = await createVendorPackageListingWithItineraries();
        if (!createRes.success) {
          setSubmitError(createRes.message ?? 'Could not create package listing.');
          return;
        }
        router.push('/vendor/photos');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    router.push('/vendor/terms');
  };

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId={categoryId}
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.inclusionsExclusions}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextSuffix={copy.nextSuffix}
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>

        <ListSection
          title={copy.inclusionsTitle}
          value={inclusions}
          onChange={setInclusions}
          maxLength={copy.maxLength}
          headerStyle={styles.inclusionsHeader}
          headerTextStyle={styles.inclusionsHeaderText}
        />
        <ListSection
          title={copy.exclusionsTitle}
          value={exclusions}
          onChange={setExclusions}
          maxLength={copy.maxLength}
          headerStyle={styles.exclusionsHeader}
          headerTextStyle={styles.exclusionsHeaderText}
        />
        {categoryId === 'glamping' || isActivity || isPackage ? (
          <ListSection
            title={
              isActivity
                ? VENDOR_ACTIVITY_INCLUSIONS_COPY.whatsprovidedTitle
                : isPackage
                  ? VENDOR_PACKAGE_INCLUSIONS_COPY.whatsprovidedTitle
                  : VENDOR_INCLUSIONS_EXCLUSIONS_COPY.whatsprovidedTitle
            }
            value={whatsprovided}
            onChange={setWhatsprovided}
            maxLength={copy.maxLength}
            headerStyle={styles.inclusionsHeader}
            headerTextStyle={styles.inclusionsHeaderText}
          />
        ) : null}
        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: { gap: 10 },
  intro: { gap: 4 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.white,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
  },
  inclusionsHeader: { backgroundColor: '#E8F5E9' },
  inclusionsHeaderText: { color: '#2E7D32' },
  exclusionsHeader: { backgroundColor: colors.surface.lightPink },
  exclusionsHeaderText: { color: colors.accent.main },
  textArea: {
    minHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.45)',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
