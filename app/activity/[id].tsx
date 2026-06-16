import { useResponsive } from '@/components/ui/useResponsive';
import { FIGMA_ACTIVITY_DETAIL } from '@/src/constants/activityDetailConstants';
import { MobileActivityDetailsScreen } from '@/src/screens/MobileActivityDetails';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

export default function ActivityDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const onBookNow = () => {
    router.push({
      pathname: '/booking/review',
      params: {
        listingId: listingId ?? '',
        title: params.title ?? FIGMA_ACTIVITY_DETAIL.title,
        price: params.price ?? FIGMA_ACTIVITY_DETAIL.priceLabel,
      },
    });
  };

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <MobileActivityDetailsScreen onBookNow={onBookNow} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MobileActivityDetailsScreen onBookNow={onBookNow} />
    </View>
  );
}
