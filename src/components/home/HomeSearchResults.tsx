import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import type { Listing } from '@/src/api/types';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { MobileHotelGridCard } from '@/src/components/home/MobileHotelGridCard';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function HomeSearchResults({
  listings,
  locationLabel,
  loading,
  onListingPress,
  variant = 'hotels',
}: {
  listings: Listing[];
  locationLabel: string;
  loading?: boolean;
  onListingPress: (listing: Listing) => void;
  variant?: 'hotels' | 'packages' | 'glamping';
}) {
  const { s } = useHomeScale();
  const gap = s(12);
  const cardW = (s(367) - gap) / 2;
  const isPackages = variant === 'packages';
  const isGlamping = variant === 'glamping';

  const rows: Listing[][] = [];
  for (let i = 0; i < listings.length; i += 2) {
    rows.push(listings.slice(i, i + 2));
  }

  return (
    <View style={[styles.section, { paddingHorizontal: s(16), gap: s(18), paddingTop: s(8) }]}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, gap: s(4) }}>
          <Text style={[styles.title, { fontSize: s(16), lineHeight: s(24) }]}>
            {isPackages
              ? 'Packages That Match Your Mood'
              : isGlamping
                ? 'Camps That Match Your Mood'
                : 'Stays That Match Your Mood'}
          </Text>
          <Text style={[styles.subtitle, { fontSize: s(12), lineHeight: s(16) }]}>
            {isPackages
              ? 'Curated Travel Packages'
              : isGlamping
                ? 'Curated Glamping Experiences'
                : 'Curated Travel Experiences'}
          </Text>
        </View>
        <Pressable
          style={[styles.menuBtn, { width: s(36), height: s(36), borderRadius: s(8) }]}
          accessibilityLabel="Filter menu"
        >
          <Ionicons name="menu" size={s(20)} color={colors.text.primary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent.main} />
        </View>
      ) : rows.length ? (
        <View style={{ gap }}>
          {rows.map((row) => (
            <View key={row.map((l) => l.id).join('-')} style={[styles.gridRow, { gap }]}>
              {row.map((listing) => (
                <MobileHotelGridCard
                  key={listing.id}
                  listing={listing}
                  width={cardW}
                  locationLabel={locationLabel}
                  priceSuffix={isPackages ? '/person' : '/night'}
                  onPress={() => onListingPress(listing)}
                />
              ))}
              {row.length === 1 ? <View style={{ width: cardW }} /> : null}
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, { fontSize: s(14) }]}>
          No {isPackages ? 'packages' : isGlamping ? 'camps' : 'stays'} found for &quot;{locationLabel}&quot;. Try another location.
        </Text>
      )}

      {listings.length > 0 ? (
        <View style={{ alignItems: 'center', marginTop: s(8) }}>
          <Pressable
            style={[
              styles.viewAllPill,
              { paddingVertical: s(5), paddingHorizontal: s(12), borderRadius: s(100) },
            ]}
          >
            <Text style={[styles.viewAllText, { fontSize: s(12) }]}>View all →</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={[styles.footerText, { fontSize: s(10), lineHeight: s(14), marginTop: s(8) }]}>
        {isPackages
          ? 'From budget getaways to international adventures, curated packages with stays, transfers, and experiences — GoTrip offers it all.'
          : 'From luxurious escapes to budget-friendly stays, hotels with stunning views to vibrant city hubs, and so much more— GoTrip offers it all.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  menuBtn: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
    textAlign: 'center',
    paddingVertical: 24,
  },
  viewAllPill: {
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
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
