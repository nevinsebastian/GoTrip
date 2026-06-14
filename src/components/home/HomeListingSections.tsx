import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Listing } from '@/src/api/types';
import { getPrimaryImage } from '@/src/utils/getPrimaryImage';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AccountMultipleIcon from '@/assets/images/account-multiple.svg';
import CashMultipleIcon from '@/assets/images/cash-multiple.svg';
import DiamondIcon from '@/assets/images/diamond.svg';
import ForestIcon from '@/assets/images/forest.svg';
import HeartIcon from '@/assets/images/heart.svg';
import HdrIcon from '@/assets/images/image-filter-hdr.svg';
import WavesIcon from '@/assets/images/waves.svg';
import { GlassSurface } from '@/src/components/home/GlassSurface';
import { PillButton } from '@/src/components/home/PillButton';
import { useHomeScale } from '@/src/components/home/useHomeScale';

const OfferBg = require('../../../assets/images/home-figma/hero-bg.png');

const MOODS = [
  { id: 'budget', label: 'Budget', Icon: CashMultipleIcon },
  { id: 'hill', label: 'Hill Station', Icon: HdrIcon },
  { id: 'private', label: 'Private', Icon: AccountMultipleIcon },
  { id: 'beach', label: 'Beach', Icon: WavesIcon },
  { id: 'luxury', label: 'Luxury', Icon: DiamondIcon },
  { id: 'forest', label: 'Forest', Icon: ForestIcon },
];

const MOOD_ROWS: Array<Array<(typeof MOODS)[number]['id']>> = [
  ['budget', 'hill'],
  ['private', 'beach'],
  ['luxury', 'forest'],
];

const DESTINATIONS = [
  { name: 'Varkala', subtitle: 'Cliff-side beach, spiritual vibe' },
  { name: 'Munnar', subtitle: 'Tea plantations, Eravikulam National Park' },
  { name: 'Wayanad', subtitle: 'Waterfalls, wildlife, scenic hills' },
  { name: 'Kochi', subtitle: 'Fort Kochi, Chinese fishing nets, colonial heritage' },
];

export function HomeMoodGrid({ onMoodPress }: { onMoodPress?: (id: string) => void }) {
  const { s } = useHomeScale();
  const [selected, setSelected] = useState('budget');

  const moodById = Object.fromEntries(MOODS.map((m) => [m.id, m]));

  return (
    <View style={[styles.section, { marginTop: s(16), gap: s(16), paddingHorizontal: s(16) }]}>
      <View style={{ gap: s(4), alignItems: 'center' }}>
        <Text style={[styles.sectionTitleCenter, { fontSize: s(16) }]}>
          Explore Stays That Match Your Mood
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: s(12) }]}>
          Curated Travel Experiences
        </Text>
      </View>

      <View style={{ paddingHorizontal: s(8), gap: s(18) }}>
        {MOOD_ROWS.map((row) => (
          <View
            key={row.join('-')}
            style={[
              styles.moodRow,
              {
                padding: s(12),
                gap: s(36),
                borderRadius: s(100),
              },
            ]}
          >
            {row.map((id) => {
              const mood = moodById[id];
              const isSelected = selected === id;
              return (
                <Pressable
                  key={id}
                  style={[
                    styles.moodPill,
                    {
                      paddingVertical: s(8),
                      paddingHorizontal: s(14),
                      gap: s(8),
                      height: s(34),
                      backgroundColor: isSelected ? colors.accent.main : 'transparent',
                      borderColor: colors.accent.main,
                    },
                  ]}
                  onPress={() => {
                    setSelected(id);
                    onMoodPress?.(id);
                  }}
                >
                  {id === 'budget' && !isSelected ? (
                    <Ionicons name="cash-outline" size={s(20)} color={colors.accent.main} />
                  ) : (
                    <mood.Icon width={s(20)} height={s(20)} />
                  )}
                  <Text
                    style={[
                      styles.moodPillLabel,
                      {
                        fontSize: s(12),
                        color: isSelected ? '#FCFCFC' : colors.accent.main,
                      },
                    ]}
                  >
                    {mood.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export function HomePromoCarousel() {
  const { s } = useHomeScale();
  const cardW = s(272);

  return (
    <View style={[styles.section, { marginTop: s(16), paddingBottom: s(12) }]}>
      <View style={styles.carouselWrap}>
        <Pressable style={[styles.carouselArrow, { width: s(32), height: s(32) }]}>
          <Ionicons name="chevron-back" size={s(16)} color="#0F1A20" />
        </Pressable>

        <View
          style={[
            styles.offerCard,
            {
              width: cardW,
              height: s(177),
              borderRadius: s(18),
              padding: s(24),
            },
          ]}
        >
          <ImageBackground
            source={OfferBg}
            style={[StyleSheet.absoluteFillObject, { borderRadius: s(18) }]}
            imageStyle={{ borderRadius: s(18) }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.35)']}
            style={[StyleSheet.absoluteFillObject, { borderRadius: s(18) }]}
          />

          <View style={{ gap: s(18), flex: 1, justifyContent: 'space-between' }}>
            <View style={{ gap: s(4) }}>
              <Text style={[styles.offerEyebrow, { fontSize: s(14), lineHeight: s(19) }]}>
                Grab upto Enjoy Up to 60% OFF*{'\n'}on Hotel Bookings
              </Text>
              <Text style={[styles.offerAmount, { fontSize: s(24), lineHeight: s(28) }]}>
                ₹ 1500/- off
              </Text>
            </View>

            <View style={styles.offerActions}>
              <GlassSurface
                borderRadius={s(24)}
                intensity="light"
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: s(10),
                  padding: s(12),
                  height: s(40),
                  marginRight: s(8),
                }}
              >
                <Ionicons name="copy-outline" size={s(16)} color="#FFFFFF" />
                <Text style={[styles.offerCode, { fontSize: s(12) }]}>Use code: GTFIRST100</Text>
              </GlassSurface>

              <GlassSurface
                borderRadius={s(20)}
                intensity="light"
                style={{
                  width: s(40),
                  height: s(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <Ionicons
                  name="arrow-up"
                  size={s(16)}
                  color="#FFFFFF"
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
              </GlassSurface>
            </View>
          </View>
        </View>

        <Pressable style={[styles.carouselArrow, { width: s(32), height: s(32) }]}>
          <Ionicons name="chevron-forward" size={s(16)} color="#0F1A20" />
        </Pressable>
      </View>
    </View>
  );
}

export function HomeSuggestedSection({
  listings,
  onListingPress,
}: {
  listings: Listing[];
  onListingPress: (listing: Listing) => void;
}) {
  const { s } = useHomeScale();
  const cardW = s(271);

  if (!listings.length) return null;

  return (
    <View style={[styles.section, { marginTop: s(24), paddingVertical: s(24), gap: s(36) }]}>
      <Text style={[styles.sectionTitleCenter, { fontSize: s(16), paddingHorizontal: s(16) }]}>
        Suggested for you
      </Text>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: s(16),
            gap: s(12),
            alignItems: 'center',
          }}
          snapToInterval={cardW + s(12)}
          decelerationRate="fast"
        >
          {listings.map((listing) => (
            <SuggestedCard
              key={listing.id}
              listing={listing}
              width={cardW}
              onPress={() => onListingPress(listing)}
            />
          ))}
        </ScrollView>

        <View style={[styles.carouselNavOverlay, { paddingHorizontal: s(16) }]}>
          <Pressable style={[styles.carouselArrow, { width: s(32), height: s(32) }]}>
            <Ionicons name="chevron-back" size={s(16)} color="#0F1A20" />
          </Pressable>
          <Pressable style={[styles.carouselArrow, { width: s(32), height: s(32) }]}>
            <Ionicons name="chevron-forward" size={s(16)} color="#0F1A20" />
          </Pressable>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Pressable
          style={[
            styles.viewAllPill,
            { paddingVertical: s(6), paddingHorizontal: s(12), borderRadius: s(100) },
          ]}
        >
          <Text style={[styles.viewAllText, { fontSize: s(14) }]}>View all →</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SuggestedCard({
  listing,
  width,
  onPress,
}: {
  listing: Listing;
  width: number;
  onPress: () => void;
}) {
  const { s } = useHomeScale();
  const img = getPrimaryImage(listing.media);
  const price =
    listing.price_start != null
      ? `₹${Number(listing.price_start).toLocaleString('en-IN')}/night`
      : '₹1199/night';
  const location = listing.location ?? 'Varkala';

  return (
    <Pressable
      style={[
        styles.suggestedCard,
        {
          width,
          padding: s(6),
          borderRadius: s(12),
          gap: s(4),
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.suggestedImageWrap, { height: s(145), borderRadius: s(8) }]}>
        {img ? (
          <Image source={{ uri: img }} style={styles.suggestedImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color={colors.text.caption} />
          </View>
        )}

        <View style={[styles.heartBtn, { width: s(33), height: s(33), borderRadius: s(6) }]}>
          <HeartIcon width={s(14)} height={s(14)} />
        </View>

        <GlassSurface
          borderRadius={s(24)}
          intensity="light"
          style={[
            styles.coupleBadge,
            {
              left: s(9.5),
              bottom: s(10),
              paddingVertical: s(8),
              paddingHorizontal: s(16),
              flexDirection: 'row',
              gap: s(10),
            },
          ]}
        >
          <Ionicons name="heart-outline" size={s(12)} color="#FFFFFF" />
          <Text style={[styles.coupleBadgeText, { fontSize: s(10) }]}>COUPLE FRIENDLY</Text>
        </GlassSurface>
      </View>

      <View style={{ padding: s(12), gap: s(18) }}>
        <View style={styles.titleRatingRow}>
          <View style={{ flex: 1, gap: s(8) }}>
            <Text style={[styles.suggestedTitle, { fontSize: s(14), lineHeight: s(16) }]} numberOfLines={1}>
              {listing.title}
            </Text>
            <Text style={[styles.suggestedDesc, { fontSize: s(10), lineHeight: s(12) }]} numberOfLines={3}>
              {listing.description ??
                'Experience refined comfort in this elegant two-floor villa featuring four spacious bedrooms and a private pool.'}
            </Text>
          </View>
          <View style={[styles.ratingRow, { paddingHorizontal: s(8) }]}>
            <Ionicons name="star" size={s(16)} color={colors.accent.main} />
            <Text style={[styles.ratingAccent, { fontSize: s(15), lineHeight: s(16) }]}>4.5</Text>
          </View>
        </View>

        <Text style={[styles.breadcrumb, { fontSize: s(12), lineHeight: s(16) }]}>
          Thiruvananthapuram &gt; {location}
        </Text>

        <View style={styles.priceBookRow}>
          <Text style={[styles.suggestedPrice, { fontSize: s(16), lineHeight: s(16) }]}>{price}</Text>
          <PillButton label="Book Now" onPress={onPress} fontSize={s(12)} height={s(34)} />
        </View>
      </View>
    </Pressable>
  );
}

export function HomeDestinationsSection({
  listings,
  onListingPress,
}: {
  listings: Listing[];
  onListingPress: (listing: Listing) => void;
}) {
  const { s } = useHomeScale();
  const cardW = s(293);

  const items = DESTINATIONS.map((dest, i) => ({
    ...dest,
    listing: listings[i % Math.max(listings.length, 1)],
  }));

  return (
    <View
      style={[
        styles.destSection,
        {
          marginTop: s(8),
          paddingVertical: s(42),
          paddingHorizontal: s(12),
          gap: s(24),
        },
      ]}
    >
      <Text style={[styles.sectionTitleCenter, { fontSize: s(16) }]}>
        Book Hotels at Popular Destinations
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: s(12), paddingHorizontal: s(4) }}
      >
        {items.map((item) => {
          const img = item.listing ? getPrimaryImage(item.listing.media) : null;
          return (
            <Pressable
              key={item.name}
              style={[
                styles.destCard,
                {
                  width: cardW,
                  padding: s(10),
                  gap: s(16),
                  borderRadius: s(12),
                },
              ]}
              onPress={() => item.listing && onListingPress(item.listing)}
            >
              <View style={[styles.destThumb, { width: s(76), height: s(58), borderRadius: s(8) }]}>
                {img ? (
                  <Image source={{ uri: img }} style={styles.destImage} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={22} color={colors.text.caption} />
                  </View>
                )}
              </View>
              <View style={{ flex: 1, gap: s(12), paddingVertical: s(3) }}>
                <Text style={[styles.destName, { fontSize: s(16), lineHeight: s(16) }]}>
                  {item.name}
                </Text>
                <View style={styles.destBottom}>
                  <Text
                    style={[styles.destSubtitle, { fontSize: s(8), lineHeight: s(8), flex: 1 }]}
                    numberOfLines={2}
                  >
                    {item.subtitle}
                  </Text>
                  <PillButton label="Explore" onPress={() => {}} fontSize={s(10)} height={s(24)} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ alignItems: 'center' }}>
        <Pressable
          style={[
            styles.viewAllDarkPill,
            { paddingVertical: s(6), paddingHorizontal: s(12), borderRadius: s(100) },
          ]}
        >
          <Text style={[styles.viewAllDarkText, { fontSize: s(14) }]}>View all →</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function HomeBudgetGrid({
  listings,
  onListingPress,
}: {
  listings: Listing[];
  onListingPress: (listing: Listing) => void;
}) {
  const { s } = useHomeScale();
  const gap = s(12);
  const cardW = (s(367) - gap) / 2;

  if (!listings.length) return null;

  const rows: Listing[][] = [];
  for (let i = 0; i < Math.min(listings.length, 6); i += 2) {
    rows.push(listings.slice(i, i + 2));
  }

  return (
    <View style={[styles.section, { marginTop: s(8), paddingHorizontal: s(16), gap: s(18) }]}>
      <Text style={[styles.sectionTitleCenter, { fontSize: s(16) }]}>More budget options</Text>
      {rows.map((row) => (
        <View key={row.map((l) => l.id).join('-')} style={[styles.budgetRow, { gap }]}>
          {row.map((listing) => (
            <BudgetCard
              key={listing.id}
              listing={listing}
              width={cardW}
              onPress={() => onListingPress(listing)}
            />
          ))}
        </View>
      ))}
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
    </View>
  );
}

function BudgetCard({
  listing,
  width,
  onPress,
}: {
  listing: Listing;
  width: number;
  onPress: () => void;
}) {
  const { s } = useHomeScale();
  const img = getPrimaryImage(listing.media);
  const price =
    listing.price_start != null
      ? `₹ ${Number(listing.price_start).toLocaleString('en-IN')}/night`
      : '₹ 1199/night';

  return (
    <Pressable
      style={[
        styles.budgetCard,
        {
          width,
          padding: s(8),
          borderRadius: s(24),
          gap: s(16),
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.budgetImageWrap, { height: s(132), borderRadius: s(18) }]}>
        {img ? (
          <Image source={{ uri: img }} style={styles.budgetImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={22} color={colors.text.caption} />
          </View>
        )}
        <View style={[styles.heartBtn, { width: s(33), height: s(33), borderRadius: s(12) }]}>
          <HeartIcon width={s(14)} height={s(14)} />
        </View>
        <GlassSurface
          borderRadius={s(24)}
          intensity="light"
          style={[
            styles.coupleBadge,
            {
              left: s(9.5),
              bottom: s(9),
              paddingVertical: s(6),
              paddingHorizontal: s(12),
              flexDirection: 'row',
              gap: s(10),
            },
          ]}
        >
          <Ionicons name="heart-outline" size={s(10)} color="#FFFFFF" />
          <Text style={[styles.coupleBadgeText, { fontSize: s(9) }]}>COUPLE FRIENDLY</Text>
        </GlassSurface>
      </View>

      <View style={{ gap: s(18) }}>
        <View style={{ paddingHorizontal: s(2), gap: s(12) }}>
          <Text style={[styles.budgetTitle, { fontSize: s(12), lineHeight: s(16) }]} numberOfLines={2}>
            {listing.title}
          </Text>
          <View style={styles.budgetMetaRow}>
            <Text style={[styles.breadcrumb, { fontSize: s(9) }]}>Kerala &gt; Varkala</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={s(12)} color={colors.accent.main} />
              <Text style={[styles.ratingAccent, { fontSize: s(12) }]}>4.5</Text>
            </View>
          </View>
          <Text style={[styles.suggestedPrice, { fontSize: s(14) }]}>{price}</Text>
        </View>
        <PillButton label="Book Now" onPress={onPress} fontSize={s(10)} height={s(34)} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionTitleCenter: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
    textAlign: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    marginBottom: 0,
  },
  moodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9999,
  },
  moodPillLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.04,
  },
  carouselWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  carouselArrow: {
    backgroundColor: colors.surface.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  offerCard: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  offerEyebrow: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.surface.white,
  },
  offerAmount: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface.white,
  },
  offerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerCode: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  carouselNavOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  viewAllPill: {
    borderWidth: 1,
    borderColor: colors.accent.main,
  },
  viewAllText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  suggestedCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  suggestedImageWrap: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.surface.white,
  },
  suggestedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.backgroundAlt,
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  coupleBadge: {
    position: 'absolute',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
  titleRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  suggestedTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  suggestedDesc: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.8)',
    letterSpacing: 0.04,
  },
  breadcrumb: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  priceBookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  suggestedPrice: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingAccent: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
    letterSpacing: 0.04,
  },
  destSection: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    width: '100%',
  },
  destCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  destThumb: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface.white,
  },
  destImage: {
    width: '100%',
    height: '100%',
  },
  destName: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  destBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 18,
  },
  destSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: '300',
    color: 'rgba(28, 32, 36, 0.8)',
    letterSpacing: 0.04,
  },
  viewAllDarkPill: {
    borderWidth: 1,
    borderColor: colors.text.primary,
  },
  viewAllDarkText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  budgetRow: {
    flexDirection: 'row',
  },
  budgetCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  budgetImageWrap: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: colors.surface.backgroundAlt,
  },
  budgetImage: {
    width: '100%',
    height: '100%',
  },
  budgetTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  budgetMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
