import { useResponsive } from '@/components/ui/useResponsive';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import { MobilePackageDetailsScreen } from '@/src/screens/MobilePackageDetails';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

export default function PackageDetailsScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const onBookNow = () => {
    router.push({
      pathname: '/booking/review',
      params: {
        listingId: listingId ?? '',
        title: params.title ?? FIGMA_PACKAGE_DETAIL.title,
        price: params.price ?? FIGMA_PACKAGE_DETAIL.priceLabel,
      },
    });
  };

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <MobilePackageDetailsScreen onBookNow={onBookNow} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MobilePackageDetailsScreen onBookNow={onBookNow} />
    </View>
  );
}
