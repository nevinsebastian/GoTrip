import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_DASHBOARD_BRAND_BLUE,
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_SEARCH_BG,
} from '@/src/constants/vendorDashboardConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

type VendorDashboardTopBarProps = {
  onMenuPress?: () => void;
};

export function VendorDashboardTopBar({ onMenuPress }: VendorDashboardTopBarProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.bar}>
        <Text style={styles.brand}>{VENDOR_DASHBOARD_COPY.brand}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.searchBtn} hitSlop={6} accessibilityRole="button">
            <Ionicons name="search" size={18} color="#000000" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/vendor/notifications')}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Ionicons name="notifications" size={20} color="#000000" />
          </Pressable>
          <Pressable onPress={onMenuPress} hitSlop={8} accessibilityRole="button">
            <Ionicons name="menu" size={22} color="#000000" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['2'],
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  brand: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_DASHBOARD_BRAND_BLUE,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: VENDOR_DASHBOARD_SEARCH_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
