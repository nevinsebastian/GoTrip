import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  getVendorPlaceType,
  getVendorSpaceType,
  VENDOR_PLACE_TYPES,
  VENDOR_PROPERTY_COPY,
  VENDOR_SPACE_TYPES,
} from '@/src/constants/vendorPropertyConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

type PickerField = 'place' | 'space' | null;

export function MobileVendorDescribePropertyScreen() {
  const [placeTypeId, setPlaceTypeId] = useState(VENDOR_PLACE_TYPES[0].id);
  const [spaceTypeId, setSpaceTypeId] = useState(VENDOR_SPACE_TYPES[0].id);
  const [pickerField, setPickerField] = useState<PickerField>(null);

  const placeType = getVendorPlaceType(placeTypeId);
  const spaceType = getVendorSpaceType(spaceTypeId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VendorOnboardingHero categoryId="property" />
          <View style={styles.body}>
            <Text style={styles.title}>{VENDOR_PROPERTY_COPY.title}</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{VENDOR_PROPERTY_COPY.placeTypeLabel}</Text>
              <Pressable
                style={({ pressed }) => [styles.selectCard, pressed && styles.pressed]}
                onPress={() => setPickerField('place')}
                accessibilityRole="button"
              >
                <Image source={placeType.thumbnail} style={styles.thumb} resizeMode="cover" />
                <Text style={styles.selectText}>{placeType.label}</Text>
                <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
              </Pressable>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{VENDOR_PROPERTY_COPY.spaceTypeLabel}</Text>
              <Pressable
                style={({ pressed }) => [styles.selectRow, pressed && styles.pressed]}
                onPress={() => setPickerField('space')}
                accessibilityRole="button"
              >
                <Text style={styles.selectText}>{spaceType.label}</Text>
                <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/select-location')}
          nextLabel={VENDOR_PROPERTY_COPY.nextCta}
          nextSuffix={VENDOR_PROPERTY_COPY.nextSuffix}
        />
      </View>

      <VendorPropertyOptionSheet
        visible={pickerField === 'place'}
        title={VENDOR_PROPERTY_COPY.placeTypeLabel}
        options={VENDOR_PLACE_TYPES}
        selectedId={placeTypeId}
        showThumbnails
        onClose={() => setPickerField(null)}
        onSelect={(id) => {
          setPlaceTypeId(id);
          setPickerField(null);
        }}
      />
      <VendorPropertyOptionSheet
        visible={pickerField === 'space'}
        title={VENDOR_PROPERTY_COPY.spaceTypeLabel}
        options={VENDOR_SPACE_TYPES}
        selectedId={spaceTypeId}
        onClose={() => setPickerField(null)}
        onSelect={(id) => {
          setSpaceTypeId(id);
          setPickerField(null);
        }}
      />
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
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.65)',
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: borderRadius.xl,
    padding: spacing['3'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
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
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  thumb: {
    width: 56,
    height: 40,
    borderRadius: 8,
  },
  selectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  pressed: { opacity: 0.85 },
});
