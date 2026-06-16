import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

import { GlassSurface } from '@/src/components/home/GlassSurface';
import { HomeCategoryTabs } from '@/src/components/home/HomeCategoryTabs';
import { HomeActivitySearchCard } from '@/src/components/home/HomeActivitySearchCard';
import { HomeGlampingSearchCard } from '@/src/components/home/HomeGlampingSearchCard';
import { HomePackageSearchCard } from '@/src/components/home/HomePackageSearchCard';
import { HomeSearchCard } from '@/src/components/home/HomeSearchCard';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { PillButton } from '@/src/components/home/PillButton';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { ACTIVITY_HERO } from '@/src/constants/homeActivityConfig';
import { GLAMPING_HERO } from '@/src/constants/homeGlampingConfig';
import { PACKAGE_HERO } from '@/src/constants/homePackageConfig';
import {
  GLAMPING_HERO_BACKGROUND,
  GLAMPING_OFFER_IMAGE,
  PACKAGE_HERO_BACKGROUND,
  PACKAGE_OFFER_IMAGE,
} from '@/src/constants/placeholderImages';

const HotelsHeroBg = require('../../../assets/images/backgroundimagehomehotels.jpg');
const HotelsPromoDiscount = require('../../../assets/images/home-figma/promo-discount.png');
const ActivityHeroBg = require('../../../assets/images/activitybg.jpg');
const ActivityOfferImage = require('../../../assets/images/activityoffer.jpg');

/** Figma Frame 5189 — base frame sizing. */
const HERO_FRAME_HEIGHT = 762;
const HERO_FRAME_GAP = 275;

const HERO_BY_TAB = {
  hotels: {
    background: HotelsHeroBg,
    tagline: 'Stay Anywhere, Feel at Home',
    taglineSub: null,
    promoTitle: 'Luxury Hotels at Stunning Discounts',
    promoSubtitle: 'Where Every Mood Meets Its Perfect Stay',
    promoImage: HotelsPromoDiscount,
    imageOffset: 24,
  },
  packages: {
    background: PACKAGE_HERO_BACKGROUND,
    tagline: PACKAGE_HERO.tagline,
    taglineSub: null,
    promoTitle: PACKAGE_HERO.promoTitle,
    promoSubtitle: PACKAGE_HERO.promoSubtitle,
    promoImage: PACKAGE_OFFER_IMAGE,
    imageOffset: 48,
  },
  glamping: {
    background: GLAMPING_HERO_BACKGROUND,
    tagline: GLAMPING_HERO.tagline,
    taglineSub: GLAMPING_HERO.taglineSub,
    promoTitle: GLAMPING_HERO.promoTitle,
    promoSubtitle: GLAMPING_HERO.promoSubtitle,
    promoImage: GLAMPING_OFFER_IMAGE,
    imageOffset: 24,
  },
  activities: {
    background: ActivityHeroBg,
    tagline: ACTIVITY_HERO.tagline,
    taglineSub: null,
    promoTitle: ACTIVITY_HERO.promoTitle,
    promoSubtitle: ACTIVITY_HERO.promoSubtitle,
    promoImage: ActivityOfferImage,
    imageOffset: 24,
  },
} as const;

export function HomeHeroSection() {
  const { s } = useHomeScale();
  const { activeCategoryTab, setActiveCategoryTab } = useHomeSearch();
  const hero = HERO_BY_TAB[activeCategoryTab];

  return (
    <View style={[styles.wrap, { paddingHorizontal: s(16), paddingTop: s(10), paddingBottom: s(10) }]}>
      <ImageBackground
        source={hero.background}
        style={[
          styles.heroFrame,
          {
            borderRadius: s(18),
            padding: s(12),
            height: s(HERO_FRAME_HEIGHT),
            gap: s(HERO_FRAME_GAP),
          },
        ]}
        imageStyle={[
          { borderRadius: s(14) },
          {
            height: '115%',
            transform: [{ translateY: -s(hero.imageOffset) }],
          },
        ]}
        resizeMode="cover"
      >
        <View style={{ width: '100%', gap: s(16) }}>
          <View style={{ width: '100%' }}>
            <Text style={[styles.tagline, { fontSize: s(16), lineHeight: s(28) }]}>{hero.tagline}</Text>
            {hero.taglineSub ? (
              <Text style={[styles.tagline, { fontSize: s(16), lineHeight: s(28) }]}>{hero.taglineSub}</Text>
            ) : null}
          </View>

          <GlassSurface borderRadius={s(12)} style={{ padding: s(10), width: '100%' }}>
            <View style={styles.glassPromoRow}>
              <View style={[styles.promoThumbWrap, { width: s(85), height: s(58), borderRadius: s(8) }]}>
                <Image source={hero.promoImage} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                <Text style={[styles.promoThumbText, { fontSize: s(12), lineHeight: s(12) }]}>
                  {'upto\n50% off'}
                </Text>
              </View>

              <View style={[styles.promoCopy, { gap: s(6), paddingVertical: s(3), flex: 1, minWidth: 0 }]}>
                <Text
                  style={[styles.promoTitle, { fontSize: s(11), lineHeight: s(14) }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {hero.promoTitle}
                </Text>
                <View style={styles.promoBottomRow}>
                  <Text
                    style={[styles.promoSubtitle, { fontSize: s(9), lineHeight: s(12), flex: 1 }]}
                    numberOfLines={2}
                  >
                    {hero.promoSubtitle}
                  </Text>
                  <PillButton label="Explore" variant="white" fontSize={s(12)} height={s(24)} />
                </View>
              </View>
            </View>
          </GlassSurface>

          <HomeCategoryTabs activeTab={activeCategoryTab} onTabChange={setActiveCategoryTab} />

          {activeCategoryTab === 'packages' ? (
            <HomePackageSearchCard />
          ) : activeCategoryTab === 'glamping' ? (
            <HomeGlampingSearchCard />
          ) : activeCategoryTab === 'activities' ? (
            <HomeActivitySearchCard />
          ) : (
            <HomeSearchCard activeTab={activeCategoryTab} />
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface.white,
  },
  heroFrame: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  tagline: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  glassPromoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  promoThumbWrap: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    padding: 8,
  },
  promoThumbText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
  promoCopy: {
    flex: 1,
  },
  promoTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
  promoBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 18,
  },
  promoSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.04,
  },
});
