import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopBecomeVendorScreen } from '@/src/screens/DesktopBecomeVendorScreen';
import { MobileBecomeVendorScreen } from '@/src/screens/MobileBecomeVendorScreen';
import React from 'react';
import { Platform } from 'react-native';

export default function BecomeVendorRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (isDesktopWeb) {
    return <DesktopBecomeVendorScreen />;
  }

  return <MobileBecomeVendorScreen />;
}
