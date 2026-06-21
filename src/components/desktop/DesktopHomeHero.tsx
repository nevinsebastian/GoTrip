import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopCategorySearchBar } from '@/src/components/desktop/DesktopCategorySearchBar';
import { DesktopHomeSearchBar } from '@/src/components/desktop/DesktopHomeSearchBar';
import { DesktopWebNav } from '@/src/components/desktop/DesktopWebNav';
import { GlassSurface } from '@/src/components/home/GlassSurface';
import { HOME_SEARCH_BY_TAB, type HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { PillButton } from '@/src/components/home/PillButton';
import {
  DESKTOP_HERO_BY_TAB,
  DESKTOP_HERO_SPECS,
} from '@/src/constants/desktopHomeConstants';
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

type DesktopHomeHeroProps = {
  activeTab: HomeCategoryTab;
  onTabChange: (tab: HomeCategoryTab) => void;
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
};

export function DesktopHomeHero({
  activeTab,
  onTabChange,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
}: DesktopHomeHeroProps) {
  const { activeCategoryTab, enterSearchMode } = useHomeSearch();
  const hero = DESKTOP_HERO_BY_TAB[activeCategoryTab];
  const searchConfig = HOME_SEARCH_BY_TAB[activeCategoryTab];

  const handleCategorySearch = ({ location, mood }: { location: string; mood: string }) => {
    enterSearchMode({
      location,
      checkIn: searchConfig.defaultCheckIn,
      checkOut: searchConfig.defaultCheckOut,
      guests: {
        adults: searchConfig.defaultAdults,
        children: searchConfig.defaultChildren,
        infants: searchConfig.defaultInfants,
        rooms: searchConfig.defaultRooms,
      },
      tab: activeCategoryTab,
      ...(activeCategoryTab === 'packages' ? { packageMood: mood } : {}),
      ...(activeCategoryTab === 'activities' ? { activityMood: mood } : {}),
    });
  };

  return (
    <View style={styles.outer}>
      <View style={styles.frame}>
        <View style={styles.heroShell}>
          <View style={styles.heroBgClip} pointerEvents="none">
            <Image source={hero.background} style={styles.heroBgImage} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            <DesktopWebNav
              embedded
              activeTab={activeTab}
              onTabChange={onTabChange}
              isLoggedIn={isLoggedIn}
              onMenuPress={onMenuPress}
              onProfilePress={onProfilePress}
              onLoginPress={onLoginPress}
            />

            <View style={styles.middle}>
              <GlassSurface borderRadius={12} intensity="medium" style={styles.promoCard}>
                <View style={styles.promoRow}>
                  <View style={styles.promoThumb}>
                    <Image
                      source={hero.promoImage}
                      style={StyleSheet.absoluteFillObject}
                      resizeMode="cover"
                    />
                    <Text style={styles.promoThumbUpto}>upto </Text>
                    <Text style={styles.promoThumbOff}>50% off</Text>
                  </View>
                  <View style={styles.promoCopy}>
                    <Text style={styles.promoTitle}>{hero.promoTitle}</Text>
                    <View style={styles.promoBottomRow}>
                      <Text style={styles.promoSubtitle}>{hero.promoSubtitle}</Text>
                      <PillButton label="Explore" variant="white" fontSize={12} height={24} />
                    </View>
                  </View>
                </View>
              </GlassSurface>

              <Text style={styles.tagline}>{hero.tagline}</Text>
            </View>
          </View>

          <View style={styles.searchSlot}>
            {activeCategoryTab === 'hotels' ? (
              <DesktopHomeSearchBar />
            ) : (
              <DesktopCategorySearchBar activeTab={activeCategoryTab} onSearch={handleCategorySearch} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    position: 'relative',
    zIndex: 100,
  },
  frame: {
    borderWidth: DESKTOP_HERO_SPECS.frameBorderWidth,
    borderColor: DESKTOP_HERO_SPECS.frameBorderColor,
    borderRadius: DESKTOP_HERO_SPECS.frameBorderRadius,
    overflow: 'visible',
    backgroundColor: DESKTOP_HERO_SPECS.accent,
    ...Platform.select({
      web: { boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' },
      default: {},
    }),
  },
  heroShell: {
    position: 'relative',
    minHeight: DESKTOP_HERO_SPECS.frameMinHeight,
    borderRadius: DESKTOP_HERO_SPECS.frameBorderRadius,
    overflow: 'visible',
  },
  heroBgClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DESKTOP_HERO_SPECS.frameBorderRadius,
    overflow: 'hidden',
  },
  heroBgImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    minHeight: DESKTOP_HERO_SPECS.frameMinHeight - DESKTOP_HERO_SPECS.searchHeight - 36,
    padding: DESKTOP_HERO_SPECS.framePadding,
    paddingBottom: 0,
    gap: 24,
  },
  searchSlot: {
    paddingHorizontal: DESKTOP_HERO_SPECS.framePadding,
    paddingBottom: DESKTOP_HERO_SPECS.framePadding,
    zIndex: 50,
    overflow: 'visible',
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 24,
    flexWrap: 'wrap',
    marginTop: 90,
  },
  promoCard: {
    width: 386,
    padding: 10,
    flexShrink: 0,
  },
  promoRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  promoThumb: {
    width: 113,
    height: 74,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface.white,
    justifyContent: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  promoThumbUpto: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    lineHeight: 12,
  },
  promoThumbOff: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.regular,
    color: colors.surface.white,
    lineHeight: 12,
    marginTop: 2,
  },
  promoCopy: {
    flex: 1,
    gap: 12,
    paddingVertical: 3,
    minWidth: 0,
  },
  promoTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.regular,
    color: colors.surface.white,
    lineHeight: 16,
  },
  promoBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 18,
    minHeight: 24,
  },
  promoSubtitle: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 12,
  },
  tagline: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    lineHeight: 28,
    flexShrink: 1,
  },
});
