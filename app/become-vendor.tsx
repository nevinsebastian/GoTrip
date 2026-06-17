import { MobileBecomeVendorScreen } from '@/src/screens/MobileBecomeVendorScreen';
import { DesktopBecomeVendorLandingScreen } from '@/src/screens/DesktopBecomeVendorLandingScreen';
import { useResponsive } from '@/components/ui/useResponsive';
import React, { useState } from 'react';
import { Platform } from 'react-native';

export default function BecomeVendorRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const [started, setStarted] = useState(false);

  if (isDesktopWeb && !started) {
    return <DesktopBecomeVendorLandingScreen onStart={() => setStarted(true)} />;
  }

  return (
    <MobileBecomeVendorScreen initialStep={isDesktopWeb && started ? 'register' : 'landing'} />
  );
}
