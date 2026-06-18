import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { GlassSurface } from '@/src/components/home/GlassSurface';
import { PillButton } from '@/src/components/home/PillButton';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import type { Listing } from '@/src/api/types';
import { DESKTOP_DESTINATIONS, DESKTOP_MOODS } from '@/src/constants/desktopHomeConstants';
import { getPrimaryImage } from '@/src/utils/getPrimaryImage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import HeartIcon from '@/assets/images/heart.svg';

const CARD_W = 386;
const CARD_H = 428;

export function DesktopAccentDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerPrimary} />
      <View style={styles.dividerMuted} />
    </View>
  );
}

export function DesktopMoodSection({ activeTab }: { activeTab: HomeCategoryTab }) {
  const [selected, setSelected] = useState('budget');

  const title =
    activeTab === 'packages'
      ? 'Explore Packages That Match Your Mood'
      : activeTab === 'glamping'
        ? 'Explore Camps That Match Your Mood'
        : activeTab === 'activities'
          ? 'Explore Activities That Match Your Mood'
          : 'Explore Stays That Match Your Mood';

  const subtitle =
    activeTab === 'packages'
      ? 'Curated Travel Packages'
      : activeTab === 'glamping'
        ? 'Curated Glamping Experiences'
        : activeTab === 'activities'
          ? 'Curated Local Adventures'
          : 'Curated Travel Experiences';

  return (
    <View style={styles.moodSection}>
      <View style={styles.moodHeader}>
        <Text style={styles.moodTitle}>{title}</Text>
        <Text style={styles.moodSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.moodPillRow}>
        {DESKTOP_MOODS.map((mood) => {
          const isSelected = selected === mood.id;
          const Icon = mood.Icon;
          return (
            <Pressable
              key={mood.id}
              style={[styles.moodPill, isSelected && styles.moodPillActive]}
              onPress={() => setSelected(mood.id)}
            >
              <Icon width={20} height={20} />
              <Text style={[styles.moodPillLabel, isSelected && styles.moodPillLabelActive]}>
                {mood.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function DesktopSuggestedSection({
  listings,
  activeTab = 'hotels',
}: {
  listings: Listing[];
  activeTab?: HomeCategoryTab;
}) {
  const items = listings.slice(0, 3);
  if (!items.length) return null;

  const title =
    activeTab === 'packages'
      ? 'Suggested packages for you'
      : activeTab === 'glamping'
        ? 'Suggested glamping for you'
        : activeTab === 'activities'
          ? 'Suggested activities for you'
          : 'Suggested for you';

  return (
    <View style={styles.suggestedSection}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.cardRow}>
        {items.map((listing) => (
          <DesktopListingCard key={listing.id} listing={listing} />
        ))}
      </View>

      <View style={styles.viewAllWrap}>
        <Pressable style={styles.viewAllPill}>
          <Text style={styles.viewAllText}>View all →</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function DesktopDestinationsSection() {
  return (
    <View style={styles.destinationsSection}>
      <Text style={styles.sectionTitle}>Book Hotels at Popular Destinations</Text>

      <View style={styles.destGrid}>
        {DESKTOP_DESTINATIONS.map((dest) => (
          <View key={dest.name} style={styles.destCard}>
            <View style={styles.destThumb}>
              <Image source={dest.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            </View>
            <View style={styles.destCopy}>
              <Text style={styles.destName}>{dest.name}</Text>
              <View style={styles.destBottomRow}>
                <Text style={styles.destSubtitle} numberOfLines={2}>
                  {dest.subtitle}
                </Text>
                <PillButton label="Explore" variant="white" fontSize={12} height={24} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function DesktopListingCard({ listing }: { listing: Listing }) {
  const img = getPrimaryImage(listing.media);
  const price =
    listing.price_start != null
      ? `₹ ${Number(listing.price_start).toLocaleString('en-IN')} / night`
      : '₹ 1199 / night';
  const location = listing.location ?? 'Varkala';

  return (
    <Pressable
      style={styles.listingCard}
      onPress={() => router.push({ pathname: '/resort/[id]', params: { id: listing.id } })}
      accessibilityLabel={listing.title}
    >
      <View style={styles.listingImageWrap}>
        {img ? (
          <Image source={{ uri: img }} style={styles.listingImage} resizeMode="cover" />
        ) : (
          <View style={styles.listingImagePlaceholder}>
            <Ionicons name="image-outline" size={24} color={colors.text.caption} />
          </View>
        )}
        <View style={styles.heartBtn}>
          <HeartIcon width={14} height={14} />
        </View>
        <GlassSurface borderRadius={24} intensity="light" style={styles.coupleBadge}>
          <Ionicons name="heart-outline" size={12} color={colors.surface.white} />
          <Text style={styles.coupleBadgeText}>COUPLE FRIENDLY</Text>
        </GlassSurface>
      </View>

      <View style={styles.listingBody}>
        <View style={styles.titleRatingRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.listingTitle} numberOfLines={1}>
              {listing.title}
            </Text>
            <Text style={styles.listingDesc} numberOfLines={3}>
              {listing.description ??
                'Experience refined comfort in this elegant two-floor villa featuring four spacious bedrooms and a private pool.'}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.accent.main} />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>

        <Text style={styles.breadcrumb}>Thiruvananthapuram &gt; {location}</Text>

        <View style={styles.priceBookRow}>
          <Text style={styles.listingPrice}>{price}</Text>
          <PillButton
            label="Book Now"
            onPress={() => router.push({ pathname: '/resort/[id]', params: { id: listing.id } })}
            fontSize={12}
            height={42}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 72,
    marginBottom: 8,
  },
  dividerPrimary: {
    flex: 1,
    height: 2,
    backgroundColor: colors.accent.main,
    maxWidth: 610,
  },
  dividerMuted: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.1)',
    maxWidth: 610,
  },
  moodSection: {
    marginTop: 72,
    gap: 72,
    alignItems: 'center',
  },
  moodHeader: {
    alignItems: 'center',
    gap: 18,
    width: '100%',
  },
  moodTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 17,
  },
  moodSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 11,
  },
  moodPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 46,
    maxWidth: 945,
    padding: 10,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    height: 34,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: 'transparent',
    minWidth: 116,
    justifyContent: 'center',
  },
  moodPillActive: {
    backgroundColor: colors.accent.main,
  },
  moodPillLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  moodPillLabelActive: {
    color: colors.surface.white,
  },
  suggestedSection: {
    marginTop: 72,
    gap: 36,
    alignItems: 'center',
    paddingVertical: 24,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    width: '100%',
    lineHeight: 17,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 36,
    width: '100%',
  },
  listingCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    backgroundColor: colors.surface.white,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
  },
  listingImageWrap: {
    width: '100%',
    height: 210,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  listingImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 33,
    height: 33,
    borderRadius: 6,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupleBadge: {
    position: 'absolute',
    left: 9,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    letterSpacing: 0.5,
  },
  listingBody: {
    padding: 12,
    gap: 18,
    flex: 1,
  },
  titleRatingRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  titleBlock: {
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  listingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 16,
  },
  listingDesc: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    lineHeight: 16,
  },
  breadcrumb: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  priceBookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  listingPrice: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 16,
  },
  viewAllWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  viewAllPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
  },
  viewAllText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 16,
  },
  destinationsSection: {
    marginTop: 72,
    gap: 36,
    paddingVertical: 42,
    alignItems: 'center',
  },
  destGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 36,
    width: '100%',
  },
  destCard: {
    width: CARD_W,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
    minHeight: 78,
  },
  destThumb: {
    width: 97,
    height: 58,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
    flexShrink: 0,
  },
  destCopy: {
    flex: 1,
    gap: 12,
    minWidth: 0,
  },
  destName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 16,
  },
  destBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 18,
  },
  destSubtitle: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.7)',
    lineHeight: 12,
  },
});
