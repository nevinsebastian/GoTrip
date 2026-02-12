import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, components, spacing } from '@/constants/DesignTokens';

import TicketsIcon from '@/assets/images/tickets.svg';

const iconSize = components.bottomNav.iconSize;
const labelSize = components.bottomNav.textSize;

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

function TabButtonWithPill({
  focused,
  icon,
  label,
  style,
  ...pressableProps
}: {
  focused: boolean;
  icon: React.ReactNode;
  label: string;
  style?: unknown;
  [key: string]: unknown;
}) {
  return (
    <Pressable {...pressableProps} style={[styles.tabButton, style]}>
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
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.surface.white,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: spacing['2'],
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="home-outline"
              color={focused ? colors.surface.white : color}
              filled={focused}
            />
          ),
          tabBarButton: (props) => {
            const focused = props.accessibilityState?.selected ?? false;
            const icon = (
              <TabBarIcon
                name="home-outline"
                color={focused ? colors.surface.white : colors.primary}
                filled={focused}
              />
            );
            return (
              <TabButtonWithPill
                {...props}
                focused={focused}
                icon={icon}
                label="Home"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="heart-outline"
              color={focused ? colors.surface.white : color}
              filled={focused}
            />
          ),
          tabBarButton: (props) => {
            const focused = props.accessibilityState?.selected ?? false;
            const icon = (
              <TabBarIcon
                name="heart-outline"
                color={focused ? colors.surface.white : colors.primary}
                filled={focused}
              />
            );
            return (
              <TabButtonWithPill
                {...props}
                focused={focused}
                icon={icon}
                label="Wishlist"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, focused }) => (
            <TicketsIcon
              width={iconSize}
              height={iconSize}
              color={focused ? colors.surface.white : color}
            />
          ),
          tabBarButton: (props) => {
            const focused = props.accessibilityState?.selected ?? false;
            const icon = (
              <TicketsIcon
                width={iconSize}
                height={iconSize}
                color={focused ? colors.surface.white : colors.primary}
              />
            );
            return (
              <TabButtonWithPill
                {...props}
                focused={focused}
                icon={icon}
                label="Tickets"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="person-outline"
              color={focused ? colors.surface.white : color}
              filled={focused}
            />
          ),
          tabBarButton: (props) => {
            const focused = props.accessibilityState?.selected ?? false;
            const icon = (
              <TabBarIcon
                name="person-outline"
                color={focused ? colors.surface.white : colors.primary}
                filled={focused}
              />
            );
            return (
              <TabButtonWithPill
                {...props}
                focused={focused}
                icon={icon}
                label="Profile"
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
