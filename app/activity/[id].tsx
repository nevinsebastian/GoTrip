import { useResponsive } from '@/components/ui/useResponsive';
import { CategoryDetailRouteShell } from '@/src/components/listing/CategoryDetailRouteShell';
import { useActivityDetail } from '@/src/hooks/useCategoryListing';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { useIsAuthenticated } from '@/src/hooks/useIsAuthenticated';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobileActivityDetailsScreen } from '@/src/screens/MobileActivityDetails';
import { defaultHotelStayDates, toDateOnly } from '@/src/utils/bookingPayment';
import { mapActivityDetailToBookingEntity } from '@/src/utils/mapBookingEntity';
import type { ActivityDetail } from '@/src/api/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, Platform, View } from 'react-native';

export default function ActivityDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;
  const { data: isLoggedIn = false } = useIsAuthenticated();

  const { data, isLoading, isError, error, refetch } = useActivityDetail(listingId);
  const display = data?.display;
  const activity = data?.detail as ActivityDetail | undefined;

  useFocusEffect(
    useCallback(() => {
      if (listingId) refetch();
    }, [listingId, refetch]),
  );

  const goToCheckout = useCallback(
    (checkIn: string, _checkOut: string, adults = 2) => {
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      const entity = activity
        ? mapActivityDetailToBookingEntity(activity, undefined, adults)
        : null;
      if (!entity?.entityId) {
        Alert.alert(
          'Unavailable',
          'This activity has no bookable time slot yet. Please try another activity.',
        );
        return;
      }
      const defaults = defaultHotelStayDates(1, 7);
      const inDate = toDateOnly(checkIn) ?? defaults.checkIn;
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listingId ?? entity.listingId,
          listingType: 'activity',
          title: display?.title ?? params.title ?? '',
          price: display?.priceLabel ?? params.price ?? '',
          checkIn: inDate,
          // Activities are single-day — do not send checkOut on hold (backend prices per adult/day).
          entityType: entity.entityType,
          entityId: entity.entityId,
          activitySlotId: entity.activitySlotId ?? entity.entityId,
          unitsBooked: String(entity.unitsBooked ?? adults),
          adults: String(Math.max(1, adults)),
        },
      });
    },
    [activity, display?.priceLabel, display?.title, isLoggedIn, listingId, params.price, params.title],
  );

  const onGuestSave = useCallback(
    (details: { checkIn: string | null; checkOut: string | null }) => {
      goToCheckout(details.checkIn ?? '', details.checkOut ?? details.checkIn ?? '');
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
          <MobileActivityDetailsScreen
            display={display}
            onBookNow={onBookNowMobile}
            bookCtaLabel={isLoggedIn ? 'Book Now' : 'Login'}
          />
        </View>
      )}
    </CategoryDetailRouteShell>
  );
}
