/**
 * Web entry for `/signup`: split-panel auth (`AuthWebModal`). Native uses `signup.tsx`.
 */

import { AuthWebModal } from '@/src/components/AuthWebModal';
import { USER_PROFILE_QUERY_KEY } from '@/src/hooks/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SignupWeb() {
  const queryClient = useQueryClient();
  return (
    <View style={styles.shell}>
      <AuthWebModal
        visible
        mode="signup"
        onClose={() => router.replace('/(tabs)')}
        onSwitchMode={(mode) =>
          router.replace(mode === 'login' ? '/login' : '/signup')
        }
        onAuthenticated={() =>
          queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
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
