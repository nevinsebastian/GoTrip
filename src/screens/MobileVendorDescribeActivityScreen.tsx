import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  getVendorActivityKind,
  getVendorActivityType,
  VENDOR_ACTIVITY_DESCRIBE_COPY,
  VENDOR_ACTIVITY_KINDS,
  VENDOR_ACTIVITY_TYPES,
  type VendorActivityTypeId,
} from '@/src/constants/vendorActivityConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

type PickerField = 'kind' | 'activity' | null;

export function MobileVendorDescribeActivityScreen() {
  const [kindId, setKindId] = useState(VENDOR_ACTIVITY_KINDS[0].id);
  const [activityTypeId, setActivityTypeId] = useState<VendorActivityTypeId>('scuba');
  const [pickerField, setPickerField] = useState<PickerField>(null);

  const kind = getVendorActivityKind(kindId);
  const activityType = getVendorActivityType(activityTypeId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VendorOnboardingHero categoryId="activities" />
          <View style={styles.body}>
            <Text style={styles.title}>{VENDOR_ACTIVITY_DESCRIBE_COPY.title}</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{VENDOR_ACTIVITY_DESCRIBE_COPY.kindLabel}</Text>
              <Pressable
                style={({ pressed }) => [styles.selectCard, pressed && styles.pressed]}
                onPress={() => setPickerField('kind')}
                accessibilityRole="button"
              >
                <Image source={kind.thumbnail} style={styles.thumb} resizeMode="cover" />
                <Text style={styles.selectText}>{kind.label}</Text>
                <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
              </Pressable>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{VENDOR_ACTIVITY_DESCRIBE_COPY.activityLabel}</Text>
              <Pressable
                style={({ pressed }) => [styles.selectRow, pressed && styles.pressed]}
                onPress={() => setPickerField('activity')}
                accessibilityRole="button"
              >
                <Text style={styles.selectText}>{activityType.label}</Text>
                <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/select-location')}
          nextLabel="Next"
          nextSuffix={VENDOR_ACTIVITY_DESCRIBE_COPY.nextSuffix}
        />
      </View>

      <VendorPropertyOptionSheet
        visible={pickerField === 'kind'}
        title={VENDOR_ACTIVITY_DESCRIBE_COPY.kindLabel}
        options={VENDOR_ACTIVITY_KINDS as Parameters<typeof VendorPropertyOptionSheet>[0]['options']}
        selectedId={kindId}
        showThumbnails
        onClose={() => setPickerField(null)}
        onSelect={(id) => {
          setKindId(id);
          setPickerField(null);
        }}
      />
      <VendorPropertyOptionSheet
        visible={pickerField === 'activity'}
        title={VENDOR_ACTIVITY_DESCRIBE_COPY.activityLabel}
        options={VENDOR_ACTIVITY_TYPES.map((item) => ({ id: item.id, label: item.label }))}
        selectedId={activityTypeId}
        onClose={() => setPickerField(null)}
        onSelect={(id) => {
          setActivityTypeId(id as VendorActivityTypeId);
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
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: borderRadius.xl,
    padding: spacing['3'],
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
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
  thumb: { width: 56, height: 40, borderRadius: 8 },
  selectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  pressed: { opacity: 0.85 },
});
