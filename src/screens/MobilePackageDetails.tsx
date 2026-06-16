import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
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
import { PackageDetailHeader } from '@/src/components/package/PackageDetailHeader';
import { ResortAmenitiesSection } from '@/src/components/resort/ResortAmenitiesSection';
import {
  FIGMA_PACKAGE_DETAIL,
  FIGMA_PACKAGE_EXPLORE,
  PACKAGE_DAY_ONE,
  PACKAGE_EXCLUSIONS,
  PACKAGE_ITINERARY_DAYS,
  PACKAGE_TRIP_HIGHLIGHTS,
} from '@/src/constants/packageDetailConstants';
import { PACKAGE_EXPANDED_IMAGE } from '@/src/constants/placeholderImages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PACKAGE_REVIEWS = [
  {
    id: '1',
    name: 'Mr. Ashish Kumar',
    rating: 4,
    ratingLabel: '4.0/5',
    text: 'I had a pleasant stay at the hotel. The rooms were clean and comfortable, with all the basic amenities needed for a relaxing visit.',
  },
  {
    id: '2',
    name: 'Mr. Ashish Kumar',
    rating: 4,
    ratingLabel: '4.0/5',
    text: 'I had a pleasant stay at the hotel. The rooms were clean and comfortable, with all the basic amenities needed for a relaxing visit.',
  },
];

export type MobilePackageDetailsProps = {
  title?: string;
  priceLabel?: string;
  onBookNow: () => void;
};

function PriceActionBlock({
  onBookNow,
  compact,
}: {
  onBookNow: () => void;
  compact?: boolean;
}) {
  const { s } = useHomeScale();

  return (
    <View style={{ gap: s(compact ? 12 : 18) }}>
      <View
        style={[
          styles.priceBox,
          {
            padding: s(18),
            borderRadius: s(8),
            gap: s(18),
          },
        ]}
      >
        <View style={{ flex: 1, gap: s(18) }}>
          <Text style={[styles.nightsPerson, { fontSize: s(12), lineHeight: s(24) }]}>
            {FIGMA_PACKAGE_DETAIL.nightsLabel}
          </Text>
          <Text style={[styles.cancellation, { fontSize: s(10), lineHeight: s(24) }]}>
            {FIGMA_PACKAGE_DETAIL.cancellationText}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: s(8) }}>
          <Text style={[styles.price, { fontSize: s(20), lineHeight: s(24) }]}>
            {FIGMA_PACKAGE_DETAIL.priceLabel}
          </Text>
          <Text style={[styles.tax, { fontSize: s(8), lineHeight: s(16) }]}>
            {FIGMA_PACKAGE_DETAIL.taxLabel}
          </Text>
        </View>
      </View>

      <Pressable
        style={[
          styles.contactBtn,
          { height: s(36), borderRadius: s(100), paddingHorizontal: s(12), gap: s(8) },
        ]}
      >
        <Ionicons name="call-outline" size={s(14)} color={colors.text.primary} />
        <Text style={[styles.contactText, { fontSize: s(12) }]}>Contact Us</Text>
      </Pressable>

      <View style={[styles.actionRow, { gap: s(12) }]}>
        <Pressable
          style={[
            styles.wishlistBtn,
            { paddingVertical: s(8), paddingHorizontal: s(12), borderRadius: s(100), gap: s(8) },
          ]}
        >
          <Text style={[styles.wishlistText, { fontSize: s(12) }]}>Wishlist</Text>
          <Ionicons name="heart-outline" size={s(18)} color={colors.accent.main} />
        </Pressable>
        <Pressable
          style={[
            styles.bookBtn,
            { paddingVertical: s(8), paddingHorizontal: s(12), borderRadius: s(100) },
          ]}
          onPress={onBookNow}
        >
          <Text style={[styles.bookText, { fontSize: s(12) }]}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function MobilePackageDetailsScreen({ onBookNow }: MobilePackageDetailsProps) {
  const { s } = useHomeScale();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState('day-1');
  const carouselRef = useRef<ScrollView>(null);
  const slides = [0, 1, 2];

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

  const goToPackage = (id: string) => {
    router.push({ pathname: '/package/[id]', params: { id } });
  };

  return (
    <View style={styles.container}>
      <PackageDetailHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: s(100) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroWrap, { height: s(312), marginHorizontal: s(16), marginTop: s(8), borderRadius: s(24) }]}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onCarouselScroll}
            style={{ borderRadius: s(24), overflow: 'hidden' }}
          >
            {slides.map((i) => (
              <View key={i} style={{ width: SCREEN_WIDTH - s(32), height: s(312) }}>
                <Image source={PACKAGE_EXPANDED_IMAGE} style={styles.heroImage} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.coupleBadge,
              { paddingVertical: s(6), paddingHorizontal: s(16), borderRadius: s(24), bottom: s(8), left: s(8) },
            ]}
          >
            <Ionicons name="people-outline" size={s(11)} color="#FFFFFF" />
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

          <Pressable
            style={[styles.carouselArrow, { width: s(32), height: s(32), borderRadius: s(16), left: s(12) }]}
            onPress={() => goToSlide('prev')}
          >
            <Ionicons name="chevron-back" size={s(18)} color={colors.text.primary} />
          </Pressable>
          <Pressable
            style={[styles.carouselArrow, { width: s(32), height: s(32), borderRadius: s(16), right: s(12) }]}
            onPress={() => goToSlide('next')}
          >
            <Ionicons name="chevron-forward" size={s(18)} color={colors.text.primary} />
          </Pressable>

          <View style={[styles.carouselDots, { bottom: s(12) }]}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={[styles.content, { paddingHorizontal: s(16), gap: s(20), paddingTop: s(16) }]}>
          <Text style={[styles.title, { fontSize: s(20), lineHeight: s(28) }]}>
            {FIGMA_PACKAGE_DETAIL.title}
          </Text>

          <View style={[styles.metaRow, { gap: s(8) }]}>
            <View style={[styles.coupleTag, { paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(24) }]}>
              <Text style={[styles.coupleTagText, { fontSize: s(10) }]}>{FIGMA_PACKAGE_DETAIL.coupleLabel}</Text>
            </View>
            <View style={[styles.ratingPill, { paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(24), gap: s(4) }]}>
              <Ionicons name="star" size={s(12)} color={colors.accent.main} />
              <Text style={[styles.ratingText, { fontSize: s(14) }]}>{FIGMA_PACKAGE_DETAIL.rating}</Text>
            </View>
            <Text style={[styles.divider, { fontSize: s(12) }]}>|</Text>
            <Text style={[styles.customers, { fontSize: s(14) }]}>
              <Text style={styles.customersAccent}>500+</Text>
              {' '}
              <Text style={styles.customersAccent}>customers</Text>
            </Text>
          </View>

          <View style={[styles.overviewCard, { padding: s(16), borderRadius: s(18), gap: s(18) }]}>
            <Text style={[styles.description, { fontSize: s(10), lineHeight: s(12) }]}>
              {FIGMA_PACKAGE_DETAIL.description}
            </Text>

            <View style={[styles.highlightsBox, { padding: s(12), borderRadius: s(12), gap: s(12) }]}>
              <View style={[styles.highlightsHeader, { paddingHorizontal: s(12), paddingVertical: s(4), borderRadius: s(24) }]}>
                <Text style={[styles.highlightsTitle, { fontSize: s(12) }]}>
                  {FIGMA_PACKAGE_DETAIL.highlightsTitle}
                </Text>
              </View>
              {FIGMA_PACKAGE_DETAIL.highlights.map((row, i) => (
                <View key={i} style={[styles.highlightRow, { gap: s(24) }]}>
                  <Text style={[styles.highlightText, { fontSize: s(12), flex: 1 }]}>{row.left}</Text>
                  <View style={[styles.highlightDot, { width: s(4), height: s(4), borderRadius: s(2) }]} />
                  <Text style={[styles.highlightText, { fontSize: s(12), flex: 1, textAlign: 'right' }]}>
                    {row.right}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ gap: s(12) }}>
              <View style={styles.providesHeader}>
                <Text style={[styles.providesTitle, { fontSize: s(12) }]}>{FIGMA_PACKAGE_DETAIL.providesTitle}</Text>
                <Text style={[styles.providesLink, { fontSize: s(10) }]}>{FIGMA_PACKAGE_DETAIL.providesLink}</Text>
              </View>
              <View style={{ gap: s(16) }}>
                <View style={[styles.providesRow, { gap: s(16) }]}>
                  {FIGMA_PACKAGE_DETAIL.provides.slice(0, 2).map((item) => (
                    <View key={item.id} style={[styles.provideChip, { padding: s(4), borderRadius: s(40), gap: s(12) }]}>
                      <View style={[styles.provideIcon, { padding: s(6), borderRadius: s(100) }]}>
                        <Ionicons name={item.icon} size={s(12)} color={colors.accent.main} />
                      </View>
                      <Text style={[styles.provideLabel, { fontSize: s(10) }]}>{item.label}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.providesRow, { gap: s(16) }]}>
                  {FIGMA_PACKAGE_DETAIL.provides.slice(2).map((item) => (
                    <View key={item.id} style={[styles.provideChip, { padding: s(4), borderRadius: s(40), gap: s(12) }]}>
                      <View style={[styles.provideIcon, { padding: s(6), borderRadius: s(100) }]}>
                        <Ionicons name={item.icon} size={s(12)} color={colors.accent.main} />
                      </View>
                      <Text style={[styles.provideLabel, { fontSize: s(10) }]}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <PriceActionBlock onBookNow={onBookNow} />
          </View>

          <Text style={[styles.sectionTitle, { fontSize: s(20), lineHeight: s(28) }]}>
            {FIGMA_PACKAGE_DETAIL.itineraryTitle}
          </Text>

          {PACKAGE_ITINERARY_DAYS.map((day) => {
            const isExpanded = expandedDay === day.id;
            return (
              <View
                key={day.id}
                style={[styles.dayCard, { padding: s(16), borderRadius: s(18), gap: isExpanded ? s(16) : 0 }]}
              >
                <Pressable
                  style={[styles.dayHeader, { gap: s(24) }]}
                  onPress={() => setExpandedDay(isExpanded ? '' : day.id)}
                >
                  <View style={[styles.dayTab, { paddingHorizontal: s(16), paddingVertical: s(12), borderRadius: s(8) }]}>
                    <Text style={[styles.dayTabText, { fontSize: s(16), lineHeight: s(24) }]}>{day.label}</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={s(18)}
                    color={colors.text.primary}
                  />
                </Pressable>

                {isExpanded && day.id === 'day-1' ? (
                  <>
                    <Text style={[styles.daySubtitle, { fontSize: s(12), lineHeight: s(16) }]}>
                      {PACKAGE_DAY_ONE.subtitle}
                    </Text>
                    <View style={[styles.separator, { height: s(8) }]} />
                    <Text style={[styles.dayBody, { fontSize: s(10), lineHeight: s(12) }]}>
                      {PACKAGE_DAY_ONE.body}
                    </Text>
                    <View style={[styles.activitiesBox, { padding: s(8), borderRadius: s(12), gap: s(8) }]}>
                      {PACKAGE_DAY_ONE.activities.map((act) => (
                        <View
                          key={act.label}
                          style={[styles.activityRow, { paddingHorizontal: s(16), paddingVertical: s(8), borderRadius: s(24), gap: s(10) }]}
                        >
                          <Ionicons name={act.icon} size={s(14)} color={colors.text.primary} />
                          <Text style={[styles.activityLabel, { fontSize: s(10) }]}>{act.label}</Text>
                        </View>
                      ))}
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -s(4) }}>
                      <View style={[styles.dayImages, { gap: s(16) }]}>
                        {[0, 1, 2, 3].map((i) => (
                          <View key={i} style={[styles.dayImage, { width: s(73), height: s(73), borderRadius: s(8) }]}>
                            <Image source={PACKAGE_EXPANDED_IMAGE} style={styles.dayImageInner} resizeMode="cover" />
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                    <View style={[styles.purpleRow, { padding: s(4), borderRadius: s(40), gap: s(16) }]}>
                      <View style={[styles.purpleTag, { paddingHorizontal: s(12), paddingVertical: s(4), borderRadius: s(24), gap: s(10) }]}>
                        <Ionicons name="business-outline" size={s(14)} color="#FFFFFF" />
                        <Text style={[styles.purpleTagText, { fontSize: s(10) }]}>Hotel</Text>
                      </View>
                      <Text style={[styles.purpleDetail, { fontSize: s(10), flex: 1 }]}>{PACKAGE_DAY_ONE.hotel}</Text>
                    </View>
                    <View style={[styles.purpleRow, { padding: s(4), borderRadius: s(40), gap: s(16) }]}>
                      <View style={[styles.purpleTag, { paddingHorizontal: s(12), paddingVertical: s(4), borderRadius: s(24), gap: s(10) }]}>
                        <Ionicons name="leaf-outline" size={s(14)} color="#FFFFFF" />
                        <Text style={[styles.purpleTagText, { fontSize: s(10) }]}>Activity</Text>
                      </View>
                      <Text style={[styles.purpleDetail, { fontSize: s(10), flex: 1 }]}>{PACKAGE_DAY_ONE.activity}</Text>
                    </View>
                    <Pressable
                      style={[
                        styles.contactBtn,
                        { height: s(36), borderRadius: s(100), paddingHorizontal: s(12), gap: s(8) },
                      ]}
                    >
                      <Ionicons name="call-outline" size={s(14)} color={colors.text.primary} />
                      <Text style={[styles.contactText, { fontSize: s(12) }]}>
                        Contact us for full itinerary
                      </Text>
                    </Pressable>
                  </>
                ) : null}
              </View>
            );
          })}

          <ResortAmenitiesSection />

          <View style={[styles.tripCard, { padding: s(24), borderRadius: s(24), gap: s(36) }]}>
            <View style={{ gap: s(8), paddingVertical: s(12) }}>
              <Text style={[styles.tripTitle, { fontSize: s(16), lineHeight: s(24) }]}>
                {FIGMA_PACKAGE_DETAIL.tripHighlightsTitle}
              </Text>
              {PACKAGE_TRIP_HIGHLIGHTS.map((item, i) => (
                <View key={i} style={[styles.bulletRow, { gap: s(8) }]}>
                  <Text style={[styles.bullet, { fontSize: s(14) }]}>•</Text>
                  <Text style={[styles.bulletText, { fontSize: s(14), lineHeight: s(18), flex: 1 }]}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.dividerRow}>
              <View style={[styles.dividerAccent, { height: s(2) }]} />
              <View style={[styles.dividerMuted, { height: s(2) }]} />
            </View>
            <View style={{ gap: s(8), paddingVertical: s(12) }}>
              <Text style={[styles.exclusionsTitle, { fontSize: s(16), lineHeight: s(24) }]}>
                {FIGMA_PACKAGE_DETAIL.exclusionsTitle}
              </Text>
              {PACKAGE_EXCLUSIONS.map((item, i) => (
                <View key={i} style={[styles.bulletRow, { gap: s(8) }]}>
                  <Text style={[styles.bullet, { fontSize: s(14) }]}>•</Text>
                  <Text style={[styles.bulletText, { fontSize: s(14), lineHeight: s(18), flex: 1 }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.reviewsCard, { padding: s(12), borderRadius: s(24), gap: s(12) }]}>
            <Text style={[styles.reviewsTitle, { fontSize: s(16), lineHeight: s(34), paddingHorizontal: s(4) }]}>
              Customer Reviews
            </Text>
            {PACKAGE_REVIEWS.map((review) => (
              <View key={review.id}>
                <View style={[styles.reviewCard, { padding: s(18), borderRadius: s(12), gap: s(12) }]}>
                  <View style={[styles.reviewHeader, { gap: s(12) }]}>
                    <View style={[styles.avatar, { width: s(53), height: s(53), borderRadius: s(26.5) }]}>
                      <Text style={[styles.avatarText, { fontSize: s(18) }]}>A</Text>
                    </View>
                    <View style={{ flex: 1, gap: s(12) }}>
                      <Text style={[styles.reviewName, { fontSize: s(12), lineHeight: s(12) }]}>{review.name}</Text>
                      <View style={[styles.starsRow, { gap: s(10) }]}>
                        <View style={{ flexDirection: 'row', gap: s(2) }}>
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Ionicons key={i} name="star" size={s(12)} color={colors.accent.main} />
                          ))}
                          <Ionicons name="star-half" size={s(12)} color={colors.accent.main} />
                        </View>
                        <Text style={[styles.reviewRating, { fontSize: s(12) }]}>{review.ratingLabel}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.reviewText, { fontSize: s(10), lineHeight: s(12) }]}>{review.text}</Text>
                </View>
                <View style={[styles.dividerRow, { marginVertical: s(12) }]}>
                  <View style={[styles.dividerAccent, { height: 1 }]} />
                  <View style={[styles.dividerMuted, { height: 1 }]} />
                </View>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.footerCard,
              {
                paddingHorizontal: s(12),
                paddingVertical: s(16),
                borderRadius: s(24),
                gap: s(18),
              },
            ]}
          >
            <View style={{ gap: s(16), paddingHorizontal: s(4), paddingVertical: s(8) }}>
              <Text style={[styles.footerAccentTitle, { fontSize: s(16), lineHeight: s(34) }]}>
                {FIGMA_PACKAGE_DETAIL.shortTitle}
              </Text>
              <Text style={[styles.footerNights, { fontSize: s(16), lineHeight: s(34) }]}>
                {FIGMA_PACKAGE_DETAIL.nightsShort}
              </Text>
            </View>
            <PriceActionBlock onBookNow={onBookNow} compact />
          </View>

          <View style={{ paddingVertical: s(24), gap: s(24), alignItems: 'center' }}>
            <View style={[styles.dividerRow, { width: '100%', paddingHorizontal: s(16) }]}>
              <View style={[styles.dividerAccent, { height: 1 }]} />
              <View style={[styles.dividerMuted, { height: 1 }]} />
            </View>
            <Text style={[styles.exploreTitle, { fontSize: s(16), lineHeight: s(51) }]}>
              Explore more options
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: s(16), gap: s(12) }}>
              {FIGMA_PACKAGE_EXPLORE.map((pkg) => (
                <Pressable
                  key={pkg.id}
                  style={[styles.exploreCard, { padding: s(8), borderRadius: s(24), gap: s(16), width: s(177) }]}
                  onPress={() => goToPackage(pkg.id)}
                >
                  <View style={[styles.exploreImageWrap, { height: s(132), borderRadius: s(18) }]}>
                    <Image source={PACKAGE_EXPANDED_IMAGE} style={styles.exploreImage} resizeMode="cover" />
                    <View style={[styles.exploreHeart, { width: s(30), height: s(30), borderRadius: s(12) }]}>
                      <HeartIcon width={s(14)} height={s(14)} />
                    </View>
                    <View style={[styles.exploreBadge, { paddingHorizontal: s(16), paddingVertical: s(6), borderRadius: s(24), gap: s(10) }]}>
                      <Ionicons name="people-outline" size={s(11)} color="#FFFFFF" />
                      <Text style={[styles.exploreBadgeText, { fontSize: s(8) }]}>{pkg.badge}</Text>
                    </View>
                  </View>
                  <View style={{ gap: s(18) }}>
                    <View style={{ gap: s(12), paddingHorizontal: s(2) }}>
                      <Text style={[styles.exploreCardTitle, { fontSize: s(11), lineHeight: s(16) }]} numberOfLines={2}>
                        {pkg.title}
                      </Text>
                      <View style={[styles.durationPill, { paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(24), height: s(16) }]}>
                        <Text style={[styles.durationText, { fontSize: s(8) }]}>{pkg.duration}</Text>
                      </View>
                      <View style={styles.exploreMeta}>
                        <View style={[styles.locationPill, { paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(24), gap: s(4) }]}>
                          <Ionicons name="location-outline" size={s(8)} color={colors.accent.main} />
                          <Text style={[styles.locationText, { fontSize: s(8) }]}>{pkg.location}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(2) }}>
                          <Ionicons name="star" size={s(8)} color={colors.accent.main} />
                          <Text style={[styles.exploreRating, { fontSize: s(8) }]}>{pkg.rating}</Text>
                        </View>
                      </View>
                      <View style={styles.explorePriceRow}>
                        <Text style={[styles.explorePrice, { fontSize: s(14) }]}>{pkg.price}</Text>
                        <Text style={[styles.explorePriceSub, { fontSize: s(8) }]}>{pkg.priceSub}</Text>
                      </View>
                    </View>
                    <Pressable
                      style={[styles.exploreBookBtn, { paddingLeft: s(18), paddingRight: s(4), paddingVertical: s(4), borderRadius: s(9999) }]}
                      onPress={() => goToPackage(pkg.id)}
                    >
                      <Text style={[styles.exploreBookText, { fontSize: s(10) }]}>Book Now</Text>
                      <View style={[styles.exploreBookIcon, { width: s(26), height: s(26), borderRadius: s(13) }]}>
                        <Ionicons name="water-outline" size={s(16)} color="#FFFFFF" />
                      </View>
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <Text
              style={[
                styles.footerText,
                { fontSize: s(10), lineHeight: s(15), paddingHorizontal: s(20), textAlign: 'center' },
              ]}
            >
              {FIGMA_PACKAGE_DETAIL.footerText}
            </Text>
          </View>
        </View>
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
  heroWrap: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    width: '100%',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  coupleTag: {
    backgroundColor: 'rgba(255, 0, 229, 0.1)',
  },
  coupleTagText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#FF00E5',
    letterSpacing: 0.04,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  divider: {
    color: 'rgba(0, 7, 20, 0.62)',
  },
  customers: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: 0.04,
  },
  customersAccent: {
    color: colors.accent.main,
  },
  overviewCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
  highlightsBox: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
  },
  highlightsHeader: {
    backgroundColor: colors.accent.main,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  highlightsTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    letterSpacing: 0.04,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  highlightDot: {
    backgroundColor: colors.accent.main,
  },
  providesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providesTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  providesLink: {
    fontFamily: typography.fontFamily.text,
    fontWeight: '300',
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  providesRow: {
    flexDirection: 'row',
  },
  provideChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  provideIcon: {
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
  },
  provideLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.8)',
    letterSpacing: 0.04,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.2)',
  },
  nightsPerson: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  cancellation: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: '#138808',
  },
  price: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  tax: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    textAlign: 'right',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text.primary,
  },
  contactText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  actionRow: {
    flexDirection: 'row',
  },
  wishlistBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent.main,
  },
  wishlistText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  bookBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.main,
  },
  bookText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTab: {
    flex: 1,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
  },
  dayTabText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  daySubtitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
  },
  separator: {
    backgroundColor: 'transparent',
  },
  dayBody: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
  activitiesBox: {
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
  },
  activityLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  dayImages: {
    flexDirection: 'row',
  },
  dayImage: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  dayImageInner: {
    width: '100%',
    height: '100%',
  },
  purpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 35, 157, 0.05)',
  },
  purpleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5E239D',
    minWidth: 88,
  },
  purpleTagText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    letterSpacing: 0.04,
  },
  purpleDetail: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: '#5E239D',
    letterSpacing: 0.04,
  },
  tripCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    backgroundColor: colors.surface.white,
  },
  tripTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    color: 'rgba(0, 7, 20, 0.62)',
  },
  bulletText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
  dividerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dividerAccent: {
    flex: 1,
    backgroundColor: colors.accent.main,
  },
  dividerMuted: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.2)',
  },
  exclusionsTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#E52E2E',
  },
  reviewsCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
  },
  reviewsTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  reviewCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12.5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(229, 77, 46, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  reviewName: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRating: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  reviewText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
  footerCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  footerAccentTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  footerNights: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  exploreTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
    width: '100%',
  },
  exploreCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12.5,
    elevation: 3,
  },
  exploreImageWrap: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
  },
  exploreImage: {
    width: '100%',
    height: '100%',
  },
  exploreHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12.5,
    elevation: 4,
  },
  exploreBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  exploreBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  exploreCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  durationPill: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  durationText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: '300',
    color: colors.text.primary,
  },
  exploreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
    height: 16,
  },
  locationText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: '300',
    color: colors.accent.main,
  },
  exploreRating: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  explorePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  explorePrice: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: 'rgba(28, 32, 36, 0.8)',
    letterSpacing: 0.04,
  },
  explorePriceSub: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.8)',
    letterSpacing: 0.04,
  },
  exploreBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.text.primary,
  },
  exploreBookText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FCFCFC',
    letterSpacing: 0.04,
  },
  exploreBookIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
});
