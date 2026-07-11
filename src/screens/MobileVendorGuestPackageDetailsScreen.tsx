import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorStepper } from '@/src/components/vendor/VendorStepper';
import {
  DEFAULT_GUEST_PACKAGE_DETAILS,
  VENDOR_GUEST_PACKAGE_COPY,
  type VendorGuestPackageDetails,
} from '@/src/constants/vendorPackageConstants';
import { getVendorPackageDraft, saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;

export function MobileVendorGuestPackageDetailsScreen() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

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
  ) => (
    <View style={styles.rowBetween}>
      <Text style={styles.rowLabel}>{label}</Text>
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentColumn, { width: contentWidth }]}>
            <VendorListingHeader />

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
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix={VENDOR_GUEST_PACKAGE_COPY.nextSuffix}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: spacing['4'], gap: 18 },
  contentColumn: { alignSelf: 'center', gap: 12 },
  intro: { gap: 4 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
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
  rowLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
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
