import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopCategorySearchBar } from '@/src/components/desktop/DesktopCategorySearchBar';
import { DesktopHomeSearchBar } from '@/src/components/desktop/DesktopHomeSearchBar';
import { DesktopWebNav } from '@/src/components/desktop/DesktopWebNav';
import { HOME_SEARCH_BY_TAB, type HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { DESKTOP_HERO_BY_TAB, DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

const SPECS = DESKTOP_HERO_SPECS;

type DesktopSearchResultsHeaderProps = {
  activeTab: HomeCategoryTab;
  onTabChange: (tab: HomeCategoryTab) => void;
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
};

export function DesktopSearchResultsHeader({
  activeTab,
  onTabChange,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
}: DesktopSearchResultsHeaderProps) {
  const { enterSearchMode } = useHomeSearch();
  const hero = DESKTOP_HERO_BY_TAB[activeTab];
  const searchConfig = HOME_SEARCH_BY_TAB[activeTab];
  const isHotels = activeTab === 'hotels';

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
      tab: activeTab,
      ...(activeTab === 'packages' ? { packageMood: mood } : {}),
      ...(activeTab === 'activities' ? { activityMood: mood } : {}),
    });
  };

  return (
    <View style={styles.outer}>
      <View style={styles.frame}>
        <View style={styles.shell}>
          <DesktopWebNav
            embedded
            activeTab={activeTab}
            onTabChange={onTabChange}
            isLoggedIn={isLoggedIn}
            onMenuPress={onMenuPress}
            onProfilePress={onProfilePress}
            onLoginPress={onLoginPress}
          />

          <View style={styles.searchRow}>
            <View style={styles.searchMain}>
              {isHotels ? (
                <DesktopHomeSearchBar variant="inline" />
              ) : (
                <DesktopCategorySearchBar
                  activeTab={activeTab}
                  onSearch={handleCategorySearch}
                  variant="inline"
                />
              )}
            </View>

            {isHotels ? (
              <Pressable style={styles.priceBtn}>
                <Text style={styles.priceText}>Price</Text>
                <Ionicons name="options-outline" size={18} color={SPECS.accent} />
                <Ionicons name="chevron-down" size={18} color={colors.text.primary} />
              </Pressable>
            ) : null}

            <View style={styles.promoCard}>
              <Image source={hero.promoImage} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              <Text style={styles.promoUpto}>upto </Text>
              <Text style={styles.promoOff}>50% off</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
  },
  frame: {
    borderWidth: SPECS.frameBorderWidth,
    borderColor: SPECS.frameBorderColor,
    borderRadius: SPECS.frameBorderRadius,
    overflow: 'visible',
    backgroundColor: SPECS.accent,
    ...Platform.select({
      web: { boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' },
      default: {},
    }),
  },
  shell: {
    padding: SPECS.framePadding,
    gap: 18,
    overflow: 'visible',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'visible',
    zIndex: 50,
  },
  searchMain: {
    flex: 1,
    minWidth: 0,
    overflow: 'visible',
  },
  priceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 34,
    backgroundColor: colors.surface.white,
    flexShrink: 0,
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  promoCard: {
    width: 106,
    height: 79,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  promoUpto: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  promoOff: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    color: colors.surface.white,
    marginTop: 2,
  },
});
