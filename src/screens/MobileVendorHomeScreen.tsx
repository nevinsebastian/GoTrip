import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { getVendorListingCategory } from '@/src/constants/vendorOnboardingConstants';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

const DESIGN_WIDTH = 402;

export function MobileVendorHomeScreen() {
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>('property');

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const category = getVendorListingCategory(categoryId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Gotrip holiday</Text>
          <View style={styles.headerActions}>
            <Ionicons name="notifications-outline" size={22} color={colors.text.primary} />
            <Ionicons name="menu" size={24} color={colors.accent.main} />
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Vendor workspace</Text>
          <Text style={styles.heroTitle}>List your {category.title.toLowerCase()}</Text>
          <Text style={styles.heroSubtitle}>{category.subtitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting started</Text>
          <View style={styles.taskCard}>
            <Ionicons name="location-outline" size={20} color={colors.accent.main} />
            <View style={styles.taskText}>
              <Text style={styles.taskTitle}>Add location details</Text>
              <Text style={styles.taskSubtitle}>Pin your listing on the map</Text>
            </View>
          </View>
          <View style={styles.taskCard}>
            <Ionicons name="images-outline" size={20} color={colors.accent.main} />
            <View style={styles.taskText}>
              <Text style={styles.taskTitle}>Upload photos</Text>
              <Text style={styles.taskSubtitle}>Show guests what makes your place special</Text>
            </View>
          </View>
          <View style={styles.taskCard}>
            <Ionicons name="pricetag-outline" size={20} color={colors.accent.main} />
            <View style={styles.taskText}>
              <Text style={styles.taskTitle}>Set pricing</Text>
              <Text style={styles.taskSubtitle}>Define rates and availability</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
    paddingBottom: spacing['6'],
    gap: spacing['5'],
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 4,
    borderColor: colors.accent.main,
    borderRadius: 18,
    padding: spacing['3'],
  },
  brand: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  heroCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(232, 84, 51, 0.08)',
    padding: spacing['5'],
    gap: 8,
  },
  heroEyebrow: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  heroSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    color: 'rgba(28, 32, 36, 0.6)',
  },
  section: {
    gap: spacing['3'],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['3'],
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: 12,
    padding: spacing['3'],
  },
  taskText: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  taskSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
});
