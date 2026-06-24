import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { colors, typography } from '@/constants/DesignTokens';
import { VENDOR_DASHBOARD_NAV_BLUE } from '@/src/constants/vendorDashboardConstants';
import {
  VENDOR_WORKSPACE_TABS,
  type VendorWorkspaceTabId,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const ICON_SIZE = 20;
const LABEL_SIZE = 12;

const TAB_ROUTE_MAP: Record<string, VendorWorkspaceTabId> = {
  home: 'home',
  listings: 'listings',
  bookings: 'bookings',
  profile: 'profile',
};

export function useVendorTabBarInset() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const s = (n: number) => Math.round(n * scale);
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? s(12) : s(10));
  return s(64) + bottomPad + s(12);
}

type VendorWorkspaceFloatingTabBarProps = {
  activeTab: VendorWorkspaceTabId;
};

export function VendorWorkspaceFloatingTabBar({ activeTab }: VendorWorkspaceFloatingTabBarProps) {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const s = (n: number) => Math.round(n * scale);
  const barWidth = Math.min(width - s(24), s(378));
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? s(12) : s(10));

  return (
    <View
      style={[styles.outer, { paddingBottom: bottomPad, paddingHorizontal: s(12) }]}
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
            gap: s(8),
          },
        ]}
      >
        {VENDOR_WORKSPACE_TABS.map((tab) => {
          const focused = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              style={styles.tabButton}
              onPress={() => {
                if (focused) return;
                router.push(tab.route);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
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
                  <Ionicons name={tab.icon} size={ICON_SIZE} color={colors.surface.white} />
                  <Text style={[styles.activeLabel, { fontSize: s(LABEL_SIZE), lineHeight: s(16) }]}>
                    {tab.label}
                  </Text>
                </View>
              ) : (
                <Ionicons name={tab.icon} size={ICON_SIZE} color={VENDOR_DASHBOARD_NAV_BLUE} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function VendorWorkspaceTabBar({ state, navigation }: BottomTabBarProps) {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  if (isDesktopWeb) return null;

  const activeRoute = state.routes[state.index]?.name ?? 'home';
  const activeTab = TAB_ROUTE_MAP[activeRoute] ?? 'home';

  return <VendorWorkspaceFloatingTabBar activeTab={activeTab} />;
}

const styles = StyleSheet.create({
  outer: {
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
    backgroundColor: VENDOR_DASHBOARD_NAV_BLUE,
  },
  activeLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
});
