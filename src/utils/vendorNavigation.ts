import { router } from 'expo-router';
import { Platform } from 'react-native';

import { getStoredAuthToken } from '@/src/api/client';
import { isVendorMode } from '@/src/utils/vendorSession';

export const VENDOR_HOME_PATH = '/vendor/home';
export const VENDOR_LOGIN_PATH = '/vendor-login';
export const BECOME_VENDOR_PATH = '/become-vendor';

/** Paths that belong to the guest GoTrip app (not vendor). */
export function isConsumerAppPath(pathname: string): boolean {
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/otp' ||
    pathname === '/resorts' ||
    pathname === '/packages' ||
    pathname === '/account-settings'
  ) {
    return true;
  }
  if (pathname.startsWith('/(tabs)') || pathname.startsWith('/resort/')) return true;
  if (pathname.startsWith('/package/') || pathname.startsWith('/glamping/')) return true;
  if (pathname.startsWith('/activity/') || pathname.startsWith('/booking/review')) return true;
  return false;
}

export function isVendorAppPath(pathname: string): boolean {
  return pathname.startsWith('/vendor') || pathname === VENDOR_LOGIN_PATH || pathname === '/become-vendor';
}

/** Vendor workspace screens that require an active vendor session. */
export function isProtectedVendorWorkspacePath(pathname: string): boolean {
  if (pathname.startsWith('/vendor/booking/')) return true;
  if (pathname.startsWith('/vendor/(workspace)')) return true;
  if (
    pathname === '/vendor/home' ||
    pathname === '/vendor/listings' ||
    pathname === '/vendor/bookings' ||
    pathname === '/vendor/profile' ||
    pathname === '/vendor/calendar' ||
    pathname === '/vendor/earnings' ||
    pathname === '/vendor/cancel-booking' ||
    pathname === '/vendor/notifications' ||
    pathname === '/vendor/dashboard'
  ) {
    return true;
  }
  return false;
}

/** Enter vendor dashboard after login; on web replaces history entry to reduce back-leaks to guest app. */
export async function enterVendorWorkspace(): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.replace(VENDOR_HOME_PATH);
    return;
  }
  router.replace(VENDOR_HOME_PATH);
}

export function goToVendorHome(): void {
  router.replace(VENDOR_HOME_PATH);
}

export function goToVendorLogin(replace = true): void {
  if (replace) router.replace(VENDOR_LOGIN_PATH);
  else router.push(VENDOR_LOGIN_PATH);
}

/**
 * Logged-in vendors skip registration/KYC and go straight to listing type selection.
 * Guests are sent through the full become-vendor onboarding flow.
 */
export async function goToVendorNewListing(): Promise<void> {
  const token = await getStoredAuthToken();
  if (token?.trim()) {
    router.push({ pathname: BECOME_VENDOR_PATH, params: { step: 'category' } });
    return;
  }
  router.push(BECOME_VENDOR_PATH);
}

/** If vendor session is active, keep the user inside vendor routes (web back-button safety). */
export async function redirectConsumerPathIfVendorMode(pathname: string): Promise<boolean> {
  const vendor = await isVendorMode();
  if (!vendor) return false;
  if (!isConsumerAppPath(pathname)) return false;
  router.replace(VENDOR_HOME_PATH);
  return true;
}
