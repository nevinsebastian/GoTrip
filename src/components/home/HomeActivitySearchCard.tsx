import DiamondIcon from '@/assets/images/diamond.svg';
import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { HOME_SEARCH_BY_TAB } from '@/src/components/home/homeSearchConfig';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import {
  ACTIVITY_MOODS,
  ACTIVITY_POPULAR,
  ACTIVITY_SUGGESTIONS,
} from '@/src/constants/homeActivityConfig';

export function HomeActivitySearchCard() {
  const { s } = useHomeScale();
  const { enterSearchMode } = useHomeSearch();
  const config = HOME_SEARCH_BY_TAB.activities;
  const locationInputRef = useRef<TextInput>(null);

  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(config.defaultLocation);
  const [selectedMood, setSelectedMood] = useState(ACTIVITY_MOODS[0].id);

  useEffect(() => {
    setLocation(config.defaultLocation);
    setSelectedMood(ACTIVITY_MOODS[0].id);
    setLocationOpen(false);
  }, []);

  const filteredSuggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return ACTIVITY_SUGGESTIONS;
    return ACTIVITY_SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [location]);

  const handleSearch = () => {
    setLocationOpen(false);
    enterSearchMode({
      location,
      checkIn: config.defaultCheckIn,
      checkOut: config.defaultCheckOut,
      guests: {
        adults: config.defaultAdults,
        children: config.defaultChildren,
        infants: config.defaultInfants,
        rooms: config.defaultRooms,
      },
      tab: 'activities',
      activityMood: selectedMood,
    });
  };

  return (
    <View style={[styles.card, { padding: s(12), gap: s(12), borderRadius: s(12) }]}>
      <View
        style={[
          styles.locationBox,
          {
            padding: s(12),
            borderRadius: s(12),
            borderColor: locationOpen ? colors.accent.main : 'rgba(28, 32, 36, 0.1)',
          },
        ]}
      >
        <Text style={[styles.fieldLabel, { fontSize: s(10), lineHeight: s(14) }]}>
          {config.locationLabel}
        </Text>
        <View style={[styles.valuePill, { paddingVertical: s(8), paddingHorizontal: s(12), minHeight: s(36), marginTop: s(8) }]}>
          <DiamondIcon width={s(16)} height={s(16)} />
          <TextInput
            ref={locationInputRef}
            value={location}
            onChangeText={setLocation}
            onFocus={() => setLocationOpen(true)}
            style={[styles.locationInput, { fontSize: s(14), lineHeight: s(20) }]}
            placeholder="Scuba Diving"
            placeholderTextColor="rgba(28, 32, 36, 0.4)"
          />
        </View>

        {locationOpen ? (
          <View style={{ gap: s(8), marginTop: s(12) }}>
            {filteredSuggestions.map((item) => (
              <Pressable
                key={item.title}
                style={[styles.suggestionRow, { paddingVertical: s(8), paddingHorizontal: s(12) }]}
                onPress={() => {
                  setLocation(item.short);
                  setLocationOpen(false);
                  locationInputRef.current?.blur();
                }}
              >
                <Text style={[styles.suggestionTitle, { fontSize: s(12), lineHeight: s(16) }]}>
                  {item.title}
                </Text>
                {item.subtitle ? (
                  <Text style={[styles.suggestionSub, { fontSize: s(10), lineHeight: s(14) }]}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </Pressable>
            ))}

            <View style={[styles.chipRow, { gap: s(8), flexWrap: 'wrap' }]}>
              {ACTIVITY_POPULAR.map((activity) => (
                <Pressable
                  key={activity}
                  style={[styles.destChip, { paddingVertical: s(8), paddingHorizontal: s(12) }]}
                  onPress={() => {
                    setLocation(activity);
                    setLocationOpen(false);
                    locationInputRef.current?.blur();
                  }}
                >
                  <Text style={[styles.destChipText, { fontSize: s(12), lineHeight: s(16) }]}>
                    {activity}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.moodRow, { gap: s(8) }]}>
        {ACTIVITY_MOODS.map((mood) => {
          const selected = selectedMood === mood.id;
          return (
            <Pressable
              key={mood.id}
              style={[
                styles.moodPill,
                {
                  paddingVertical: s(8),
                  paddingHorizontal: s(8),
                  borderRadius: s(100),
                  gap: s(4),
                  backgroundColor: selected ? colors.accent.main : colors.surface.white,
                  borderColor: colors.accent.main,
                },
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Ionicons
                name={mood.icon}
                size={s(12)}
                color={selected ? colors.surface.white : colors.accent.main}
                style={{ flexShrink: 0 }}
              />
              <Text
                style={[
                  styles.moodLabel,
                  {
                    fontSize: s(9),
                    lineHeight: s(12),
                    color: selected ? colors.surface.white : colors.accent.main,
                    flexShrink: 1,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {mood.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.actionRow, { gap: s(12) }]}>
        <Pressable
          style={[styles.priceBtn, { height: s(32), paddingHorizontal: s(12), borderRadius: s(100) }]}
          onPress={() => setLocationOpen(false)}
        >
          <Text style={[styles.priceText, { fontSize: s(12) }]}>Price</Text>
          <Ionicons name="filter-outline" size={s(14)} color={colors.accent.main} />
          <Ionicons name="chevron-down" size={s(12)} color={colors.text.primary} />
        </Pressable>

        <Pressable
          style={[styles.searchBtn, { height: s(42), paddingLeft: s(18), paddingRight: s(8), flex: 1 }]}
          onPress={handleSearch}
          accessibilityLabel="Search activities"
        >
          <Text style={[styles.searchText, { fontSize: s(14), lineHeight: s(16) }]}>Search</Text>
          <View style={[styles.searchIconCircle, { width: s(26), height: s(26), borderRadius: s(13) }]}>
            <Ionicons name="search" size={s(16)} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  locationBox: {
    borderWidth: 1,
    backgroundColor: colors.surface.white,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  valuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: 8,
  },
  locationInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    padding: 0,
  },
  suggestionRow: {
    borderRadius: 8,
    backgroundColor: 'rgba(28, 32, 36, 0.03)',
  },
  suggestionTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  suggestionSub: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  chipRow: {
    flexDirection: 'row',
  },
  destChip: {
    borderRadius: 8,
    backgroundColor: 'rgba(229, 77, 46, 0.08)',
  },
  destChipText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  moodRow: {
    flexDirection: 'row',
  },
  moodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexWrap: 'nowrap',
  },
  moodLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    backgroundColor: colors.surface.white,
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent.main,
    borderRadius: 999,
  },
  searchText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  searchIconCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
