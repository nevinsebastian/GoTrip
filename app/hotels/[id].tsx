import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { checkHotelAvailability } from '@/src/api/booking.service';
import { fetchAvailability } from '@/src/api/hotel.service';
import { DesktopConfirmDatesModal } from '@/src/components/desktop/DesktopConfirmDatesModal';
import { DesktopConfirmGuestsModal } from '@/src/components/desktop/DesktopConfirmGuestsModal';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { useHotelDetail } from '@/src/hooks/useHotelDetail';
import { useHotelSearch } from '@/src/hooks/useHotelSearch';
import { useIsAuthenticated } from '@/src/hooks/useIsAuthenticated';
import { DesktopHotelDetailScreen } from '@/src/screens/DesktopHotelDetailScreen';
import { MobileResortDetailsScreen } from '@/src/screens/MobileResortDetails';
import {
  formatCheckTime,
  formatInr,
  getBookingEntity,
  getHotelAddress,
  getHotelCarouselImages,
  getHotelLocationLabel,
  getMinRoomPrice,
  getPriceFromLabel,
  mapHotelRoomsForDisplay,
  mapReviewToDisplay,
  normalizeHighlights,
  normalizePropertyRules,
} from '@/src/utils/hotelDetailHelpers';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function paramString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function paramNumber(value: string | string[] | undefined, fallback: number): number {
  const raw = paramString(value);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function monthRangeAround(dateIso: string) {
  const d = new Date(dateIso);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 2, 0));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export default function HotelDetailScreen() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  const params = useLocalSearchParams<{
    id?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
  }>();
  const hotelId = paramString(params.id);
  const { searchParams } = useHomeSearch();
  const { data: isLoggedIn = false, refetch: refetchAuth } = useIsAuthenticated();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useHotelDetail(hotelId);

  useFocusEffect(
    useCallback(() => {
      refetchAuth();
      if (hotelId) refetch();
    }, [hotelId, refetch, refetchAuth]),
  );

  const hotel = data?.hotel;
  const roomTypes = useMemo(() => mapHotelRoomsForDisplay(hotel ?? { id: '', title: '' }), [hotel]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | undefined>();
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<string | undefined>();
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateModalStep, setDateModalStep] = useState<'dates' | 'guests' | 'price'>('dates');
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    nights?: number;
    subtotal?: number;
    taxAmount?: number;
    totalAmount?: number;
  } | null>(null);
  const [disabledDates, setDisabledDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkIn = paramString(params.checkIn) ?? searchParams?.checkIn ?? null;
    const checkOut = paramString(params.checkOut) ?? searchParams?.checkOut ?? null;
    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
    setAdultsCount(paramNumber(params.adults, searchParams?.guests?.adults ?? 2));
  }, [params.checkIn, params.checkOut, params.adults, searchParams]);

  useEffect(() => {
    if (!hotel || roomTypes.length === 0) return;
    if (!selectedRoomTypeId) {
      setSelectedRoomTypeId(roomTypes[0].id);
      const mealPlans = roomTypes[0].mealPlans;
      if (mealPlans?.length) setSelectedMealPlanId(mealPlans[0].id);
    }
  }, [hotel, roomTypes, selectedRoomTypeId]);

  const selectedRoom = roomTypes.find((r) => r.id === selectedRoomTypeId) ?? roomTypes[0];
  const mealPlans = selectedRoom?.mealPlans ?? [];

  const city = hotel ? getHotelLocationLabel(hotel).split(',')[0]?.trim() : undefined;
  const { listings: relatedListings } = useHotelSearch(
    { q: city, limit: 8 },
    Boolean(city && hotelId),
  );
  const related = relatedListings.filter((l) => l.id !== hotelId).slice(0, 4);

  const carouselImages = hotel
    ? getHotelCarouselImages(hotel.images, null)
    : [];
  const rating = hotel?.avgRating != null ? String(hotel.avgRating) : '—';
  const reviewCountLabel =
    hotel?.reviewCount != null
      ? `${hotel.reviewCount} review${hotel.reviewCount === 1 ? '' : 's'}`
      : undefined;
  const displayPrice = hotel ? getPriceFromLabel(hotel) : '—';
  const minNightPrice = hotel ? getMinRoomPrice(hotel) : null;
  const reviews = (data?.reviews ?? []).map(mapReviewToDisplay);

  const loadAvailabilityCalendar = useCallback(async () => {
    if (!hotel || !selectedRoomTypeId) return;
    const anchor = checkInDate ?? new Date().toISOString().slice(0, 10);
    const { startDate, endDate } = monthRangeAround(anchor);
    const { entityType, entityId } = getBookingEntity(hotel, selectedRoomTypeId);
    if (!entityId) return;
    try {
      const res = await fetchAvailability(entityType, entityId, startDate, endDate);
      const blocked = new Set<string>();
      for (const day of res.availability ?? []) {
        const unavailable = day.is_blocked || (day.available_units ?? 0) <= 0;
        if (unavailable) blocked.add(day.date);
      }
      setDisabledDates(blocked);
    } catch {
      setDisabledDates(new Set());
    }
  }, [hotel, selectedRoomTypeId, checkInDate]);

  useEffect(() => {
    if (dateModalVisible && dateModalStep === 'dates') {
      loadAvailabilityCalendar();
    }
  }, [dateModalVisible, dateModalStep, loadAvailabilityCalendar]);

  const closeDateModal = () => {
    setDateModalVisible(false);
    setDateModalStep('dates');
    setBookingError(null);
    setPriceBreakdown(null);
  };

  const openBookingFlow = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (searchParams?.checkIn && !checkInDate) {
      setCheckInDate(searchParams.checkIn);
      setCheckOutDate(searchParams.checkOut ?? null);
    }
    if (!isDesktopWeb) {
      const entity = hotel ? getBookingEntity(hotel, selectedRoomTypeId) : null;
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: hotelId ?? '',
          listingType: 'hotel',
          imageUri: carouselImages[0] ?? '',
          title: hotel?.title ?? '',
          checkIn: checkInDate ?? '',
          checkOut: checkOutDate ?? '',
          entityType: entity?.entityType ?? 'room_type',
          entityId: entity?.entityId ?? '',
          mealPlanId: selectedMealPlanId ?? '',
        },
      });
      return;
    }
    setDateModalStep('dates');
    setDateModalVisible(true);
  };

  const continueToCheckout = () => {
    if (!hotel || !hotelId || !checkInDate || !checkOutDate) return;
    const { entityType, entityId } = getBookingEntity(hotel, selectedRoomTypeId);
    if (!entityId) {
      setBookingError('Please select a room type.');
      return;
    }
    closeDateModal();
    router.push({
      pathname: '/booking/review',
      params: {
        listingId: hotelId,
        listingType: 'hotel',
        imageUri: carouselImages[0] ?? '',
        title: hotel.title,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        entityType,
        entityId,
        mealPlanId: selectedMealPlanId ?? '',
        adults: String(adultsCount),
      },
    });
  };

  const handleCheckAvailability = async () => {
    if (!hotel || !hotelId) return;
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setBookingError('Please select check-in and check-out dates.');
      setDateModalStep('dates');
      return;
    }
    const { entityType, entityId } = getBookingEntity(hotel, selectedRoomTypeId);
    if (!entityId) {
      setBookingError('Please select a room type.');
      return;
    }

    setCheckingAvailability(true);
    setBookingError(null);
    try {
      const res = await checkHotelAvailability({
        entityType: entityType as 'room_type' | 'full_property',
        entityId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: Math.max(1, adultsCount),
        infants: infantsCount,
        unitsBooked: 1,
        mealPlanId: selectedMealPlanId,
      });

      if (!res.available) {
        const dates = res.unavailableDates?.join(', ') ?? 'selected dates';
        setBookingError(`Not available for ${dates}. Try different dates.`);
        setPriceBreakdown(null);
        return;
      }

      setPriceBreakdown(res.priceBreakdown ?? null);
      setDateModalStep('price');
    } catch (err) {
      setBookingError(getErrorMessage(err));
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (!hotelId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text variant="bodySemibold">Invalid hotel link</Text>
        <Pressable onPress={() => router.back()} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="caption" style={styles.loadingText}>
          Loading hotel…
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !hotel) {
    const is404 = (error as { status?: number })?.status === 404;
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="bed-outline" size={40} color={colors.text.caption} />
        <Text variant="bodySemibold" style={styles.errorTitle}>
          {is404 ? 'Hotel not found' : 'Could not load hotel'}
        </Text>
        <Text variant="caption" style={styles.errorBody}>
          {is404 ? 'This listing may have been removed.' : getErrorMessage(error)}
        </Text>
        <Pressable onPress={() => (is404 ? router.replace('/resorts') : refetch())} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>{is404 ? 'Browse hotels' : 'Retry'}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const propertyRules = normalizePropertyRules(hotel.hotelProperty?.propertyRules);
  const highlights = normalizeHighlights(hotel.highlights);
  const checkInTime = formatCheckTime(hotel.hotelProperty?.checkInTime);
  const checkOutTime = formatCheckTime(hotel.hotelProperty?.checkOutTime);

  const sharedDetailProps = {
    title: hotel.title,
    locationLabel: getHotelLocationLabel(hotel),
    address: getHotelAddress(hotel),
    rating,
    reviewCountLabel,
    starRating: hotel.hotelProperty?.starRating ?? undefined,
    description: hotel.description ?? undefined,
    propertyRules,
    highlights,
    checkInTime,
    checkOutTime,
    cancellationText: data?.cancellationPolicyText,
    carouselImages,
    rooms: roomTypes,
    reviews,
    relatedListings: related,
    onBookNow: openBookingFlow,
    onSelectRoom: (roomTypeId: string) => {
      setSelectedRoomTypeId(roomTypeId);
      const room = roomTypes.find((r) => r.id === roomTypeId);
      if (room?.mealPlans?.length) setSelectedMealPlanId(room.mealPlans[0].id);
    },
    selectedRoomTypeId,
  };

  const totalLabel =
    priceBreakdown?.totalAmount != null
      ? formatInr(priceBreakdown.totalAmount)
      : minNightPrice != null
        ? formatInr(minNightPrice)
        : displayPrice;

  return (
    <View style={styles.container}>
      {!isDesktopWeb ? (
        <MobileResortDetailsScreen {...sharedDetailProps} listingId={hotelId} />
      ) : (
        <DesktopHotelDetailScreen
          {...sharedDetailProps}
          displayPrice={displayPrice}
          isLoggedIn={isLoggedIn}
          onBack={() => router.back()}
          bookingFocus={
            dateModalVisible && (dateModalStep === 'dates' || dateModalStep === 'guests')
              ? {
                  visible: true,
                  sectionTitle: 'Confirm dates and guest details',
                  modalContent:
                    dateModalStep === 'dates' ? (
                      <DesktopConfirmDatesModal
                        checkIn={checkInDate}
                        checkOut={checkOutDate}
                        onCheckInChange={setCheckInDate}
                        onCheckOutChange={setCheckOutDate}
                        onClose={closeDateModal}
                        onSave={() => setDateModalStep('guests')}
                        disabledDates={disabledDates}
                      />
                    ) : (
                      <DesktopConfirmGuestsModal
                        adults={adultsCount}
                        children={childrenCount}
                        infants={infantsCount}
                        onAdultsChange={setAdultsCount}
                        onChildrenChange={setChildrenCount}
                        onInfantsChange={setInfantsCount}
                        onClose={closeDateModal}
                        onBack={() => setDateModalStep('dates')}
                        onSave={() => {
                          setDateModalStep('price');
                          handleCheckAvailability();
                        }}
                      />
                    ),
                }
              : undefined
          }
        />
      )}

      <Modal
        visible={dateModalVisible && isDesktopWeb && dateModalStep === 'price'}
        transparent
        animationType="fade"
        onRequestClose={closeDateModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDateModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text variant="bodySemibold" style={styles.modalTitle}>
                Price details
              </Text>
              <Pressable onPress={closeDateModal} hitSlop={12}>
                <Ionicons name="close" size={22} color={colors.primary} />
              </Pressable>
            </View>

            {mealPlans.length ? (
              <View style={styles.mealPlanBlock}>
                <Text variant="caption" style={styles.mealPlanLabel}>
                  Meal plan
                </Text>
                <View style={styles.mealPlanRow}>
                  {mealPlans.map((plan) => {
                    const active = selectedMealPlanId === plan.id;
                    return (
                      <Pressable
                        key={plan.id}
                        style={[styles.mealPlanChip, active && styles.mealPlanChipActive]}
                        onPress={() => setSelectedMealPlanId(plan.id)}
                      >
                        <Text style={[styles.mealPlanChipText, active && styles.mealPlanChipTextActive]}>
                          {plan.label ?? plan.planCode ?? 'Plan'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <View style={styles.priceRows}>
              <View style={styles.priceRow}>
                <Text variant="caption">
                  {priceBreakdown?.nights ?? '—'} nights
                </Text>
                <Text variant="bodySemibold">
                  {priceBreakdown?.subtotal != null ? formatInr(priceBreakdown.subtotal) : '—'}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text variant="caption">Taxes & fees</Text>
                <Text variant="bodySemibold">
                  {priceBreakdown?.taxAmount != null ? formatInr(priceBreakdown.taxAmount) : '—'}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text variant="bodySemibold">Total</Text>
                <Text variant="bodySemibold">{totalLabel}</Text>
              </View>
            </View>

            {bookingError ? (
              <Text variant="caption" style={styles.errorCaption}>
                {bookingError}
              </Text>
            ) : null}

            <Pressable
              style={styles.primaryBtn}
              onPress={priceBreakdown && !bookingError ? continueToCheckout : handleCheckAvailability}
              disabled={checkingAvailability}
            >
              <Text style={styles.primaryBtnText}>
                {checkingAvailability
                  ? 'Checking…'
                  : priceBreakdown && !bookingError
                    ? 'Continue to book'
                    : 'Check availability'}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['3'],
    padding: spacing['5'],
    backgroundColor: colors.surface.white,
  },
  loadingText: {
    color: colors.text.secondary,
  },
  errorTitle: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  errorBody: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing['2'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['4'],
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  retryBtnText: {
    color: colors.surface.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.27)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.gray['1'] ?? '#fcfcfc',
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    padding: spacing['4'],
    gap: spacing['4'],
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: colors.primary,
  },
  mealPlanBlock: {
    gap: spacing['2'],
  },
  mealPlanLabel: {
    color: colors.text.secondary,
  },
  mealPlanRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
  },
  mealPlanChip: {
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['3'],
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  mealPlanChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229, 77, 46, 0.08)',
  },
  mealPlanChipText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  mealPlanChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  priceRows: {
    gap: spacing['3'],
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorCaption: {
    color: '#d32f2f',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing['3'],
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.surface.white,
    fontWeight: '600',
  },
});
