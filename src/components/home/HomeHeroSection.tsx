import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import BellLoginIcon from '@/assets/images/login-figma/bell-login.svg';
import MenuLoginIcon from '@/assets/images/login-figma/menu-login.svg';
import TabActivitiesIcon from '@/assets/images/home-figma/tab-activities.svg';
import TabGlampingIcon from '@/assets/images/home-figma/tab-glamping.svg';
import TabHotelsIcon from '@/assets/images/home-figma/tab-hotels.svg';
import TabPackagesIcon from '@/assets/images/home-figma/tab-packages.svg';
import { GlassSurface } from '@/src/components/home/GlassSurface';
import { HomeGlampingSearchCard } from '@/src/components/home/HomeGlampingSearchCard';
import { HomePackageSearchCard } from '@/src/components/home/HomePackageSearchCard';
import { HomeSearchCard } from '@/src/components/home/HomeSearchCard';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { PillButton } from '@/src/components/home/PillButton';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { GLAMPING_HERO } from '@/src/constants/homeGlampingConfig';
import { PACKAGE_HERO } from '@/src/constants/homePackageConfig';
import {
  GLAMPING_HERO_BACKGROUND,
  GLAMPING_OFFER_IMAGE,
  PACKAGE_HERO_BACKGROUND,
  PACKAGE_OFFER_IMAGE,
} from '@/src/constants/placeholderImages';

const HeaderLogo = require('../../../assets/images/login-figma/logo-header.png');
const HotelsHeroBg = require('../../../assets/images/backgroundimagehomehotels.jpg');
const HotelsPromoDiscount = require('../../../assets/images/home-figma/promo-discount.png');

/** Figma Frame 5189 — base frame sizing. */
const HERO_FRAME_HEIGHT = 762;
const HERO_FRAME_GAP = 275;

const CATEGORY_TABS: Array<{
  id: HomeCategoryTab;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
}> = [
  { id: 'hotels', label: 'Hotels', Icon: TabHotelsIcon },
  { id: 'packages', label: 'Packages', Icon: TabPackagesIcon },
  { id: 'glamping', label: 'Glamping', Icon: TabGlampingIcon },
  { id: 'activities', label: 'Activities', Icon: TabActivitiesIcon },
];

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
    background: HotelsHeroBg,
    tagline: 'Adventure Awaits Around Every Corner',
    taglineSub: null,
    promoTitle: 'Thrilling Activities at Stunning Discounts',
    promoSubtitle: 'Where Every Mood Finds Its Perfect Escape',
    promoImage: HotelsPromoDiscount,
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
        <View style={[styles.headerCard, { padding: s(12), borderRadius: s(10), width: '100%' }]}>
          <Image
            source={HeaderLogo}
            style={{ width: s(68), height: s(32) }}
            resizeMode="contain"
          />
          <View style={styles.topBarActions}>
            <Pressable style={styles.headerIconButton} accessibilityLabel="Notifications">
              <BellLoginIcon width={18} height={18} />
            </Pressable>
            <Pressable style={styles.headerIconButton} accessibilityLabel="Menu">
              <MenuLoginIcon width={24} height={24} />
            </Pressable>
          </View>
        </View>

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

          <View style={[styles.tabsShell, { padding: s(4), borderRadius: s(12), gap: s(2), width: '100%' }]}>
            {CATEGORY_TABS.map((tab) => {
              const selected = tab.id === activeCategoryTab;
              return (
                <Pressable
                  key={tab.id}
                  style={[
                    styles.tabButton,
                    {
                      paddingVertical: s(6),
                      paddingHorizontal: s(4),
                      borderRadius: s(8),
                      gap: s(2),
                      backgroundColor: selected ? colors.accent.main : colors.surface.white,
                      borderWidth: selected ? 2 : 1,
                      borderColor: selected ? colors.surface.white : 'rgba(28, 32, 36, 0.2)',
                    },
                  ]}
                  onPress={() => setActiveCategoryTab(tab.id)}
                  accessibilityState={{ selected }}
                >
                  <View
                    style={[
                      styles.tabIconBox,
                      {
                        width: s(18),
                        height: s(18),
                        borderRadius: s(2),
                        backgroundColor: selected ? 'rgba(255, 255, 255, 0.95)' : colors.surface.white,
                      },
                    ]}
                  >
                    <tab.Icon width={s(11)} height={s(11)} />
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        fontSize: s(9),
                        lineHeight: s(12),
                        color: selected ? colors.surface.white : colors.text.primary,
                      },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {activeCategoryTab === 'packages' ? (
            <HomePackageSearchCard />
          ) : activeCategoryTab === 'glamping' ? (
            <HomeGlampingSearchCard />
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    alignSelf: 'stretch',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  tabsShell: {
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(3px)' } as object) : null),
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tabIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.01,
    textAlign: 'center',
    width: '100%',
  },
});
