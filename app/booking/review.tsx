import { getStoredAuthToken } from '@/src/api/client';
import { PaymentResultModal } from '@/src/components/PaymentResultModal';
import { RazorpayCheckoutModal } from '@/src/components/RazorpayCheckoutModal';
import { useCreateBooking } from '@/src/hooks/useCreateBooking';
import { useCreateOrder } from '@/src/hooks/useCreateOrder';
import { useListingDetails } from '@/src/hooks/useListingDetails';
import { useVerifyPayment } from '@/src/hooks/useVerifyPayment';
import { MobileBookingReviewScreen } from '@/src/screens/MobileBookingReviewScreen';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { getPackageFixedDates } from '@/src/utils/packageDates';

export default function BookingReviewRoute() {
  const params = useLocalSearchParams<{
    listingId?: string;
    imageUri?: string;
    listingType?: string;
    title?: string;
    checkIn?: string;
    checkOut?: string;
  }>();
  const listingId = typeof params.listingId === 'string' ? params.listingId : undefined;
  const imageUriParam = typeof params.imageUri === 'string' ? params.imageUri : undefined;
  const listingTypeParam = typeof params.listingType === 'string' ? params.listingType : undefined;

  const { data: listingRes } = useListingDetails(listingId);
  const listing = listingRes?.data;
  const isPackageListing =
    listingTypeParam === 'package' || listing?.category?.type === 'package';
  const packageDates = getPackageFixedDates(listingId);
  const fixedCheckIn =
    typeof params.checkIn === 'string' ? params.checkIn : packageDates.startDate;
  const fixedCheckOut =
    typeof params.checkOut === 'string' ? params.checkOut : packageDates.endDate;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<{
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
    booking_id: string;
  } | null>(null);
  const [paymentResult, setPaymentResult] = useState<null | {
    status: 'success' | 'failed';
    bookingId?: string;
    totalLabel?: string;
    datesLabel?: string;
    guestsLabel?: string;
    title?: string;
    errorMessage?: string;
  }>(null);
  const [lastBookingMeta, setLastBookingMeta] = useState<{
    checkIn: string;
    checkOut: string;
    guestsLabel: string;
    totalLabel: string;
  } | null>(null);

  const { mutate: createBookingMut, isPending: isCreatingBooking } = useCreateBooking();
  const { mutate: createOrderMut, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: verifyPaymentMut } = useVerifyPayment();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await getStoredAuthToken();
      if (mounted) setIsLoggedIn(Boolean(token));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const carouselImage = (() => {
    const media = listing?.media ?? [];
    const img = media.find((m) => m.media_type === 'image')?.url;
    return imageUriParam ?? img ?? null;
  })();

  const title = isPackageListing
    ? (typeof params.title === 'string' ? params.title : FIGMA_PACKAGE_DETAIL.title)
    : FIGMA_PROPERTY.title;

  const handleConfirm = ({
    checkIn,
    checkOut,
    guests,
  }: {
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number; infants: number };
  }) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!listingId) {
      setErrorMessage('Listing id missing. Please go back and try again.');
      return;
    }

    setErrorMessage(null);
    const guestCount = Math.max(1, guests.adults + guests.children + guests.infants);
    const guestsLabel = [
      `${guests.adults} adult${guests.adults === 1 ? '' : 's'}`,
      guests.children ? `${guests.children} child${guests.children === 1 ? '' : 'ren'}` : null,
      guests.infants ? `${guests.infants} infant${guests.infants === 1 ? '' : 's'}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    const totalLabel = '₹ 2,420 including tax';

    createBookingMut(
      {
        listing_id: listingId,
        start_date: checkIn,
        end_date: checkOut,
        guests: guestCount,
      },
      {
        onSuccess: (res) => {
          const bookingId = res?.data?.id;
          if (!res?.success || !bookingId) {
            setErrorMessage(res?.message ?? 'Failed to create booking.');
            return;
          }
          createOrderMut(
            {
              booking_id: bookingId,
              receipt: bookingId.slice(0, 40),
            },
            {
              onSuccess: (orderRes) => {
                const d = orderRes?.data;
                if (!orderRes?.success || !d?.order_id || !d?.key_id) {
                  setErrorMessage(orderRes?.message ?? 'Failed to create payment order.');
                  return;
                }
                setLastBookingMeta({
                  checkIn,
                  checkOut,
                  guestsLabel,
                  totalLabel,
                });
                setPaymentOrder({
                  order_id: d.order_id,
                  amount: d.amount,
                  currency: d.currency ?? 'INR',
                  key_id: d.key_id,
                  booking_id: bookingId,
                });
                setPaymentVisible(true);
              },
              onError: (err) => setErrorMessage(getErrorMessage(err)),
            },
          );
        },
        onError: (err) => setErrorMessage(getErrorMessage(err)),
      },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <PaymentResultModal
        visible={Boolean(paymentResult)}
        status={paymentResult?.status ?? 'success'}
        bookingId={paymentResult?.bookingId}
        title={paymentResult?.title}
        datesLabel={paymentResult?.datesLabel}
        guestsLabel={paymentResult?.guestsLabel}
        totalPriceLabel={paymentResult?.totalLabel}
        errorMessage={paymentResult?.errorMessage}
        imageSource={carouselImage ? { uri: carouselImage } : RESORT_PLACEHOLDER_IMAGE}
        onClose={() => setPaymentResult(null)}
        onRetry={
          paymentResult?.status === 'failed'
            ? () => {
                setPaymentResult(null);
                if (paymentOrder) setPaymentVisible(true);
              }
            : undefined
        }
      />
      <RazorpayCheckoutModal
        visible={paymentVisible && Boolean(paymentOrder)}
        onClose={() => {
          setPaymentVisible(false);
          setPaymentOrder(null);
        }}
        keyId={paymentOrder?.key_id ?? ''}
        orderId={paymentOrder?.order_id ?? ''}
        amount={paymentOrder?.amount ?? 0}
        currency={paymentOrder?.currency ?? 'INR'}
        name="GoTrip"
        description={title}
        onError={(msg) => {
          setPaymentVisible(false);
          setPaymentResult({
            status: 'failed',
            bookingId: paymentOrder?.booking_id,
            title,
            datesLabel:
              lastBookingMeta ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}` : undefined,
            guestsLabel: lastBookingMeta?.guestsLabel,
            totalLabel: lastBookingMeta?.totalLabel,
            errorMessage: msg,
          });
        }}
        onSuccess={(payload) => {
          verifyPaymentMut(
            {
              razorpay_order_id: payload.razorpay_order_id,
              razorpay_payment_id: payload.razorpay_payment_id,
              razorpay_signature: payload.razorpay_signature,
            },
            {
              onSuccess: (res) => {
                setPaymentVisible(false);
                if (res?.success) {
                  setPaymentResult({
                    status: 'success',
                    bookingId: paymentOrder?.booking_id,
                    title,
                    datesLabel:
                      lastBookingMeta ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}` : undefined,
                    guestsLabel: lastBookingMeta?.guestsLabel,
                    totalLabel: lastBookingMeta?.totalLabel,
                  });
                  return;
                }
                const msg = res?.message ?? 'Payment verification failed.';
                setPaymentResult({
                  status: 'failed',
                  bookingId: paymentOrder?.booking_id,
                  title,
                  datesLabel:
                    lastBookingMeta ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}` : undefined,
                  guestsLabel: lastBookingMeta?.guestsLabel,
                  totalLabel: lastBookingMeta?.totalLabel,
                  errorMessage: msg,
                });
              },
              onError: (err) => {
                const msg = getErrorMessage(err);
                setPaymentResult({
                  status: 'failed',
                  bookingId: paymentOrder?.booking_id,
                  title,
                  datesLabel:
                    lastBookingMeta ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}` : undefined,
                  guestsLabel: lastBookingMeta?.guestsLabel,
                  totalLabel: lastBookingMeta?.totalLabel,
                  errorMessage: msg,
                });
              },
            },
          );
        }}
      />

      <MobileBookingReviewScreen
        imageUri={carouselImage}
        listingType={isPackageListing ? 'package' : 'hotel'}
        propertyTitle={title}
        fixedCheckIn={fixedCheckIn}
        fixedCheckOut={fixedCheckOut}
        onConfirm={handleConfirm}
        isSubmitting={isCreatingBooking || isCreatingOrder}
        errorMessage={errorMessage}
      />
    </View>
  );
}
