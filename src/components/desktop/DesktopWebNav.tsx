import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  DESKTOP_HERO_SPECS,
  DESKTOP_WEB_ICONS,
  DESKTOP_WEB_IMAGES,
} from '@/src/constants/desktopHomeConstants';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TabActivitiesIcon from '@/assets/images/home-figma/tab-activities.svg';
import TabGlampingIcon from '@/assets/images/home-figma/tab-glamping.svg';
import TabHotelsIcon from '@/assets/images/home-figma/tab-hotels.svg';
import TabPackagesIcon from '@/assets/images/home-figma/tab-packages.svg';

const ACCENT = DESKTOP_HERO_SPECS.accent;
const TAB_BORDER = 'rgba(28, 32, 36, 0.2)';
const HeartIcon = DESKTOP_WEB_ICONS.heart;
const AccountIcon = DESKTOP_WEB_ICONS.account;

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
  embedded?: boolean;
};

function NavTab({
  tab,
  selected,
  onPress,
}: {
  tab: (typeof NAV_TABS)[number];
  selected: boolean;
  onPress: () => void;
}) {
  const inner = (
    <View style={[styles.tabInner, selected ? styles.tabInnerActive : styles.tabInnerIdle]}>
      <View style={[styles.tabIconBox, selected && styles.tabIconBoxActive]}>
        <tab.Icon width={24} height={24} />
      </View>
      <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{tab.label}</Text>
    </View>
  );

  if (selected) {
    return (
      <View style={styles.tabRing}>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: true }}>
          {inner}
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: false }}>
      {inner}
    </Pressable>
  );
}

export function DesktopWebNav({
  activeTab,
  onTabChange,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
  embedded = false,
}: DesktopWebNavProps) {
  if (!embedded) {
    return null;
  }

  return (
    <View style={styles.navBar}>
      <Image source={DESKTOP_WEB_IMAGES.logo} style={styles.logo} resizeMode="contain" />

      <View
        style={[
          styles.tabsShell,
          Platform.OS === 'web'
            ? ({ backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' } as object)
            : null,
        ]}
      >
        {NAV_TABS.map((tab) => (
          <NavTab
            key={tab.id}
            tab={tab}
            selected={tab.id === activeTab}
            onPress={() => onTabChange(tab.id)}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.wishlistBtn}
          onPress={() => router.push('/(tabs)/two')}
          accessibilityLabel="Wishlist"
        >
          <HeartIcon width={24} height={24} />
        </Pressable>
        <Pressable
          style={styles.profileBtn}
          onPress={isLoggedIn ? onProfilePress : onLoginPress}
          accessibilityLabel={isLoggedIn ? 'Profile' : 'Login'}
        >
          <AccountIcon width={24} height={24} />
        </Pressable>
        <Pressable style={styles.menuBtn} onPress={onMenuPress} accessibilityLabel="Menu">
          <Ionicons name="menu" size={24} color={ACCENT} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: DESKTOP_HERO_SPECS.navHeight,
    paddingHorizontal: 24,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: 16,
    width: '100%',
    zIndex: 2,
  },
  logo: {
    width: 87,
    height: 40,
    flexShrink: 0,
  },
  tabsShell: {
    flex: 1,
    maxWidth: 817,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    gap: 8,
  },
  tabRing: {
    borderWidth: 2,
    borderColor: ACCENT,
    borderRadius: 12,
    padding: 4,
    width: 169,
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 48,
  },
  tabInnerActive: {
    backgroundColor: ACCENT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tabInnerIdle: {
    backgroundColor: colors.surface.white,
    borderWidth: 2,
    borderColor: TAB_BORDER,
    width: 169,
    borderRadius: 8,
  },
  tabIconBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  tabIconBoxActive: {
    backgroundColor: colors.surface.white,
    borderRadius: 2,
  },
  tabLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    letterSpacing: 0.32,
  },
  tabLabelActive: {
    color: colors.surface.white,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  wishlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    borderWidth: 1,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: 22,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
