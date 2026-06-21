import { useResponsive } from '@/components/ui/useResponsive';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobilePackageDetailsScreen } from '@/src/screens/MobilePackageDetails';
import { getPackageFixedDates } from '@/src/utils/packageDates';
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
        listingType: 'package',
        title: params.title ?? FIGMA_PACKAGE_DETAIL.title,
        price: params.price ?? FIGMA_PACKAGE_DETAIL.priceLabel,
        checkIn: getPackageFixedDates(listingId).startDate,
        checkOut: getPackageFixedDates(listingId).endDate,
      },
    });
  };

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <DesktopCategoryListingDetailScreen
          tab="packages"
          title={params.title}
          priceLabel={params.price}
          onBookNow={onBookNow}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MobilePackageDetailsScreen listingId={listingId} onBookNow={onBookNow} />
    </View>
  );
}
