import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import {
  isConsumerAppPath,
  isProtectedVendorWorkspacePath,
  redirectConsumerPathIfVendorMode,
  VENDOR_HOME_PATH,
  VENDOR_LOGIN_PATH,
} from '@/src/utils/vendorNavigation';
import { isVendorMode } from '@/src/utils/vendorSession';

/**
 * Web: keeps vendor sessions inside /vendor/* — browser back from booking must not land on guest home.
 * Also sends unauthenticated users away from protected vendor workspace URLs on reload.
 */
export function VendorModeRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    let cancelled = false;

    const enforce = async () => {
      const path = pathname || window.location.pathname;
      const vendor = await isVendorMode();
      if (cancelled) return;

      if (vendor && isConsumerAppPath(path)) {
        router.replace(VENDOR_HOME_PATH);
        return;
      }

      if (!vendor && isProtectedVendorWorkspacePath(path)) {
        router.replace(VENDOR_LOGIN_PATH);
      }
    };

    void enforce();

    const onPopState = () => {
      void redirectConsumerPathIfVendorMode(window.location.pathname);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      cancelled = true;
      window.removeEventListener('popstate', onPopState);
    };
  }, [pathname, router]);

  return null;
}
