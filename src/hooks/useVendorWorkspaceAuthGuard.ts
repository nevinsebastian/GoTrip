import { getStoredAuthToken } from '@/src/api/client';
import { goToVendorLogin } from '@/src/utils/vendorNavigation';
import { isVendorMode } from '@/src/utils/vendorSession';
import { useEffect } from 'react';

/** Redirects unauthenticated users away from protected vendor workspace screens. */
export function useVendorWorkspaceAuthGuard() {
  useEffect(() => {
    let cancelled = false;

    const enforce = async () => {
      const [vendor, token] = await Promise.all([isVendorMode(), getStoredAuthToken()]);
      if (cancelled) return;
      if (!token?.trim() || !vendor) {
        goToVendorLogin();
      }
    };

    void enforce();

    return () => {
      cancelled = true;
    };
  }, []);
}
