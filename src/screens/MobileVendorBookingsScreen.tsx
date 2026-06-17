import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardBookingList } from '@/src/components/vendor/dashboard/VendorDashboardBookingList';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import { useVendorTabBarInset } from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorBookingsScreen() {
  const tabInset = useVendorTabBarInset();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Bookings</Text>
          <VendorDashboardBookingList />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: '#121921',
  },
});
