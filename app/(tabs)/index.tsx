import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopHomeScreen } from '@/src/screens/DesktopHomeScreen';
import { MobileHotelsHome } from '@/src/screens/MobileHotelsHome';
import React from 'react';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (!isDesktopWeb) {
    return <MobileHotelsHome />;
  }

  return <DesktopHomeScreen />;
}
