import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import {
  CANCELLATION_TEXT,
  RESORT_AMENITIES,
  ROOM_DESCRIPTION,
  type ResortRoomVariant,
} from '@/src/components/resort/resortConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { useHomeScale } from '@/src/components/home/useHomeScale';

type ResortRoomCardProps = {
  name: string;
  guests: number;
  rooms: number;
  priceLabel: string;
  images: string[];
  variant: ResortRoomVariant;
  showImages?: boolean;
  cancellationText?: string;
  selected?: boolean;
  onBookNow: () => void;
  onWishlist?: () => void;
  bookCtaLabel?: string;
  occupancyLabel?: string;
  /** When false, room does not fit selected adults/children — grey out Book Now */
  fitsGuests?: boolean;
};

export function ResortRoomCard({
  name,
  guests,
  rooms,
  priceLabel,
  images,
  variant,
  showImages = true,
  cancellationText,
  selected = false,
  onBookNow,
  onWishlist,
  bookCtaLabel = 'Book Now',
  occupancyLabel,
  fitsGuests = true,
}: ResortRoomCardProps) {
  const { s } = useHomeScale();
  const showAmenities = variant !== 'compact';
  const imgA = images[0];
  const imgB = images[1] ?? images[0];
  const capacityText = occupancyLabel ?? `${guests} Guest - ${rooms} Room`;

  return (
    <View
      style={[
        styles.card,
        {
          padding: s(16),
          borderRadius: s(18),
          gap: s(18),
          backgroundColor: colors.surface.white,
          borderWidth: selected ? 2 : 0,
          borderColor: selected ? colors.primary : 'transparent',
          opacity: fitsGuests ? 1 : 0.55,
        },
      ]}
    >
      {showImages && variant !== 'compact' ? (
        <View style={[styles.imageRow, { gap: s(12) }]}>
          {[imgA, imgB].map((uri, idx) => (
            <View key={idx} style={[styles.imageWrap, { height: s(171), borderRadius: s(12) }]}>
              {uri ? (
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
              ) : (
                <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.image} resizeMode="cover" />
              )}
            </View>
          ))}
        </View>
      ) : null}

      <View style={[styles.titleRow, { paddingVertical: s(8) }]}>
        <Text style={[styles.roomName, { fontSize: s(16), lineHeight: s(34) }]}>{name}</Text>
        <Text style={[styles.capacity, { fontSize: s(13), lineHeight: s(20), flex: 1, textAlign: 'right' }]}>
          {capacityText}
        </Text>
      </View>

      {!fitsGuests ? (
        <Text style={{ color: '#D53B3B', fontSize: s(12) }}>
          Does not fit your guest count — choose another room or book more units.
        </Text>
      ) : null}

      {variant === 'special' ? (
        <View style={[styles.badgeRow, { gap: s(8) }]}>
          <View style={[styles.specialBadge, { paddingHorizontal: s(10), paddingVertical: s(6) }]}>
            <Ionicons name="pricetag" size={s(12)} color="#FFFFFF" />
            <Text style={[styles.specialBadgeText, { fontSize: s(10) }]}>Special Price</Text>
          </View>
          <View style={[styles.discountBadge, { paddingHorizontal: s(10), paddingVertical: s(6) }]}>
            <Ionicons name="wallet-outline" size={s(12)} color="#7C3AED" />
            <Text style={[styles.discountBadgeText, { fontSize: s(10) }]}>Flat ₹500 /- off</Text>
            <Ionicons name="information-circle-outline" size={s(12)} color="#7C3AED" />
          </View>
        </View>
      ) : null}

      {variant === 'breakfast' ? (
        <View style={[styles.badgeRow, { gap: s(8), flexWrap: 'wrap' }]}>
          <View style={[styles.breakfastBadge, { paddingHorizontal: s(10), paddingVertical: s(6) }]}>
            <Ionicons name="restaurant-outline" size={s(12)} color="#FFFFFF" />
            <Text style={[styles.breakfastBadgeText, { fontSize: s(10) }]}>Room with Breakfast</Text>
          </View>
          <View style={[styles.purpleBadge, { paddingHorizontal: s(10), paddingVertical: s(6) }]}>
            <Ionicons name="bed-outline" size={s(12)} color="#7C3AED" />
            <Text style={[styles.purpleBadgeText, { fontSize: s(10) }]}>King Bed</Text>
            <Ionicons name="flower-outline" size={s(12)} color="#7C3AED" />
            <Text style={[styles.purpleBadgeText, { fontSize: s(10) }]}>Garden View</Text>
          </View>
        </View>
      ) : null}

      {variant === 'featured' ? (
        <Text style={[styles.description, { fontSize: s(10), lineHeight: s(12) }]}>{ROOM_DESCRIPTION}</Text>
      ) : null}

      {variant === 'featured' ? (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={s(14)} color={colors.accent.main} />
          <Text style={[styles.ratingText, { fontSize: s(12), color: colors.accent.main }]}>4.5</Text>
          <Text style={[styles.customersText, { fontSize: s(12), color: colors.accent.main }]}>
            500+ customers
          </Text>
        </View>
      ) : null}

      {showAmenities ? (
        <View style={{ gap: s(12) }}>
          <View style={styles.amenitiesHeader}>
            <Text style={[styles.amenitiesTitle, { fontSize: s(12) }]}>What we provide?</Text>
            <Text style={[styles.amenitiesLink, { fontSize: s(10) }]}>View all amenities -&gt;</Text>
          </View>
          <View style={[styles.amenitiesGrid, { gap: s(12) }]}>
            {RESORT_AMENITIES.map((item) => (
              <View key={item.id} style={[styles.amenityItem, { gap: s(8) }]}>
                <View style={[styles.amenityIcon, { width: s(28), height: s(28), borderRadius: s(14) }]}>
                  <Ionicons name={item.icon} size={s(14)} color={colors.accent.main} />
                </View>
                <Text style={[styles.amenityLabel, { fontSize: s(10) }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={[styles.priceBox, { padding: s(12), borderRadius: s(12) }]}>
        <View style={{ flex: 1, gap: s(4) }}>
          <Text style={[styles.priceLabel, { fontSize: s(12) }]}>Price for one night</Text>
          <Text style={[styles.cancelText, { fontSize: s(10) }]}>
            {cancellationText ?? CANCELLATION_TEXT}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.priceValue, { fontSize: s(20), lineHeight: s(24) }]}>{priceLabel}</Text>
          <Text
            style={[
              styles.taxText,
              { fontSize: s(8) },
            ]}
          >
            including tax
          </Text>
        </View>
      </View>

      <View style={[styles.actionRow, { gap: s(12) }]}>
        {variant === 'featured' ? (
          <Pressable
            style={[styles.outlineBtn, { height: s(42), borderRadius: s(9999), flex: 1 }]}
            onPress={onWishlist}
          >
            <Text style={[styles.outlineBtnText, { fontSize: s(14) }]}>Select rooms</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.wishlistBtn, { height: s(42), borderRadius: s(9999), flex: 1 }]}
            onPress={onWishlist}
          >
            <Text style={[styles.wishlistBtnText, { fontSize: s(14) }]}>Wishlist</Text>
            <Ionicons name="heart-outline" size={s(16)} color={colors.accent.main} />
          </Pressable>
        )}
        <Pressable
          style={[styles.bookBtn, { height: s(42), borderRadius: s(9999), flex: 1 }]}
          onPress={fitsGuests ? onBookNow : undefined}
          disabled={!fitsGuests}
        >
          <Text style={[styles.bookBtnText, { fontSize: s(14) }]}>
            {fitsGuests ? bookCtaLabel : 'Doesn’t fit'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  imageRow: {
    flexDirection: 'row',
  },
  imageWrap: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  roomName: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  capacity: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
  },
  customersText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    borderRadius: 999,
  },
  specialBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 999,
  },
  discountBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#7C3AED',
  },
  breakfastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.text.primary,
    borderRadius: 999,
  },
  breakfastBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  purpleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 999,
  },
  purpleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#7C3AED',
  },
  amenitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amenitiesTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  amenitiesLink: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityIcon: {
    backgroundColor: 'rgba(229, 77, 46, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
    flex: 1,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.25)',
    backgroundColor: 'rgba(229, 77, 46, 0.04)',
  },
  priceLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  cancelText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#22A06B',
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  taxText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  wishlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accent.main,
  },
  wishlistBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  bookBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
});
