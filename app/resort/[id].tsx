import { Text } from '@/components/ui';
import {
  borderRadius,
  colors,
  spacing,
} from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStoredAuthToken } from '@/src/api/client';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useListingDetails } from '@/src/hooks/useListingDetails';

const ResortImage = require('@/assets/images/resort.jpg');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AMENITIES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'wifi', label: 'Free WiFi', icon: 'wifi-outline' },
  { id: 'ac', label: 'Air conditioning', icon: 'snow-outline' },
  { id: 'business', label: 'Business services', icon: 'briefcase-outline' },
  { id: 'pet', label: 'Pet friendly', icon: 'paw-outline' },
  { id: 'breakfast', label: 'Breakfast available', icon: 'cafe-outline' },
  { id: 'parking', label: 'Parking available', icon: 'car-outline' },
];

const DESCRIPTION =
  'Elegant two-floor villa with private pool, curated interiors, and calm green views—perfect for a quick luxury escape.';

const HOST_DESCRIPTION =
  'Mr. Ashish Kumar is an experienced host with 5 years of managing multiple luxury resorts in Wayanad.';

export default function ResortDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    price?: string;
    rating?: string;
    latitude?: string;
    longitude?: string;
  }>();
  const listingId = typeof params.id === 'string' ? params.id : undefined;
  const { data: listingRes } = useListingDetails(listingId);
  const listing = listingRes?.data;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateModalStep, setDateModalStep] = useState<'dates' | 'guests' | 'price' | 'login'>(
    'dates',
  );
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const title = listing?.title ?? params.title ?? 'TITANIC Comfort Berlin Mitte';
  const displayPrice =
    listing?.price_start != null ? `₹${Number(listing.price_start).toLocaleString('en-IN')}` : (params.price ?? '₹2,420');
  const rating = params.rating ?? '4.5';

  const locationLabel = (() => {
    const loc = (listing?.location ?? '').trim();
    if (!loc) return '—';
    // Prefer the first segment (e.g. "Varkala" from "Varkala, Kerala")
    return loc.split(',')[0]?.trim() || loc;
  })();

  const lat = listing?.latitude ? parseFloat(String(listing.latitude)) : typeof params.latitude === 'string' ? parseFloat(params.latitude) : 52.509669;
  const lng = listing?.longitude ? parseFloat(String(listing.longitude)) : typeof params.longitude === 'string' ? parseFloat(params.longitude) : 13.376294;

  const getDirectImageUrl = (url?: string | null) => {
    if (!url) return null;
    const u = url.toLowerCase();
    if (!u.startsWith('http')) return null;
    if (u.includes('i.ibb.co/')) return url;
    if (u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.png') || u.endsWith('.webp') || u.endsWith('.gif')) return url;
    return null;
  };

  const carouselImages = (() => {
    const media = listing?.media ?? [];
    const imgs = media
      .filter((m) => m.media_type === 'image')
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((m) => getDirectImageUrl(m.url))
      .filter(Boolean) as string[];
    return imgs.length ? imgs : [];
  })();

  const normalizeAmenity = (label: string) => label.toLowerCase().replace(/\s+/g, ' ').trim();

  // Keep the original icon + label sizing/wording by mapping API values → existing amenity cards.
  const amenityCatalog = AMENITIES.map((a) => ({
    ...a,
    keys: [
      normalizeAmenity(a.label),
      // common backend variants
      a.id === 'wifi' ? 'wifi' : null,
      a.id === 'parking' ? 'parking' : null,
      a.id === 'breakfast' ? 'breakfast' : null,
      a.id === 'ac' ? 'air conditioning' : null,
      a.id === 'pet' ? 'pet friendly' : null,
      a.id === 'business' ? 'business' : null,
    ].filter(Boolean) as string[],
  }));

  const amenitiesFromListing = (listing?.amenities ?? []).filter(Boolean).map(normalizeAmenity);

  const amenitiesToRender =
    amenitiesFromListing.length > 0
      ? amenityCatalog.filter((a) => a.keys.some((k) => amenitiesFromListing.includes(k)))
      : AMENITIES;

  const visibleAmenities = showAllAmenities ? amenitiesToRender : amenitiesToRender.slice(0, 4);
  const canExpandAmenities = amenitiesToRender.length > 4;

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const index = Math.round(contentOffset.x / (layoutMeasurement.width || SCREEN_WIDTH));
    const max = Math.max(0, (carouselImages.length || 1) - 1);
    setCarouselIndex(Math.min(index, max));
  };

  const closeDateModal = () => {
    setDateModalVisible(false);
    setDateModalStep('dates');
    setLoginError(null);
  };
  const openDateModal = () => {
    setDateModalStep('dates');
    setDateModalVisible(true);
  };

  const formatSelectedDatesLabel = (dates: string[]) => {
    if (dates.length === 0) return 'Select dates';
    const first = dates[0];
    const month = new Date(first).toLocaleString('en-US', { month: 'long' });
    const days = dates.map((d) => new Date(d).getDate()).join(',');
    return `${month} ${days}`;
  };

  const getDatesInRange = (start: string, end: string) => {
    const out: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const a = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    const b = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return out;
    if (a.getTime() > b.getTime()) return out;

    const cur = new Date(a);
    while (cur.getTime() <= b.getTime()) {
      const yyyy = cur.getUTCFullYear();
      const mm = String(cur.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(cur.getUTCDate()).padStart(2, '0');
      out.push(`${yyyy}-${mm}-${dd}`);
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    return out;
  };

  const selectedDates = (() => {
    if (checkInDate && checkOutDate) return getDatesInRange(checkInDate, checkOutDate);
    if (checkInDate) return [checkInDate];
    return [];
  })();

  const markedDates: Record<
    string,
    { customStyles?: { container?: any; text?: any } }
  > = React.useMemo(() => {
    const lightFill = colors.surface.lightPink ?? '#feebe7';
    const primary = colors.primary;
    const out: Record<string, { customStyles?: { container?: any; text?: any } }> = {};

    if (!checkInDate) return out;

    if (!checkOutDate) {
      out[checkInDate] = {
        customStyles: {
          container: {
            backgroundColor: primary,
            borderRadius: 999,
          },
          text: { color: colors.surface.white, fontWeight: '600' },
        },
      };
      return out;
    }

    const range = getDatesInRange(checkInDate, checkOutDate);
    range.forEach((d, idx) => {
      const isEdge = idx === 0 || idx === range.length - 1;
      out[d] = {
        customStyles: {
          container: {
            backgroundColor: isEdge ? primary : lightFill,
            borderRadius: 999,
          },
          text: { color: isEdge ? colors.surface.white : colors.text.primary, fontWeight: '600' },
        },
      };
    });

    return out;
  }, [checkInDate, checkOutDate]);

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
      return;
    }
    if (new Date(date).getTime() < new Date(checkInDate).getTime()) {
      setCheckInDate(date);
      setCheckOutDate(null);
      return;
    }
    setCheckOutDate(date);
  };

  const handleClearDates = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const handleDatesSave = () => {
    if (!checkInDate) return;
    setDateModalStep('guests');
  };

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

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

  useEffect(() => {
    if (!dateModalVisible) return;
    let mounted = true;
    (async () => {
      const token = await getStoredAuthToken();
      if (mounted) setIsLoggedIn(Boolean(token));
    })();
    return () => {
      mounted = false;
    };
  }, [dateModalVisible]);

  const nightsCount = (() => {
    if (!checkInDate || !checkOutDate) return 0;
    const a = new Date(checkInDate);
    const b = new Date(checkOutDate);
    const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  })();

  const parsePrice = (value: string) => {
    const num = Number((value ?? '').replace(/[^\d.]/g, ''));
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  const perNight = parsePrice(displayPrice) ?? 9395;
  const nights = nightsCount || 2;
  const subtotal = perNight * nights;
  const taxes = Math.round(subtotal * 0.18 * 10) / 10;
  const total = Math.round((subtotal + taxes) * 10) / 10;

  const guestsLabel = (() => {
    const parts = [`${adultsCount} adult${adultsCount === 1 ? '' : 's'}`];
    if (childrenCount) parts.push(`${childrenCount} child${childrenCount === 1 ? '' : 'ren'}`);
    if (infantsCount) parts.push(`${infantsCount} infant${infantsCount === 1 ? '' : 's'}`);
    return parts.join(', ');
  })();

  const handleGuestSave = () => setDateModalStep('price');

  const handleCtaPress = () => {
    if (isLoggedIn) {
      // TODO: Proceed to payment flow
      closeDateModal();
      return;
    }
    setDateModalStep('login');
  };

  const handleGetOtpInModal = () => {
    setLoginError(null);
    const trimmed = loginPhone.trim();
    if (!trimmed) {
      setLoginError('Please enter your phone number.');
      return;
    }
    sendOtp(
      { channel: 'phone', phone: trimmed },
      {
        onSuccess: (res) => {
          if (res?.success) {
            closeDateModal();
            router.push({
              pathname: '/otp',
              params: { contact: trimmed, isEmail: '0' },
            });
            return;
          }
          setLoginError(res?.message ?? 'Failed to send OTP. Please try again.');
        },
        onError: (err) => setLoginError(getErrorMessage(err)),
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image carousel ~40% height */}
        <View style={styles.heroWrap}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onCarouselScroll}
            style={styles.carousel}
          >
            {(carouselImages.length ? carouselImages : [ResortImage]).map((img: any, i: number) => (
              <Image
                key={i}
                source={typeof img === 'string' ? { uri: img } : img}
                style={[styles.carouselSlide, { width: SCREEN_WIDTH }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Carousel dots */}
          <View style={styles.carouselDots}>
            {(carouselImages.length ? carouselImages : [ResortImage]).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === carouselIndex && styles.dotActive]}
              />
            ))}
          </View>
          {/* Header buttons */}
          <SafeAreaView style={styles.heroOverlay} edges={['top']}>
            <View style={styles.heroHeader}>
              <Pressable
                style={styles.headerBtnGray}
                onPress={() => router.back()}
                hitSlop={12}
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
              </Pressable>
              <View style={styles.headerBtnRow}>
                <Pressable style={styles.headerBtnGray} onPress={() => {}} accessibilityLabel="Share">
                  <Ionicons name="share-outline" size={22} color={colors.text.primary} />
                </Pressable>
                <Pressable style={styles.headerBtnOrange} onPress={() => {}} accessibilityLabel="Save">
                  <Ionicons name="heart" size={22} color={colors.surface.white} />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Content - white background */}
        <View style={styles.content}>
          {/* Title + rating pill */}
          <View style={styles.titleColumn}>
            <Text variant="caption" style={styles.locationLabel}>
              {locationLabel}
            </Text>
            <Text variant="heading1" style={styles.title}>
              {title}
            </Text>
            <View style={styles.reviewsRow}>
              <Text variant="bodySemibold" style={styles.ratingValue}>
                {rating}/10
              </Text>
              <Text variant="caption" style={styles.ratingText}>
                Very good • 1,004 reviews
              </Text>
            </View>
          </View>

          <Text variant="body" style={styles.description}>
            {listing?.description ?? DESCRIPTION}
          </Text>

          {/* Amenities */}
          <Text variant="bodySemibold" style={styles.sectionHeading}>
            Popular amenities
          </Text>
          <View style={styles.amenitiesGrid}>
            {visibleAmenities.map((item) => (
              <View key={item.id} style={styles.amenityCard}>
                <View style={styles.amenityIconWrap}>
                  <Ionicons name={item.icon} size={20} color={colors.text.primary} />
                </View>
                <Text variant="caption" style={styles.amenityLabel}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          {canExpandAmenities ? (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => setShowAllAmenities((v) => !v)}
              accessibilityLabel={showAllAmenities ? 'Show less amenities' : 'See all amenities'}
            >
              <Text variant="body" style={styles.secondaryBtnText}>
                {showAllAmenities ? 'Show less' : 'See all amenities'}
              </Text>
            </Pressable>
          ) : null}

          {/* Map */}
          <Text variant="bodySemibold" style={styles.sectionHeading}>
            Location
          </Text>
          <View style={styles.mapCard}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: Number.isFinite(lat) ? lat : 52.509669,
                longitude: Number.isFinite(lng) ? lng : 13.376294,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pointerEvents="none"
            >
              {Number.isFinite(lat) && Number.isFinite(lng) ? (
                <Marker coordinate={{ latitude: lat, longitude: lng }} />
              ) : null}
            </MapView>
          </View>

          {/* Host - compact */}
          <Text variant="bodySemibold" style={styles.sectionHeading}>
            Hosted by
          </Text>
          <View style={styles.hostCard}>
            <Image source={ResortImage} style={styles.hostImage} resizeMode="cover" />
            <View style={styles.hostInfo}>
              <Text variant="bodySemibold" style={styles.hostName}>
                {listing?.vendor?.business_name ?? 'Host'}
              </Text>
              <Text variant="caption" style={styles.hostDesc}>
                {HOST_DESCRIPTION}
              </Text>
              <View style={styles.hostMeta}>
                <View style={styles.hostRatingRow}>
                  <Ionicons name="star" size={14} color={colors.rating.star} />
                  <Text variant="caption" style={styles.hostRatingText}>
                    4.5
                  </Text>
                </View>
                <View style={styles.hostMetaDivider} />
                <Text variant="caption" style={styles.hostCustomers}>
                  500+ stays hosted
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Fixed footer: price + Reserve */}
      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.footerInner}>
          <View style={styles.footerPriceWrap}>
            <Text variant="heading2" style={styles.footerPrice}>
              {displayPrice}
            </Text>
            <Text variant="caption" style={styles.footerPriceSub}>
              For 1 room/day.
            </Text>
          </View>
          <Pressable style={styles.reserveBtn} onPress={openDateModal} accessibilityLabel="Reserve">
            <Text variant="bodySemibold" style={styles.reserveBtnText}>
              Reserve
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Date selection modal */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDateModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDateModal}>
          <Pressable style={styles.dateModalCard} onPress={(e) => e.stopPropagation()}>
            {dateModalStep === 'dates' ? (
              <>
                <View style={styles.dateModalHeader}>
                  <Text variant="bodySemibold" style={styles.dateModalTitle}>
                    Select dates
                  </Text>
                  <Pressable
                    onPress={closeDateModal}
                    hitSlop={12}
                    accessibilityLabel="Close date selector"
                  >
                    <Ionicons name="close" size={22} color={colors.primary} />
                  </Pressable>
                </View>

                <View style={styles.calendarCard}>
                  <Calendar
                    current={checkInDate ?? undefined}
                    markingType="custom"
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    hideExtraDays={false}
                    enableSwipeMonths
                    renderArrow={(direction) => (
                      <Ionicons
                        name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                        size={16}
                        color={colors.text.secondary}
                      />
                    )}
                    theme={{
                      textDayFontFamily: 'Poppins',
                      textMonthFontFamily: 'Poppins',
                      textDayHeaderFontFamily: 'Poppins',
                      textMonthFontWeight: '500',
                      textDayFontWeight: '500',
                      monthTextColor: colors.text.primary,
                      textSectionTitleColor: colors.text.caption,
                      dayTextColor: '#4A5660',
                      textDisabledColor: '#e0e0e0',
                      arrowColor: colors.text.secondary,
                      todayTextColor: colors.text.primary,
                      textDayFontSize: 14,
                      textMonthFontSize: 14,
                      textDayHeaderFontSize: 12,
                    } as any}
                    style={styles.calendarInner}
                  />
                </View>

                <View style={styles.dateModalFooter}>
                  <View style={styles.dateModalFooterLeft}>
                    <Text variant="bodySemibold" style={styles.selectedDatesText}>
                      {formatSelectedDatesLabel(selectedDates)}
                    </Text>
                    <Pressable onPress={handleClearDates} accessibilityLabel="Clear selected dates">
                      <Text variant="caption" style={styles.clearDatesText}>
                        Clear dates
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={styles.saveBtn}
                    onPress={handleDatesSave}
                    accessibilityLabel="Save dates"
                  >
                    <Text variant="bodySemibold" style={styles.saveBtnText}>
                      Save
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : dateModalStep === 'guests' ? (
              <>
                <View style={styles.dateModalHeader}>
                  <Text variant="bodySemibold" style={styles.dateModalTitle}>
                    Guest details
                  </Text>
                  <Pressable
                    onPress={closeDateModal}
                    hitSlop={12}
                    accessibilityLabel="Close guest details"
                  >
                    <Ionicons name="close" size={22} color={colors.primary} />
                  </Pressable>
                </View>

                <View style={styles.guestsList}>
                  <View style={styles.guestRow}>
                    <View style={styles.guestRowLeft}>
                      <Text variant="bodySemibold" style={styles.guestLabel}>
                        Adults
                      </Text>
                      <Text variant="caption" style={styles.guestSubLabel}>
                        Age 13+
                      </Text>
                    </View>
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => setAdultsCount((v) => clamp(v - 1, 1, 10))}
                        hitSlop={10}
                        accessibilityLabel="Decrease adults"
                      >
                        <Ionicons name="remove" size={16} color={colors.primary} />
                      </Pressable>
                      <Text variant="bodySemibold" style={styles.stepperValue}>
                        {adultsCount}
                      </Text>
                      <Pressable
                        onPress={() => setAdultsCount((v) => clamp(v + 1, 1, 10))}
                        hitSlop={10}
                        accessibilityLabel="Increase adults"
                      >
                        <Ionicons name="add" size={16} color={colors.primary} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.guestRow}>
                    <View style={styles.guestRowLeft}>
                      <Text variant="bodySemibold" style={styles.guestLabel}>
                        Children
                      </Text>
                      <Text variant="caption" style={styles.guestSubLabel}>
                        Age 2-12
                      </Text>
                    </View>
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => setChildrenCount((v) => clamp(v - 1, 0, 10))}
                        hitSlop={10}
                        accessibilityLabel="Decrease children"
                      >
                        <Ionicons name="remove" size={16} color={colors.primary} />
                      </Pressable>
                      <Text variant="bodySemibold" style={styles.stepperValue}>
                        {childrenCount}
                      </Text>
                      <Pressable
                        onPress={() => setChildrenCount((v) => clamp(v + 1, 0, 10))}
                        hitSlop={10}
                        accessibilityLabel="Increase children"
                      >
                        <Ionicons name="add" size={16} color={colors.primary} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.guestRow}>
                    <View style={styles.guestRowLeft}>
                      <Text variant="bodySemibold" style={styles.guestLabel}>
                        Infants
                      </Text>
                      <Text variant="caption" style={styles.guestSubLabel}>
                        Under 2
                      </Text>
                    </View>
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => setInfantsCount((v) => clamp(v - 1, 0, 10))}
                        hitSlop={10}
                        accessibilityLabel="Decrease infants"
                      >
                        <Ionicons name="remove" size={16} color={colors.primary} />
                      </Pressable>
                      <Text variant="bodySemibold" style={styles.stepperValue}>
                        {infantsCount}
                      </Text>
                      <Pressable
                        onPress={() => setInfantsCount((v) => clamp(v + 1, 0, 10))}
                        hitSlop={10}
                        accessibilityLabel="Increase infants"
                      >
                        <Ionicons name="add" size={16} color={colors.primary} />
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View style={styles.guestFooter}>
                  <Pressable
                    onPress={() => {
                      handleClearDates();
                      setDateModalStep('dates');
                    }}
                    accessibilityLabel="Clear dates"
                  >
                    <Text variant="caption" style={styles.guestFooterClear}>
                      Clear dates
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.saveBtn}
                    onPress={handleGuestSave}
                    accessibilityLabel="Save guests"
                  >
                    <Text variant="bodySemibold" style={styles.saveBtnText}>
                      Save
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : dateModalStep === 'price' ? (
              <>
                <View style={styles.dateModalHeader}>
                  <Text variant="bodySemibold" style={styles.dateModalTitle}>
                    Price details
                  </Text>
                  <Pressable onPress={closeDateModal} hitSlop={12} accessibilityLabel="Close price details">
                    <Ionicons name="close" size={22} color={colors.primary} />
                  </Pressable>
                </View>

                <View style={styles.priceBody}>
                  <View style={styles.priceRows}>
                    <View style={styles.priceRow}>
                      <Text variant="caption" style={styles.priceRowLabel}>
                        {`${nights} nights * ₹${perNight.toLocaleString('en-IN')}`}
                      </Text>
                      <Text variant="bodySemibold" style={styles.priceRowValue}>
                        ₹ {subtotal.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text variant="caption" style={styles.priceRowLabel}>
                        Taxes
                      </Text>
                      <Text variant="bodySemibold" style={styles.priceRowValue}>
                        ₹ {taxes.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.priceTotalRow}>
                    <Text variant="bodySemibold" style={styles.priceTotalLabel}>
                      Total INR
                    </Text>
                    <Text variant="bodySemibold" style={styles.priceTotalLabel}>
                      ₹ {total.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={[styles.saveBtn, styles.fullWidthCta]}
                  onPress={handleCtaPress}
                  accessibilityLabel={isLoggedIn ? 'Proceed to pay' : 'Login to proceed'}
                >
                  <Text variant="bodySemibold" style={styles.saveBtnText}>
                    {isLoggedIn ? 'Proceed to pay' : 'Login to proceed'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.dateModalHeader}>
                  <Text variant="bodySemibold" style={styles.dateModalTitle}>
                    Log in or sign up
                  </Text>
                  <Pressable onPress={closeDateModal} hitSlop={12} accessibilityLabel="Close login">
                    <Ionicons name="close" size={22} color={colors.primary} />
                  </Pressable>
                </View>

                <View style={styles.loginBody}>
                  <View style={styles.loginFieldBlock}>
                    <TextInput
                      value={loginPhone}
                      onChangeText={setLoginPhone}
                      placeholder="Phone number"
                      placeholderTextColor="rgba(0, 5, 29, 0.45)"
                      keyboardType="phone-pad"
                      style={styles.loginPhoneInput}
                    />
                    <Text variant="caption" style={styles.loginHelper}>
                      You’ll get OTP to this number.
                    </Text>
                  </View>

                  {loginError ? (
                    <Text variant="caption" style={styles.loginError}>
                      {loginError}
                    </Text>
                  ) : null}

                  <Pressable
                    style={[styles.otpBtn, isSendingOtp && styles.btnDisabled]}
                    onPress={handleGetOtpInModal}
                    accessibilityLabel="Get OTP"
                    disabled={isSendingOtp}
                  >
                    <Text variant="bodySemibold" style={styles.otpBtnText}>
                      {isSendingOtp ? 'Sending OTP...' : 'Get OTP'}
                    </Text>
                  </Pressable>

                  <View style={styles.orRow}>
                    <View style={styles.orLine} />
                    <Text variant="caption" style={styles.orText}>
                      OR
                    </Text>
                    <View style={styles.orLine} />
                  </View>

                  <View style={styles.socialStackInModal}>
                    <Pressable style={styles.socialBtn} onPress={() => {}} accessibilityLabel="Log in with mail">
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Log in with mail
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} onPress={() => {}} accessibilityLabel="Continue with Google">
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Google
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} onPress={() => {}} accessibilityLabel="Continue with Apple">
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Apple
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} onPress={() => {}} accessibilityLabel="Continue with Facebook">
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Facebook
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroWrap: {
    width: '100%',
    height: SCREEN_WIDTH * 1.1,
    maxHeight: 360,
    backgroundColor: colors.gray['2'],
  },
  carousel: {
    flex: 1,
  },
  carouselSlide: {
    height: '100%',
  },
  carouselDots: {
    position: 'absolute',
    bottom: spacing['4'],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.light,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing['3'],
    paddingTop: spacing['2'],
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtnGray: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  headerBtnRow: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  headerBtnOrange: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['5'],
    backgroundColor: colors.surface.white,
  },
  titleColumn: {
    flex: 1,
    marginBottom: spacing['3'],
  },
  title: {
    color: colors.text.primary,
    lineHeight: 28,
  },
  locationLabel: {
    color: colors.text.caption,
    marginBottom: spacing['1'],
  },
  reviewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['1'],
  },
  ratingValue: {
    color: colors.text.primary,
  },
  ratingText: {
    color: colors.text.secondary,
  },
  description: {
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing['4'],
  },
  sectionHeading: {
    color: colors.text.primary,
    marginBottom: spacing['3'],
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing['3'],
    columnGap: spacing['4'],
    marginBottom: spacing['3'],
  },
  amenityCard: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  amenityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.lightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    color: colors.text.primary,
    flexShrink: 1,
  },
  mapCard: {
    height: 180,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: spacing['5'],
  },
  map: {
    flex: 1,
  },
  secondaryBtn: {
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    backgroundColor: colors.gray['2'],
    borderRadius: borderRadius.lg,
    marginBottom: spacing['5'],
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.text.secondary,
  },
  hostCard: {
    flexDirection: 'row',
    gap: spacing['4'],
    marginBottom: spacing['3'],
  },
  hostImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.gray['2'],
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    color: colors.text.primary,
    marginBottom: spacing['1'],
  },
  hostDesc: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing['2'],
  },
  hostMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  hostRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostRatingText: {
    color: colors.text.secondary,
  },
  hostMetaDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border.light,
  },
  hostCustomers: {
    color: colors.primary,
  },
  bottomSpacer: {
    height: spacing['4'],
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['2'],
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  footerPriceWrap: {
    flex: 1,
  },
  footerPrice: {
    color: colors.text.primary,
  },
  footerPriceSub: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  reserveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
    borderRadius: borderRadius.lg,
    minWidth: 140,
    alignItems: 'center',
  },
  reserveBtnText: {
    color: colors.surface.white,
  },
  // Date modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.27)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  dateModalCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.gray['1'] ?? '#fcfcfc',
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['3'],
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: '#000932',
    shadowOpacity: 0.12,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    gap: spacing['6'],
  },
  dateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['1'],
  },
  dateModalTitle: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  calendarCard: {
    backgroundColor: colors.surface.white,
    width: 306,
    alignSelf: 'center',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 19,
    shadowOffset: { width: 2, height: 16 },
    elevation: 6,
  },
  calendarInner: {
    borderRadius: 8,
  },
  dateModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateModalFooterLeft: {
    flexShrink: 1,
    gap: spacing['1'],
  },
  selectedDatesText: {
    color: colors.text.primary,
  },
  clearDatesText: {
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  saveBtn: {
    width: 104,
    height: 32,
    borderRadius: borderRadius.sm ?? 4,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: colors.surface.white,
  },
  fullWidthCta: {
    width: '100%',
    marginTop: spacing['2'],
  },
  priceBody: {
    width: '100%',
    paddingHorizontal: spacing['2'],
    gap: spacing['5'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['2'],
  },
  priceRows: {
    gap: spacing['4'],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRowLabel: {
    color: 'rgba(0, 7, 20, 0.62)',
  },
  priceRowValue: {
    color: colors.text.primary,
  },
  priceTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['2'],
  },
  priceTotalLabel: {
    color: colors.text.primary,
  },
  loginBody: {
    width: '100%',
    paddingHorizontal: spacing['2'],
    paddingTop: spacing['2'],
    gap: spacing['3'],
  },
  loginFieldBlock: {
    gap: spacing['2'],
  },
  loginPhoneInput: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    borderRadius: 6,
    paddingHorizontal: spacing['3'],
    color: colors.text.primary,
  },
  loginHelper: {
    color: 'rgba(0, 5, 29, 0.45)',
    paddingHorizontal: spacing['1'],
  },
  loginError: {
    color: '#d32f2f',
  },
  otpBtn: {
    height: 32,
    borderRadius: borderRadius.sm ?? 4,
    backgroundColor: colors.neutral?.['9'] ?? '#8b8d98',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBtnText: {
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['2'],
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 47, 0.15)',
  },
  orText: {
    color: 'rgba(0, 5, 29, 0.45)',
  },
  socialStackInModal: {
    gap: spacing['3'],
    paddingBottom: spacing['2'],
  },
  socialBtn: {
    height: 32,
    borderRadius: borderRadius.sm ?? 4,
    borderWidth: 1,
    borderColor: 'rgba(231, 40, 0, 0.4)',
    backgroundColor: 'rgba(229, 77, 46, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3'],
  },
  socialBtnText: {
    color: 'rgba(205, 34, 0, 0.92)',
  },
  guestsList: {
    gap: spacing['5'],
    paddingHorizontal: spacing['2'],
    paddingTop: spacing['2'],
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestRowLeft: {
    gap: spacing['1'],
  },
  guestLabel: {
    color: colors.text.primary,
  },
  guestSubLabel: {
    color: colors.text.secondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 104,
    height: 32,
    paddingHorizontal: spacing['3'],
    borderRadius: borderRadius.sm ?? 4,
    borderWidth: 1,
    borderColor: 'rgba(231, 40, 0, 0.4)',
    backgroundColor: 'rgba(229, 77, 46, 0.03)',
  },
  stepperValue: {
    color: colors.text.primary,
    minWidth: 18,
    textAlign: 'center',
  },
  guestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2'],
    paddingTop: spacing['2'],
  },
  guestFooterClear: {
    color: colors.text.primary,
  },
});
