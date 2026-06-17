import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  VENDOR_DASHBOARD_CATEGORIES,
  VENDOR_DASHBOARD_CATEGORY_ACTIVE,
  VENDOR_DASHBOARD_CATEGORY_BORDER,
} from '@/src/constants/vendorDashboardConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { getVendorListingCategory } from '@/src/constants/vendorOnboardingConstants';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type VendorDashboardCategoryTabsProps = {
  selectedId: VendorListingCategoryId;
  onSelect: (id: VendorListingCategoryId) => void;
};

export function VendorDashboardCategoryTabs({
  selectedId,
  onSelect,
}: VendorDashboardCategoryTabsProps) {
  return (
    <View style={styles.row}>
      {VENDOR_DASHBOARD_CATEGORIES.map((tab) => {
        const selected = tab.id === selectedId;
        const category = getVendorListingCategory(tab.id);
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, selected ? styles.tabSelected : styles.tabIdle]}
            onPress={() => onSelect(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            {selected ? <View style={styles.innerBorder} /> : null}
            <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
              <Image source={category.thumbnail} style={styles.icon} resizeMode="cover" />
            </View>
            <Text style={[styles.label, selected && styles.labelSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 6,
    overflow: 'hidden',
  },
  tabIdle: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CATEGORY_BORDER,
  },
  tabSelected: {
    backgroundColor: VENDOR_DASHBOARD_CATEGORY_ACTIVE,
    borderWidth: 2,
    borderColor: colors.surface.white,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.surface.white,
    borderRadius: 12,
    margin: 3,
    pointerEvents: 'none',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.surface.white,
  },
  iconWrapSelected: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.surface.white,
    fontWeight: typography.fontWeight.bold,
  },
});
