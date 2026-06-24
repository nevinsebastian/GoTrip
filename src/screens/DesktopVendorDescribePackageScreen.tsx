import { Input, Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
  getVendorPackageCategory,
  VENDOR_PACKAGE_CATEGORIES,
  VENDOR_PACKAGE_DESCRIBE_COPY,
  VENDOR_PACKAGE_DESTINATIONS,
  type VendorPackageCategoryId,
} from '@/src/constants/vendorPackageConstants';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export function DesktopVendorDescribePackageScreen() {
  const [destination, setDestination] = useState('');
  const [categoryId, setCategoryId] = useState<VendorPackageCategoryId>('couple');

  const category = getVendorPackageCategory(categoryId);
  const destinationOptions = useMemo(
    () =>
      VENDOR_PACKAGE_DESTINATIONS.map((label, index) => ({
        value: `dest-${index}`,
        label,
      })),
    [],
  );

  return (
    <DesktopVendorOnboardingShell
      listingCategoryId="packages"
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/guest-package-details')}
          nextLabel="Next"
          nextSuffix={VENDOR_PACKAGE_DESCRIBE_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{VENDOR_PACKAGE_DESCRIBE_COPY.title}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{VENDOR_PACKAGE_DESCRIBE_COPY.destinationLabel}</Text>
          <View style={styles.searchRow}>
            <Input
              value={destination}
              onChangeText={setDestination}
              placeholder={VENDOR_PACKAGE_DESCRIBE_COPY.destinationPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={[authFieldInputStyle.field, styles.searchInput]}
            />
            <View style={styles.destinationSelect}>
              <DesktopInlineSelect
                value={
                  destinationOptions.find((o) => o.label === destination)?.value ??
                  destinationOptions[0].value
                }
                options={destinationOptions}
                onSelect={(id) => {
                  const label = destinationOptions.find((o) => o.value === id)?.label ?? '';
                  setDestination(label);
                }}
                menuMaxHeight={200}
              />
            </View>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{VENDOR_PACKAGE_DESCRIBE_COPY.categoryLabel}</Text>
          <DesktopInlineSelect
            value={categoryId}
            options={VENDOR_PACKAGE_CATEGORIES.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            onSelect={(id) => setCategoryId(id as VendorPackageCategoryId)}
            startAdornment={<Text style={styles.selectText}>{category.label}</Text>}
          />
        </View>
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  fieldGroup: { gap: 8 },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
  },
  destinationSelect: {
    width: 44,
    height: 44,
  },
  selectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
