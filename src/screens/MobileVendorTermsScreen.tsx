import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { DEFAULT_VENDOR_HOST_TERMS, VENDOR_TERMS_COPY } from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';
const TERMS_SCROLL_HEIGHT = 220;

export function MobileVendorTermsScreen() {
  const categoryId = useVendorListingCategory();
  const [terms, setTerms] = useState(DEFAULT_VENDOR_HOST_TERMS);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId={categoryId} />
          <Text style={styles.title}>{VENDOR_TERMS_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_TERMS_COPY.subtitle}</Text>

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
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/publish-listing')}
          nextLabel="Next"
          nextSuffix={VENDOR_TERMS_COPY.nextSuffix}
          nextDisabled={!agreed}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 14,
  },
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
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  lastUpdated: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  termsScroll: {
    maxHeight: TERMS_SCROLL_HEIGHT,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(28, 32, 36, 0.02)',
  },
  termsScrollContent: {
    padding: 10,
  },
  termsInput: {
    minHeight: TERMS_SCROLL_HEIGHT - 24,
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
    width: 22,
    height: 22,
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
