import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import type { WishlistListing } from '@/src/api/types';
import { getPrimaryImage } from '@/src/utils/getPrimaryImage';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import HeartIcon from '@/assets/images/heart.svg';

import { GlassSurface } from '@/src/components/home/GlassSurface';
import { PillButton } from '@/src/components/home/PillButton';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import {
  GLAMPING_HERO_BACKGROUND,
  PACKAGE_HERO_BACKGROUND,
  RESORT_PLACEHOLDER_IMAGE,
} from '@/src/constants/placeholderImages';

export function WishlistGridCard({
  listing,
  width,
  onPress,
  onRemove,
  removing,
}: {
  listing: WishlistListing;
  width: number;
  onPress: () => void;
  onRemove: () => void;
  removing?: boolean;
}) {
  const { s } = useHomeScale();
  const img = getPrimaryImage(listing.media);
  const isPackage = listing.category?.type === 'package';
  const isGlamping = listing.category?.type === 'camping';
  const placeholderImage = isGlamping
    ? GLAMPING_HERO_BACKGROUND
    : isPackage
      ? PACKAGE_HERO_BACKGROUND
      : RESORT_PLACEHOLDER_IMAGE;
  const priceSuffix = isPackage ? '/person' : '/night';
  const price =
    listing.price_start != null
      ? `₹ ${Number(listing.price_start).toLocaleString('en-IN')}${priceSuffix}`
      : `₹ 1199${priceSuffix}`;
  const rating =
    typeof listing.rating === 'number' && Number.isFinite(listing.rating) && listing.rating > 0
      ? String(listing.rating)
      : '4.5';
  const locationLabel = listing.location ?? 'Varkala';

  return (
    <View
      style={[
        styles.card,
        {
          width,
          padding: s(8),
          borderRadius: s(24),
          gap: s(16),
        },
      ]}
    >
      <View style={[styles.imageWrap, { height: s(132), borderRadius: s(18) }]}>
        <Pressable onPress={onPress} style={StyleSheet.absoluteFillObject} accessibilityLabel={listing.title}>
          {img ? (
            <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
          ) : (
            <Image source={placeholderImage} style={styles.image} resizeMode="cover" />
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.heartBtn,
            { width: s(33), height: s(33), borderRadius: s(12) },
            pressed && styles.heartBtnPressed,
            removing && styles.heartBtnDisabled,
          ]}
          onPress={onRemove}
          disabled={removing}
          accessibilityLabel="Remove from wishlist"
        >
          <HeartIcon width={s(14)} height={s(14)} />
        </Pressable>

        <GlassSurface
          borderRadius={s(24)}
          intensity="light"
          style={[
            styles.coupleBadge,
            {
              paddingVertical: s(6),
              paddingHorizontal: s(12),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: s(6),
            },
          ]}
        >
          <Ionicons
            name={isPackage ? 'airplane-outline' : isGlamping ? 'leaf-outline' : 'heart-outline'}
            size={s(10)}
            color="#FFFFFF"
          />
          <Text style={[styles.coupleBadgeText, { fontSize: s(9) }]} numberOfLines={1}>
            {isPackage ? 'TRAVEL PACKAGE' : isGlamping ? 'GLAMPING' : 'COUPLE FRIENDLY'}
          </Text>
        </GlassSurface>
      </View>

      <View style={{ gap: s(18) }}>
        <Pressable onPress={onPress} style={{ paddingHorizontal: s(2), gap: s(12) }}>
          <Text style={[styles.title, { fontSize: s(12), lineHeight: s(16) }]} numberOfLines={2}>
            {listing.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.breadcrumb, { fontSize: s(9), lineHeight: s(12) }]} numberOfLines={1}>
              Kerala &gt; {locationLabel}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star-outline" size={s(12)} color={colors.accent.main} />
              <Text style={[styles.rating, { fontSize: s(12), lineHeight: s(12) }]}>{rating}</Text>
            </View>
          </View>
          <Text style={[styles.price, { fontSize: s(14), lineHeight: s(16) }]}>{price}</Text>
        </Pressable>
        <PillButton
          label={isPackage ? 'View Package' : isGlamping ? 'Book Camp' : 'Book Now'}
          onPress={onPress}
          fontSize={s(10)}
          height={s(34)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrap: {
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heartBtnPressed: {
    opacity: 0.85,
  },
  heartBtnDisabled: {
    opacity: 0.5,
  },
  coupleBadge: {
    position: 'absolute',
    bottom: 9,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
    letterSpacing: 0.04,
    flexShrink: 1,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  breadcrumb: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    flex: 1,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  rating: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  price: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
