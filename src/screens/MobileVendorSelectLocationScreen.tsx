import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { getVendorListingCategory } from '@/src/constants/vendorOnboardingConstants';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

const DESIGN_WIDTH = 402;

export function MobileVendorSelectLocationScreen() {
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>('property');

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const category = getVendorListingCategory(categoryId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <VendorOnboardingHero categoryId={categoryId} />
          <View style={styles.body}>
            <Text style={styles.title}>Select location</Text>
            <Text style={styles.subtitle}>
              Tell us where your {category.title.toLowerCase()} is located to continue listing setup.
            </Text>
            <Pressable style={styles.locationField} accessibilityRole="button">
              <Ionicons name="location-outline" size={18} color="rgba(28, 32, 36, 0.45)" />
              <Text style={styles.locationPlaceholder}>Search city or area</Text>
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
            onPress={() => router.replace('/vendor')}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>Continue to vendor workspace</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 18,
  },
  body: {
    gap: 10,
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
    lineHeight: 20,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 47, 0.15)',
    paddingHorizontal: spacing['3'],
    marginTop: 6,
  },
  locationPlaceholder: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.placeholder,
  },
  footer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    paddingTop: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
  },
  nextButton: {
    height: 48,
    borderRadius: 28,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  pressed: { opacity: 0.85 },
});
