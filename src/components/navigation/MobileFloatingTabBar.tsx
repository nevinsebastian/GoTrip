import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TicketsIcon from '@/assets/images/tickets.svg';
import { HOME_DESIGN_WIDTH } from '@/src/components/home/useHomeScale';

const ICON_SIZE = 20;
const LABEL_SIZE = 12;
const ACCENT = colors.accent.main;

export const MOBILE_TAB_ITEMS = [
  { id: 'index', label: 'Home', icon: 'home' as const, isSvg: false },
  { id: 'two', label: 'Wishlist', icon: 'heart' as const, isSvg: false },
  { id: 'three', label: 'Tickets', icon: null, isSvg: true },
  { id: 'four', label: 'Profile', icon: 'person-circle' as const, isSvg: false },
] as const;

export type MobileTabId = (typeof MOBILE_TAB_ITEMS)[number]['id'];

type MobileFloatingTabBarProps = {
  activeTab: string;
  onTabPress: (tabId: MobileTabId) => void;
  /** docked = reserves space in tab navigator; overlay = floats above stack screens */
  variant?: 'docked' | 'overlay';
};

export function useMobileTabBarInset() {
  const { s } = useTabBarScale();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? s(12) : s(10));
  return s(64) + bottomPad + s(8);
}

function useTabBarScale() {
  const { width } = useWindowDimensions();
  const scale = width / HOME_DESIGN_WIDTH;
  const s = (n: number) => Math.round(n * scale);
  const barWidth = Math.min(width - s(24), s(378));
  return { s, barWidth };
}

function TabIcon({
  tab,
  focused,
}: {
  tab: (typeof MOBILE_TAB_ITEMS)[number];
  focused: boolean;
}) {
  const color = focused ? colors.surface.white : ACCENT;

  if (tab.isSvg) {
    return <TicketsIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />;
  }

  const iconName = tab.icon;
  if (!iconName) return null;

  return <Ionicons name={iconName} size={ICON_SIZE} color={color} />;
}

export function MobileFloatingTabBar({
  activeTab,
  onTabPress,
  variant = 'docked',
}: MobileFloatingTabBarProps) {
  const { s, barWidth } = useTabBarScale();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? s(12) : s(10));

  return (
    <View
      style={[
        variant === 'overlay' ? styles.outerOverlay : styles.outerDocked,
        {
          paddingBottom: bottomPad,
          paddingHorizontal: s(12),
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          {
            width: barWidth,
            height: s(64),
            paddingTop: s(14),
            paddingBottom: s(14),
            paddingLeft: s(14),
            paddingRight: s(24),
            borderRadius: s(100),
            gap: s(12),
          },
        ]}
      >
        {MOBILE_TAB_ITEMS.map((tab) => {
          const focused = tab.id === activeTab;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={tab.label}
            >
              {focused ? (
                <View
                  style={[
                    styles.activePill,
                    {
                      paddingVertical: s(8),
                      paddingLeft: s(12),
                      paddingRight: s(18),
                      borderRadius: s(100),
                      gap: s(8),
                      height: s(36),
                    },
                  ]}
                >
                  <TabIcon tab={tab} focused />
                  <Text style={[styles.activeLabel, { fontSize: s(LABEL_SIZE), lineHeight: s(16) }]}>
                    {tab.label}
                  </Text>
                </View>
              ) : (
                <TabIcon tab={tab} focused={false} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerDocked: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
  },
  activeLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
});
