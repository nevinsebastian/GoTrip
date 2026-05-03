/**
 * Web entry for `/signup`: split-panel auth (`AuthWebModal`). Native uses `signup.tsx`.
 */

import { AuthWebModal } from '@/src/components/AuthWebModal';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SignupWeb() {
  return (
    <View style={styles.shell}>
      <AuthWebModal
        visible
        mode="signup"
        onClose={() => router.replace('/(tabs)')}
        onSwitchMode={(mode) =>
          router.replace(mode === 'login' ? '/login' : '/signup')
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
