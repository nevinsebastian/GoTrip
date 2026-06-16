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
import { HomePackageSearchCard } from '@/src/components/home/HomePackageSearchCard';
import { HomeSearchCard } from '@/src/components/home/HomeSearchCard';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { PillButton } from '@/src/components/home/PillButton';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { PACKAGE_HERO } from '@/src/constants/homePackageConfig';
import {
  PACKAGE_HERO_BACKGROUND,
  PACKAGE_OFFER_IMAGE,
} from '@/src/constants/placeholderImages';

const HeaderLogo = require('../../../assets/images/login-figma/logo-header.png');
const HotelsHeroBg = require('../../../assets/images/backgroundimagehomehotels.jpg');
const HotelsPromoDiscount = require('../../../assets/images/home-figma/promo-discount.png');

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
    promoTitle: 'Luxury Hotels at Stunning Discounts',
    promoSubtitle: 'Where Every Mood Meets Its Perfect Stay',
    promoImage: HotelsPromoDiscount,
  },
  packages: {
    background: PACKAGE_HERO_BACKGROUND,
    tagline: PACKAGE_HERO.tagline,
    promoTitle: PACKAGE_HERO.promoTitle,
    promoSubtitle: PACKAGE_HERO.promoSubtitle,
    promoImage: PACKAGE_OFFER_IMAGE,
  },
  glamping: {
    background: HotelsHeroBg,
    tagline: 'Sleep Under the Stars in Style',
    promoTitle: 'Glamping Escapes at Great Prices',
    promoSubtitle: 'Where Nature Meets Comfort',
    promoImage: HotelsPromoDiscount,
  },
  activities: {
    background: HotelsHeroBg,
    tagline: 'Adventure Awaits Around Every Corner',
    promoTitle: 'Thrilling Activities at Stunning Discounts',
    promoSubtitle: 'Where Every Mood Finds Its Perfect Escape',
    promoImage: HotelsPromoDiscount,
  },
} as const;

const HERO_LAYOUT: Record<
  HomeCategoryTab,
  { frameMinHeight: number; imageTopSpace: number; imageOffset?: number }
> = {
  hotels: { frameMinHeight: 762, imageTopSpace: 130, imageOffset: 24 },
  packages: { frameMinHeight: 762, imageTopSpace: 275, imageOffset: 48 },
  glamping: { frameMinHeight: 762, imageTopSpace: 130, imageOffset: 24 },
  activities: { frameMinHeight: 762, imageTopSpace: 130, imageOffset: 24 },
};

export function HomeHeroSection() {
  const { s } = useHomeScale();
  const { activeCategoryTab, setActiveCategoryTab } = useHomeSearch();
  const hero = HERO_BY_TAB[activeCategoryTab];
  const layout = HERO_LAYOUT[activeCategoryTab];
  const imageOffset = layout.imageOffset ?? 0;

  return (
    <View style={[styles.wrap, { paddingHorizontal: s(16), paddingTop: s(10), gap: s(10) }]}>
      <View style={[styles.headerCard, { padding: s(12), borderRadius: s(10) }]}>
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

      <ImageBackground
        source={hero.background}
        style={[
          styles.heroFrame,
          {
            borderRadius: s(18),
            padding: s(12),
            minHeight: s(layout.frameMinHeight),
          },
        ]}
        imageStyle={[
          { borderRadius: s(14) },
          imageOffset
            ? {
                height: '115%',
                transform: [{ translateY: -s(imageOffset) }],
              }
            : null,
        ]}
        resizeMode="cover"
      >
        <View style={[styles.heroBottom, { gap: s(16), width: '100%', paddingTop: s(layout.imageTopSpace) }]}>
          <Text style={[styles.tagline, { fontSize: s(16), lineHeight: s(28) }]}>{hero.tagline}</Text>

          <GlassSurface borderRadius={s(12)} style={{ padding: s(10) }}>
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

          <View style={[styles.tabsShell, { padding: s(4), borderRadius: s(12), gap: s(2) }]}>
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
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
  heroFrame: {
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroBottom: {
    zIndex: 2,
    width: '100%',
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
