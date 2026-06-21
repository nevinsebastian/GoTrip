import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import DiamondIcon from '@/assets/images/diamond.svg';
import { HOME_SEARCH_BY_TAB, type HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { DESKTOP_HERO_SPECS, DESKTOP_WEB_ICONS } from '@/src/constants/desktopHomeConstants';
import { DESKTOP_SEARCH_BAR_MOODS } from '@/src/constants/desktopSearchConstants';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import {
  ACTIVITY_POPULAR,
  ACTIVITY_SUGGESTIONS,
} from '@/src/constants/homeActivityConfig';
import {
  GLAMPING_CAMP_SUGGESTIONS,
  GLAMPING_POPULAR_CAMPS,
} from '@/src/constants/homeGlampingConfig';
import {
  PACKAGE_DESTINATION_SUGGESTIONS,
  PACKAGE_POPULAR_DESTINATIONS,
} from '@/src/constants/homePackageConfig';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

const SPECS = DESKTOP_HERO_SPECS;
const SearchIcon = DESKTOP_WEB_ICONS.search;
const SEARCH_ROOT_ID = 'desktop-category-search-bar';
const LOCATION_PANEL_ID = 'desktop-category-location-panel';

type Suggestion = { title: string; subtitle: string | null; short: string };

function getSuggestions(tab: HomeCategoryTab): Suggestion[] {
  if (tab === 'packages') return PACKAGE_DESTINATION_SUGGESTIONS;
  if (tab === 'glamping') return GLAMPING_CAMP_SUGGESTIONS;
  return ACTIVITY_SUGGESTIONS;
}

function getPopularChips(tab: HomeCategoryTab): string[] {
  if (tab === 'packages') return PACKAGE_POPULAR_DESTINATIONS.slice(0, 5);
  if (tab === 'glamping') return GLAMPING_POPULAR_CAMPS.slice(0, 5);
  return ACTIVITY_POPULAR.slice(0, 5);
}

type DesktopCategorySearchBarProps = {
  activeTab: HomeCategoryTab;
  onSearch: (params: { location: string; mood: string }) => void;
  variant?: 'hero' | 'inline';
};

export function DesktopCategorySearchBar({
  activeTab,
  onSearch,
  variant = 'hero',
}: DesktopCategorySearchBarProps) {
  const { searchParams } = useHomeSearch();
  const config = HOME_SEARCH_BY_TAB[activeTab];
  const locationInputRef = useRef<TextInput>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(config.defaultLocation);
  const [selectedMood, setSelectedMood] = useState(DESKTOP_SEARCH_BAR_MOODS[0].id);

  useEffect(() => {
    setLocation(config.defaultLocation);
    setSelectedMood(DESKTOP_SEARCH_BAR_MOODS[0].id);
    setLocationOpen(false);
  }, [activeTab, config.defaultLocation]);

  useEffect(() => {
    if (variant !== 'inline' || !searchParams || searchParams.tab !== activeTab) return;
    if (searchParams.location) setLocation(searchParams.location);
    const mood = searchParams.packageMood ?? searchParams.activityMood;
    if (mood) setSelectedMood(mood);
  }, [variant, searchParams, activeTab]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !locationOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(`#${SEARCH_ROOT_ID}`) || target.closest(`#${LOCATION_PANEL_ID}`)) return;
      setLocationOpen(false);
      locationInputRef.current?.blur();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [locationOpen]);

  const filteredSuggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    const pool = getSuggestions(activeTab);
    if (!q) return pool;
    return pool.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [location, activeTab]);

  const handleSearch = () => {
    setLocationOpen(false);
    onSearch({ location, mood: selectedMood });
  };

  const LocationIcon =
    activeTab === 'activities' ? (
      <DiamondIcon width={18} height={18} />
    ) : activeTab === 'glamping' ? (
      <Ionicons name="bonfire-outline" size={18} color={colors.text.primary} />
    ) : (
      <Ionicons name="location-outline" size={18} color={colors.text.primary} />
    );

  const barRadius =
    variant === 'inline'
      ? {
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }
      : {
          borderTopLeftRadius: SPECS.searchBorderTopLeft,
          borderTopRightRadius: SPECS.searchBorderTopRight,
          borderBottomLeftRadius: SPECS.searchBorderBottomLeft,
          borderBottomRightRadius: SPECS.searchBorderBottomRight,
        };

  const isCompact = variant === 'inline';

  return (
    <View nativeID={SEARCH_ROOT_ID} style={styles.wrap}>
      <View style={[styles.bar, barRadius, isCompact && styles.barCompact]}>
        <View style={styles.leftCluster}>
          <View style={[styles.locationField, locationOpen && styles.fieldActive]}>
            <Text style={styles.fieldLabel}>{config.locationLabel}</Text>
            <View style={styles.valueBox}>
              {LocationIcon}
              <TextInput
                ref={locationInputRef}
                value={location}
                onChangeText={setLocation}
                onFocus={() => setLocationOpen(true)}
                style={styles.locationInput}
                placeholder={config.defaultLocation}
                placeholderTextColor="rgba(28, 32, 36, 0.4)"
              />
            </View>
          </View>

          <Pressable style={styles.priceBtn} onPress={() => setLocationOpen(false)}>
            <Text style={styles.priceText}>Price</Text>
            <Ionicons name="options-outline" size={18} color={SPECS.accent} />
            <Ionicons name="chevron-down" size={18} color={colors.text.primary} />
          </Pressable>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.moodShell}>
          {DESKTOP_SEARCH_BAR_MOODS.map((mood) => {
            const selected = selectedMood === mood.id;
            return (
              <Pressable
                key={mood.id}
                style={[styles.moodPill, selected && styles.moodPillActive]}
                onPress={() => setSelectedMood(mood.id)}
              >
                <Ionicons
                  name={mood.icon}
                  size={16}
                  color={selected ? colors.surface.white : SPECS.accent}
                />
                <Text style={[styles.moodLabel, selected && styles.moodLabelActive]}>{mood.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.searchBtn, isCompact && styles.searchBtnCompact]}
          onPress={handleSearch}
          accessibilityLabel="Search"
        >
          <SearchIcon width={24} height={24} />
        </Pressable>
      </View>

      {locationOpen ? (
        <View
          nativeID={LOCATION_PANEL_ID}
          style={styles.locationPanelWrap}
          {...Platform.select({
            web: {
              onMouseDown: (event: { preventDefault: () => void }) => event.preventDefault(),
            },
            default: {},
          })}
        >
          <View style={styles.locationPanel}>
            {filteredSuggestions.map((item) => (
              <Pressable
                key={item.title}
                style={styles.suggestionRow}
                onPress={() => {
                  setLocation(item.short);
                  setLocationOpen(false);
                  locationInputRef.current?.blur();
                }}
              >
                <Text style={styles.suggestionTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.suggestionSub}>{item.subtitle}</Text> : null}
              </Pressable>
            ))}
            <View style={styles.chipRow}>
              {getPopularChips(activeTab).map((chip) => (
                <Pressable
                  key={chip}
                  style={styles.destChip}
                  onPress={() => {
                    setLocation(chip);
                    setLocationOpen(false);
                    locationInputRef.current?.blur();
                  }}
                >
                  <Text style={styles.destChipText}>{chip}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative',
    zIndex: 50,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    padding: 12,
    gap: 12,
    minHeight: SPECS.searchHeight,
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  barCompact: {
    minHeight: 79,
    padding: 8,
    gap: 8,
  },
  leftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  locationField: {
    width: 270,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
  },
  fieldActive: {
    borderColor: SPECS.accent,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.8)',
  },
  valueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SPECS.valueBoxBg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 35,
  },
  locationInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    padding: 0,
    margin: 0,
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
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  vDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginVertical: 4,
  },
  moodShell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderRadius: 100,
    padding: 8,
    minHeight: 56,
  },
  moodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: SPECS.accent,
    backgroundColor: colors.surface.white,
  },
  moodPillActive: {
    backgroundColor: SPECS.accent,
    borderColor: SPECS.accent,
  },
  moodLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: SPECS.accent,
  },
  moodLabelActive: {
    color: colors.surface.white,
  },
  searchBtnCompact: {
    width: 55,
    height: 55,
    borderWidth: 4,
  },
  searchBtn: {
    width: 88,
    height: 88,
    borderRadius: 100,
    backgroundColor: SPECS.accent,
    borderWidth: 7,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  locationPanelWrap: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    width: 350,
    zIndex: 100001,
  },
  locationPanel: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.15)' },
      default: { elevation: 8 },
    }),
  },
  suggestionRow: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.2)',
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: SPECS.accent,
    lineHeight: 16,
  },
  suggestionSub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  destChip: {
    backgroundColor: SPECS.valueBoxBg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  destChipText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
  },
});
