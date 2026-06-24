import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  DEFAULT_CAMPING_INSIGHTS,
  VENDOR_CAMPING_INSIGHTS_COPY,
} from '@/src/constants/vendorGlampingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

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

export function DesktopVendorCampingInsightsScreen() {
  const [aboutExperience, setAboutExperience] = useState(DEFAULT_CAMPING_INSIGHTS.aboutExperience);
  const [thingsToCarry, setThingsToCarry] = useState(DEFAULT_CAMPING_INSIGHTS.thingsToCarry);
  const [howToReach, setHowToReach] = useState(DEFAULT_CAMPING_INSIGHTS.howToReach);

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId="glamping"
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.campingInsights}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/inclusions-exclusions')}
          nextSuffix={VENDOR_CAMPING_INSIGHTS_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{VENDOR_CAMPING_INSIGHTS_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_CAMPING_INSIGHTS_COPY.subtitle}</Text>
        </View>

        <InsightSection
          title={VENDOR_CAMPING_INSIGHTS_COPY.aboutTitle}
          value={aboutExperience}
          onChange={setAboutExperience}
          maxLength={VENDOR_CAMPING_INSIGHTS_COPY.aboutMax}
        />
        <InsightSection
          title={VENDOR_CAMPING_INSIGHTS_COPY.carryTitle}
          value={thingsToCarry}
          onChange={setThingsToCarry}
          maxLength={VENDOR_CAMPING_INSIGHTS_COPY.carryMax}
          headerIcon="bag-outline"
          showPinkHeader
        />
        <InsightSection
          title={VENDOR_CAMPING_INSIGHTS_COPY.reachTitle}
          value={howToReach}
          onChange={setHowToReach}
          maxLength={VENDOR_CAMPING_INSIGHTS_COPY.reachMax}
          headerIcon="navigate-outline"
          showPinkHeader
        />
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
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface.white,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
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
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
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
});
