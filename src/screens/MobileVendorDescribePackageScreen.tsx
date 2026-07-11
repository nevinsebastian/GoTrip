import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  getVendorPackageCategory,
  VENDOR_PACKAGE_CATEGORIES,
  VENDOR_PACKAGE_DESCRIBE_COPY,
  VENDOR_PACKAGE_DESTINATIONS,
  type VendorPackageCategoryId,
} from '@/src/constants/vendorPackageConstants';
import { saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

type PickerField = 'destination' | 'category' | null;

export function MobileVendorDescribePackageScreen() {
  const [destination, setDestination] = useState('');
  const [categoryId, setCategoryId] = useState<VendorPackageCategoryId>('couple');
  const [pickerField, setPickerField] = useState<PickerField>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const category = getVendorPackageCategory(categoryId);
  const destinationOptions = useMemo(
    () =>
      VENDOR_PACKAGE_DESTINATIONS.map((label, index) => ({
        id: `dest-${index}`,
        label,
      })),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VendorOnboardingHero categoryId="packages" />
          <View style={styles.body}>
            <Text style={styles.title}>{VENDOR_PACKAGE_DESCRIBE_COPY.title}</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{VENDOR_PACKAGE_DESCRIBE_COPY.destinationLabel}</Text>
              <View style={styles.searchField}>
                <Input
                  value={destination}
                  onChangeText={setDestination}
                  placeholder={VENDOR_PACKAGE_DESCRIBE_COPY.destinationPlaceholder}
                  placeholderTextColor={colors.text.placeholder}
                  style={styles.searchInput}
                />
                <Pressable onPress={() => setPickerField('destination')} hitSlop={8}>
                  <Ionicons name="search" size={18} color="rgba(28, 32, 36, 0.45)" />
                </Pressable>
                <Pressable onPress={() => setPickerField('destination')} hitSlop={8}>
                  <Ionicons name="chevron-down" size={16} color="rgba(28, 32, 36, 0.45)" />
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{VENDOR_PACKAGE_DESCRIBE_COPY.categoryLabel}</Text>
              <Pressable
                style={({ pressed }) => [styles.selectRow, pressed && styles.pressed]}
                onPress={() => setPickerField('category')}
                accessibilityRole="button"
              >
                <Text style={styles.selectText}>{category.label}</Text>
                <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
              </Pressable>
            </View>
            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={async () => {
            if (!destination.trim()) {
              setSubmitError('Please select or enter a destination.');
              return;
            }
            setSubmitError(null);
            await saveVendorPackageDraft({
              destination: destination.trim(),
              categoryId,
            });
            router.push('/vendor/select-location');
          }}
          nextLabel="Next"
          nextSuffix={VENDOR_PACKAGE_DESCRIBE_COPY.nextSuffix}
        />
      </View>

      <VendorPropertyOptionSheet
        visible={pickerField === 'destination'}
        title={VENDOR_PACKAGE_DESCRIBE_COPY.destinationLabel}
        options={destinationOptions as Parameters<typeof VendorPropertyOptionSheet>[0]['options']}
        selectedId={
          destinationOptions.find((o) => o.label === destination)?.id ?? destinationOptions[0].id
        }
        onClose={() => setPickerField(null)}
        onSelect={(id) => {
          const label = destinationOptions.find((o) => o.id === id)?.label ?? '';
          setDestination(label);
          setPickerField(null);
        }}
      />
      <VendorPropertyOptionSheet
        visible={pickerField === 'category'}
        title={VENDOR_PACKAGE_DESCRIBE_COPY.categoryLabel}
        options={VENDOR_PACKAGE_CATEGORIES.map((item) => ({ id: item.id, label: item.label }))}
        selectedId={categoryId}
        onClose={() => setPickerField(null)}
        onSelect={(id) => {
          setCategoryId(id as VendorPackageCategoryId);
          setPickerField(null);
        }}
      />
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
    gap: 18,
  },
  body: { gap: 16 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  fieldGroup: { gap: 8 },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.65)',
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 24,
    paddingRight: spacing['3'],
    gap: 6,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 44,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 24,
    paddingHorizontal: spacing['3'],
    height: 44,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  selectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  pressed: { opacity: 0.85 },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
