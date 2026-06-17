import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_CATEGORY_PROVIDER_LABEL,
  VENDOR_WORKSPACE_BLUE,
  VENDOR_WORKSPACE_PROFILE,
} from '@/src/constants/vendorWorkspaceConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

type VendorWorkspaceHeaderProps = {
  categoryId: VendorListingCategoryId;
  onMenuPress?: () => void;
  showSearch?: boolean;
};

export function VendorWorkspaceHeader({
  categoryId,
  onMenuPress,
  showSearch = true,
}: VendorWorkspaceHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>{VENDOR_CATEGORY_PROVIDER_LABEL[categoryId]}</Text>
      <View style={styles.actions}>
        {showSearch ? (
          <Ionicons name="search-outline" size={20} color={colors.text.primary} />
        ) : null}
        <Pressable onPress={() => router.push('/vendor/notifications')} hitSlop={8}>
          <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
        </Pressable>
        <Pressable onPress={onMenuPress} hitSlop={8}>
          <Image source={VENDOR_WORKSPACE_PROFILE.avatar} style={styles.avatar} resizeMode="cover" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['2'],
  },
  brand: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_WORKSPACE_BLUE,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
});
