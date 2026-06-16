import { MobileProfileScreen } from '@/src/screens/MobileProfileScreen';
import { router } from 'expo-router';
import React from 'react';

import { usePreviousTab } from './_layout';

export default function ProfileScreen() {
  const { previousTab } = usePreviousTab();

  const handleBack = () => {
    if (previousTab === 'index') {
      router.replace('/(tabs)');
    } else {
      router.replace(`/(tabs)/${previousTab}` as '/(tabs)/two');
    }
  };

  return <MobileProfileScreen onBack={handleBack} />;
}
