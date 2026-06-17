import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { DESKTOP_WEB_COLORS } from '@/src/constants/desktopWebConstants';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import TabActivitiesIcon from '@/assets/images/home-figma/tab-activities.svg';
import TabGlampingIcon from '@/assets/images/home-figma/tab-glamping.svg';
import TabHotelsIcon from '@/assets/images/home-figma/tab-hotels.svg';
import TabPackagesIcon from '@/assets/images/home-figma/tab-packages.svg';
import HeartIcon from '@/assets/images/heart.svg';

const WebLogo = require('../../../assets/images/logogotrip.png');

const NAV_TABS: Array<{
  id: HomeCategoryTab;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
}> = [
  { id: 'hotels', label: 'Hotels', Icon: TabHotelsIcon },
  { id: 'packages', label: 'Packages', Icon: TabPackagesIcon },
  { id: 'glamping', label: 'Glamping', Icon: TabGlampingIcon },
  { id: 'activities', label: 'Activities', Icon: TabActivitiesIcon },
];

type DesktopWebNavProps = {
  activeTab: HomeCategoryTab;
  onTabChange: (tab: HomeCategoryTab) => void;
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
};

export function DesktopWebNav({
  activeTab,
  onTabChange,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
}: DesktopWebNavProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.inner}>
        {Platform.OS === 'web' ? (
          <Image source={WebLogo} style={styles.logo} resizeMode="contain" />
        ) : null}

        <View style={styles.tabs}>
          {NAV_TABS.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, selected && styles.tabActive]}
                onPress={() => onTabChange(tab.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <tab.Icon width={14} height={14} />
                <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.wishlistBtn}
            onPress={() => router.push('/(tabs)/two')}
            accessibilityLabel="Wishlist"
          >
            <HeartIcon width={18} height={18} />
          </Pressable>
          {isLoggedIn ? (
            <Pressable style={styles.profileBtn} onPress={onProfilePress} accessibilityLabel="Profile">
              <Ionicons name="person" size={18} color={colors.surface.white} />
            </Pressable>
          ) : (
            <Pressable style={styles.profileBtn} onPress={onLoginPress} accessibilityLabel="Login">
              <Ionicons name="person" size={18} color={colors.surface.white} />
            </Pressable>
          )}
          <Pressable style={styles.menuBtn} onPress={onMenuPress} accessibilityLabel="Menu">
            <Ionicons name="menu" size={22} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  inner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['4'],
  },
  logo: {
    width: 120,
    height: 44,
    flexShrink: 0,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tabActive: {
    backgroundColor: DESKTOP_WEB_COLORS.navTabActive,
    borderColor: DESKTOP_WEB_COLORS.navTabActive,
  },
  tabLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  tabLabelActive: {
    color: colors.surface.white,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  wishlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: 28,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
