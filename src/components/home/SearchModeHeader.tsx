import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function SearchModeHeader() {
  const { s } = useHomeScale();
  const insets = useSafeAreaInsets();
  const { searchParams, exitSearchMode, updateSearchLocation, enterSearchMode } = useHomeSearch();
  const [query, setQuery] = useState(searchParams?.location ?? '');

  useEffect(() => {
    setQuery(searchParams?.location ?? '');
  }, [searchParams?.location]);

  if (!searchParams) return null;

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    updateSearchLocation(trimmed);
    enterSearchMode({ ...searchParams, location: trimmed });
  };

  return (
    <View
      style={[
        styles.wrap,
        { paddingHorizontal: s(16), paddingTop: insets.top + s(10), paddingBottom: s(8) },
      ]}
    >
      <View style={[styles.bar, { padding: s(6), borderRadius: s(9999), gap: s(8) }]}>
        <Pressable
          style={[styles.backBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}
          onPress={exitSearchMode}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={s(20)} color={colors.accent.main} />
        </Pressable>

        <View style={[styles.searchPill, { borderRadius: s(9999), paddingLeft: s(16), paddingRight: s(4) }]}>
          <TextInput
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              updateSearchLocation(text);
            }}
            onSubmitEditing={handleSearch}
            style={[styles.searchInput, { fontSize: s(14), lineHeight: s(20) }]}
            placeholder="Search location"
            placeholderTextColor="rgba(28, 32, 36, 0.4)"
            returnKeyType="search"
          />

          <View style={[styles.filterChip, { borderRadius: s(8), paddingHorizontal: s(6), height: s(32) }]}>
            <Ionicons name="filter-outline" size={s(16)} color={colors.accent.main} />
            <Ionicons name="chevron-down" size={s(12)} color={colors.text.primary} />
          </View>

          <Pressable
            style={[styles.searchBtn, { width: s(36), height: s(36), borderRadius: s(18) }]}
            onPress={handleSearch}
            accessibilityLabel="Search"
          >
            <Ionicons name="search" size={s(18)} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface.white,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.main,
  },
  backBtn: {
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    gap: 8,
    minHeight: 40,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  searchBtn: {
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
