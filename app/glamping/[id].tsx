import { useResponsive } from '@/components/ui/useResponsive';
import { CategoryDetailRouteShell } from '@/src/components/listing/CategoryDetailRouteShell';
import { useGlampingDetail } from '@/src/hooks/useCategoryListing';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobileGlampingDetailsScreen } from '@/src/screens/MobileGlampingDetails';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, View } from 'react-native';

export default function GlampingDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const { data, isLoading, isError, error, refetch } = useGlampingDetail(listingId);
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
          listingType: 'glamping',
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
        listingType: 'glamping',
        title: display?.title ?? params.title ?? '',
        price: display?.priceLabel ?? params.price ?? '',
      },
    });
  };

  return (
    <CategoryDetailRouteShell
      isLoading={isLoading}
      isError={isError || !listingId}
      error={error ?? new Error('Invalid glamping link')}
      categoryLabel="Glamping"
      browsePath="/(tabs)"
      onRetry={refetch}
    >
      {isDesktopWeb ? (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <DesktopCategoryListingDetailScreen
            tab="glamping"
            title={display?.title ?? params.title}
            priceLabel={display?.priceLabel ?? params.price}
            display={display}
            onBookNow={openDateModal}
            bookingFocus={bookingFocus}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MobileGlampingDetailsScreen display={display} onBookNow={onBookNowMobile} />
        </View>
      )}
    </CategoryDetailRouteShell>
  );
}
