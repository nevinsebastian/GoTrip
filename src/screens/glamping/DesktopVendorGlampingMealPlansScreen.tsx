import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { saveVendorGlampingMealPlansStep } from '@/src/api/vendorGlampingOnboarding.service';
import {
  DEFAULT_GLAMPING_MEAL_INCLUSIONS,
  VENDOR_GLAMPING_MEAL_OPTIONS,
  VENDOR_GLAMPING_MEAL_PLANS_COPY,
  type VendorGlampingMealInclusions,
} from '@/src/constants/vendorGlampingConstants';
import { getVendorGlampingDraft, saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorGlampingMealPlansScreen() {
  const [inclusions, setInclusions] = useState<VendorGlampingMealInclusions>(
    DEFAULT_GLAMPING_MEAL_INCLUSIONS,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const draft = await getVendorGlampingDraft();
      if (draft?.mealPlanInclusions) {
        setInclusions(draft.mealPlanInclusions);
      }
    })();
  }, []);

  const toggle = (key: keyof VendorGlampingMealInclusions) => {
    if (submitError) setSubmitError(null);
    setInclusions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = async () => {
    const hasSelection = Object.values(inclusions).some(Boolean);
    if (!hasSelection) {
      setSubmitError('Please select at least one meal inclusion.');
      return;
    }

    const prev = (await getVendorGlampingDraft()) ?? {};
    await saveVendorGlampingDraft({ ...prev, mealPlanInclusions: inclusions });

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await saveVendorGlampingMealPlansStep();
      if (!res.success) {
        setSubmitError(res.message ?? 'Could not save meal plans.');
        return;
      }
      router.push('/vendor/glamping/preview');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DesktopVendorOnboardingShell
      listingCategoryId="glamping"
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix={VENDOR_GLAMPING_MEAL_PLANS_COPY.nextSuffix}
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{VENDOR_GLAMPING_MEAL_PLANS_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_GLAMPING_MEAL_PLANS_COPY.subtitle}</Text>
        </View>

        <View style={styles.sectionCard}>
          {VENDOR_GLAMPING_MEAL_OPTIONS.map((option) => {
            const checked = inclusions[option.key];
            return (
              <Pressable
                key={option.key}
                style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
                onPress={() => toggle(option.key)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
              >
                <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                  {checked ? (
                    <Ionicons name="checkmark" size={14} color={colors.surface.white} />
                  ) : null}
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, paddingBottom: 4 },
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
    width: '100%',
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 4,
    backgroundColor: colors.surface.white,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  checkboxChecked: {
    borderColor: colors.accent.main,
    backgroundColor: colors.accent.main,
  },
  optionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  pressed: { opacity: 0.85 },
  errorText: { fontFamily: typography.fontFamily.text, fontSize: 12, color: colors.primaryAlt },
});
