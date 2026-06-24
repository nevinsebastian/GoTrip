import { Input, Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { VENDOR_ONBOARDING } from '@/src/constants/vendorOnboardingConstants';
import { VENDOR_WORKSPACE_COPY } from '@/src/constants/vendorWorkspaceConstants';
import { goToVendorHome } from '@/src/utils/vendorNavigation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

const HeaderLogo = require('@/assets/images/login-figma/logo-header.png');

const FIGMA_BLUE = '#2C6F9C';
const FIGMA_PINK = '#AA1155';
const FIGMA_VENDOR_SUFFIX = '#E54D2E';

type DesktopVendorWebHeaderProps = {
  compact?: boolean;
};

/** Figma Frame 5077 — shared vendor desktop web header (login, dashboard, …). */
export function DesktopVendorWebHeader({ compact = false }: DesktopVendorWebHeaderProps) {
  return (
    <View style={[styles.headerBar, compact && styles.headerBarCompact]}>
      <Pressable onPress={() => goToVendorHome()} style={styles.brandRow} accessibilityRole="button">
        <Image source={HeaderLogo} style={styles.brandLogo} resizeMode="contain" />
        <Text style={styles.brandVendorSuffix}>-vendor</Text>
      </Pressable>

      <View style={[styles.searchSection, compact && styles.searchSectionCompact]}>
        <View style={styles.searchWrap}>
          <Input
            placeholder={VENDOR_ONBOARDING.searchPlaceholder}
            placeholderTextColor="#1C2024"
            style={styles.searchInput}
            editable={false}
          />
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={16} color="#1C2024" />
          </View>
        </View>
      </View>

      <View style={styles.headerActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/become-vendor')}
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnBlue, pressed && styles.pressed]}
        >
          <Text style={styles.actionBtnText}>{VENDOR_WORKSPACE_COPY.addListing}</Text>
          <Ionicons name="home" size={24} color={colors.surface.white} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/vendor/(workspace)/listings')}
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnPink, pressed && styles.pressed]}
        >
          <Text style={styles.actionBtnText}>{VENDOR_WORKSPACE_COPY.allListings}</Text>
          <Ionicons name="business" size={24} color={colors.surface.white} />
        </Pressable>

        <Pressable
          style={styles.profileBtn}
          accessibilityRole="button"
          onPress={() => router.push('/vendor/(workspace)/profile')}
        >
          <Ionicons name="person-outline" size={20} color={FIGMA_BLUE} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 42,
    gap: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 7, 20, 0.25)',
    backgroundColor: colors.surface.white,
    zIndex: 10,
  },
  headerBarCompact: {
    gap: 16,
    paddingHorizontal: 16,
    height: 'auto' as unknown as number,
    minHeight: 90,
    flexWrap: 'wrap',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 189,
    height: 34,
    flexShrink: 0,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  brandLogo: {
    width: 87,
    height: 40,
  },
  brandVendorSuffix: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 24,
    color: FIGMA_VENDOR_SUFFIX,
    marginBottom: 2,
  },
  searchSection: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 80,
    justifyContent: 'center',
  },
  searchSectionCompact: {
    paddingHorizontal: 0,
    flexBasis: '100%',
  },
  searchWrap: {
    position: 'relative',
    width: '100%',
    height: 40,
  },
  searchInput: {
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.8)',
    paddingLeft: 8,
    paddingRight: 40,
    fontSize: 16,
    lineHeight: 24,
  },
  searchIcon: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flexShrink: 0,
  },
  actionBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer' as const,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  actionBtnBlue: {
    backgroundColor: FIGMA_BLUE,
  },
  actionBtnPink: {
    backgroundColor: FIGMA_PINK,
  },
  actionBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 21,
    letterSpacing: 0.56,
    color: colors.surface.white,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(44, 111, 156, 0.8)',
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  pressed: { opacity: 0.85 },
});
