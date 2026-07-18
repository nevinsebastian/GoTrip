import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { colors, typography } from '@/constants/DesignTokens';
import { RazorpayCheckoutModal } from '@/src/components/RazorpayCheckoutModal';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { CANCELLATION_TEXT, FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import { useCheckAvailability } from '@/src/hooks/useEntityAvailability';
import { useHotelDetail } from '@/src/hooks/useHotelDetail';
import { useConfirmBookingPayment } from '@/src/hooks/useConfirmBookingPayment';
import { useIsAuthenticated } from '@/src/hooks/useIsAuthenticated';
import { DesktopBookingPriceSummaryScreen } from '@/src/screens/DesktopBookingPriceSummaryScreen';
import { DesktopBookingResultScreen } from '@/src/screens/DesktopBookingResultScreen';
import { DesktopConfirmDatesGuestScreen } from '@/src/screens/DesktopConfirmDatesGuestScreen';
import type { AvailabilityEntityType, BookingPriceBreakdown } from '@/src/api/types';
import { formatPriceBreakdownTotal } from '@/src/utils/availabilityCalendar';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { friendlyPaymentError, isUuid, toDateOnly } from '@/src/utils/bookingPayment';
import { runHoldAndPay } from '@/src/utils/runHoldAndPay';
import {
  formatCheckTime,
  formatHotelPricePerNight,
  getBookingEntity,
  mapHotelRoomsForDisplay,
} from '@/src/utils/hotelDetailHelpers';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

function paramStr(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function paramNum(v: string | string[] | undefined, fallback: number): number {
  const raw = paramStr(v);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function formatGuestsLabel(adults: number, children: number, infants: number): string {
  return [
    `${adults} adult${adults === 1 ? '' : 's'}`,
    children ? `${children} child${children === 1 ? '' : 'ren'}` : null,
    infants ? `${infants} infant${infants === 1 ? '' : 's'}` : null,
  ]
    .filter(Boolean)
    .join(', ');
}

function formatDatesLabel(checkIn: string, checkOut: string): string {
  const a = new Date(`${checkIn}T12:00:00`);
  const b = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return `${checkIn} to ${checkOut}`;
  const monthYear = b.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  return `${a.getDate()}-${b.getDate()} ${monthYear}`;
}

const DEFAULT_AMENITIES: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  { icon: 'water-outline', label: 'Private pool' },
  { icon: 'car-outline', label: 'Free Parking' },
  { icon: 'time-outline', label: '24/7 Room service' },
];

type Step = 'dates' | 'summary' | 'result';

type SelectionState = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
};

type PaymentOrder = {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  booking_id: string;
};

type ResultState = {
  status: 'success' | 'failed';
  bookingId?: string;
  datesLabel?: string;
  guestsLabel?: string;
  totalLabel?: string;
  errorMessage?: string;
};

export default function BookingConfirmRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const { searchParams } = useHomeSearch();
  const { data: isLoggedIn = false } = useIsAuthenticated();

  const params = useLocalSearchParams<{
    listingId?: string;
    listingType?: string;
    entityType?: string;
    entityId?: string;
    mealPlanId?: string;
    imageUri?: string;
    title?: string;
    roomName?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    infants?: string;
  }>();

  const listingId = paramStr(params.listingId);
  const entityIdParam = paramStr(params.entityId);
  const mealPlanId = paramStr(params.mealPlanId);
  const roomNameParam = paramStr(params.roomName);
  const imageUri = paramStr(params.imageUri) ?? '';
  const titleParam = paramStr(params.title);

  const initialCheckIn = paramStr(params.checkIn) ?? searchParams?.checkIn ?? null;
  const initialCheckOut = paramStr(params.checkOut) ?? searchParams?.checkOut ?? null;
  const initialAdults = paramNum(params.adults, searchParams?.guests.adults ?? 2);
  const initialChildren = paramNum(params.children, searchParams?.guests.children ?? 0);
  const initialInfants = paramNum(params.infants, searchParams?.guests.infants ?? 0);

  const { data, isLoading, isError } = useHotelDetail(listingId, Boolean(listingId));
  const hotel = data?.hotel;
  const cancellationPolicyText = data?.cancellationPolicyText;

  const rooms = useMemo(() => mapHotelRoomsForDisplay(hotel ?? { id: '', title: '' }), [hotel]);
  const selectedRoom = useMemo(() => {
    if (!rooms.length) return undefined;
    return rooms.find((r) => r.id === entityIdParam) ?? rooms[0];
  }, [rooms, entityIdParam]);

  const bookingEntity = useMemo(() => {
    if (!hotel) return null;
    return getBookingEntity(hotel, entityIdParam ?? selectedRoom?.id);
  }, [hotel, entityIdParam, selectedRoom?.id]);

  const [activeTab, setActiveTab] = useState<HomeCategoryTab>('hotels');
  const [step, setStep] = useState<Step>('dates');
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<BookingPriceBreakdown | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  const { mutate: checkAvailabilityMut, isPending: isChecking } = useCheckAvailability();
  const { mutate: confirmBookingMut } = useConfirmBookingPayment();
  const [isHoldingAndPaying, setIsHoldingAndPaying] = useState(false);

  // Mobile / non-desktop: keep existing review flow
  useEffect(() => {
    if (isDesktopWeb || !listingId) return;
    router.replace({
      pathname: '/booking/review',
      params: {
        listingId,
        listingType: paramStr(params.listingType) ?? 'hotel',
        imageUri,
        title: titleParam ?? '',
        checkIn: initialCheckIn ?? '',
        checkOut: initialCheckOut ?? '',
        entityType: paramStr(params.entityType) ?? 'room_type',
        entityId: entityIdParam ?? '',
        mealPlanId: mealPlanId ?? '',
        adults: String(initialAdults),
        children: String(initialChildren),
        infants: String(initialInfants),
      },
    });
  }, [
    isDesktopWeb,
    listingId,
    imageUri,
    titleParam,
    initialCheckIn,
    initialCheckOut,
    entityIdParam,
    mealPlanId,
    initialAdults,
    initialChildren,
    initialInfants,
    params.listingType,
    params.entityType,
  ]);

  const navHandlers = useMemo(
    () => ({
      onTabChange: (tab: HomeCategoryTab) => {
        setActiveTab(tab);
        if (tab === 'hotels') {
          router.push('/resorts');
          return;
        }
        if (tab === 'packages') {
          router.push('/packages');
          return;
        }
        router.push('/');
      },
      onLoginPress: () => router.push('/login'),
      onProfilePress: () => router.push('/account-settings'),
      onMenuPress: () => router.push('/(tabs)/four'),
    }),
    [],
  );

  const openPayment = useCallback(
    (
      bookingId: string,
      orderData: { order_id: string; amount: number; currency: string; key_id: string },
    ) => {
      setPaymentOrder({
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: orderData.currency ?? 'INR',
        key_id: orderData.key_id,
        booking_id: bookingId,
      });
      setPaymentVisible(true);
    },
    [],
  );

  const startHoldAndPay = useCallback(
    (sel: SelectionState, breakdown: BookingPriceBreakdown | null) => {
      if (!listingId || !bookingEntity?.entityId || !bookingEntity.entityType) {
        setErrorMessage('Booking details missing. Please go back and try again.');
        return;
      }

      const checkIn = toDateOnly(sel.checkIn);
      const checkOut = toDateOnly(sel.checkOut);
      if (!checkIn || !checkOut) {
        setErrorMessage('Please select valid check-in and check-out dates.');
        return;
      }

      const guestsLabel = formatGuestsLabel(sel.adults, sel.children, sel.infants);
      const datesLabel = formatDatesLabel(checkIn, checkOut);
      const totalLabel = formatPriceBreakdownTotal(
        breakdown?.totalAmount,
        breakdown?.currency ?? 'INR',
      );

      setIsHoldingAndPaying(true);
      void (async () => {
        try {
          const { bookingId, hold, payment, payableTotal } = await runHoldAndPay({
            listingId,
            entityType: bookingEntity.entityType,
            entityId: bookingEntity.entityId,
            checkIn,
            checkOut,
            guests: {
              adults: Math.max(1, sel.adults),
              children: sel.children,
              infants: sel.infants,
            },
            unitsBooked: 1,
            mealPlanId,
            pricePreview: breakdown,
          });

          const paidLabel = formatPriceBreakdownTotal(
            payableTotal,
            hold.priceBreakdown?.currency ?? breakdown?.currency,
          );
          if (hold.priceBreakdown) setPriceBreakdown(hold.priceBreakdown);

          setResult({
            status: 'failed',
            bookingId,
            datesLabel,
            guestsLabel,
            totalLabel: paidLabel,
          });
          openPayment(bookingId, payment.data!);
        } catch (err) {
          const status =
            (err as { statusCode?: number; status?: number })?.statusCode ??
            (err as { status?: number })?.status;
          const msg =
            status === 409
              ? 'Dates are no longer available. Please pick different dates.'
              : friendlyPaymentError(getErrorMessage(err));
          setErrorMessage(msg);
          setResult({
            status: 'failed',
            datesLabel,
            guestsLabel,
            totalLabel,
            errorMessage: msg,
          });
          setStep('result');
        } finally {
          setIsHoldingAndPaying(false);
        }
      })();
    },
    [listingId, bookingEntity, mealPlanId, openPayment],
  );

  const handleConfirmDates = useCallback(
    (payload: SelectionState) => {
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      if (!bookingEntity?.entityId || !bookingEntity.entityType) {
        setErrorMessage('Could not resolve booking entity. Please go back and try again.');
        return;
      }

      setErrorMessage(null);
      setSelection(payload);

      checkAvailabilityMut(
        {
          entityType: bookingEntity.entityType as Exclude<AvailabilityEntityType, 'package'>,
          entityId: bookingEntity.entityId,
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          adults: Math.max(1, payload.adults),
          children: payload.children || undefined,
          infants: payload.infants || undefined,
          unitsBooked: 1,
          mealPlanId: mealPlanId || undefined,
        },
        {
          onSuccess: (res) => {
            if (!res.available) {
              const dates = res.unavailableDates?.join(', ') ?? 'selected dates';
              setErrorMessage(`Not available for ${dates}. Please choose different dates.`);
              setPriceBreakdown(null);
              return;
            }
            setPriceBreakdown(res.priceBreakdown ?? null);
            setStep('summary');
          },
          onError: (err) => setErrorMessage(getErrorMessage(err)),
        },
      );
    },
    [isLoggedIn, bookingEntity, mealPlanId, checkAvailabilityMut],
  );

  const handleProceedToPay = useCallback(() => {
    if (!selection) {
      setErrorMessage('Please confirm dates and guests first.');
      setStep('dates');
      return;
    }
    setErrorMessage(null);
    startHoldAndPay(selection, priceBreakdown);
  }, [selection, priceBreakdown, startHoldAndPay]);

  const handlePaymentFailed = useCallback(
    (msg: string) => {
      setPaymentVisible(false);
      setResult((prev) => ({
        status: 'failed',
        bookingId: paymentOrder?.booking_id ?? prev?.bookingId,
        datesLabel:
          prev?.datesLabel ??
          (selection ? formatDatesLabel(selection.checkIn, selection.checkOut) : undefined),
        guestsLabel:
          prev?.guestsLabel ??
          (selection
            ? formatGuestsLabel(selection.adults, selection.children, selection.infants)
            : undefined),
        totalLabel:
          prev?.totalLabel ??
          formatPriceBreakdownTotal(priceBreakdown?.totalAmount, priceBreakdown?.currency),
        errorMessage: msg,
      }));
      setStep('result');
    },
    [paymentOrder, selection, priceBreakdown],
  );

  const handlePaymentSuccess = useCallback(
    (_payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const bookingId = paymentOrder?.booking_id;
      if (!bookingId) {
        handlePaymentFailed('Missing booking id after payment.');
        return;
      }

      // Backend confirms via Razorpay webhook — poll booking status.
      confirmBookingMut(
        { bookingId },
        {
          onSuccess: () => {
            setPaymentVisible(false);
            setResult((prev) => ({
              status: 'success',
              bookingId,
              datesLabel: prev?.datesLabel,
              guestsLabel: prev?.guestsLabel,
              totalLabel: prev?.totalLabel,
            }));
            setStep('result');
          },
          onError: (err) => {
            // Payment may still settle via webhook; treat soft timeout as success if we have an id.
            const msg = getErrorMessage(err);
            if (msg.toLowerCase().includes('booking failed') || msg.toLowerCase().includes('cancelled')) {
              handlePaymentFailed(msg);
              return;
            }
            setPaymentVisible(false);
            setResult((prev) => ({
              status: 'success',
              bookingId,
              datesLabel: prev?.datesLabel,
              guestsLabel: prev?.guestsLabel,
              totalLabel: prev?.totalLabel,
            }));
            setStep('result');
          },
        },
      );
    },
    [confirmBookingMut, paymentOrder, handlePaymentFailed],
  );

  if (!isDesktopWeb) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent.main} />
      </View>
    );
  }

  if (!listingId) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorTitle}>Missing listing</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading && !hotel) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent.main} size="large" />
      </View>
    );
  }

  if (isError || !hotel) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorTitle}>Could not load listing</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const roomName = roomNameParam ?? selectedRoom?.name ?? 'Room';
  const guestCount = selectedRoom?.guests ?? 2;
  const guestRoomLabel = `${guestCount} Guest - 1 Room`;
  const description =
    hotel.description?.trim() ||
    'Discover refined comfort in this elegant stay with spacious rooms and curated amenities.';
  const rating = hotel.avgRating != null ? String(hotel.avgRating) : FIGMA_PROPERTY.rating;
  const customersLabel =
    hotel.reviewCount != null && hotel.reviewCount > 0
      ? `${hotel.reviewCount}+ customers`
      : FIGMA_PROPERTY.customersLabel;
  const priceAmount = selectedRoom?.basePricePerNight ?? null;
  const priceLabel = formatHotelPricePerNight(priceAmount);
  const rawCheckIn = formatCheckTime(hotel.hotelProperty?.checkInTime);
  const rawCheckOut = formatCheckTime(hotel.hotelProperty?.checkOutTime);
  const checkInTimeLabel = rawCheckIn !== '—' ? `${rawCheckIn} onwards` : '2:00 PM – 11:00 PM';
  const checkOutTimeLabel = rawCheckOut !== '—' ? `Until ${rawCheckOut}` : '12:00 AM – 11:00 AM';
  const cancellationText = cancellationPolicyText?.trim() || CANCELLATION_TEXT;
  const propertyTitle = titleParam ?? hotel.title;
  const coverImage =
    imageUri ||
    hotel.images?.find((i) => i.isCover)?.url ||
    hotel.images?.[0]?.url ||
    null;
  const imageSource = coverImage ? { uri: coverImage } : RESORT_PLACEHOLDER_IMAGE;

  const amenityLabels =
    (selectedRoom?.amenities?.length ? selectedRoom.amenities : hotel.highlights) ?? [];
  const amenities =
    amenityLabels.length >= 3
      ? amenityLabels.slice(0, 3).map((label, i) => ({
          icon: DEFAULT_AMENITIES[i]?.icon ?? ('checkmark-circle-outline' as const),
          label,
        }))
      : DEFAULT_AMENITIES;

  const confirming = isChecking;
  const paying = isHoldingAndPaying;

  return (
    <View style={styles.root}>
      <RazorpayCheckoutModal
        visible={paymentVisible && Boolean(paymentOrder)}
        onClose={() => {
          setPaymentVisible(false);
          // Web Razorpay dismisses via onClose only (no onError).
          setResult((prev) => {
            if (prev?.status === 'success') return prev;
            return {
              status: 'failed',
              bookingId: paymentOrder?.booking_id ?? prev?.bookingId,
              datesLabel:
                prev?.datesLabel ??
                (selection ? formatDatesLabel(selection.checkIn, selection.checkOut) : undefined),
              guestsLabel:
                prev?.guestsLabel ??
                (selection
                  ? formatGuestsLabel(selection.adults, selection.children, selection.infants)
                  : undefined),
              totalLabel:
                prev?.totalLabel ??
                formatPriceBreakdownTotal(priceBreakdown?.totalAmount, priceBreakdown?.currency),
              errorMessage: prev?.errorMessage ?? 'Payment was cancelled.',
            };
          });
          setStep('result');
        }}
        keyId={paymentOrder?.key_id ?? ''}
        orderId={paymentOrder?.order_id ?? ''}
        amount={paymentOrder?.amount ?? 0}
        currency={paymentOrder?.currency ?? 'INR'}
        name="GoTrip"
        description={propertyTitle}
        onError={handlePaymentFailed}
        onSuccess={handlePaymentSuccess}
      />

      {step === 'result' && result ? (
        <DesktopBookingResultScreen
          status={result.status}
          propertyTitle={propertyTitle}
          rating={rating}
          customersLabel={customersLabel}
          imageSource={imageSource}
          bookingId={result.bookingId}
          datesLabel={result.datesLabel}
          guestsLabel={result.guestsLabel}
          totalPriceLabel={result.totalLabel}
          errorMessage={result.errorMessage}
          activeTab={activeTab}
          isLoggedIn={isLoggedIn}
          {...navHandlers}
          onHelp={() => router.push('/')}
          onRetry={
            result.status === 'failed'
              ? () => {
                  setErrorMessage(null);
                  if (paymentOrder?.order_id) {
                    setPaymentVisible(true);
                    return;
                  }
                  if (selection) {
                    setStep('summary');
                    startHoldAndPay(selection, priceBreakdown);
                  } else {
                    setStep('dates');
                  }
                }
              : undefined
          }
        />
      ) : step === 'summary' && selection ? (
        <DesktopBookingPriceSummaryScreen
          propertyTitle={propertyTitle}
          roomName={roomName}
          guestRoomLabel={guestRoomLabel}
          description={description}
          imageSource={imageSource}
          checkIn={selection.checkIn}
          checkOut={selection.checkOut}
          adults={selection.adults}
          children={selection.children}
          infants={selection.infants}
          priceBreakdown={priceBreakdown}
          cancellationText={cancellationText}
          paying={paying}
          errorMessage={errorMessage}
          activeTab={activeTab}
          isLoggedIn={isLoggedIn}
          {...navHandlers}
          onChangeSelection={() => {
            setErrorMessage(null);
            setStep('dates');
          }}
          onProceedToPay={handleProceedToPay}
        />
      ) : (
        <DesktopConfirmDatesGuestScreen
          roomName={roomName}
          guestRoomLabel={guestRoomLabel}
          description={description}
          rating={rating}
          customersLabel={customersLabel}
          amenities={amenities}
          priceLabel={priceLabel}
          cancellationText={cancellationText}
          checkInTimeLabel={checkInTimeLabel}
          checkOutTimeLabel={checkOutTimeLabel}
          entityType={bookingEntity?.entityType}
          entityId={bookingEntity?.entityId ?? undefined}
          initialCheckIn={selection?.checkIn ?? initialCheckIn}
          initialCheckOut={selection?.checkOut ?? initialCheckOut}
          initialAdults={selection?.adults ?? initialAdults}
          initialChildren={selection?.children ?? initialChildren}
          initialInfants={selection?.infants ?? initialInfants}
          confirming={confirming}
          errorMessage={errorMessage}
          activeTab={activeTab}
          isLoggedIn={isLoggedIn}
          {...navHandlers}
          onBack={() => router.back()}
          onConfirm={handleConfirmDates}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.white },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.surface.white,
    padding: 24,
  },
  errorTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  link: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.accent.main,
    textDecorationLine: 'underline',
  },
});
