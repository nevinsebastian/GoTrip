/**
 * Web entry for `/login`: same auth flow as `login.tsx` but uses the split-panel
 * `AuthWebModal` UI. Native uses `login.tsx` unchanged.
 */

import { AuthWebModal } from '@/src/components/AuthWebModal';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function LoginWeb() {
  return (
    <View style={styles.shell}>
      <AuthWebModal
        visible
        mode="login"
        onClose={() => router.replace('/(tabs)')}
        onSwitchMode={(mode) =>
          router.replace(mode === 'signup' ? '/signup' : '/login')
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
