import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { VendorStepper } from '@/src/components/vendor/VendorStepper';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  DEFAULT_GUEST_PACKAGE_DETAILS,
  VENDOR_GUEST_PACKAGE_COPY,
  type VendorGuestPackageDetails,
} from '@/src/constants/vendorPackageConstants';
import { getVendorPackageDraft, saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export function DesktopVendorGuestPackageDetailsScreen() {
  const [details, setDetails] = useState<VendorGuestPackageDetails>(DEFAULT_GUEST_PACKAGE_DETAILS);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const draft = await getVendorPackageDraft();
      if (!draft) return;
      setDetails({
        days: draft.totalDays ?? DEFAULT_GUEST_PACKAGE_DETAILS.days,
        nights: draft.totalNights ?? DEFAULT_GUEST_PACKAGE_DETAILS.nights,
        minGroupSize: draft.minGroupSize ?? DEFAULT_GUEST_PACKAGE_DETAILS.minGroupSize,
        maxGroupSize: draft.maxGroupSize ?? DEFAULT_GUEST_PACKAGE_DETAILS.maxGroupSize,
        bookingMode: draft.bookingMode ?? DEFAULT_GUEST_PACKAGE_DETAILS.bookingMode,
      });
    })();
  }, []);

  const update = (patch: Partial<VendorGuestPackageDetails>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  };

  const stepperRow = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    min = 0,
    hint?: string,
  ) => (
    <View style={styles.rowBetween}>
      <View style={styles.labelCol}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <VendorStepper variant="pill" value={value} min={min} onChange={onChange} />
    </View>
  );

  const handleNext = async () => {
    if (details.days < 1) {
      setSubmitError('Days must be at least 1.');
      return;
    }
    if (details.nights < 0) {
      setSubmitError('Nights cannot be negative.');
      return;
    }
    if (details.minGroupSize < 1) {
      setSubmitError('Minimum group size must be at least 1.');
      return;
    }
    if (details.maxGroupSize < details.minGroupSize) {
      setSubmitError('Maximum group size must be at least the minimum.');
      return;
    }
    setSubmitError(null);
    const prev = (await getVendorPackageDraft()) ?? {};
    await saveVendorPackageDraft({
      ...prev,
      totalDays: details.days,
      totalNights: details.nights,
      minGroupSize: details.minGroupSize,
      maxGroupSize: details.maxGroupSize,
      bookingMode: details.bookingMode,
    });
    router.push('/vendor/set-pricing');
  };

  return (
    <DesktopVendorOnboardingShell
      listingCategoryId="packages"
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.guestPackage}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextSuffix={VENDOR_GUEST_PACKAGE_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{VENDOR_GUEST_PACKAGE_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_GUEST_PACKAGE_COPY.subtitle}</Text>
        </View>

        <View style={styles.detailsCard}>
          {stepperRow(VENDOR_GUEST_PACKAGE_COPY.daysLabel, details.days, (days) => update({ days }), 1)}
          {stepperRow(VENDOR_GUEST_PACKAGE_COPY.nightsLabel, details.nights, (nights) =>
            update({ nights }),
          )}
          {stepperRow(
            VENDOR_GUEST_PACKAGE_COPY.minGroupLabel,
            details.minGroupSize,
            (minGroupSize) => update({ minGroupSize }),
            1,
          )}
          {stepperRow(
            VENDOR_GUEST_PACKAGE_COPY.maxGroupLabel,
            details.maxGroupSize,
            (maxGroupSize) => update({ maxGroupSize }),
            1,
          )}

          <View style={styles.orRow}>
            <View style={styles.orLineAccent} />
            <View style={styles.orLineMuted} />
          </View>

          <View style={styles.bookingRow}>
            <Text style={styles.rowLabel}>{VENDOR_GUEST_PACKAGE_COPY.bookingModeLabel}</Text>
            <View style={styles.bookingPills}>
              {VENDOR_GUEST_PACKAGE_COPY.bookingModes.map((option) => {
                const selected = details.bookingMode === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={({ pressed }) => [
                      styles.bookingPill,
                      selected && styles.bookingPillSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => update({ bookingMode: option.id })}
                  >
                    <Text style={[styles.bookingPillText, selected && styles.bookingPillTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12 },
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
  detailsCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  labelCol: { flex: 1, gap: 2 },
  rowLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  rowHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  orRow: { flexDirection: 'row', alignItems: 'center' },
  orLineAccent: { flex: 1, height: 1, backgroundColor: colors.accent.main },
  orLineMuted: { flex: 1, height: 1, backgroundColor: 'rgba(28, 32, 36, 0.12)' },
  bookingRow: { gap: 8 },
  bookingPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bookingPill: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  bookingPillSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
  },
  bookingPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
  },
  bookingPillTextSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: { opacity: 0.85 },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
