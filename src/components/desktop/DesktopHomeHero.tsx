import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopHomeSearchBar } from '@/src/components/desktop/DesktopHomeSearchBar';
import { GlassSurface } from '@/src/components/home/GlassSurface';
import { PillButton } from '@/src/components/home/PillButton';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

const HERO_BY_TAB: Record<
  HomeCategoryTab,
  {
    background: number;
    tagline: string;
    promoTitle: string;
    promoSubtitle: string;
    promoImage: number;
  }
> = {
  hotels: {
    background: require('../../../assets/images/backgroundimagehomehotels.jpg'),
    tagline: 'Stay Anywhere, Feel at Home',
    promoTitle: 'Luxury Hotels at Stunning Discounts',
    promoSubtitle: 'Where Every Mood Meets Its Perfect Stay',
    promoImage: require('../../../assets/images/home-figma/promo-discount.png'),
  },
  packages: {
    background: require('../../../assets/images/packagebackground.jpg'),
    tagline: 'Travel Beyond Borders',
    promoTitle: 'Curated Packages for Every Journey',
    promoSubtitle: 'Handpicked destinations, seamless planning',
    promoImage: require('../../../assets/images/offerpackage.jpg'),
  },
  glamping: {
    background: require('../../../assets/images/glampingbg.jpg'),
    tagline: 'Sleep Under the Stars',
    promoTitle: 'Glamping Escapes Await',
    promoSubtitle: 'Nature meets comfort in scenic retreats',
    promoImage: require('../../../assets/images/glampingoffer.jpg'),
  },
  activities: {
    background: require('../../../assets/images/activitybg.jpg'),
    tagline: 'Adventure Starts Here',
    promoTitle: 'Unforgettable Local Experiences',
    promoSubtitle: 'Trekking, sightseeing, and more',
    promoImage: require('../../../assets/images/activityoffer.jpg'),
  },
};

export function DesktopHomeHero() {
  const { activeCategoryTab } = useHomeSearch();
  const hero = HERO_BY_TAB[activeCategoryTab];

  return (
    <ImageBackground
      source={hero.background}
      style={styles.hero}
      imageStyle={styles.heroImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <Text style={styles.tagline}>{hero.tagline}</Text>

      <View style={styles.body}>
        <GlassSurface borderRadius={16} intensity="light" style={styles.promoCard}>
          <View style={styles.promoRow}>
            <View style={styles.promoThumb}>
              <Image source={hero.promoImage} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              <Text style={styles.promoThumbText}>{'upto\n50% off'}</Text>
            </View>
            <View style={styles.promoCopy}>
              <Text style={styles.promoTitle}>{hero.promoTitle}</Text>
              <Text style={styles.promoSubtitle}>{hero.promoSubtitle}</Text>
              <PillButton label="Explore" variant="white" fontSize={12} height={28} />
            </View>
          </View>
        </GlassSurface>
      </View>

      <View style={styles.searchWrap}>
        <DesktopHomeSearchBar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    minHeight: 520,
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  heroImage: {
    transform: [{ scale: 1.05 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  tagline: {
    alignSelf: 'center',
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
    zIndex: 1,
    marginTop: 24,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
    zIndex: 1,
  },
  promoCard: {
    maxWidth: 380,
    padding: 14,
  },
  promoRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  promoThumb: {
    width: 96,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    padding: 8,
  },
  promoThumbText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface.white,
    lineHeight: 16,
  },
  promoCopy: {
    flex: 1,
    gap: 8,
  },
  promoTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface.white,
    lineHeight: 20,
  },
  promoSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  searchWrap: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    zIndex: 1,
  },
});
