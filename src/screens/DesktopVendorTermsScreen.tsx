import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  DEFAULT_VENDOR_HOST_TERMS,
  VENDOR_TERMS_COPY,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorTermsScreen() {
  const listingCategoryId = useVendorListingCategory();
  const [terms, setTerms] = useState(DEFAULT_VENDOR_HOST_TERMS);
  const [agreed, setAgreed] = useState(false);

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId={listingCategoryId}
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.terms}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/publish-listing')}
          nextLabel="Next"
          nextSuffix={VENDOR_TERMS_COPY.nextSuffix}
          nextDisabled={!agreed}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.pageTitle}>{VENDOR_TERMS_COPY.title}</Text>

        <View style={styles.termsCard}>
          <Text style={styles.cardTitle}>{VENDOR_TERMS_COPY.cardTitle}</Text>
          <Text style={styles.lastUpdated}>{VENDOR_TERMS_COPY.lastUpdated}</Text>

          <ScrollView
            style={styles.termsScroll}
            contentContainerStyle={styles.termsScrollContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <TextInput
              value={terms}
              onChangeText={setTerms}
              multiline
              style={styles.termsInput}
              textAlignVertical="top"
              placeholderTextColor={colors.text.placeholder}
            />
          </ScrollView>
        </View>

        <Pressable
          style={({ pressed }) => [styles.agreeRow, pressed && styles.pressed]}
          onPress={() => setAgreed((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed ? <Ionicons name="checkmark" size={14} color={colors.surface.white} /> : null}
          </View>
          <Text style={styles.agreeText}>{VENDOR_TERMS_COPY.agreeLabel}</Text>
        </Pressable>
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 2,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  termsCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface.white,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  lastUpdated: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  termsScroll: {
    height: 250,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(28, 32, 36, 0.02)',
  },
  termsScrollContent: {
    padding: 10,
  },
  termsInput: {
    minHeight: 220,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.primary,
    padding: 0,
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  agreeText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.primary,
  },
  pressed: { opacity: 0.85 },
});

