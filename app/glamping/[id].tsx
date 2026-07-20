import { useResponsive } from '@/components/ui/useResponsive';
import { CategoryDetailRouteShell } from '@/src/components/listing/CategoryDetailRouteShell';
import { useGlampingDetail } from '@/src/hooks/useCategoryListing';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { useIsAuthenticated } from '@/src/hooks/useIsAuthenticated';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobileGlampingDetailsScreen } from '@/src/screens/MobileGlampingDetails';
import { defaultHotelStayDates, toDateOnly } from '@/src/utils/bookingPayment';
import { mapGlampingDetailToBookingEntity } from '@/src/utils/mapBookingEntity';
import type { GlampingDetail } from '@/src/api/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, Platform, View } from 'react-native';

export default function GlampingDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;
  const { data: isLoggedIn = false } = useIsAuthenticated();

  const { data, isLoading, isError, error, refetch } = useGlampingDetail(listingId);
  const display = data?.display;
  const glamping = data?.detail as GlampingDetail | undefined;

  useFocusEffect(
    useCallback(() => {
      if (listingId) refetch();
    }, [listingId, refetch]),
  );

  const goToCheckout = useCallback(
    (checkIn: string, checkOut: string) => {
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      const entity = glamping ? mapGlampingDetailToBookingEntity(glamping) : null;
      if (!entity?.entityId) {
        Alert.alert(
          'Unavailable',
          'This glamping listing has no bookable site yet. Please try another stay.',
        );
        return;
      }
      const defaults = defaultHotelStayDates(2, 7);
      const inDate = toDateOnly(checkIn) ?? defaults.checkIn;
      const outDate = toDateOnly(checkOut) ?? defaults.checkOut;
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listingId ?? entity.listingId,
          listingType: 'glamping',
          title: display?.title ?? params.title ?? '',
          price: display?.priceLabel ?? params.price ?? '',
          checkIn: inDate,
          checkOut: outDate,
          entityType: entity.entityType,
          entityId: entity.entityId,
          unitsBooked: String(entity.unitsBooked ?? 1),
          adults: '2',
        },
      });
    },
    [display?.priceLabel, display?.title, glamping, isLoggedIn, listingId, params.price, params.title],
  );

  const onGuestSave = useCallback(
    (details: { checkIn: string | null; checkOut: string | null }) => {
      goToCheckout(details.checkIn ?? '', details.checkOut ?? '');
    },
    [goToCheckout],
  );

  const { openDateModal, bookingFocus } = useDesktopBookingFocus({ onGuestSave });

  const onBookNowMobile = () => {
    goToCheckout('', '');
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
            onBookNow={() => {
              if (!isLoggedIn) {
                router.push('/login');
                return;
              }
              openDateModal();
            }}
            isLoggedIn={isLoggedIn}
            bookingFocus={bookingFocus}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MobileGlampingDetailsScreen
            display={display}
            onBookNow={onBookNowMobile}
            bookCtaLabel={isLoggedIn ? 'Book Now' : 'Login'}
          />
        </View>
      )}
    </CategoryDetailRouteShell>
  );
}
