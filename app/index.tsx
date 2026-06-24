import { getStoredAuthToken } from '@/src/api/client';
import { isVendorMode } from '@/src/utils/vendorSession';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/DesignTokens';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [vendorMode, setVendorMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    Promise.all([getStoredAuthToken(), isVendorMode()])
      .then(([token, vendor]) => {
        if (mounted) {
          setHasToken(Boolean(token));
          setVendorMode(vendor);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setHasToken(false);
          setVendorMode(false);
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (vendorMode) {
    return <Redirect href="/vendor/home" />;
  }

  if (hasToken) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
});
