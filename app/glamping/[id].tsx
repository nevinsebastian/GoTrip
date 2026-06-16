import { useResponsive } from '@/components/ui/useResponsive';
import { FIGMA_GLAMPING_DETAIL } from '@/src/constants/glampingDetailConstants';
import { MobileGlampingDetailsScreen } from '@/src/screens/MobileGlampingDetails';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

export default function GlampingDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const onBookNow = () => {
    router.push({
      pathname: '/booking/review',
      params: {
        listingId: listingId ?? '',
        title: params.title ?? FIGMA_GLAMPING_DETAIL.title,
        price: params.price ?? FIGMA_GLAMPING_DETAIL.priceLabel,
      },
    });
  };

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <MobileGlampingDetailsScreen onBookNow={onBookNow} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MobileGlampingDetailsScreen onBookNow={onBookNow} />
    </View>
  );
}

