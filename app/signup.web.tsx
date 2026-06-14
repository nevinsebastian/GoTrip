/**
 * Web entry for `/signup`: mobile web uses the same native signup UI;
 * desktop web keeps the split-panel AuthWebModal.
 */

import { useResponsive } from '@/components/ui/useResponsive';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { MobileSignupScreen } from '@/src/screens/MobileSignupScreen';
import { USER_PROFILE_QUERY_KEY } from '@/src/hooks/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function SignupWeb() {
  const { isDesktop } = useResponsive();
  const queryClient = useQueryClient();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

  if (!isDesktopWeb) {
    return <MobileSignupScreen />;
  }

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
