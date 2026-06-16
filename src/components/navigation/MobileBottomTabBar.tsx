import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import React from 'react';

import {
  MobileFloatingTabBar,
  MOBILE_TAB_ITEMS,
  type MobileTabId,
} from '@/src/components/navigation/MobileFloatingTabBar';

export function MobileBottomTabBar({ activeTab = 'index' }: { activeTab?: string }) {
  return (
    <MobileFloatingTabBar
      activeTab={activeTab}
      variant="overlay"
      onTabPress={(tabId) => router.push((tabId === 'index' ? '/(tabs)' : `/(tabs)/${tabId}`) as any)}
    />
  );
}

export function MobileTabBarFromNavigation({
  state,
  navigation,
  onBeforeProfilePress,
}: BottomTabBarProps & { onBeforeProfilePress?: (currentTab: MobileTabId) => void }) {
  const activeTab = state.routes[state.index]?.name ?? 'index';

  return (
    <MobileFloatingTabBar
      activeTab={activeTab}
      onTabPress={(tabId) => {
        const route = state.routes.find((r) => r.name === tabId);
        if (!route || state.routes[state.index]?.name === tabId) return;

        if (tabId === 'four' && onBeforeProfilePress) {
          onBeforeProfilePress(state.routes[state.index]?.name as MobileTabId);
        }

        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      }}
    />
  );
}

export { MOBILE_TAB_ITEMS, MobileFloatingTabBar };
export type { MobileTabId };
