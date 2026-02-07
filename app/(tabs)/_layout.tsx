import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, components, spacing } from '@/constants/DesignTokens';

function TabBarIcon({
  name,
  color,
  size = components.bottomNav.iconSize,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
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
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: components.bottomNav.textSize,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrap,
                focused && styles.iconWrapActive,
              ]}
            >
              <TabBarIcon
                name="home"
                color={focused ? colors.surface.white : color}
              />
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="heart-outline" color={color} />
          ),
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar-outline" color={color} />
          ),
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-outline" color={color} />
          ),
          tabBarLabel: '',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
});
