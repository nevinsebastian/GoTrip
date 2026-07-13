import { useResponsive } from '@/components/ui/useResponsive';
import { CategoryDetailRouteShell } from '@/src/components/listing/CategoryDetailRouteShell';
import { useActivityDetail } from '@/src/hooks/useCategoryListing';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobileActivityDetailsScreen } from '@/src/screens/MobileActivityDetails';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, View } from 'react-native';

export default function ActivityDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const { data, isLoading, isError, error, refetch } = useActivityDetail(listingId);
  const display = data?.display;

  useFocusEffect(
    useCallback(() => {
      if (listingId) refetch();
    }, [listingId, refetch]),
  );

  const onGuestSave = useCallback(
    (details: { checkIn: string | null; checkOut: string | null }) => {
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listingId ?? '',
          listingType: 'activity',
          title: display?.title ?? params.title ?? '',
          price: display?.priceLabel ?? params.price ?? '',
          checkIn: details.checkIn ?? '',
          checkOut: details.checkOut ?? '',
        },
      });
    },
    [display?.priceLabel, display?.title, listingId, params.price, params.title],
  );

  const { openDateModal, bookingFocus } = useDesktopBookingFocus({ onGuestSave });

  const onBookNowMobile = () => {
    router.push({
      pathname: '/booking/review',
      params: {
        listingId: listingId ?? '',
        listingType: 'activity',
        title: display?.title ?? params.title ?? '',
        price: display?.priceLabel ?? params.price ?? '',
      },
    });
  };

  return (
    <CategoryDetailRouteShell
      isLoading={isLoading}
      isError={isError || !listingId}
      error={error ?? new Error('Invalid activity link')}
      categoryLabel="Activity"
      browsePath="/(tabs)"
      onRetry={refetch}
    >
      {isDesktopWeb ? (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <DesktopCategoryListingDetailScreen
            tab="activities"
            title={display?.title ?? params.title}
            priceLabel={display?.priceLabel ?? params.price}
            display={display}
            onBookNow={openDateModal}
            bookingFocus={bookingFocus}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MobileActivityDetailsScreen display={display} onBookNow={onBookNowMobile} />
        </View>
      )}
    </CategoryDetailRouteShell>
  );
}
