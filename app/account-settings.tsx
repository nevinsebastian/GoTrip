import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopAccountSettingsScreen } from '@/src/screens/DesktopAccountSettingsScreen';
import { MobileAccountSettingsScreen } from '@/src/screens/MobileAccountSettingsScreen';
import { Platform } from 'react-native';
import React from 'react';

export default function AccountSettingsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (isDesktopWeb) {
    return <DesktopAccountSettingsScreen />;
  }

  return <MobileAccountSettingsScreen />;
}
