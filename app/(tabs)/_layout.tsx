import { colors } from '@/constants/DesignTokens';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useResponsive } from '@/components/ui/useResponsive';

import {
  MobileTabBarFromNavigation,
  type MobileTabId,
} from '@/src/components/navigation/MobileBottomTabBar';

type PreviousTabContextValue = {
  previousTab: MobileTabId;
  setPreviousTab: (name: MobileTabId) => void;
};

const PreviousTabContext = createContext<PreviousTabContextValue | null>(null);

export function usePreviousTab() {
  const ctx = useContext(PreviousTabContext);
  return ctx ?? { previousTab: 'index' as MobileTabId, setPreviousTab: () => {} };
}

function CustomTabBar(
  props: BottomTabBarProps & { setPreviousTab: (name: MobileTabId) => void },
) {
  const isProfileActive = props.state.routes[props.state.index].name === 'four';
  const { isDesktop } = useResponsive();

  if ((Platform.OS === 'web' && isDesktop) || isProfileActive) {
    return null;
  }

  return (
    <MobileTabBarFromNavigation
      {...props}
      onBeforeProfilePress={(currentTab) => props.setPreviousTab(currentTab)}
    />
  );
}

export default function TabLayout() {
  const [previousTab, setPreviousTab] = useState<MobileTabId>('index');

  return (
    <PreviousTabContext.Provider value={{ previousTab, setPreviousTab }}>
      <View style={styles.layout}>
        <Tabs
          initialRouteName="index"
          tabBar={(props) => <CustomTabBar {...props} setPreviousTab={setPreviousTab} />}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarActiveTintColor: colors.accent.main,
            tabBarInactiveTintColor: colors.accent.main,
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="two" options={{ title: 'Wishlist' }} />
          <Tabs.Screen name="three" options={{ title: 'Tickets' }} />
          <Tabs.Screen name="four" options={{ title: 'Profile' }} />
        </Tabs>
      </View>
    </PreviousTabContext.Provider>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
