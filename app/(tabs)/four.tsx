import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopProfileScreen } from '@/src/screens/DesktopProfileScreen';
import { MobileProfileScreen } from '@/src/screens/MobileProfileScreen';
import { router } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { usePreviousTab } from './_layout';

export default function ProfileScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const { previousTab } = usePreviousTab();

  if (isDesktopWeb) {
    return <DesktopProfileScreen />;
  }

  const handleBack = () => {
    if (previousTab === 'index') {
      router.replace('/(tabs)');
    } else {
      router.replace(`/(tabs)/${previousTab}` as '/(tabs)/two');
    }
  };

  return <MobileProfileScreen onBack={handleBack} />;
}
