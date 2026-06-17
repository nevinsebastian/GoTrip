import { VendorWorkspaceTabBar } from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function VendorWorkspaceLayout() {
  return (
    <View style={styles.layout}>
      <Tabs
        initialRouteName="home"
        tabBar={(props) => <VendorWorkspaceTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="listings" options={{ title: 'Listings' }} />
        <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="calendar" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: { flex: 1 },
});
