import { useResponsive } from '@/components/ui/useResponsive';
import { CategoryDetailRouteShell } from '@/src/components/listing/CategoryDetailRouteShell';
import { PackageEnquiryModal } from '@/src/components/package/PackageEnquiryModal';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { useIsAuthenticated } from '@/src/hooks/useIsAuthenticated';
import { usePackageDetailData, useSubmitPackageEnquiry } from '@/src/hooks/usePackageUser';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { MobilePackageDetailsScreen } from '@/src/screens/MobilePackageDetails';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

export default function PackageDetailsScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;

  const { data, isLoading, isError, error, refetch } = usePackageDetailData(listingId);
  const display = data?.display;
  const { data: isLoggedIn = false } = useIsAuthenticated();
  const submitEnquiry = useSubmitPackageEnquiry();

  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  const travelCheckIn = display?.travelCheckIn;
  const travelCheckOut = display?.travelCheckOut;
  const isEnquiryOnly = display?.bookingMode !== 'direct';

  useFocusEffect(
    useCallback(() => {
      if (listingId) refetch();
    }, [listingId, refetch]),
  );

  const goToBooking = useCallback(
    (checkIn: string, checkOut: string) => {
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listingId ?? '',
          listingType: 'package',
          packageEntityId: display?.packageEntityId ?? '',
          title: display?.title ?? params.title ?? '',
          price: display?.priceLabel ?? params.price ?? '',
          checkIn,
          checkOut,
        },
      });
    },
    [display?.packageEntityId, display?.priceLabel, display?.title, listingId, params.price, params.title],
  );

  const openEnquiry = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setEnquiryError(null);
    setEnquiryOpen(true);
  }, [isLoggedIn]);

  const handleEnquirySubmit = useCallback(
    (payload: Parameters<typeof submitEnquiry.mutate>[0]['payload']) => {
      if (!listingId) return;
      setEnquiryError(null);
      submitEnquiry.mutate(
        { listingId, payload },
        {
          onSuccess: () => {
            setEnquiryOpen(false);
            Alert.alert('Enquiry sent', 'The vendor will contact you shortly.', [
              { text: 'View enquiries', onPress: () => router.push('/(tabs)/three') },
              { text: 'OK' },
            ]);
          },
          onError: (err) => setEnquiryError(getErrorMessage(err)),
        },
      );
    },
    [listingId, submitEnquiry],
  );

  const onGuestSave = useCallback(
    (details: { checkIn: string | null; checkOut: string | null }) => {
      if (isEnquiryOnly) {
        openEnquiry();
        return;
      }
      goToBooking(
        details.checkIn ?? travelCheckIn ?? '',
        details.checkOut ?? travelCheckOut ?? '',
      );
    },
    [goToBooking, isEnquiryOnly, openEnquiry, travelCheckIn, travelCheckOut],
  );

  const { openDateModal, bookingFocus } = useDesktopBookingFocus({ onGuestSave });

  const onBookNowMobile = () => {
    if (isEnquiryOnly) {
      openEnquiry();
      return;
    }
    goToBooking(travelCheckIn ?? '', travelCheckOut ?? '');
  };

  return (
    <CategoryDetailRouteShell
      isLoading={isLoading}
      isError={isError || !listingId}
      error={error ?? new Error('Invalid package link')}
      categoryLabel="Package"
      browsePath="/packages"
      onRetry={refetch}
    >
      {isDesktopWeb ? (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <DesktopCategoryListingDetailScreen
            tab="packages"
            title={display?.title ?? params.title}
            priceLabel={display?.priceLabel ?? params.price}
            display={display}
            onBookNow={isEnquiryOnly ? openEnquiry : openDateModal}
            bookingFocus={bookingFocus}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MobilePackageDetailsScreen
            listingId={listingId}
            display={display}
            onBookNow={onBookNowMobile}
          />
        </View>
      )}

      <PackageEnquiryModal
        visible={enquiryOpen}
        title={display?.title ?? params.title ?? 'Package'}
        defaultTravelDate={travelCheckIn}
        defaultCheckOut={travelCheckOut}
        minAdults={display?.minGroupSize ?? 1}
        submitting={submitEnquiry.isPending}
        errorMessage={enquiryError}
        onClose={() => setEnquiryOpen(false)}
        onSubmit={handleEnquirySubmit}
      />
    </CategoryDetailRouteShell>
  );
}
