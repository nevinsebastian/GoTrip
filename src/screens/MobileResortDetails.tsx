import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import type { Listing, ListingDetail } from '@/src/api/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import HeartIcon from '@/assets/images/heart.svg';

import { useHomeScale } from '@/src/components/home/useHomeScale';
import { MobileBottomTabBar } from '@/src/components/navigation/MobileBottomTabBar';
import { ResortAmenitiesSection } from '@/src/components/resort/ResortAmenitiesSection';
import { ResortDetailHeader } from '@/src/components/resort/ResortDetailHeader';
import { ResortExploreMore } from '@/src/components/resort/ResortExploreMore';
import { ResortHostInstructions } from '@/src/components/resort/ResortHostInstructions';
import { ResortReviewsSection } from '@/src/components/resort/ResortReviewsSection';
import { ResortRoomCard } from '@/src/components/resort/ResortRoomCard';
import { DEFAULT_ROOM_CONFIGS, FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import type { HotelReviewDisplay, HotelRoomDisplay } from '@/src/utils/hotelDetailHelpers';
import { openLocationInMaps } from '@/src/utils/openLocationInMaps';

import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type MobileResortDetailsProps = {
  listing?: ListingDetail;
  listingId?: string;
  title: string;
  rating: string;
  reviewCountLabel?: string;
  starRating?: number;
  locationLabel: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  propertyRules?: string[];
  highlights?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  cancellationText?: string;
  carouselImages: string[];
  rooms?: HotelRoomDisplay[];
  reviews?: HotelReviewDisplay[];
  relatedListings: Listing[];
  onBookNow: () => void;
  onSelectRoom?: (roomTypeId: string) => void;
  selectedRoomTypeId?: string;
  bookCtaLabel?: string;
};

export function MobileResortDetailsScreen({
  title,
  address,
  latitude,
  longitude,
  rating,
  reviewCountLabel,
  starRating,
  description,
  propertyRules = [],
  highlights = [],
  checkInTime,
  checkOutTime,
  cancellationText,
  carouselImages,
  rooms,
  reviews = [],
  relatedListings,
  onBookNow,
  onSelectRoom,
  selectedRoomTypeId,
  bookCtaLabel = 'Book Now',
}: MobileResortDetailsProps) {
  const { s } = useHomeScale();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

  const images = carouselImages.length ? carouselImages : [];
  const slides = images.length ? images : [null];

  const roomCards = rooms?.length ? rooms : DEFAULT_ROOM_CONFIGS.map((room) => ({
    id: room.id,
    name: room.name,
    guests: room.guests,
    rooms: room.rooms,
    priceLabel: room.priceLabel,
    variant: room.variant,
    showImages: room.showImages,
    mealPlans: [],
    amenities: [],
  }));
  const featuredRoom = roomCards[0];
  const imageRooms = roomCards.slice(1);
  const displayTitle = title || FIGMA_PROPERTY.title;
  const displayAddress = address || FIGMA_PROPERTY.address;
  const customersLabel = reviewCountLabel ?? FIGMA_PROPERTY.customersLabel;

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const index = Math.round(contentOffset.x / (layoutMeasurement.width || SCREEN_WIDTH));
    setCarouselIndex(Math.min(index, slides.length - 1));
  };

  const goToSlide = (direction: 'prev' | 'next') => {
    const next =
      direction === 'prev'
        ? Math.max(0, carouselIndex - 1)
        : Math.min(slides.length - 1, carouselIndex + 1);
    carouselRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    setCarouselIndex(next);
  };

  const goToListing = (id: string) => {
    router.push({
      pathname: '/hotels/[id]',
      params: { id },
    });
  };

  return (
    <View style={styles.container}>
      <ResortDetailHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: s(100) }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.heroWrap,
            { height: s(312), marginHorizontal: s(16), marginTop: s(8), borderRadius: s(24) },
          ]}
        >
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onCarouselScroll}
            style={{ borderRadius: s(24), overflow: 'hidden' }}
          >
            {slides.map((uri, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH - s(32), height: s(312) }}>
                {uri ? (
                  <Image source={{ uri }} style={styles.heroImage} resizeMode="cover" />
                ) : (
                  <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.heroImage} resizeMode="cover" />
                )}
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.coupleBadge,
              {
                paddingVertical: s(6),
                paddingHorizontal: s(16),
                borderRadius: s(24),
                bottom: s(8),
                left: s(8),
              },
            ]}
          >
            <Ionicons name="heart-outline" size={s(10)} color="#FFFFFF" />
            <Text style={[styles.coupleBadgeText, { fontSize: s(8) }]}>COUPLE FRIENDLY</Text>
          </View>

          <View style={[styles.heroActions, { top: s(8), right: s(8), gap: s(8) }]}>
            <Pressable style={[styles.heroIconBtn, { width: s(30), height: s(30), borderRadius: s(12) }]}>
              <Ionicons name="share-social-outline" size={s(14)} color={colors.text.primary} />
            </Pressable>
            <Pressable style={[styles.heroIconBtn, { width: s(30), height: s(30), borderRadius: s(12) }]}>
              <HeartIcon width={s(14)} height={s(14)} />
            </Pressable>
          </View>

          {slides.length > 1 ? (
            <>
              <Pressable
                style={[
                  styles.carouselArrow,
                  { width: s(32), height: s(32), borderRadius: s(16), left: s(12) },
                ]}
                onPress={() => goToSlide('prev')}
              >
                <Ionicons name="chevron-back" size={s(18)} color={colors.text.primary} />
              </Pressable>
              <Pressable
                style={[
                  styles.carouselArrow,
                  { width: s(32), height: s(32), borderRadius: s(16), right: s(12) },
                ]}
                onPress={() => goToSlide('next')}
              >
                <Ionicons name="chevron-forward" size={s(18)} color={colors.text.primary} />
              </Pressable>
            </>
          ) : null}

          <View style={[styles.carouselDots, { bottom: s(12) }]}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={[styles.content, { paddingHorizontal: s(16), gap: s(20), paddingTop: s(16) }]}>
          <View style={{ gap: s(12) }}>
            <Text style={[styles.propertyTitle, { fontSize: s(20), lineHeight: s(26) }]}>
              {displayTitle}
              {starRating ? ` · ${starRating}★` : ''}
            </Text>
            <Text style={[styles.addressText, { fontSize: s(10), lineHeight: s(14) }]}>
              {displayAddress}
            </Text>
            <Pressable
              style={[styles.viewLocationBtn, { paddingVertical: s(8), paddingHorizontal: s(16), borderRadius: s(9999) }]}
              disabled={latitude == null || longitude == null}
              onPress={() => {
                if (latitude == null || longitude == null) return;
                void openLocationInMaps({
                  latitude,
                  longitude,
                  label: address || title,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={FIGMA_PROPERTY.viewLocationLabel}
            >
              <Text style={[styles.viewLocationText, { fontSize: s(12) }]}>
                {FIGMA_PROPERTY.viewLocationLabel}
              </Text>
            </Pressable>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={s(14)} color={colors.accent.main} />
              <Text style={[styles.ratingText, { fontSize: s(12) }]}>{rating}</Text>
              <Text style={[styles.ratingDivider, { fontSize: s(12) }]}>|</Text>
              <Text style={[styles.ratingText, { fontSize: s(12) }]}>{customersLabel}</Text>
            </View>
            {description ? (
              <Text style={[styles.addressText, { fontSize: s(12), lineHeight: s(18) }]}>
                {description}
              </Text>
            ) : null}
            {checkInTime || checkOutTime ? (
              <Text style={[styles.addressText, { fontSize: s(11) }]}>
                Check-in: {checkInTime ?? '—'} · Check-out: {checkOutTime ?? '—'}
              </Text>
            ) : null}
            {highlights.length ? (
              <View style={{ gap: s(4) }}>
                {highlights.map((item) => (
                  <Text key={item} style={[styles.addressText, { fontSize: s(11) }]}>
                    • {item}
                  </Text>
                ))}
              </View>
            ) : null}
            {propertyRules.length ? (
              <View style={{ gap: s(4) }}>
                <Text style={[styles.propertyTitle, { fontSize: s(14) }]}>Property rules</Text>
                {propertyRules.map((rule) => (
                  <Text key={rule} style={[styles.addressText, { fontSize: s(11) }]}>
                    • {rule}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          {featuredRoom ? (
            <ResortRoomCard
              key={featuredRoom.id}
              name={featuredRoom.name}
              guests={featuredRoom.guests}
              rooms={featuredRoom.rooms}
              variant={featuredRoom.variant}
              showImages={featuredRoom.showImages}
              priceLabel={featuredRoom.priceLabel}
              cancellationText={cancellationText}
              images={images.length >= 2 ? [images[0], images[1]] : images}
              onBookNow={() => {
                onSelectRoom?.(featuredRoom.id);
                onBookNow();
              }}
              bookCtaLabel={bookCtaLabel}
              occupancyLabel={featuredRoom.occupancyLabel}
              fitsGuests={featuredRoom.fitsSelectedGuests !== false}
              selected={selectedRoomTypeId === featuredRoom.id}
            />
          ) : null}

          {description ? null : <ResortHostInstructions />}

          {imageRooms.map((room) => (
            <ResortRoomCard
              key={room.id}
              name={room.name}
              guests={room.guests}
              rooms={room.rooms}
              variant={room.variant}
              showImages={room.showImages}
              priceLabel={room.priceLabel}
              cancellationText={cancellationText}
              images={images.length >= 2 ? [images[0], images[1]] : images}
              onBookNow={() => {
                onSelectRoom?.(room.id);
                onBookNow();
              }}
              bookCtaLabel={bookCtaLabel}
              occupancyLabel={room.occupancyLabel}
              fitsGuests={room.fitsSelectedGuests !== false}
              selected={selectedRoomTypeId === room.id}
            />
          ))}

          <ResortAmenitiesSection amenities={roomCards.flatMap((r) => r.amenities ?? [])} />

          <ResortReviewsSection reviews={reviews} />
        </View>

        <ResortExploreMore listings={relatedListings} onCardPress={goToListing} />
      </ScrollView>

      <MobileBottomTabBar />
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
    flexGrow: 1,
  },
  heroWrap: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  coupleBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  heroActions: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconBtn: {
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12.5,
    elevation: 4,
  },
  carouselArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12.5,
    elevation: 3,
  },
  carouselDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: colors.surface.white,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    width: '100%',
  },
  propertyTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  addressText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
  viewLocationBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.text.primary,
  },
  viewLocationText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  ratingDivider: {
    fontFamily: typography.fontFamily.text,
    color: 'rgba(0, 7, 20, 0.62)',
  },
});
