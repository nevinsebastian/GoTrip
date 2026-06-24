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
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import { VENDOR_FOOD_OPTIONS, type VendorFoodOptionId } from '@/src/constants/vendorListingConstants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export function DesktopVendorGuestActivityDetailsScreen() {
  const [details, setDetails] = useState<VendorGuestActivityDetails>(DEFAULT_GUEST_ACTIVITY_DETAILS);

  const update = (patch: Partial<VendorGuestActivityDetails>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  };

  const toggleFood = (id: VendorFoodOptionId) => {
    const has = details.food.includes(id);
    update({
      food: has ? details.food.filter((item) => item !== id) : [...details.food, id],
    });
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
          onNext={() => router.push('/vendor/amenities')}
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
          {stepperRow(VENDOR_GUEST_ACTIVITY_COPY.hoursLabel, details.hours, (hours) =>
            update({ hours }),
          )}
          {stepperRow(
            VENDOR_GUEST_ACTIVITY_COPY.commonBathroomsLabel,
            details.commonBathrooms,
            (commonBathrooms) => update({ commonBathrooms }),
          )}

          <View style={styles.orRow}>
            <View style={styles.orLineAccent} />
            <View style={styles.orLineMuted} />
          </View>

          <View style={styles.foodRow}>
            <Text style={styles.rowLabel}>{VENDOR_GUEST_ACTIVITY_COPY.foodLabel}</Text>
            <View style={styles.foodPills}>
              {VENDOR_FOOD_OPTIONS.map((option) => {
                const selected = details.food.includes(option.id);
                return (
                  <Pressable
                    key={option.id}
                    style={({ pressed }) => [
                      styles.foodPill,
                      selected && styles.foodPillSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => toggleFood(option.id)}
                  >
                    <Text style={[styles.foodPillText, selected && styles.foodPillTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
  foodRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  foodPills: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
  },
  foodPill: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  foodPillSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  foodPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  foodPillTextSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  pressed: { opacity: 0.85 },
});
