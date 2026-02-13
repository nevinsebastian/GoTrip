import { Text } from '@/components/ui';
import {
  borderRadius,
  colors,
  spacing,
} from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

const ResortImage = require('@/assets/images/resort.jpg');

const CAROUSEL_IMAGES = [ResortImage, ResortImage, ResortImage];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PROVIDES = [
  'Private pool',
  '24/7 Room service',
  'Air conditioning',
  'Restaurant facility',
];

const DESCRIPTION =
  'Experience refined comfort in this elegant two-floor villa featuring four spacious bedrooms and a private pool. Nestled in the lush greenery of Wayanad, the property offers complete privacy, serene views, and thoughtfully designed interiors—perfect for families or groups seeking a premium getaway in nature.';

const HOST_DESCRIPTION =
  'Mr. Ashish Kumar is an experienced host with 5 years of managing multiple luxury resorts in Wayanad.';

export default function ResortDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string; rating?: string }>();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);

  const title = params.title ?? 'Luxury stay in Wayanad';
  const displayPrice = params.price ?? '₹2,420';
  const rating = params.rating ?? '4.5';

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const index = Math.round(contentOffset.x / (layoutMeasurement.width || SCREEN_WIDTH));
    setCarouselIndex(Math.min(index, CAROUSEL_IMAGES.length - 1));
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
            {CAROUSEL_IMAGES.map((img, i) => (
              <Image
                key={i}
                source={img}
                style={[styles.carouselSlide, { width: SCREEN_WIDTH }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Carousel dots */}
          <View style={styles.carouselDots}>
            {CAROUSEL_IMAGES.map((_, i) => (
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
          {/* Title: "Luxury stay in Wayanad | 2 floors, 4 rooms | with private pool" */}
          <Text variant="heading1" style={styles.title}>
            {title} | 2 floors, 4 rooms | with private pool
          </Text>
          <Text variant="body" style={styles.description}>
            {DESCRIPTION}
          </Text>

          {/* What we provide? */}
          <Text variant="bodySemibold" style={styles.sectionHeading}>
            What we provide?
          </Text>
          <View style={styles.providesList}>
            {PROVIDES.map((label) => (
              <View key={label} style={styles.provideRow}>
                <View style={styles.provideIconWrap}>
                  <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                </View>
                <Text variant="body" style={styles.provideLabel}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
          <Pressable style={styles.secondaryBtn}>
            <Text variant="body" style={styles.secondaryBtnText}>
              Show more
            </Text>
          </Pressable>

          {/* Host */}
          <Text variant="bodySemibold" style={styles.sectionHeading}>
            Host
          </Text>
          <View style={styles.hostCard}>
            <Image source={ResortImage} style={styles.hostImage} resizeMode="cover" />
            <View style={styles.hostInfo}>
              <Text variant="bodySemibold" style={styles.hostName}>
                Mr. Ashish Kumar
              </Text>
              <Text variant="body" style={styles.hostDesc}>
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
                  500+ customers
                </Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.secondaryBtn}>
            <Text variant="body" style={styles.secondaryBtnText}>
              View host profile
            </Text>
          </Pressable>

          {/* Instructions */}
          <Text variant="bodySemibold" style={styles.sectionHeading}>
            Instructions
          </Text>
          <Text variant="body" style={styles.description}>
            {DESCRIPTION}
          </Text>
          <Pressable style={styles.secondaryBtn}>
            <Text variant="body" style={styles.secondaryBtnText}>
              More details
            </Text>
          </Pressable>

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
          <Pressable style={styles.reserveBtn}>
            <Text variant="bodySemibold" style={styles.reserveBtnText}>
              Reserve
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
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
  title: {
    color: colors.text.primary,
    marginBottom: spacing['3'],
    lineHeight: 28,
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
  providesList: {
    gap: spacing['2'],
    marginBottom: spacing['3'],
  },
  provideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  provideIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.lightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  provideLabel: {
    color: colors.text.primary,
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
});
