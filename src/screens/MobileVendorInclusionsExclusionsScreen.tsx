import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import {
  DEFAULT_CAMPING_EXCLUSIONS,
  DEFAULT_CAMPING_INCLUSIONS,
  VENDOR_INCLUSIONS_EXCLUSIONS_COPY,
} from '@/src/constants/vendorGlampingConstants';
import {
  DEFAULT_PACKAGE_EXCLUSIONS,
  DEFAULT_PACKAGE_INCLUSIONS,
  VENDOR_PACKAGE_INCLUSIONS_COPY,
} from '@/src/constants/vendorPackageConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;
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

export function MobileVendorInclusionsExclusionsScreen() {
  const categoryId = useVendorListingCategory();
  const isPackage = categoryId === 'packages';
  const copy = isPackage ? VENDOR_PACKAGE_INCLUSIONS_COPY : VENDOR_INCLUSIONS_EXCLUSIONS_COPY;

  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [inclusions, setInclusions] = useState(DEFAULT_CAMPING_INCLUSIONS);
  const [exclusions, setExclusions] = useState(DEFAULT_CAMPING_EXCLUSIONS);

  useEffect(() => {
    if (categoryId === 'packages') {
      setInclusions(DEFAULT_PACKAGE_INCLUSIONS);
      setExclusions(DEFAULT_PACKAGE_EXCLUSIONS);
      return;
    }
    if (categoryId === 'glamping') {
      setInclusions(DEFAULT_CAMPING_INCLUSIONS);
      setExclusions(DEFAULT_CAMPING_EXCLUSIONS);
    }
  }, [categoryId]);

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
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/terms')}
          nextLabel="Next"
          nextSuffix={copy.nextSuffix}
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
    backgroundColor: colors.surface.white,
    overflow: 'hidden',
    gap: 0,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
  },
  inclusionsHeader: {
    backgroundColor: '#E8F5E9',
  },
  inclusionsHeaderText: {
    color: '#2E7D32',
  },
  exclusionsHeader: {
    backgroundColor: colors.surface.lightPink,
  },
  exclusionsHeaderText: {
    color: colors.accent.main,
  },
  textArea: {
    minHeight: 140,
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
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.45)',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
});
