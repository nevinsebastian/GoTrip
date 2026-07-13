import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { HotelReviewDisplay } from '@/src/utils/hotelDetailHelpers';
import { MOCK_REVIEWS } from '@/src/components/resort/resortConstants';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function ResortReviewsSection({ reviews }: { reviews?: HotelReviewDisplay[] }) {
  const { s } = useHomeScale();
  const items = reviews?.length ? reviews : MOCK_REVIEWS;

  return (
    <View style={[styles.section, { paddingHorizontal: s(16), gap: s(16) }]}>
      <View style={styles.titleDividerRow}>
        <View style={[styles.dividerAccent, { height: 1 }]} />
        <View style={[styles.dividerMuted, { height: 1 }]} />
      </View>

      <Text style={[styles.title, { fontSize: s(16), lineHeight: s(22) }]}>Customer Reviews</Text>

      {items.map((review) => (
        <View key={review.id} style={[styles.card, { padding: s(14), borderRadius: s(18), gap: s(12) }]}>
          <View style={styles.headerRow}>
            <View style={[styles.avatar, { width: s(48), height: s(48), borderRadius: s(24) }]}>
              <Text style={[styles.avatarText, { fontSize: s(16) }]}>{review.name.charAt(3)}</Text>
            </View>
            <View style={{ flex: 1, gap: s(4) }}>
              <Text style={[styles.name, { fontSize: s(14), lineHeight: s(18) }]}>{review.name}</Text>
              <View style={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < review.rating ? 'star' : 'star-outline'}
                    size={s(12)}
                    color={colors.accent.main}
                  />
                ))}
                <Text style={[styles.ratingLabel, { fontSize: s(10), marginLeft: s(4) }]}>
                  {review.ratingLabel}
                </Text>
              </View>
            </View>
          </View>
          <Text style={[styles.reviewText, { fontSize: s(10), lineHeight: s(14) }]}>{review.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  titleDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerAccent: {
    flex: 1,
    backgroundColor: colors.accent.main,
  },
  dividerMuted: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.2)',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: colors.accent.main,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  name: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  reviewText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
});
