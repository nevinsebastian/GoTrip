import { useResponsive } from '@/components/ui/useResponsive';
import { isVendorMode } from '@/src/utils/vendorSession';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/** Keeps active vendors out of the guest tab experience on mobile. */
export function useVendorModeRedirect() {
  const { isDesktop } = useResponsive();

  useEffect(() => {
    if (Platform.OS === 'web' && isDesktop) return;

    let cancelled = false;
    isVendorMode().then((active) => {
      if (!cancelled && active) {
        router.replace('/vendor');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isDesktop]);
}
