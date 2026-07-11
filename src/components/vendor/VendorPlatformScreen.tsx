import { useResponsive } from '@/components/ui/useResponsive';
import React from 'react';
import { Platform } from 'react-native';

type VendorPlatformScreenProps = {
  Mobile: React.ComponentType;
  Desktop?: React.ComponentType;
  loadDesktop?: () => React.ComponentType;
};

export function VendorPlatformScreen({ Mobile, Desktop, loadDesktop }: VendorPlatformScreenProps) {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (isDesktopWeb) {
    const Screen = loadDesktop?.() ?? Desktop;
    if (Screen) return <Screen />;
  }

  return <Mobile />;
}
