import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
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
import { Image, StyleSheet, View } from 'react-native';

export function DesktopVendorDescribeActivityScreen() {
  const [kindId, setKindId] = useState(VENDOR_ACTIVITY_KINDS[0].id);
  const [activityTypeId, setActivityTypeId] = useState<VendorActivityTypeId>('scuba');

  const kind = getVendorActivityKind(kindId);
  const activityType = getVendorActivityType(activityTypeId);

  return (
    <DesktopVendorOnboardingShell
      listingCategoryId="activities"
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/select-location')}
          nextLabel="Next"
          nextSuffix={VENDOR_ACTIVITY_DESCRIBE_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{VENDOR_ACTIVITY_DESCRIBE_COPY.title}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{VENDOR_ACTIVITY_DESCRIBE_COPY.kindLabel}</Text>
          <DesktopInlineSelect
            value={kindId}
            options={VENDOR_ACTIVITY_KINDS.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            onSelect={setKindId}
            startAdornment={
              <Image source={kind.thumbnail} style={styles.thumb} resizeMode="cover" />
            }
            renderOption={(option, selected) => {
              const item = getVendorActivityKind(option.value);
              return (
                <View style={styles.optionRow}>
                  <Image source={item.thumbnail} style={styles.optionThumb} resizeMode="cover" />
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                  {selected ? (
                    <Ionicons name="checkmark" size={16} color={colors.accent.main} />
                  ) : null}
                </View>
              );
            }}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{VENDOR_ACTIVITY_DESCRIBE_COPY.activityLabel}</Text>
          <DesktopInlineSelect
            value={activityTypeId}
            options={VENDOR_ACTIVITY_TYPES.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            onSelect={(id) => setActivityTypeId(id as VendorActivityTypeId)}
            startAdornment={<Text style={styles.selectText}>{activityType.label}</Text>}
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
  thumb: { width: 32, height: 32, borderRadius: 6 },
  selectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  optionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionThumb: { width: 36, height: 28, borderRadius: 6 },
  optionLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
});
