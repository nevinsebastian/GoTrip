import { useResponsive } from '@/components/ui/useResponsive';
import React from 'react';
import { Platform } from 'react-native';

type VendorPlatformScreenProps = {
  Mobile: React.ComponentType;
  Desktop: React.ComponentType;
};

export function VendorPlatformScreen({ Mobile, Desktop }: VendorPlatformScreenProps) {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const Screen = isDesktopWeb ? Desktop : Mobile;
  return <Screen />;
}
