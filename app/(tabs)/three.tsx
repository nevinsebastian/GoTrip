import { useResponsive } from '@/components/ui/useResponsive';
import { TicketsDesktopShell } from '@/src/components/TicketsDesktopShell';
import { MobileTicketsScreen } from '@/src/screens/MobileTicketsScreen';
import { Platform } from 'react-native';
import React from 'react';

export default function TicketsScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (isDesktopWeb) {
    return <TicketsDesktopShell />;
  }

  return <MobileTicketsScreen />;
}
