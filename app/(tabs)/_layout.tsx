import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, borderRadius, components, spacing } from '@/constants/DesignTokens';

import TicketsIcon from '@/assets/images/tickets.svg';

const iconSize = components.bottomNav.iconSize;
const labelSize = components.bottomNav.textSize;

const TAB_CONFIG = [
  { name: 'index', label: 'Home', icon: 'home-outline', isSvg: false },
  { name: 'two', label: 'Wishlist', icon: 'heart-outline', isSvg: false },
  { name: 'three', label: 'Tickets', icon: null, isSvg: true },
  { name: 'four', label: 'Profile', icon: 'person-outline', isSvg: false },
] as const;

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

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <CustomTabBar {...props} />}
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
