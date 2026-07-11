import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import {
  EMPTY_CAMPING_INSIGHTS,
  VENDOR_CAMPING_INSIGHTS_COPY,
} from '@/src/constants/vendorGlampingConstants';
import {
  EMPTY_ACTIVITY_INSIGHTS,
  VENDOR_ACTIVITY_INSIGHTS_COPY,
} from '@/src/constants/vendorActivityConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { getVendorGlampingDraft, saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { getVendorActivityDraft, saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function InsightSection({
  title,
  value,
  onChange,
  maxLength,
  headerIcon,
  showPinkHeader,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  headerIcon?: keyof typeof Ionicons.glyphMap;
  showPinkHeader?: boolean;
}) {
  return (
    <View style={styles.sectionCard}>
      {showPinkHeader ? (
        <View style={styles.pinkHeader}>
          {headerIcon ? <Ionicons name={headerIcon} size={14} color={colors.text.primary} /> : null}
          <Text style={styles.pinkHeaderText}>{title}</Text>
        </View>
      ) : (
        <Text style={styles.sectionLabel}>{title}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, maxLength))}
        multiline
        style={[styles.textArea, showPinkHeader && styles.textAreaUnderHeader]}
        textAlignVertical="top"
      />
      <Text style={styles.charCount}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

export function MobileVendorCampingInsightsScreen() {
  const categoryId = useVendorListingCategory();
  const isActivity = categoryId === 'activities';
  const copy = isActivity ? VENDOR_ACTIVITY_INSIGHTS_COPY : VENDOR_CAMPING_INSIGHTS_COPY;
  const emptyInsights = isActivity ? EMPTY_ACTIVITY_INSIGHTS : EMPTY_CAMPING_INSIGHTS;

  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [aboutExperience, setAboutExperience] = useState(emptyInsights.aboutExperience);
  const [thingsToCarry, setThingsToCarry] = useState(emptyInsights.thingsToCarry);
  const [howToReach, setHowToReach] = useState(emptyInsights.howToReach);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (isActivity) {
        const draft = await getVendorActivityDraft();
        if (draft?.aboutExperience != null) setAboutExperience(draft.aboutExperience);
        if (draft?.thingsToCarry != null) setThingsToCarry(draft.thingsToCarry);
        if (draft?.howToReach != null) setHowToReach(draft.howToReach);
        return;
      }
      const draft = await getVendorGlampingDraft();
      if (draft?.aboutExperience != null) setAboutExperience(draft.aboutExperience);
      if (draft?.thingsToCarry != null) setThingsToCarry(draft.thingsToCarry);
      if (draft?.howToReach != null) setHowToReach(draft.howToReach);
    })();
  }, [isActivity]);

  const handleNext = async () => {
    if (!aboutExperience.trim()) {
      setSubmitError('Please describe the experience.');
      return;
    }
    if (!thingsToCarry.trim()) {
      setSubmitError('Please add things to carry.');
      return;
    }
    if (!howToReach.trim()) {
      setSubmitError('Please add how to reach information.');
      return;
    }
    setSubmitError(null);
    if (isActivity) {
      const prev = (await getVendorActivityDraft()) ?? {};
      await saveVendorActivityDraft({
        ...prev,
        aboutExperience: aboutExperience.trim(),
        thingsToCarry: thingsToCarry.trim(),
        howToReach: howToReach.trim(),
      });
      router.push('/vendor/inclusions-exclusions');
      return;
    }
    const prev = (await getVendorGlampingDraft()) ?? {};
    await saveVendorGlampingDraft({
      ...prev,
      aboutExperience: aboutExperience.trim(),
      thingsToCarry: thingsToCarry.trim(),
      howToReach: howToReach.trim(),
    });
    router.push('/vendor/inclusions-exclusions');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.contentColumn, { width: contentWidth }]}>
            <VendorListingHeader />

            <View style={styles.intro}>
              <Text style={styles.title}>{copy.title}</Text>
              <Text style={styles.subtitle}>{copy.subtitle}</Text>
            </View>

            <InsightSection
              title={copy.aboutTitle}
              value={aboutExperience}
              onChange={setAboutExperience}
              maxLength={copy.aboutMax}
            />
            <InsightSection
              title={copy.carryTitle}
              value={thingsToCarry}
              onChange={setThingsToCarry}
              maxLength={copy.carryMax}
              headerIcon="bag-outline"
              showPinkHeader
            />
            <InsightSection
              title={copy.reachTitle}
              value={howToReach}
              onChange={setHowToReach}
              maxLength={copy.reachMax}
              headerIcon="navigate-outline"
              showPinkHeader
            />
            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix={VENDOR_CAMPING_INSIGHTS_COPY.nextSuffix}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: spacing['4'], alignItems: 'center' },
  contentColumn: { alignSelf: 'stretch', gap: 8 },
  intro: { gap: 4 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 28,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
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
    overflow: 'hidden',
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  pinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface.lightPink,
    marginHorizontal: -12,
    marginTop: -12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: FIELD_BORDER,
  },
  pinkHeaderText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  textAreaUnderHeader: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
