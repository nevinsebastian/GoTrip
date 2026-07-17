import { getStoredAuthToken } from '@/src/api/client';
import { PaymentResultModal } from '@/src/components/PaymentResultModal';
import { RazorpayCheckoutModal } from '@/src/components/RazorpayCheckoutModal';
import { useHoldBooking } from '@/src/hooks/useHoldBooking';
import { useInitiatePayment } from '@/src/hooks/useInitiatePayment';
import { useCheckAvailability, useEntityAvailability } from '@/src/hooks/useEntityAvailability';
import { useActivityDetail, useGlampingDetail } from '@/src/hooks/useCategoryListing';
import { useHotelDetail } from '@/src/hooks/useHotelDetail';
import { usePackageDetailData } from '@/src/hooks/usePackageUser';
import { useVerifyPayment } from '@/src/hooks/useVerifyPayment';
import { MobileBookingReviewScreen } from '@/src/screens/MobileBookingReviewScreen';
import { formatPriceBreakdownTotal } from '@/src/utils/availabilityCalendar';
import {
  mapActivityDetailToBookingEntity,
  mapGlampingDetailToBookingEntity,
  mapHotelDetailToBookingEntity,
  supportsAvailabilityCalendar,
  supportsCheckAvailability,
} from '@/src/utils/mapBookingEntity';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { getPackageFixedDates } from '@/src/utils/packageDates';
import type { AvailabilityEntityType, BookingPriceBreakdown } from '@/src/api/types';

type ListingKind = 'hotel' | 'package' | 'activity' | 'glamping';

function paramStr(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

export default function BookingReviewRoute() {
  const params = useLocalSearchParams<{
    listingId?: string;
    imageUri?: string;
    listingType?: string;
    packageEntityId?: string;
    entityType?: string;
    entityId?: string;
    mealPlanId?: string;
    activitySlotId?: string;
    unitsBooked?: string;
    title?: string;
    checkIn?: string;
    checkOut?: string;
  }>();

  const listingId = paramStr(params.listingId);
  const imageUriParam = paramStr(params.imageUri);
  const listingTypeParam = (paramStr(params.listingType) ?? 'hotel') as ListingKind;
  const packageEntityIdParam = paramStr(params.packageEntityId);
  const entityTypeParam = paramStr(params.entityType) as AvailabilityEntityType | undefined;
  const entityIdParam = paramStr(params.entityId);
  const mealPlanIdParam = paramStr(params.mealPlanId);
  const activitySlotIdParam = paramStr(params.activitySlotId);
  const unitsBookedParam = Number(paramStr(params.unitsBooked) ?? '1') || 1;

  const isPackageListing = listingTypeParam === 'package';
  const isHotel = listingTypeParam === 'hotel';
  const isActivity = listingTypeParam === 'activity';
  const isGlamping = listingTypeParam === 'glamping';

  const { data: hotelDetail } = useHotelDetail(listingId, isHotel);
  const { data: activityDetail } = useActivityDetail(listingId, isActivity);
  const { data: glampingDetail } = useGlampingDetail(listingId, isGlamping);
  const { data: packageDetail } = usePackageDetailData(listingId, isPackageListing);

  const hotel = hotelDetail?.hotel;
  const activity = activityDetail?.detail as import('@/src/api/types').ActivityDetail | undefined;
  const glamping = glampingDetail?.detail as import('@/src/api/types').GlampingDetail | undefined;

  const resolvedEntity = useMemo(() => {
    if (entityTypeParam && entityIdParam) {
      return {
        listingId: listingId ?? '',
        entityType: entityTypeParam,
        entityId: entityIdParam,
        mealPlanId: mealPlanIdParam,
        activitySlotId: activitySlotIdParam ?? (entityTypeParam === 'activity_slot' ? entityIdParam : undefined),
        unitsBooked: unitsBookedParam,
      };
    }
    if (isHotel && hotel) {
      return mapHotelDetailToBookingEntity(hotel, entityIdParam, mealPlanIdParam);
    }
    if (isActivity && activity) {
      return mapActivityDetailToBookingEntity(activity, activitySlotIdParam);
    }
    if (isGlamping && glamping) {
      return mapGlampingDetailToBookingEntity(glamping, entityIdParam, unitsBookedParam);
    }
    if (isPackageListing) {
      const id = packageEntityIdParam ?? packageDetail?.display?.packageEntityId;
      if (!listingId || !id) return null;
      return {
        listingId,
        entityType: 'package' as const,
        entityId: id,
        unitsBooked: 1,
      };
    }
    return null;
  }, [
    entityTypeParam,
    entityIdParam,
    mealPlanIdParam,
    activitySlotIdParam,
    unitsBookedParam,
    listingId,
    isHotel,
    hotel,
    isActivity,
    activity,
    isGlamping,
    glamping,
    isPackageListing,
    packageEntityIdParam,
    packageDetail?.display?.packageEntityId,
  ]);

  const packageDates = getPackageFixedDates(listingId);
  const fixedCheckIn =
    paramStr(params.checkIn) ??
    (isPackageListing
      ? packageDetail?.display?.travelCheckIn ?? packageDates.startDate
      : undefined);
  const fixedCheckOut =
    paramStr(params.checkOut) ??
    (isPackageListing
      ? packageDetail?.display?.travelCheckOut ?? packageDates.endDate
      : isActivity
        ? fixedCheckIn
        : undefined);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pricePreview, setPricePreview] = useState<BookingPriceBreakdown | null>(null);
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

  const calendarEntityType = resolvedEntity?.entityType;
  const calendarEntityId = resolvedEntity?.entityId;
  const canLoadCalendar =
    Boolean(calendarEntityType && calendarEntityId) &&
    supportsAvailabilityCalendar(calendarEntityType!);

  const { disabledDates, isFetching: availabilityLoading } = useEntityAvailability(
    canLoadCalendar ? calendarEntityType : undefined,
    canLoadCalendar ? calendarEntityId : undefined,
    fixedCheckIn,
    canLoadCalendar,
  );

  const { mutate: checkAvailabilityMut, isPending: isChecking } = useCheckAvailability();
  const { mutate: holdBookingMut, isPending: isHoldingBooking } = useHoldBooking();
  const { mutate: initiatePaymentMut, isPending: isInitiatingPayment } = useInitiatePayment();
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
    if (isPackageListing && packageDetail?.display?.carouselImages?.[0]) {
      return packageDetail.display.carouselImages[0];
    }
    if (isHotel && hotelDetail?.hotel) {
      const imgs = hotel?.images ?? [];
      const cover = imgs.find((i) => i.isCover)?.url ?? imgs[0]?.url;
      return imageUriParam ?? cover ?? null;
    }
    return imageUriParam ?? null;
  })();

  const title = (() => {
    if (typeof params.title === 'string' && params.title) return params.title;
    if (isPackageListing) return packageDetail?.display?.title ?? FIGMA_PACKAGE_DETAIL.title;
    if (isHotel) return hotel?.title ?? FIGMA_PROPERTY.title;
    if (isActivity) return activity?.title ?? 'Activity';
    if (isGlamping) return glamping?.title ?? 'Glamping';
    return FIGMA_PROPERTY.title;
  })();

  const openPayment = (
    bookingId: string,
    orderData: { order_id: string; amount: number; currency: string; key_id: string },
    meta: { checkIn: string; checkOut: string; guestsLabel: string; totalLabel: string },
  ) => {
    setLastBookingMeta(meta);
    setPaymentOrder({
      order_id: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency ?? 'INR',
      key_id: orderData.key_id,
      booking_id: bookingId,
    });
    setPaymentVisible(true);
  };

  const startHoldAndPay = (
    checkIn: string,
    checkOut: string,
    guests: { adults: number; children: number; infants: number },
    guestsLabel: string,
    breakdown?: BookingPriceBreakdown | null,
  ) => {
    if (!listingId || !resolvedEntity) {
      setErrorMessage('Booking details missing. Please go back and try again.');
      return;
    }

    const totalLabel = formatPriceBreakdownTotal(
      breakdown?.totalAmount,
      breakdown?.currency ?? 'INR',
    );
    const meta = { checkIn, checkOut, guestsLabel, totalLabel };

    holdBookingMut(
      {
        listingId: resolvedEntity.listingId || listingId,
        entityType: resolvedEntity.entityType,
        entityId: resolvedEntity.entityId,
        checkIn,
        checkOut: isActivity ? undefined : checkOut,
        adults: Math.max(1, guests.adults),
        children: guests.children || undefined,
        infants: guests.infants || undefined,
        unitsBooked: resolvedEntity.unitsBooked ?? 1,
        mealPlanId: resolvedEntity.mealPlanId,
        activitySlotId: resolvedEntity.activitySlotId,
        guests: [
          {
            fullName: 'Guest',
            age: 30,
            isPrimary: true,
          },
        ],
      },
      {
        onSuccess: (holdRes) => {
          const bookingId = holdRes.bookingId ?? holdRes.booking?.id;
          if (!holdRes.success || !bookingId) {
            setErrorMessage('Failed to hold booking.');
            return;
          }
          const paidLabel = formatPriceBreakdownTotal(
            holdRes.priceBreakdown?.totalAmount ?? breakdown?.totalAmount,
            holdRes.priceBreakdown?.currency ?? breakdown?.currency,
          );
          const nextMeta = { ...meta, totalLabel: paidLabel };

          initiatePaymentMut(
            { bookingId },
            {
              onSuccess: (payRes) => {
                const d = payRes?.data;
                if (!payRes?.success || !d?.order_id || !d?.key_id) {
                  setErrorMessage(payRes?.message ?? 'Failed to initiate payment.');
                  return;
                }
                openPayment(bookingId, d, nextMeta);
              },
              onError: (err) => setErrorMessage(getErrorMessage(err)),
            },
          );
        },
        onError: (err) => {
          const status = (err as { status?: number })?.status;
          if (status === 409) {
            setErrorMessage('Dates are no longer available. Please pick different dates.');
            return;
          }
          setErrorMessage(getErrorMessage(err));
        },
      },
    );
  };

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
    if (!resolvedEntity) {
      setErrorMessage('Could not resolve booking entity. Please go back and try again.');
      return;
    }

    setErrorMessage(null);
    const guestsLabel = [
      `${guests.adults} adult${guests.adults === 1 ? '' : 's'}`,
      guests.children ? `${guests.children} child${guests.children === 1 ? '' : 'ren'}` : null,
      guests.infants ? `${guests.infants} infant${guests.infants === 1 ? '' : 's'}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    // Packages (direct): skip check-availability → hold → pay
    if (isPackageListing || !supportsCheckAvailability(resolvedEntity.entityType)) {
      startHoldAndPay(checkIn, checkOut, guests, guestsLabel, pricePreview);
      return;
    }

    checkAvailabilityMut(
      {
        entityType: resolvedEntity.entityType as Exclude<AvailabilityEntityType, 'package'>,
        entityId: resolvedEntity.entityId,
        checkIn,
        checkOut: isActivity ? undefined : checkOut,
        adults: Math.max(1, guests.adults),
        infants: guests.infants || undefined,
        unitsBooked: resolvedEntity.unitsBooked ?? 1,
        mealPlanId: resolvedEntity.mealPlanId,
      },
      {
        onSuccess: (res) => {
          if (!res.available) {
            const dates = res.unavailableDates?.join(', ') ?? 'selected dates';
            setErrorMessage(`Not available for ${dates}. Please choose different dates.`);
            setPricePreview(null);
            return;
          }
          setPricePreview(res.priceBreakdown ?? null);
          startHoldAndPay(checkIn, checkOut, guests, guestsLabel, res.priceBreakdown);
        },
        onError: (err) => setErrorMessage(getErrorMessage(err)),
      },
    );
  };

  const isSubmitting = isChecking || isHoldingBooking || isInitiatingPayment;
  const pricePreviewLabel = pricePreview?.totalAmount != null
    ? formatPriceBreakdownTotal(pricePreview.totalAmount, pricePreview.currency)
    : null;

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
                      lastBookingMeta
                        ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}`
                        : undefined,
                    guestsLabel: lastBookingMeta?.guestsLabel,
                    totalLabel: lastBookingMeta?.totalLabel,
                  });
                  return;
                }
                setPaymentResult({
                  status: 'failed',
                  bookingId: paymentOrder?.booking_id,
                  title,
                  datesLabel:
                    lastBookingMeta
                      ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}`
                      : undefined,
                  guestsLabel: lastBookingMeta?.guestsLabel,
                  totalLabel: lastBookingMeta?.totalLabel,
                  errorMessage: res?.message ?? 'Payment verification failed.',
                });
              },
              onError: (err) => {
                setPaymentResult({
                  status: 'failed',
                  bookingId: paymentOrder?.booking_id,
                  title,
                  datesLabel:
                    lastBookingMeta
                      ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}`
                      : undefined,
                  guestsLabel: lastBookingMeta?.guestsLabel,
                  totalLabel: lastBookingMeta?.totalLabel,
                  errorMessage: getErrorMessage(err),
                });
              },
            },
          );
        }}
      />

      <MobileBookingReviewScreen
        imageUri={carouselImage}
        listingType={listingTypeParam}
        propertyTitle={title}
        fixedCheckIn={fixedCheckIn}
        fixedCheckOut={fixedCheckOut}
        disabledDates={disabledDates}
        availabilityLoading={availabilityLoading}
        pricePreviewLabel={pricePreviewLabel}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </View>
  );
}
