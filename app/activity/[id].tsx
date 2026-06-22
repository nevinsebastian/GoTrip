import { useResponsive } from '@/components/ui/useResponsive';
import { FIGMA_ACTIVITY_DETAIL } from '@/src/constants/activityDetailConstants';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobileActivityDetailsScreen } from '@/src/screens/MobileActivityDetails';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, View } from 'react-native';

export default function ActivityDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const onGuestSave = useCallback(
    (details: { checkIn: string | null; checkOut: string | null }) => {
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listingId ?? '',
          title: params.title ?? FIGMA_ACTIVITY_DETAIL.title,
          price: params.price ?? FIGMA_ACTIVITY_DETAIL.priceLabel,
          checkIn: details.checkIn ?? '',
          checkOut: details.checkOut ?? '',
        },
      });
    },
    [listingId, params.price, params.title],
  );

  const { openDateModal, bookingFocus } = useDesktopBookingFocus({ onGuestSave });

  const onBookNowMobile = () => {
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
        <DesktopCategoryListingDetailScreen
          tab="activities"
          title={params.title}
          priceLabel={params.price}
          onBookNow={openDateModal}
          bookingFocus={bookingFocus}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MobileActivityDetailsScreen onBookNow={onBookNowMobile} />
    </View>
  );
}
