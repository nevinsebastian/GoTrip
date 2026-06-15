import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import HeartIcon from '@/assets/images/heart.svg';

import { FIGMA_EXPLORE_HOTELS, RESORT_FOOTER_TEXT } from '@/src/components/resort/resortConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function ResortExploreMore({ onCardPress }: { onCardPress?: (id: string) => void }) {
  const { s } = useHomeScale();
  const gap = s(12);
  const cardW = (s(367) - gap) / 2;
  const hotels = FIGMA_EXPLORE_HOTELS;

  const rows: (typeof FIGMA_EXPLORE_HOTELS)[] = [];
  for (let i = 0; i < hotels.length; i += 2) {
    rows.push(hotels.slice(i, i + 2));
  }

  return (
    <View style={[styles.section, { paddingTop: s(24), paddingBottom: s(16), gap: s(18) }]}>
      <View style={[styles.titleDividerRow, { paddingHorizontal: s(16), gap: s(12) }]}>
        <View style={[styles.dividerAccent, { height: 1 }]} />
        <View style={[styles.dividerMuted, { height: 1 }]} />
      </View>

      <Text style={[styles.title, { fontSize: s(16), lineHeight: s(22), paddingHorizontal: s(16) }]}>
        Explore more options
      </Text>

      <View style={{ paddingHorizontal: s(16), gap }}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={[styles.gridRow, { gap }]}>
            {row.map((hotel) => (
              <Pressable
                key={hotel.id}
                style={[styles.card, { width: cardW, padding: s(8), borderRadius: s(24), gap: s(16) }]}
                onPress={() => onCardPress?.(hotel.id)}
              >
                <View style={[styles.imageWrap, { height: s(132), borderRadius: s(18) }]}>
                  <Image source={RESORT_PLACEHOLDER_IMAGE} style={styles.image} resizeMode="cover" />
                  <View style={[styles.heartBtn, { width: s(33), height: s(33), borderRadius: s(12) }]}>
                    <HeartIcon width={s(14)} height={s(14)} />
                  </View>
                  <View style={[styles.coupleBadge, { paddingVertical: s(6), paddingHorizontal: s(12), borderRadius: s(24) }]}>
                    <Ionicons name="heart-outline" size={s(10)} color="#FFFFFF" />
                    <Text style={[styles.coupleBadgeText, { fontSize: s(9) }]}>COUPLE FRIENDLY</Text>
                  </View>
                </View>

                <View style={{ gap: s(12), paddingHorizontal: s(2) }}>
                  <Text style={[styles.cardTitle, { fontSize: s(12), lineHeight: s(16) }]} numberOfLines={2}>
                    {hotel.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.location, { fontSize: s(10) }]}>{hotel.location}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={s(10)} color={colors.accent.main} />
                      <Text style={[styles.rating, { fontSize: s(10) }]}>{hotel.rating}</Text>
                    </View>
                  </View>
                  <Text style={[styles.price, { fontSize: s(12) }]}>{hotel.price}</Text>
                </View>
              </Pressable>
            ))}
            {row.length === 1 ? <View style={{ width: cardW }} /> : null}
          </View>
        ))}
      </View>

      <View style={{ alignItems: 'center' }}>
        <Pressable
          style={[
            styles.viewAllPill,
            { paddingVertical: s(5), paddingHorizontal: s(12), borderRadius: s(100) },
          ]}
        >
          <Text style={[styles.viewAllText, { fontSize: s(12) }]}>View all →</Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.footerText,
          { fontSize: s(10), lineHeight: s(15), paddingHorizontal: s(20), marginTop: s(12) },
        ]}
      >
        {RESORT_FOOTER_TEXT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: colors.surface.white,
  },
  titleDividerRow: {
    flexDirection: 'row',
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
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
  },
  imageWrap: {
    width: '100%',
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
    top: 8,
    right: 8,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupleBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
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
  cardTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  price: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewAllPill: {
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: 'transparent',
  },
  viewAllText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  footerText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.5)',
    textAlign: 'center',
  },
});
