import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  DESKTOP_VENDOR_DASHBOARD_CATEGORY_STYLES,
  VENDOR_DASHBOARD_CATEGORIES,
} from '@/src/constants/vendorDashboardConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { getVendorListingCategory } from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

type DesktopVendorDashboardCategoryTabsProps = {
  selectedId: VendorListingCategoryId;
  onSelect: (id: VendorListingCategoryId) => void;
};

export function DesktopVendorDashboardCategoryTabs({
  selectedId,
  onSelect,
}: DesktopVendorDashboardCategoryTabsProps) {
  return (
    <View style={styles.row}>
      {VENDOR_DASHBOARD_CATEGORIES.map((tab) => {
        const selected = tab.id === selectedId;
        const theme = DESKTOP_VENDOR_DASHBOARD_CATEGORY_STYLES[tab.id];
        const category = getVendorListingCategory(tab.id);
        const iconName = theme.icon as keyof typeof Ionicons.glyphMap;

        return (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              { backgroundColor: theme.background },
              selected
                ? {
                    borderWidth: 2,
                    borderColor: theme.borderColor ?? '#2C6F9C',
                  }
                : styles.tabIdleBorder,
            ]}
            onPress={() => onSelect(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <View style={styles.thumbWrap}>
              <Image source={category.thumbnail} style={styles.thumb} resizeMode="cover" />
            </View>
            <Ionicons name={iconName} size={24} color="#0F1A20" />
            <Text style={styles.label}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 36,
    width: '100%',
  },
  tab: {
    flex: 1,
    maxWidth: 254,
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 16,
    borderRadius: 8,
    ...Platform.select({
      web: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
      },
    }),
  },
  tabIdleBorder: {
    borderWidth: 0,
  },
  thumbWrap: {
    width: 63,
    height: 42,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.surface.white,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    letterSpacing: 0.16,
    color: '#0F1A20',
  },
});
