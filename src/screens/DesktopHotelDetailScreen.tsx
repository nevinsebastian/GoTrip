import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import type { Listing, ListingDetail } from '@/src/api/types';
import type { HotelReviewDisplay, HotelRoomDisplay } from '@/src/utils/hotelDetailHelpers';
import { getPrimaryImage } from '@/src/utils/getPrimaryImage';
import { openLocationInMaps } from '@/src/utils/openLocationInMaps';
import { DesktopSearchResultsHeader } from '@/src/components/desktop/DesktopSearchResultsHeader';
import { DesktopBookingFocusOverlay } from '@/src/components/desktop/DesktopBookingFocusOverlay';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import {
  CANCELLATION_TEXT,
  DEFAULT_ROOM_CONFIGS,
  FIGMA_EXPLORE_HOTELS,
  FIGMA_PROPERTY,
  HOST_DESCRIPTION,
  HOST_NAME,
  INSTRUCTIONS_TEXT,
  MOCK_REVIEWS,
  RESORT_AMENITIES,
  ROOM_DESCRIPTION,
} from '@/src/components/resort/resortConstants';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import HeartIcon from '@/assets/images/heart.svg';

type DesktopHotelDetailScreenProps = {
  listing?: ListingDetail;
  title: string;
  locationLabel: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  rating: string;
  reviewCountLabel?: string;
  starRating?: number;
  description?: string;
  propertyRules?: string[];
  highlights?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  cancellationText?: string;
  carouselImages: string[];
  displayPrice: string;
  rooms?: HotelRoomDisplay[];
  reviews?: HotelReviewDisplay[];
  relatedListings?: Listing[];
  onBookNow: () => void;
  onSelectRoom?: (roomTypeId: string) => void;
  selectedRoomTypeId?: string;
  activeTab?: HomeCategoryTab;
  onTabChange?: (tab: HomeCategoryTab) => void;
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
  onBack?: () => void;
  bookingFocus?: {
    visible: boolean;
    sectionTitle: string;
    modalContent: React.ReactNode;
  };
};

function AmenityChip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.amenityChip}>
      <View style={styles.amenityIconBox}>
        <Ionicons name={icon} size={18} color={colors.text.primary} />
      </View>
      <Text style={styles.amenityLabel}>{label}</Text>
    </View>
  );
}

function DesktopRoomRow({
  name,
  guests,
  rooms,
  priceLabel,
  images,
  variant,
  cancellationText,
  onBookNow,
  bookCtaLabel = 'Book Now',
}: {
  name: string;
  guests: number;
  rooms: number;
  priceLabel: string;
  images: string[];
  variant: 'featured' | 'special' | 'breakfast' | 'compact';
  cancellationText?: string;
  onBookNow: () => void;
  bookCtaLabel?: string;
}) {
  const imgA = images[0];
  const imgB = images[1] ?? images[0];

  return (
    <View style={styles.roomCard}>
      {variant !== 'compact' ? (
        <View style={styles.roomImages}>
          {[imgA, imgB].map((uri, idx) => (
            <View key={idx} style={styles.roomImageWrap}>
              {uri ? (
                <Image source={{ uri }} style={styles.roomImage} resizeMode="cover" />
              ) : (
                <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.roomImage} resizeMode="cover" />
              )}
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.roomContent}>
        <View style={styles.roomTitleRow}>
          <View style={styles.roomTitleLeft}>
            <Text style={styles.roomName}>{name}</Text>
            <Text style={styles.roomCapacity}>
              {guests} Guest - {rooms} Room
            </Text>
          </View>
          {variant === 'special' ? (
            <View style={styles.specialBadge}>
              <Ionicons name="pricetag" size={14} color={colors.surface.white} />
              <Text style={styles.specialBadgeText}>Special Price</Text>
            </View>
          ) : null}
          {variant === 'breakfast' ? (
            <View style={styles.breakfastBadge}>
              <Ionicons name="restaurant-outline" size={14} color={colors.surface.white} />
              <Text style={styles.breakfastBadgeText}>Room with Breakfast</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.roomAmenitiesHeader}>
          <Text style={styles.roomAmenitiesTitle}>What we provide?</Text>
          <Pressable>
            <Text style={styles.roomAmenitiesLink}>View all amenities -&gt;</Text>
          </Pressable>
        </View>

        <View style={styles.roomAmenitiesRow}>
          {RESORT_AMENITIES.slice(0, 3).map((a) => (
            <AmenityChip key={a.id} icon={a.icon} label={a.label} />
          ))}
        </View>

        <View style={styles.roomPriceRow}>
          <View>
            <Text style={styles.roomPriceLabel}>Price for one night</Text>
            <Text style={styles.roomCancelText}>{cancellationText ?? CANCELLATION_TEXT}</Text>
          </View>
          <View style={styles.roomPriceRight}>
            <Text style={styles.roomPrice}>{priceLabel}</Text>
            <Text style={styles.roomTax}>including tax</Text>
          </View>
        </View>

        <View style={styles.roomActions}>
          {variant === 'special' ? (
            <View style={styles.discountPill}>
              <Ionicons name="wallet-outline" size={18} color="#7C3AED" />
              <Text style={styles.discountText}>Flat ₹500 /- off</Text>
              <Ionicons name="information-circle-outline" size={18} color="#7C3AED" />
            </View>
          ) : (
            <View style={styles.roomActionsSpacer} />
          )}
          <Pressable style={styles.wishlistBtn}>
            <Ionicons name="heart-outline" size={20} color={colors.text.primary} />
            <Text style={styles.wishlistText}>Wishlist</Text>
          </Pressable>
          <Pressable style={styles.bookBtn} onPress={onBookNow}>
            <Text style={styles.bookBtnText}>{bookCtaLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function DesktopHotelDetailScreen({
  title,
  locationLabel,
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
  displayPrice,
  rooms,
  reviews = [],
  relatedListings = [],
  onBookNow,
  onSelectRoom,
  selectedRoomTypeId,
  activeTab = 'hotels',
  onTabChange,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
  onBack,
  bookingFocus,
}: DesktopHotelDetailScreenProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [galleryWidth, setGalleryWidth] = useState(620);
  const carouselRef = useRef<ScrollView>(null);
  const slides = carouselImages.length ? carouselImages : [null];
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
  const otherRooms = roomCards.slice(1);
  const addressText = address ?? FIGMA_PROPERTY.address;
  const customersLabel = reviewCountLabel ?? FIGMA_PROPERTY.customersLabel;
  const reviewItems = reviews.length ? reviews : MOCK_REVIEWS;
  const exploreItems =
    relatedListings.length > 0
      ? relatedListings.slice(0, 4).map((l) => ({
          id: l.id,
          title: l.title ?? 'Hotel',
          location: l.location ?? locationLabel,
          rating: String((l as Listing & { rating?: number }).rating ?? rating),
          price:
            l.price_start != null
              ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night`
              : displayPrice,
          image: getPrimaryImage(l.media),
        }))
      : FIGMA_EXPLORE_HOTELS.map((h) => ({ ...h, image: null as string | null }));

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const slideWidth = layoutMeasurement.width || galleryWidth;
    const index = Math.round(contentOffset.x / slideWidth);
    setCarouselIndex(Math.min(index, slides.length - 1));
  };

  const goToSlide = (direction: 'prev' | 'next') => {
    const next =
      direction === 'prev'
        ? Math.max(0, carouselIndex - 1)
        : Math.min(slides.length - 1, carouselIndex + 1);
    carouselRef.current?.scrollTo({ x: next * galleryWidth, animated: true });
    setCarouselIndex(next);
  };

  return (
    <View style={styles.pageRoot}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        scrollEnabled={!bookingFocus?.visible}
      >
        <View style={styles.contentShell}>
          <View style={styles.headerWrap}>
            <DesktopSearchResultsHeader
              activeTab={activeTab}
              onTabChange={onTabChange ?? (() => {})}
              isLoggedIn={isLoggedIn}
              onMenuPress={onMenuPress}
              onProfilePress={onProfilePress}
              onLoginPress={onLoginPress}
            />
          </View>

          <View style={styles.main}>
        {onBack ? (
          <Pressable style={styles.backRow} onPress={onBack} accessibilityLabel="Back to search results">
            <Ionicons name="arrow-back" size={18} color={colors.text.primary} />
            <Text style={styles.backText}>Back to results</Text>
          </Pressable>
        ) : null}
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle}>
            {title}
            {starRating ? ` · ${starRating}★` : ''}
          </Text>
          <View style={styles.propertyMeta}>
            <Text style={styles.propertyAddress} numberOfLines={1}>
              {addressText}
            </Text>
            <Pressable
              style={[
                styles.viewLocationBtn,
                (latitude == null || longitude == null) && styles.viewLocationBtnDisabled,
              ]}
              disabled={latitude == null || longitude == null}
              onPress={() => {
                if (latitude == null || longitude == null) return;
                void openLocationInMaps({
                  latitude,
                  longitude,
                  label: address || locationLabel || title,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="View Location"
            >
              <Text style={styles.viewLocationText}>View Location</Text>
              <Ionicons name="location-outline" size={16} color={colors.accent.main} />
            </Pressable>
          </View>
        </View>

        <View style={styles.featuredRow}>
          <View
            style={styles.galleryCol}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setGalleryWidth(w);
            }}
          >
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onCarouselScroll}
              style={styles.galleryScroll}
            >
              {slides.map((uri, i) => (
                <View key={i} style={[styles.gallerySlide, { width: galleryWidth }]}>
                  {uri ? (
                    <Image source={{ uri }} style={styles.galleryImage} resizeMode="cover" />
                  ) : (
                    <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.galleryImage} resizeMode="cover" />
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.galleryDots}>
              {slides.map((_, i) => (
                <View key={i} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
              ))}
            </View>

            <View style={styles.galleryArrows}>
              <Pressable style={styles.arrowBtn} onPress={() => goToSlide('prev')}>
                <Ionicons name="chevron-back" size={16} color={colors.text.primary} />
              </Pressable>
              <Pressable style={[styles.arrowBtn, styles.arrowBtnRight]} onPress={() => goToSlide('next')}>
                <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
              </Pressable>
            </View>

            <View style={styles.galleryActions}>
              <Pressable style={styles.shareBtn}>
                <Ionicons name="share-outline" size={18} color={colors.text.primary} />
              </Pressable>
              <Pressable style={styles.saveBtn}>
                <Ionicons name="heart" size={18} color={colors.surface.white} />
              </Pressable>
            </View>
          </View>

          <View style={styles.featuredPanel}>
            <View style={styles.featuredTitleRow}>
              <Text style={styles.featuredRoomName}>{featuredRoom.name}</Text>
              <Text style={styles.featuredCapacity}>
                {featuredRoom.guests} Guest - {featuredRoom.rooms} Room
              </Text>
            </View>

            <Text style={styles.featuredDesc}>{description ?? ROOM_DESCRIPTION}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.accent.main} />
              <Text style={styles.ratingValue}>{rating}</Text>
              <Text style={styles.ratingDivider}>|</Text>
              <Text style={styles.customersLabel}>{customersLabel}</Text>
            </View>
            {checkInTime || checkOutTime ? (
              <Text style={styles.featuredDesc}>
                Check-in: {checkInTime ?? '—'} · Check-out: {checkOutTime ?? '—'}
              </Text>
            ) : null}

            <View style={styles.amenitiesSection}>
              <View style={styles.roomAmenitiesHeader}>
                <Text style={styles.roomAmenitiesTitle}>What we provide?</Text>
                <Pressable>
                  <Text style={styles.roomAmenitiesLink}>View all amenities -&gt;</Text>
                </Pressable>
              </View>
              <View style={styles.featuredAmenities}>
                {RESORT_AMENITIES.map((a) => (
                  <AmenityChip key={a.id} icon={a.icon} label={a.label} />
                ))}
              </View>
            </View>

            <View style={styles.featuredPriceRow}>
              <View>
                <Text style={styles.roomPriceLabel}>Price for one night</Text>
                <Text style={styles.roomCancelText}>{cancellationText ?? CANCELLATION_TEXT}</Text>
              </View>
              <View style={styles.roomPriceRight}>
                <Text style={styles.roomPrice}>{displayPrice}</Text>
                <Text style={styles.roomTax}>including tax</Text>
              </View>
            </View>

            <View style={styles.featuredActions}>
              <Pressable style={styles.outlineBtn}>
                <Text style={styles.outlineBtnText}>Select rooms</Text>
              </Pressable>
              <Pressable
                style={styles.bookBtn}
                onPress={() => {
                  onSelectRoom?.(featuredRoom.id);
                  onBookNow();
                }}
              >
                <Text style={styles.bookBtnText}>{isLoggedIn ? 'Book Now' : 'Login'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.twoCol}>
          <View style={styles.hostCol}>
            <View style={styles.hostRow}>
              <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.hostAvatar} resizeMode="cover" />
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{HOST_NAME}</Text>
                <Text style={styles.hostDesc}>{HOST_DESCRIPTION}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={colors.accent.main} />
                  <Text style={styles.hostRating}>4.5</Text>
                  <Text style={styles.ratingDivider}>|</Text>
                  <Text style={styles.customersLabel}>500+ stays hosted</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.linkBtn}>
              <Text style={styles.linkBtnText}>View host profile</Text>
            </Pressable>
          </View>

          <View style={styles.instructionsCol}>
            <Text style={styles.instructionsTitle}>About this stay</Text>
            <Text style={styles.instructionsBody}>{description ?? INSTRUCTIONS_TEXT}</Text>
            {highlights.length ? (
              <View style={{ gap: 8, marginTop: 8 }}>
                {highlights.map((item) => (
                  <Text key={item} style={styles.instructionsBody}>
                    • {item}
                  </Text>
                ))}
              </View>
            ) : null}
            {propertyRules.length ? (
              <View style={{ gap: 8, marginTop: 12 }}>
                <Text style={styles.instructionsTitle}>Property rules</Text>
                {propertyRules.map((rule) => (
                  <Text key={rule} style={styles.instructionsBody}>
                    • {rule}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.roomsSection}>
          {otherRooms.map((room) => (
            <DesktopRoomRow
              key={room.id}
              name={room.name}
              guests={room.guests}
              rooms={room.rooms}
              priceLabel={room.priceLabel}
              images={carouselImages}
              variant={room.variant}
              cancellationText={cancellationText}
              onBookNow={() => {
                onSelectRoom?.(room.id);
                onBookNow();
              }}
              bookCtaLabel={isLoggedIn ? 'Book Now' : 'Login'}
            />
          ))}
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsGrid}>
            {reviewItems.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={14} color={colors.accent.main} />
                    <Text style={styles.reviewRatingText}>{review.ratingLabel}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.exploreSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore more in {locationLabel}</Text>
            <Pressable style={styles.viewAllLink}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
            </Pressable>
          </View>
          <View style={styles.exploreGrid}>
            {exploreItems.map((item) => (
              <Pressable
                key={item.id}
                style={styles.exploreCard}
                onPress={() =>
                  router.push({
                    pathname: '/hotels/[id]',
                    params: { id: item.id },
                  })
                }
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.exploreImage} resizeMode="cover" />
                ) : (
                  <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.exploreImage} resizeMode="cover" />
                )}
                <View style={styles.exploreHeart}>
                  <HeartIcon width={14} height={14} />
                </View>
                <Text style={styles.exploreTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.exploreLocation}>{item.location}</Text>
                <View style={styles.exploreMeta}>
                  <Ionicons name="star" size={14} color={colors.accent.main} />
                  <Text style={styles.exploreRating}>{item.rating}</Text>
                  <Text style={styles.explorePrice}>{item.price}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        </View>
        </View>

        <DesktopSiteFooter />
      </ScrollView>

      {bookingFocus ? (
        <DesktopBookingFocusOverlay
          visible={bookingFocus.visible}
          sectionTitle={bookingFocus.sectionTitle}
        >
          {bookingFocus.modalContent}
        </DesktopBookingFocusOverlay>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.surface.white,
    position: 'relative',
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  contentShell: {
    ...desktopContentShellStyle,
  },
  headerWrap: {
    width: '100%',
    paddingTop: 24,
    zIndex: 300,
  },
  main: {
    width: '100%',
    paddingTop: 24,
    gap: 32,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  propertyHeader: {
    gap: 12,
  },
  propertyTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  propertyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  propertyAddress: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(28, 32, 36, 0.7)',
  },
  viewLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewLocationBtnDisabled: {
    opacity: 0.45,
  },
  viewLocationText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  featuredRow: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'stretch',
  },
  galleryCol: {
    flex: 1.15,
    minWidth: 480,
    height: 413,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.gray?.['2'] ?? '#eee',
  },
  galleryScroll: {
    flex: 1,
  },
  gallerySlide: {
    height: 413,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
  },
  dotActive: {
    backgroundColor: colors.accent.main,
  },
  galleryArrows: {
    position: 'absolute',
    top: '45%',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnRight: {
    marginLeft: 'auto',
  },
  galleryActions: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  shareBtn: {
    width: 40,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredPanel: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    borderRadius: 16,
    padding: 24,
    gap: 16,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
      default: {},
    }),
  },
  featuredTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    flexWrap: 'wrap',
  },
  featuredRoomName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  featuredCapacity: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  featuredDesc: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.75)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  ratingDivider: {
    color: 'rgba(28, 32, 36, 0.3)',
  },
  customersLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  amenitiesSection: {
    gap: 12,
  },
  featuredAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '30%',
    minWidth: 160,
  },
  amenityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 77, 46, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  featuredPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderRadius: 12,
    padding: 18,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  bookBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 42,
  },
  hostCol: {
    flex: 1,
    gap: 16,
  },
  hostRow: {
    flexDirection: 'row',
    gap: 24,
  },
  hostAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  hostInfo: {
    flex: 1,
    gap: 12,
  },
  hostName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  hostDesc: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.75)',
  },
  hostRating: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  instructionsCol: {
    flex: 1,
    gap: 12,
  },
  instructionsTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  instructionsBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.75)',
  },
  roomsSection: {
    gap: 24,
  },
  roomCard: {
    flexDirection: 'row',
    gap: 24,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    borderRadius: 16,
    padding: 24,
    backgroundColor: colors.surface.white,
  },
  roomImages: {
    width: 251,
    gap: 12,
    flexShrink: 0,
  },
  roomImageWrap: {
    height: 115,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray?.['2'] ?? '#eee',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  roomContent: {
    flex: 1,
    gap: 16,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  roomTitleLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    flexWrap: 'wrap',
  },
  roomName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  roomCapacity: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent.main,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  specialBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  breakfastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2D6A4F',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  breakfastBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  roomAmenitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomAmenitiesTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  roomAmenitiesLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.accent.main,
  },
  roomAmenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roomPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderRadius: 12,
    padding: 18,
  },
  roomPriceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  roomCancelText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 8,
  },
  roomPriceRight: {
    alignItems: 'flex-end',
  },
  roomPrice: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  roomTax: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 4,
  },
  roomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomActionsSpacer: {
    flex: 1,
  },
  discountPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  discountText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: '#7C3AED',
  },
  wishlistBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
  },
  wishlistText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  reviewsSection: {
    gap: 20,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  reviewsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  reviewCard: {
    width: '48%',
    minWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  reviewText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.75)',
  },
  exploreSection: {
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  exploreCard: {
    width: 240,
    gap: 8,
    position: 'relative',
  },
  exploreImage: {
    width: 240,
    height: 160,
    borderRadius: 12,
  },
  exploreHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  exploreLocation: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  exploreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exploreRating: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
  },
  explorePrice: {
    marginLeft: 'auto',
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
