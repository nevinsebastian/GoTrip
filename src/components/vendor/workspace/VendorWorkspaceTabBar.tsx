import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_WORKSPACE_BLUE,
  VENDOR_WORKSPACE_TABS,
  type VendorWorkspaceTabId,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ROUTE_MAP: Record<string, VendorWorkspaceTabId> = {
  home: 'home',
  calendar: 'calendar',
  listings: 'listings',
  profile: 'profile',
};

export function VendorWorkspaceTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name ?? 'home';
  const activeTab = TAB_ROUTE_MAP[activeRoute] ?? 'home';

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing['3']) }]}>
      <View style={styles.bar}>
        {VENDOR_WORKSPACE_TABS.map((tab) => {
          const focused = tab.id === activeTab;
          const route = state.routes.find((r) => r.name === tab.id);
          return (
            <Pressable
              key={tab.id}
              style={[styles.tabBtn, focused && styles.tabBtnActive]}
              onPress={() => {
                if (!route || focused) return;
                navigation.navigate(route.name);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
            >
              <Ionicons
                name={tab.icon}
                size={focused ? 16 : 20}
                color={focused ? colors.surface.white : 'rgba(28, 32, 36, 0.45)'}
              />
              {focused ? <Text style={styles.tabLabel}>{tab.label}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
    paddingTop: spacing['2'],
    paddingHorizontal: spacing['4'],
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBtn: {
    minWidth: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: VENDOR_WORKSPACE_BLUE,
    paddingHorizontal: 14,
    height: 36,
  },
  tabLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
