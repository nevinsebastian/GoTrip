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
import { ResortAmenitiesSection } from '@/src/components/resort/ResortAmenitiesSection';
import { ResortDetailHeader } from '@/src/components/resort/ResortDetailHeader';
import { ResortExploreMore } from '@/src/components/resort/ResortExploreMore';
import { ResortHostInstructions } from '@/src/components/resort/ResortHostInstructions';
import { ResortReviewsSection } from '@/src/components/resort/ResortReviewsSection';
import { ResortRoomCard } from '@/src/components/resort/ResortRoomCard';
import { DEFAULT_ROOM_CONFIGS, FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';

import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type MobileResortDetailsProps = {
  listing?: ListingDetail;
  listingId?: string;
  title: string;
  rating: string;
  locationLabel: string;
  carouselImages: string[];
  relatedListings: Listing[];
  onBookNow: () => void;
};

export function MobileResortDetailsScreen({
  carouselImages,
  onBookNow,
}: MobileResortDetailsProps) {
  const { s } = useHomeScale();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

  const images = carouselImages.length ? carouselImages : [];
  const slides = images.length ? images : [null];

  const featuredRoom = DEFAULT_ROOM_CONFIGS[0];
  const imageRooms = DEFAULT_ROOM_CONFIGS.slice(1);

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
      pathname: '/resort/[id]',
      params: { id, title: FIGMA_PROPERTY.title, rating: FIGMA_PROPERTY.rating },
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
        <View style={[styles.heroWrap, { height: s(280) }]}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onCarouselScroll}
          >
            {slides.map((uri, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH, height: s(280) }}>
                {uri ? (
                  <Image source={{ uri }} style={styles.heroImage} resizeMode="cover" />
                ) : (
                  <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.heroImage} resizeMode="cover" />
                )}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.coupleBadge, { paddingVertical: s(6), paddingHorizontal: s(12), borderRadius: s(24), top: s(12), left: s(16) }]}>
            <Ionicons name="heart-outline" size={s(10)} color="#FFFFFF" />
            <Text style={[styles.coupleBadgeText, { fontSize: s(9) }]}>COUPLE FRIENDLY</Text>
          </View>

          <View style={[styles.heroActions, { top: s(12), right: s(16), gap: s(8) }]}>
            <Pressable style={[styles.heroIconBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}>
              <Ionicons name="share-social-outline" size={s(18)} color={colors.text.primary} />
            </Pressable>
            <Pressable style={[styles.heroIconBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}>
              <HeartIcon width={s(16)} height={s(16)} />
            </Pressable>
          </View>

          {slides.length > 1 ? (
            <>
              <Pressable
                style={[styles.carouselArrow, styles.carouselArrowLeft, { width: s(32), height: s(32), borderRadius: s(16), left: s(12) }]}
                onPress={() => goToSlide('prev')}
              >
                <Ionicons name="chevron-back" size={s(18)} color={colors.text.primary} />
              </Pressable>
              <Pressable
                style={[styles.carouselArrow, styles.carouselArrowRight, { width: s(32), height: s(32), borderRadius: s(16), right: s(12) }]}
                onPress={() => goToSlide('next')}
              >
                <Ionicons name="chevron-forward" size={s(18)} color={colors.text.primary} />
              </Pressable>
            </>
          ) : null}

          <View style={styles.carouselDots}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={[styles.content, { paddingHorizontal: s(16), gap: s(20), paddingTop: s(16) }]}>
          <View style={{ gap: s(12) }}>
            <Text style={[styles.propertyTitle, { fontSize: s(20), lineHeight: s(26) }]}>
              {FIGMA_PROPERTY.title}
            </Text>
            <Text style={[styles.addressText, { fontSize: s(10), lineHeight: s(14) }]}>
              {FIGMA_PROPERTY.address}
            </Text>
            <Pressable style={[styles.viewLocationBtn, { paddingVertical: s(8), paddingHorizontal: s(16), borderRadius: s(9999) }]}>
              <Text style={[styles.viewLocationText, { fontSize: s(12) }]}>
                {FIGMA_PROPERTY.viewLocationLabel}
              </Text>
            </Pressable>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={s(14)} color={colors.accent.main} />
              <Text style={[styles.ratingText, { fontSize: s(12) }]}>{FIGMA_PROPERTY.rating}</Text>
              <Text style={[styles.ratingDivider, { fontSize: s(12) }]}>|</Text>
              <Text style={[styles.ratingText, { fontSize: s(12) }]}>{FIGMA_PROPERTY.customersLabel}</Text>
            </View>
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
              images={images.length >= 2 ? [images[0], images[1]] : images}
              onBookNow={onBookNow}
            />
          ) : null}

          <ResortHostInstructions />

          {imageRooms.map((room) => (
            <ResortRoomCard
              key={room.id}
              name={room.name}
              guests={room.guests}
              rooms={room.rooms}
              variant={room.variant}
              showImages={room.showImages}
              priceLabel={room.priceLabel}
              images={images.length >= 2 ? [images[0], images[1]] : images}
              onBookNow={onBookNow}
            />
          ))}

          <ResortAmenitiesSection />

          <ResortReviewsSection />
        </View>

        <ResortExploreMore onCardPress={goToListing} />
      </ScrollView>
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
    backgroundColor: colors.gray['2'],
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
    gap: 6,
    backgroundColor: 'rgba(28, 32, 36, 0.45)',
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
  },
  carouselArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselArrowLeft: {},
  carouselArrowRight: {},
  carouselDots: {
    position: 'absolute',
    bottom: 12,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: colors.surface.white,
    width: 20,
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
