import { useResponsive } from '@/components/ui/useResponsive';
import { useIsAuthenticated } from '@/src/hooks/useIsAuthenticated';
import { MobileBecomeVendorScreen } from '@/src/screens/MobileBecomeVendorScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

type BecomeVendorInitialStep = 'landing' | 'category';

export default function BecomeVendorRoute() {
  const { step } = useLocalSearchParams<{ step?: string }>();
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const { data: isAuthenticated, isLoading } = useIsAuthenticated();

  const wantsCategory = step === 'category';
  const initialStep: BecomeVendorInitialStep =
    wantsCategory && isAuthenticated ? 'category' : 'landing';

  if (wantsCategory && isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isDesktopWeb) {
    const { DesktopBecomeVendorScreen } = require('@/src/screens/DesktopBecomeVendorScreen');
    return <DesktopBecomeVendorScreen initialStep={initialStep} />;
  }

  return <MobileBecomeVendorScreen initialStep={initialStep} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
