import { useRouter } from 'expo-router';
import { useEffect, useLayoutEffect } from 'react';
import { Platform, View } from 'react-native';

/**
 * Root index route (`/`).
 *
 * Do not use `useRootNavigationState()` here — on web reload it can throw before the
 * root slot parent exists, which surfaces as the Expo Router error screen.
 *
 * Web: hard redirect to `/login` (no imperative router call on cold load).
 * Native: deferred `router.replace` so the root navigator is mounted first.
 */
export default function Index() {
  const router = useRouter();

  useLayoutEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (path !== '/') return;
    window.location.replace('/login');
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const id = setTimeout(() => {
      router.replace('/login');
    }, 0);
    return () => clearTimeout(id);
  }, [router]);

  return <View style={{ flex: 1 }} />;
}
