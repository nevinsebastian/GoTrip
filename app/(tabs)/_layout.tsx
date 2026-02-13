import { borderRadius, colors, components, spacing } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import TicketsIcon from '@/assets/images/tickets.svg';

const iconSize = components.bottomNav.iconSize;
const labelSize = components.bottomNav.textSize;

const TAB_CONFIG = [
  { name: 'index', label: 'Home', icon: 'home-outline', isSvg: false },
  { name: 'two', label: 'Wishlist', icon: 'heart-outline', isSvg: false },
  { name: 'three', label: 'Tickets', icon: null, isSvg: true },
  { name: 'four', label: 'Profile', icon: 'person-outline', isSvg: false },
] as const;

type TabRouteName = (typeof TAB_CONFIG)[number]['name'];

type PreviousTabContextValue = {
  previousTab: TabRouteName;
  setPreviousTab: (name: TabRouteName) => void;
};

const PreviousTabContext = createContext<PreviousTabContextValue | null>(null);

export function usePreviousTab() {
  const ctx = useContext(PreviousTabContext);
  return ctx ?? { previousTab: 'index' as TabRouteName, setPreviousTab: () => {} };
}

function TabBarIcon({
  name,
  color,
  filled = false,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  filled?: boolean;
}) {
  return (
    <Ionicons
      name={filled ? (name.replace('-outline', '') as keyof typeof Ionicons.glyphMap) : name}
      size={iconSize}
      color={color}
    />
  );
}

function CustomTabBar({
  state,
  descriptors,
  navigation,
  setPreviousTab,
}: BottomTabBarProps & { setPreviousTab: (name: TabRouteName) => void }) {
  const isProfileActive = state.routes[state.index].name === 'four';

  if (isProfileActive) {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const config = TAB_CONFIG[index];
          const label = config?.label ?? options.title ?? route.name;

          const onPress = () => {
            if (focused) return;
            if (route.name === 'four') {
              const currentTab = state.routes[state.index].name as TabRouteName;
              setPreviousTab(currentTab);
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconColor = focused ? colors.surface.white : colors.primary;

          const icon =
            config?.isSvg ? (
              <TicketsIcon width={iconSize} height={iconSize} color={iconColor} />
            ) : config?.icon ? (
              <TabBarIcon
                name={config.icon}
                color={iconColor}
                filled={focused}
              />
            ) : null;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            >
              {focused ? (
                <View style={styles.pill}>
                  {icon}
                  <Text style={styles.pillLabel}>{label}</Text>
                </View>
              ) : (
                icon
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const [previousTab, setPreviousTab] = useState<TabRouteName>('index');

  return (
    <PreviousTabContext.Provider value={{ previousTab, setPreviousTab }}>
      <Tabs
        initialRouteName="index"
        tabBar={(props) => <CustomTabBar {...props} setPreviousTab={setPreviousTab} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.primary,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="two" options={{ title: 'Wishlist' }} />
        <Tabs.Screen name="three" options={{ title: 'Tickets' }} />
        <Tabs.Screen name="four" options={{ title: 'Profile' }} />
      </Tabs>
    </PreviousTabContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: colors.surface.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing['2'],
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: spacing['2'],
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 48,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    gap: 6,
  },
  pillLabel: {
    fontSize: labelSize,
    fontWeight: '500',
    color: colors.surface.white,
  },
});
