import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { VendorStepper } from '@/src/components/vendor/VendorStepper';
import {
  DEFAULT_GUEST_ACTIVITY_DETAILS,
  VENDOR_GUEST_ACTIVITY_COPY,
  type VendorGuestActivityDetails,
} from '@/src/constants/vendorActivityConstants';
import { getVendorActivityDraft, saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorGuestActivityDetailsScreen() {
  const [details, setDetails] = useState<VendorGuestActivityDetails>(DEFAULT_GUEST_ACTIVITY_DETAILS);

  useEffect(() => {
    (async () => {
      const draft = await getVendorActivityDraft();
      if (!draft) return;
      setDetails({
        guests: draft.guests ?? DEFAULT_GUEST_ACTIVITY_DETAILS.guests,
        hours: draft.hours ?? DEFAULT_GUEST_ACTIVITY_DETAILS.hours,
        minAge: draft.minAge ?? DEFAULT_GUEST_ACTIVITY_DETAILS.minAge,
        totalSlotsPerDay: draft.totalSlotsPerDay ?? DEFAULT_GUEST_ACTIVITY_DETAILS.totalSlotsPerDay,
        slotLabel: draft.slotLabel ?? DEFAULT_GUEST_ACTIVITY_DETAILS.slotLabel,
        slotStartTime: draft.slotStartTime ?? DEFAULT_GUEST_ACTIVITY_DETAILS.slotStartTime,
      });
    })();
  }, []);

  const update = (patch: Partial<VendorGuestActivityDetails>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  };

  const stepperRow = (label: string, value: number, onChange: (v: number) => void, hint?: string) => (
    <View style={styles.rowBetween}>
      <View style={styles.labelCol}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <VendorStepper variant="pill" value={value} min={0} onChange={onChange} />
    </View>
  );

  return (
    <DesktopVendorOnboardingShell
      listingCategoryId="activities"
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.guestActivity}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={async () => {
            await saveVendorActivityDraft({
              guests: details.guests,
              hours: details.hours,
              minAge: details.minAge,
              totalSlotsPerDay: details.totalSlotsPerDay,
              slotLabel: details.slotLabel.trim(),
              slotStartTime: details.slotStartTime.trim(),
            });
            router.push('/vendor/set-pricing');
          }}
          nextSuffix={VENDOR_GUEST_ACTIVITY_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{VENDOR_GUEST_ACTIVITY_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_GUEST_ACTIVITY_COPY.subtitle}</Text>
        </View>

        <View style={styles.detailsCard}>
          {stepperRow(
            VENDOR_GUEST_ACTIVITY_COPY.guestsLabel,
            details.guests,
            (guests) => update({ guests }),
            VENDOR_GUEST_ACTIVITY_COPY.guestsAgeHint,
          )}
          {stepperRow(VENDOR_GUEST_ACTIVITY_COPY.hoursLabel, details.hours, (hours) => update({ hours }))}
          {stepperRow(
            VENDOR_GUEST_ACTIVITY_COPY.minAgeLabel,
            details.minAge,
            (minAge) => update({ minAge }),
            VENDOR_GUEST_ACTIVITY_COPY.minAgeHint,
          )}
          {stepperRow(
            VENDOR_GUEST_ACTIVITY_COPY.totalSlotsLabel,
            details.totalSlotsPerDay,
            (totalSlotsPerDay) => update({ totalSlotsPerDay }),
            VENDOR_GUEST_ACTIVITY_COPY.totalSlotsHint,
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.rowLabel}>{VENDOR_GUEST_ACTIVITY_COPY.slotLabel}</Text>
            <TextInput
              value={details.slotLabel}
              onChangeText={(slotLabel) => update({ slotLabel })}
              placeholder={VENDOR_GUEST_ACTIVITY_COPY.slotLabelPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.textInput}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.rowLabel}>{VENDOR_GUEST_ACTIVITY_COPY.startTimeLabel}</Text>
            <TextInput
              value={details.slotStartTime}
              onChangeText={(slotStartTime) => update({ slotStartTime })}
              placeholder={VENDOR_GUEST_ACTIVITY_COPY.startTimePlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.textInput}
              autoCapitalize="none"
            />
          </View>
        </View>
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
    borderColor: FIELD_BORDER,
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
  fieldGroup: { gap: 6 },
  textInput: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
});
