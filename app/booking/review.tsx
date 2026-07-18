import { getStoredAuthToken } from '@/src/api/client';
import { PaymentResultModal } from '@/src/components/PaymentResultModal';
import { RazorpayCheckoutModal } from '@/src/components/RazorpayCheckoutModal';
import { useCheckAvailability, useEntityAvailability } from '@/src/hooks/useEntityAvailability';
import { useActivityDetail, useGlampingDetail } from '@/src/hooks/useCategoryListing';
import { useHotelDetail } from '@/src/hooks/useHotelDetail';
import { usePackageDetailData } from '@/src/hooks/usePackageUser';
import { useConfirmBookingPayment } from '@/src/hooks/useConfirmBookingPayment';
import { MobileBookingReviewScreen } from '@/src/screens/MobileBookingReviewScreen';
import { formatPriceBreakdownTotal } from '@/src/utils/availabilityCalendar';
import { friendlyPaymentError, isUuid, toDateOnly } from '@/src/utils/bookingPayment';
import { runHoldAndPay } from '@/src/utils/runHoldAndPay';
import {
  mapActivityDetailToBookingEntity,
  mapGlampingDetailToBookingEntity,
  mapHotelDetailToBookingEntity,
  supportsAvailabilityCalendar,
  supportsCheckAvailability,
} from '@/src/utils/mapBookingEntity';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useResponsive } from '@/components/ui/useResponsive';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { colors } from '@/constants/DesignTokens';

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
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;

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
    adults?: string;
    children?: string;
    infants?: string;
    roomName?: string;
  }>();

  const listingId = paramStr(params.listingId);
  const imageUriParam = paramStr(params.imageUri);
  const listingTypeParam = (paramStr(params.listingType) ?? 'hotel') as ListingKind;

  // Desktop hotels use /booking/confirm (Figma) — never the mobile review sheet.
  useEffect(() => {
    if (!isDesktopWeb || !listingId) return;
    if (listingTypeParam !== 'hotel') return;
    router.replace({
      pathname: '/booking/confirm',
      params: {
        listingId,
        listingType: 'hotel',
        imageUri: imageUriParam ?? '',
        title: paramStr(params.title) ?? '',
        roomName: paramStr(params.roomName) ?? '',
        checkIn: paramStr(params.checkIn) ?? '',
        checkOut: paramStr(params.checkOut) ?? '',
        entityType: paramStr(params.entityType) ?? 'room_type',
        entityId: paramStr(params.entityId) ?? '',
        mealPlanId: paramStr(params.mealPlanId) ?? '',
        adults: paramStr(params.adults) ?? '2',
        children: paramStr(params.children) ?? '0',
        infants: paramStr(params.infants) ?? '0',
      },
    });
  }, [
    isDesktopWeb,
    listingId,
    listingTypeParam,
    imageUriParam,
    params.title,
    params.roomName,
    params.checkIn,
    params.checkOut,
    params.entityType,
    params.entityId,
    params.mealPlanId,
    params.adults,
    params.children,
    params.infants,
  ]);

  if (isDesktopWeb && listingTypeParam === 'hotel') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent.main} />
      </View>
    );
  }

  return <BookingReviewMobileContent params={params} />;
}

function BookingReviewMobileContent({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
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
  const paymentInFlight = useRef(false);

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
  const { mutate: confirmBookingMut } = useConfirmBookingPayment();
  const [isHoldingAndPaying, setIsHoldingAndPaying] = useState(false);

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
    if (paymentInFlight.current) return;

    const checkInDate = toDateOnly(checkIn);
    const checkOutDate = toDateOnly(checkOut) ?? checkInDate;
    if (!checkInDate) {
      setErrorMessage('Please select valid check-in and check-out dates.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inDate = new Date(`${checkInDate}T12:00:00`);
    if (inDate < today) {
      setErrorMessage('Please select future check-in dates.');
      return;
    }

    const totalLabel = formatPriceBreakdownTotal(
      breakdown?.totalAmount,
      breakdown?.currency ?? 'INR',
    );
    const meta = { checkIn: checkInDate, checkOut: checkOutDate ?? checkInDate, guestsLabel, totalLabel };

    paymentInFlight.current = true;
    setIsHoldingAndPaying(true);

    void (async () => {
      try {
        const { bookingId, hold, payment, payableTotal } = await runHoldAndPay({
          listingId: resolvedEntity.listingId || listingId,
          entityType: resolvedEntity.entityType,
          entityId: resolvedEntity.entityId,
          checkIn: checkInDate,
          checkOut: isActivity ? undefined : checkOutDate,
          guests: {
            adults: Math.max(1, guests.adults),
            children: guests.children,
            infants: guests.infants,
          },
          unitsBooked: resolvedEntity.unitsBooked ?? 1,
          mealPlanId: resolvedEntity.mealPlanId,
          activitySlotId: resolvedEntity.activitySlotId,
          pricePreview: breakdown,
        });

        const paidLabel = formatPriceBreakdownTotal(
          payableTotal,
          hold.priceBreakdown?.currency ?? breakdown?.currency,
        );
        openPayment(bookingId, payment.data!, { ...meta, totalLabel: paidLabel });
      } catch (err) {
        const status =
          (err as { statusCode?: number; status?: number })?.statusCode ??
          (err as { status?: number })?.status;
        if (status === 409) {
          setErrorMessage('Dates are no longer available. Please pick different dates.');
        } else {
          setErrorMessage(friendlyPaymentError(getErrorMessage(err)));
        }
      } finally {
        paymentInFlight.current = false;
        setIsHoldingAndPaying(false);
      }
    })();
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
        checkIn: toDateOnly(checkIn) ?? checkIn,
        checkOut: isActivity ? undefined : toDateOnly(checkOut) ?? checkOut,
        adults: Math.max(1, guests.adults),
        infants: guests.infants || undefined,
        unitsBooked: resolvedEntity.unitsBooked ?? 1,
        mealPlanId:
          resolvedEntity.mealPlanId && isUuid(resolvedEntity.mealPlanId)
            ? resolvedEntity.mealPlanId
            : undefined,
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
        onError: (err) => setErrorMessage(friendlyPaymentError(getErrorMessage(err))),
      },
    );
  };

  const isSubmitting = isChecking || isHoldingAndPaying;
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
          const bookingId = paymentOrder?.booking_id;
          if (!bookingId) {
            setPaymentVisible(false);
            setPaymentResult({
              status: 'failed',
              title,
              errorMessage: 'Missing booking id after payment.',
            });
            return;
          }

          confirmBookingMut(
            { bookingId },
            {
              onSuccess: () => {
                setPaymentVisible(false);
                setPaymentResult({
                  status: 'success',
                  bookingId,
                  title,
                  datesLabel: lastBookingMeta
                    ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}`
                    : undefined,
                  guestsLabel: lastBookingMeta?.guestsLabel,
                  totalLabel: lastBookingMeta?.totalLabel,
                });
              },
              onError: (err) => {
                const msg = getErrorMessage(err);
                setPaymentVisible(false);
                if (
                  msg.toLowerCase().includes('cancelled') ||
                  msg.toLowerCase().includes('failed') ||
                  msg.toLowerCase().includes('expired')
                ) {
                  setPaymentResult({
                    status: 'failed',
                    bookingId,
                    title,
                    datesLabel: lastBookingMeta
                      ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}`
                      : undefined,
                    guestsLabel: lastBookingMeta?.guestsLabel,
                    totalLabel: lastBookingMeta?.totalLabel,
                    errorMessage: msg,
                  });
                  return;
                }
                // Webhook may still be processing — show success with booking id.
                setPaymentResult({
                  status: 'success',
                  bookingId,
                  title,
                  datesLabel: lastBookingMeta
                    ? `${lastBookingMeta.checkIn} to ${lastBookingMeta.checkOut}`
                    : undefined,
                  guestsLabel: lastBookingMeta?.guestsLabel,
                  totalLabel: lastBookingMeta?.totalLabel,
                });
              },
            },
          );
        }}
      />

      <View
        style={{
          flex: 1,
          maxWidth: Platform.OS === 'web' ? 480 : undefined,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <MobileBookingReviewScreen
          imageUri={carouselImage}
          listingType={listingTypeParam}
          propertyTitle={title}
          fixedCheckIn={fixedCheckIn}
          fixedCheckOut={fixedCheckOut}
          disabledDates={disabledDates}
          availabilityLoading={availabilityLoading}
          pricePreviewLabel={pricePreviewLabel}
          initialAdults={Number(paramStr(params.adults)) || undefined}
          initialChildren={Number(paramStr(params.children)) || undefined}
          initialInfants={Number(paramStr(params.infants)) || undefined}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </View>
    </View>
  );
}
