/**
 * Web entry for `/login`: mobile web uses the same native login UI;
 * desktop web keeps the split-panel AuthWebModal.
 */

import { useResponsive } from '@/components/ui/useResponsive';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { MobileLoginScreen } from '@/src/screens/MobileLoginScreen';
import { USER_PROFILE_QUERY_KEY } from '@/src/hooks/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function LoginWeb() {
  const { isDesktop } = useResponsive();
  const queryClient = useQueryClient();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (!isDesktopWeb) {
    return <MobileLoginScreen />;
  }

  return (
    <View style={styles.shell}>
      <AuthWebModal
        visible
        mode="login"
        onClose={() => router.replace('/(tabs)')}
        onSwitchMode={(mode) =>
          router.replace(mode === 'signup' ? '/signup' : '/login')
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
