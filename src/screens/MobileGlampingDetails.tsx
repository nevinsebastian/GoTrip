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
import { GlampingDetailHeader } from '@/src/components/glamping/GlampingDetailHeader';
import { ResortAmenitiesSection } from '@/src/components/resort/ResortAmenitiesSection';
import { FIGMA_GLAMPING_EXPLORE } from '@/src/constants/glampingDetailConstants';
import type { CategoryDetailDisplay } from '@/src/utils/categoryDetailDisplay';
import {
  carouselImagesFromDisplay,
  mergeGlampingDetailContent,
  reviewsFromDisplay,
} from '@/src/utils/mergeCategoryDetailContent';
import { GLAMPING_EXPANDED_IMAGE } from '@/src/constants/placeholderImages';
import { openLocationInMaps } from '@/src/utils/openLocationInMaps';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GLAMPING_REVIEWS = [
  {
    id: '1',
    name: 'Mr. Ashish Kumar',
    ratingLabel: '4.0/5',
    text: 'I had a pleasant stay at the hotel. The rooms were clean and comfortable, with all the basic amenities needed for a relaxing visit.',
  },
  {
    id: '2',
    name: 'Mr. Ashish Kumar',
    ratingLabel: '4.0/5',
    text: 'I had a pleasant stay at the hotel. The rooms were clean and comfortable, with all the basic amenities needed for a relaxing visit.',
  },
];

export type MobileGlampingDetailsProps = {
  onBookNow: () => void;
  display?: CategoryDetailDisplay;
  bookCtaLabel?: string;
};

export function MobileGlampingDetailsScreen({
  onBookNow,
  display,
  bookCtaLabel,
}: MobileGlampingDetailsProps) {
  const { s } = useHomeScale();
  const detailContent = mergeGlampingDetailContent(display);
  const bookLabel = bookCtaLabel ?? detailContent.primaryButtons.book;
  const reviewItems = reviewsFromDisplay(display) ?? GLAMPING_REVIEWS;
  const slides = carouselImagesFromDisplay(display);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const carouselRef = useRef<ScrollView>(null);

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

  const goToGlamping = (id: string) => {
    router.push({ pathname: '/glamping/[id]', params: { id } });
  };

  return (
    <View style={styles.container}>
      <GlampingDetailHeader />

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
            {slides.map((slide, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH - s(32), height: s(312) }}>
                <Image
                  source={typeof slide === 'object' && 'uri' in slide ? slide : GLAMPING_EXPANDED_IMAGE}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          <View style={[styles.carouselDots, { bottom: s(12) }]}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
            ))}
          </View>

          <View style={[styles.heroOverlay, { left: s(16), right: s(16), top: s(12) }]}>
            <View style={[styles.badge, { paddingVertical: s(6), paddingHorizontal: s(12), borderRadius: s(24), gap: s(10) }]}>
              <Ionicons name="heart-outline" size={s(10)} color="#FFFFFF" />
              <Text style={[styles.badgeText, { fontSize: s(9), lineHeight: s(12) }]}>COUPLE FRIENDLY</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: s(10) }}>
              <View style={[styles.heroIconBtn, { width: s(33), height: s(33), borderRadius: s(12) }]}>
                <Ionicons name="share-social-outline" size={s(16)} color={colors.text.primary} />
              </View>
              <View style={[styles.heroIconBtn, { width: s(33), height: s(33), borderRadius: s(12) }]}>
                <HeartIcon width={s(14)} height={s(14)} />
              </View>
            </View>
          </View>

          <View style={[styles.heroArrows, { left: s(16), right: s(16), bottom: s(52) }]}>
            <Pressable style={[styles.arrowBtn, { width: s(32), height: s(32), borderRadius: s(8) }]} onPress={() => goToSlide('prev')}>
              <Ionicons name="arrow-back" size={s(16)} color={colors.text.primary} />
            </Pressable>
            <Pressable style={[styles.arrowBtn, { width: s(32), height: s(32), borderRadius: s(8) }]} onPress={() => goToSlide('next')}>
              <Ionicons name="arrow-forward" size={s(16)} color={colors.text.primary} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.content, { paddingHorizontal: s(16), gap: s(20), paddingTop: s(16) }]}>
          <Text style={[styles.title, { fontSize: s(20), lineHeight: s(24) }]}>{detailContent.title}</Text>

          <View style={[styles.metaRow, { height: s(29) }]}>
            <Pressable
              style={[styles.locationPill, { paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(24), gap: s(4) }]}
              disabled={display?.latitude == null || display?.longitude == null}
              onPress={() => {
                if (display?.latitude == null || display?.longitude == null) return;
                void openLocationInMaps({
                  latitude: display.latitude,
                  longitude: display.longitude,
                  label: detailContent.locationLabel || detailContent.title,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Open location in maps"
            >
              <Ionicons name="location-outline" size={s(10)} color={colors.accent.main} />
              <Text style={[styles.locationText, { fontSize: s(12) }]}>{detailContent.locationLabel}</Text>
            </Pressable>

            <View style={styles.metaRight}>
              <View style={[styles.ratingRow, { gap: s(2), paddingRight: s(8) }]}>
                <Ionicons name="star" size={s(14)} color={colors.accent.main} />
                <Text style={[styles.ratingText, { fontSize: s(14) }]}>{detailContent.rating}</Text>
              </View>
              <Text style={[styles.divider, { fontSize: s(12) }]}>|</Text>
              <View style={{ paddingLeft: s(8) }}>
                <Text style={[styles.customers, { fontSize: s(14) }]}>
                  <Text style={styles.customersAccent}>500+</Text>
                  {' '}
                  <Text style={styles.customersAccent}>customers</Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.overviewCard, { padding: s(16), borderRadius: s(18), gap: s(18) }]}>
            <Text style={[styles.description, { fontSize: s(10), lineHeight: s(12) }]}>
              {detailContent.descriptionBlocks.join('\n')}
            </Text>

            <View style={[styles.highlightsBox, { padding: s(12), borderRadius: s(12), gap: s(16) }]}>
              <View style={[styles.highlightsHeader, { paddingHorizontal: s(12), paddingVertical: s(4), borderRadius: s(24) }]}>
                <Text style={[styles.highlightsTitle, { fontSize: s(12) }]}>{detailContent.highlightsTitle}</Text>
              </View>
              {detailContent.highlights.map((h) => (
                <Text key={h} style={[styles.highlightText, { fontSize: s(12), textAlign: 'center' }]}>{h}</Text>
              ))}
            </View>

            <View style={{ gap: s(12) }}>
              <View style={styles.providesHeader}>
                <Text style={[styles.providesTitle, { fontSize: s(12) }]}>{detailContent.providesTitle}</Text>
                <Text style={[styles.providesLink, { fontSize: s(10) }]}>{detailContent.providesLink}</Text>
              </View>

              <View style={{ gap: s(16) }}>
                <View style={[styles.providesRow, { gap: s(16) }]}>
                  {detailContent.provides.slice(0, 2).map((item) => (
                    <View key={item.id} style={[styles.provideChip, { padding: s(4), borderRadius: s(40), gap: s(12) }]}>
                      <View style={[styles.provideIcon, { padding: s(6), borderRadius: s(100) }]}>
                        <Ionicons name="flame-outline" size={s(12)} color={colors.accent.main} />
                      </View>
                      <Text style={[styles.provideLabel, { fontSize: s(10) }]}>{item.label}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.providesRow, { gap: s(16) }]}>
                  {detailContent.provides.slice(2).map((item) => (
                    <View key={item.id} style={[styles.provideChip, { padding: s(4), borderRadius: s(40), gap: s(12) }]}>
                      <View style={[styles.provideIcon, { padding: s(6), borderRadius: s(100) }]}>
                        <Ionicons name="cafe-outline" size={s(12)} color={colors.accent.main} />
                      </View>
                      <Text style={[styles.provideLabel, { fontSize: s(10) }]}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={[styles.priceBox, { padding: s(18), borderRadius: s(8), gap: s(18) }]}>
              <View style={{ flex: 1, gap: s(18) }}>
                <Text style={[styles.nightsPerson, { fontSize: s(12), lineHeight: s(24) }]}>
                  {detailContent.nightsLabel}
                </Text>
                <Text style={[styles.cancellation, { fontSize: s(10), lineHeight: s(24) }]}>
                  {detailContent.cancellationText}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: s(8) }}>
                <Text style={[styles.price, { fontSize: s(20), lineHeight: s(24) }]}>
                  {detailContent.priceLabel}
                </Text>
                <Text style={[styles.tax, { fontSize: s(8), lineHeight: s(16) }]}>
                  {detailContent.taxLabel}
                </Text>
              </View>
            </View>

            <View style={[styles.actionRow, { gap: s(12) }]}>
              <Pressable
                style={[styles.contactBtn, { height: s(36), borderRadius: s(100), paddingHorizontal: s(12), gap: s(8) }]}>
                <Ionicons name="call-outline" size={s(14)} color={colors.text.primary} />
                <Text style={[styles.contactText, { fontSize: s(12) }]}>{detailContent.primaryButtons.contact}</Text>
              </Pressable>

              <Pressable
                style={[styles.bookBtn, { height: s(36), borderRadius: s(100), paddingHorizontal: s(12) }]}
                onPress={onBookNow}
              >
                <Text style={[styles.bookText, { fontSize: s(12) }]}>{bookLabel}</Text>
              </Pressable>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { fontSize: s(20), lineHeight: s(28) }]}>{detailContent.itineraryTitle}</Text>

          <View style={[styles.dayCard, { padding: s(16), borderRadius: s(18), gap: expanded ? s(16) : 0 }]}>
            <Pressable style={[styles.dayHeader, { gap: s(24) }]} onPress={() => setExpanded((v) => !v)}>
              <View style={[styles.dayTab, { paddingHorizontal: s(16), paddingVertical: s(12), borderRadius: s(8) }]}>
                <Text style={[styles.dayTabText, { fontSize: s(16), lineHeight: s(24) }]}>
                  {detailContent.aboutCampingTitle}
                </Text>
              </View>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={s(18)}
                color={colors.text.primary}
              />
            </Pressable>

            {expanded ? (
              <>
                <Text style={[styles.daySubtitle, { fontSize: s(12), lineHeight: s(16) }]}>
                  {detailContent.aboutCampingSubtitle}
                </Text>
                <View style={[styles.separator, { height: s(8) }]} />
                <View style={{ gap: s(8) }}>
                  <Text style={[styles.dayBody, { fontSize: s(10), lineHeight: s(12) }]}>
                    {detailContent.aboutCampingBodyIntro}
                  </Text>
                  <View style={{ gap: s(4) }}>
                    {detailContent.aboutCampingBullets.map((b) => (
                      <View key={b} style={{ flexDirection: 'row', gap: s(8) }}>
                        <Text style={[styles.bullet, { fontSize: s(10), lineHeight: s(14) }]}>•</Text>
                        <Text style={[styles.dayBody, { fontSize: s(10), lineHeight: s(14), flex: 1 }]}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.orangeBox, { padding: s(16), borderRadius: s(12), gap: s(24) }]}>
                  <View style={{ gap: s(24) }}>
                    <View style={[styles.orangeHeader, { paddingHorizontal: s(12), paddingVertical: s(8), borderRadius: s(24), gap: s(10) }]}>
                      <Ionicons name="bag-add-outline" size={s(16)} color="#FFFFFF" />
                      <Text style={[styles.orangeHeaderText, { fontSize: s(12) }]}>{detailContent.thingsToCarryTitle}</Text>
                    </View>
                    <View style={{ gap: s(4) }}>
                      {detailContent.thingsToCarry.map((t) => (
                        <View key={t} style={{ flexDirection: 'row', gap: s(8) }}>
                          <Text style={[styles.orangeBullet, { fontSize: s(10), lineHeight: s(14) }]}>•</Text>
                          <Text style={[styles.orangeListText, { fontSize: s(10), lineHeight: s(14), flex: 1 }]}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={{ gap: s(24) }}>
                    <View style={[styles.orangeHeader, { paddingHorizontal: s(12), paddingVertical: s(8), borderRadius: s(24), gap: s(10) }]}>
                      <Ionicons name="navigate-outline" size={s(16)} color="#FFFFFF" />
                      <Text style={[styles.orangeHeaderText, { fontSize: s(12) }]}>{detailContent.howToReachTitle}</Text>
                    </View>
                    <View style={{ gap: s(4) }}>
                      {detailContent.howToReach.map((t) => (
                        <View key={t} style={{ flexDirection: 'row', gap: s(8) }}>
                          <Text style={[styles.orangeBullet, { fontSize: s(10), lineHeight: s(14) }]}>•</Text>
                          <Text style={[styles.orangeListText, { fontSize: s(10), lineHeight: s(14), flex: 1 }]}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={[styles.imageGrid, { height: s(198), gap: s(16) }]}>
                  <View style={{ flex: 1, flexDirection: 'row', gap: s(16) }}>
                    <View style={[styles.gridCell, { borderRadius: s(8) }]}>
                      <Image source={GLAMPING_EXPANDED_IMAGE} style={styles.gridImg} resizeMode="cover" />
                    </View>
                    <View style={[styles.gridCell, { borderRadius: s(8) }]}>
                      <Image source={GLAMPING_EXPANDED_IMAGE} style={styles.gridImg} resizeMode="cover" />
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', gap: s(16) }}>
                    <View style={[styles.gridCell, { borderRadius: s(8) }]}>
                      <Image source={GLAMPING_EXPANDED_IMAGE} style={styles.gridImg} resizeMode="cover" />
                    </View>
                    <View style={[styles.gridCell, { borderRadius: s(8) }]}>
                      <Image source={GLAMPING_EXPANDED_IMAGE} style={styles.gridImg} resizeMode="cover" />
                    </View>
                  </View>
                </View>

                <View style={[styles.noteBox, { padding: s(16), borderRadius: s(12), gap: s(12) }]}>
                  <View style={[styles.noteHeader, { paddingVertical: s(4), paddingHorizontal: s(12), borderRadius: s(24) }]}>
                    <Text style={[styles.noteHeaderText, { fontSize: s(10) }]}>{detailContent.noteTitle}</Text>
                  </View>
                  <Text style={[styles.noteText, { fontSize: s(10), lineHeight: s(16) }]}>{detailContent.noteBody}</Text>
                </View>

                <Pressable style={[styles.fullItineraryBtn, { height: s(36), borderRadius: s(100), paddingHorizontal: s(12), gap: s(8) }]}>
                  <Ionicons name="call-outline" size={s(14)} color={colors.text.primary} />
                  <Text style={[styles.contactText, { fontSize: s(12) }]}>{detailContent.fullItineraryCta}</Text>
                </Pressable>
              </>
            ) : null}
          </View>

          <View style={[styles.tripCard, { padding: s(24), borderRadius: s(24), gap: s(18) }]}>
            <View style={{ gap: s(8) }}>
              <Text style={[styles.inclusionsTitle, { fontSize: s(14), lineHeight: s(24) }]}>
                {detailContent.inclusionsTitle}
              </Text>
              {detailContent.inclusions.map((item) => (
                <View key={item} style={{ flexDirection: 'row', gap: s(8) }}>
                  <Text style={[styles.bullet, { fontSize: s(10), lineHeight: s(14) }]}>•</Text>
                  <Text style={[styles.tripText, { fontSize: s(10), lineHeight: s(14), flex: 1 }]}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={{ gap: s(8) }}>
              <Text style={[styles.exclusionsTitle, { fontSize: s(14), lineHeight: s(24) }]}>
                {detailContent.exclusionsTitle}
              </Text>
              {detailContent.exclusions.map((item) => (
                <View key={item} style={{ flexDirection: 'row', gap: s(8) }}>
                  <Text style={[styles.bullet, { fontSize: s(10), lineHeight: s(14) }]}>•</Text>
                  <Text style={[styles.tripText, { fontSize: s(10), lineHeight: s(14), flex: 1 }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <ResortAmenitiesSection />

          <View style={[styles.reviewsCard, { padding: s(12), borderRadius: s(24), gap: s(12) }]}>
            <Text style={[styles.reviewsTitle, { fontSize: s(16), lineHeight: s(34), paddingHorizontal: s(4) }]}>
              Customer Reviews
            </Text>
            {reviewItems.map((review) => (
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

          <View style={{ paddingVertical: s(24), gap: s(24), alignItems: 'center' }}>
            <View style={[styles.dividerRow, { width: '100%', paddingHorizontal: s(16) }]}>
              <View style={[styles.dividerAccent, { height: 1 }]} />
              <View style={[styles.dividerMuted, { height: 1 }]} />
            </View>
            <Text style={[styles.exploreTitle, { fontSize: s(16), lineHeight: s(51) }]}>Explore more options</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: s(16), gap: s(12) }}>
              {FIGMA_GLAMPING_EXPLORE.map((item) => (
                <Pressable
                  key={item.id}
                  style={[styles.exploreCard, { padding: s(6), borderRadius: s(24), gap: s(16), width: s(170) }]}
                  onPress={() => goToGlamping(item.id)}
                >
                  <View style={[styles.exploreImageWrap, { height: s(132), borderRadius: s(18) }]}>
                    <Image source={GLAMPING_EXPANDED_IMAGE} style={styles.exploreImage} resizeMode="cover" />
                    <View style={[styles.exploreHeart, { width: s(33), height: s(33), borderRadius: s(12) }]}>
                      <HeartIcon width={s(14)} height={s(14)} />
                    </View>
                    <View style={[styles.exploreBadge, { paddingHorizontal: s(12), paddingVertical: s(6), borderRadius: s(24), gap: s(10) }]}>
                      <Ionicons name="heart-outline" size={s(10)} color="#FFFFFF" />
                      <Text style={[styles.exploreBadgeText, { fontSize: s(9) }]}>{item.badge}</Text>
                    </View>
                  </View>
                  <View style={{ gap: s(18) }}>
                    <View style={{ gap: s(12), paddingHorizontal: s(2) }}>
                      <Text style={[styles.exploreCardTitle, { fontSize: s(11), lineHeight: s(16) }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <View style={[styles.exploreMeta, { paddingVertical: s(4) }]}>
                        <View style={[styles.locationPillMini, { paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(24), gap: s(4) }]}>
                          <Ionicons name="location-outline" size={s(8)} color={colors.accent.main} />
                          <Text style={[styles.locationMiniText, { fontSize: s(8) }]}>{item.location}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(2) }}>
                          <Ionicons name="star" size={s(10)} color={colors.accent.main} />
                          <Text style={[styles.exploreRating, { fontSize: s(10) }]}>{item.rating}</Text>
                        </View>
                      </View>
                      <View style={styles.explorePriceRow}>
                        <Text style={[styles.explorePrice, { fontSize: s(14) }]}>{item.price}</Text>
                        <Text style={[styles.explorePriceSub, { fontSize: s(8) }]}>{item.priceSub}</Text>
                      </View>
                    </View>

                    <Pressable
                      style={[styles.exploreBookBtn, { paddingLeft: s(18), paddingRight: s(4), paddingVertical: s(4), borderRadius: s(9999) }]}
                      onPress={() => goToGlamping(item.id)}
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

            <Pressable style={[styles.viewAllPill, { paddingVertical: s(5), paddingHorizontal: s(12), borderRadius: s(100) }]}>
              <Text style={[styles.viewAllText, { fontSize: s(12) }]}>{`View all ->`}</Text>
            </Pressable>

            <View style={[styles.dividerRow, { width: '100%', paddingHorizontal: s(16) }]}>
              <View style={[styles.dividerAccent, { height: 1 }]} />
              <View style={[styles.dividerMuted, { height: 1 }]} />
            </View>

            <Text style={[styles.footerText, { fontSize: s(8), lineHeight: s(10), paddingHorizontal: s(20), textAlign: 'center' }]}>
              {detailContent.footerText}
            </Text>
          </View>
        </View>
      </ScrollView>

      <MobileBottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  scroll: { flex: 1 },
  heroWrap: {
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  carouselDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  dotActive: { backgroundColor: '#FFFFFF', width: 8, height: 8, borderRadius: 4 },
  heroOverlay: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#FFFFFF' },
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
  heroArrows: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' },
  arrowBtn: {
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 4,
  },
  content: { width: '100%' },
  title: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationPill: { backgroundColor: 'rgba(229, 77, 46, 0.1)', flexDirection: 'row', alignItems: 'center' },
  locationText: { fontFamily: typography.fontFamily.text, fontWeight: '300', color: colors.accent.main },
  metaRight: { flexDirection: 'row', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.accent.main, letterSpacing: 0.04 },
  divider: { color: 'rgba(0, 7, 20, 0.62)' },
  customers: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, letterSpacing: 0.04 },
  customersAccent: { color: colors.accent.main },
  overviewCard: { borderWidth: 1, borderColor: 'rgba(28, 32, 36, 0.1)', backgroundColor: colors.surface.white },
  description: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(0, 7, 20, 0.62)', letterSpacing: 0.04 },
  highlightsBox: { backgroundColor: 'rgba(229, 77, 46, 0.05)' },
  highlightsHeader: { backgroundColor: colors.accent.main, alignSelf: 'stretch', alignItems: 'center' },
  highlightsTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: '#FFFFFF', letterSpacing: 0.04 },
  highlightText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.accent.main, letterSpacing: 0.04 },
  providesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  providesTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary },
  providesLink: { fontFamily: typography.fontFamily.text, fontWeight: '300', color: colors.accent.main, letterSpacing: 0.04 },
  providesRow: { flexDirection: 'row' },
  provideChip: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(28, 32, 36, 0.05)' },
  provideIcon: { backgroundColor: 'rgba(229, 77, 46, 0.1)' },
  provideLabel: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(28, 32, 36, 0.8)', letterSpacing: 0.04 },
  priceBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(229, 77, 46, 0.2)' },
  nightsPerson: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary },
  cancellation: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: '#138808' },
  price: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: colors.accent.main },
  tax: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(0, 7, 20, 0.62)', textAlign: 'right' },
  actionRow: { flexDirection: 'row' },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.text.primary },
  contactText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary },
  bookBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent.main },
  bookText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#FFFFFF' },
  sectionTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary },
  dayCard: { borderWidth: 1, borderColor: 'rgba(28, 32, 36, 0.2)' },
  dayHeader: { flexDirection: 'row', alignItems: 'center' },
  dayTab: { flex: 1, backgroundColor: colors.accent.main, alignItems: 'center' },
  dayTabText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#FFFFFF' },
  daySubtitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.text.primary },
  separator: { backgroundColor: 'transparent' },
  dayBody: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(0, 7, 20, 0.62)', letterSpacing: 0.04 },
  bullet: { color: 'rgba(0, 7, 20, 0.62)' },
  orangeBox: { backgroundColor: 'rgba(229, 77, 46, 0.05)' },
  orangeHeader: { backgroundColor: colors.accent.main, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  orangeHeaderText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: '#FFFFFF', letterSpacing: 0.04 },
  orangeBullet: { color: colors.accent.main },
  orangeListText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.accent.main, letterSpacing: 0.04 },
  imageGrid: { width: '100%' },
  gridCell: { flex: 1, overflow: 'hidden', borderWidth: 1, borderColor: '#FFFFFF' },
  gridImg: { width: '100%', height: '100%' },
  noteBox: { backgroundColor: 'rgba(94, 35, 157, 0.05)' },
  noteHeader: { backgroundColor: '#5E239D', alignSelf: 'stretch', alignItems: 'center' },
  noteHeaderText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: '#FFFFFF', letterSpacing: 0.04 },
  noteText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: '#5E239D', letterSpacing: 0.04 },
  fullItineraryBtn: { borderWidth: 1, borderColor: colors.text.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  tripCard: { borderWidth: 1, borderColor: 'rgba(28, 32, 36, 0.2)', backgroundColor: colors.surface.white },
  inclusionsTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#2AE95A' },
  exclusionsTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#E52E2E' },
  tripText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(0, 7, 20, 0.62)', letterSpacing: 0.04 },
  reviewsCard: { backgroundColor: colors.surface.white, borderWidth: 1, borderColor: 'rgba(28, 32, 36, 0.2)' },
  reviewsTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary },
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
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: 'rgba(229, 77, 46, 0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: colors.accent.main },
  reviewName: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: colors.text.primary },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  reviewRating: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.accent.main, letterSpacing: 0.04 },
  reviewText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(0, 7, 20, 0.62)', letterSpacing: 0.04 },
  dividerRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  dividerAccent: { flex: 1, backgroundColor: colors.accent.main },
  dividerMuted: { flex: 1, backgroundColor: 'rgba(28, 32, 36, 0.2)' },
  exploreTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: colors.text.primary, textAlign: 'center', width: '100%' },
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
  exploreImageWrap: { overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.4)', position: 'relative' },
  exploreImage: { width: '100%', height: '100%' },
  exploreHeart: { position: 'absolute', top: 8, right: 6, backgroundColor: colors.surface.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12.5, elevation: 4 },
  exploreBadge: { position: 'absolute', bottom: 7, left: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  exploreBadgeText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#FFFFFF' },
  exploreCardTitle: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.text.primary, letterSpacing: 0.04 },
  exploreMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationPillMini: { backgroundColor: 'rgba(229, 77, 46, 0.1)', flexDirection: 'row', alignItems: 'center' },
  locationMiniText: { fontFamily: typography.fontFamily.text, fontWeight: '300', color: colors.accent.main },
  exploreRating: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.accent.main, letterSpacing: 0.04 },
  explorePriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  explorePrice: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.semibold, color: 'rgba(28, 32, 36, 0.8)', letterSpacing: 0.04 },
  explorePriceSub: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(28, 32, 36, 0.8)', letterSpacing: 0.04 },
  exploreBookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.text.primary, borderWidth: 1, borderColor: colors.text.primary },
  exploreBookText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.medium, color: '#FCFCFC', letterSpacing: 0.04 },
  exploreBookIcon: { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  viewAllPill: { borderWidth: 1, borderColor: colors.accent.main, alignItems: 'center', justifyContent: 'center' },
  viewAllText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: colors.accent.main, letterSpacing: 0.04 },
  footerText: { fontFamily: typography.fontFamily.text, fontWeight: typography.fontWeight.regular, color: 'rgba(28,32,36,0.8)', letterSpacing: 0.04 },
});

