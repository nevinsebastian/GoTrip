import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import HeartIcon from '@/assets/images/heart.svg';

import { FIGMA_BOOKING } from '@/src/constants/bookingConstants';
import { FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function BookingSummaryCard({ imageUri }: { imageUri?: string | null }) {
  const { s } = useHomeScale();

  return (
    <View style={[styles.card, { padding: s(12), borderRadius: s(18), gap: s(12) }]}>
      <View style={[styles.row, { gap: s(12) }]}>
        <View style={[styles.imageWrap, { width: s(88), height: s(88), borderRadius: s(12) }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.image} resizeMode="cover" />
          )}
          <Pressable style={[styles.heartBtn, { width: s(28), height: s(28), borderRadius: s(14) }]}>
            <HeartIcon width={s(12)} height={s(12)} />
          </Pressable>
        </View>

        <View style={{ flex: 1, gap: s(6) }}>
          <View style={styles.titleRow}>
            <Text style={[styles.roomName, { fontSize: s(14), lineHeight: s(18) }]}>
              {FIGMA_BOOKING.roomName}
            </Text>
            <Text style={[styles.capacity, { fontSize: s(12), lineHeight: s(16) }]}>
              {FIGMA_BOOKING.guests} Guest - {FIGMA_BOOKING.rooms} Room
            </Text>
          </View>
          <Text style={[styles.location, { fontSize: s(10), lineHeight: s(14) }]}>
            {FIGMA_BOOKING.locationBreadcrumb}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={s(12)} color={colors.accent.main} />
            <Text style={[styles.ratingText, { fontSize: s(10) }]}>{FIGMA_BOOKING.rating}</Text>
            <Text style={[styles.ratingDivider, { fontSize: s(10) }]}>|</Text>
            <Text style={[styles.ratingText, { fontSize: s(10) }]}>{FIGMA_PROPERTY.customersLabel}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.priceBox, { padding: s(10), borderRadius: s(12) }]}>
        <View style={styles.priceRow}>
          <Text style={[styles.priceValue, { fontSize: s(18), lineHeight: s(22) }]}>
            {FIGMA_BOOKING.priceLabel}
          </Text>
          <Text style={[styles.taxText, { fontSize: s(8) }]}>{FIGMA_BOOKING.taxLabel}</Text>
        </View>
        <Text style={[styles.cancelText, { fontSize: s(10), lineHeight: s(14) }]}>
          {FIGMA_BOOKING.cancellationText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageWrap: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
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
  location: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
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
  priceBox: {
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.25)',
    backgroundColor: 'rgba(229, 77, 46, 0.04)',
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
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
  cancelText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#22A06B',
    textAlign: 'center',
  },
});
