import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function ResortDetailHeader() {
  const { s } = useHomeScale();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + s(10), paddingHorizontal: s(16) }]}>
      <View style={[styles.bar, { padding: s(12), borderRadius: s(18) }]}>
        <View style={[styles.row, { gap: s(8) }]}>
          <Pressable
            style={[styles.backBtn, { width: s(32), height: s(32), borderRadius: s(16) }]}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={s(20)} color={colors.accent.main} />
          </Pressable>

          <View
            style={[
              styles.searchPill,
              {
                borderRadius: s(9999),
                paddingLeft: s(18),
                paddingRight: s(8),
                paddingVertical: s(8),
                minHeight: s(40),
              },
            ]}
          >
            <Text style={[styles.searchText, { fontSize: s(14), lineHeight: s(16) }]}>
              {FIGMA_PROPERTY.searchLabel}
            </Text>

            <View style={[styles.filterChip, { borderRadius: s(8), paddingHorizontal: s(8), height: s(32) }]}>
              <Ionicons name="filter-outline" size={s(14)} color={colors.accent.main} />
              <Ionicons name="chevron-down" size={s(12)} color={colors.text.primary} />
            </View>

            <View style={[styles.searchBtn, { width: s(26), height: s(26), borderRadius: s(13) }]}>
              <Ionicons name="search" size={s(16)} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface.white,
    paddingBottom: 10,
  },
  bar: {
    backgroundColor: colors.accent.main,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  searchBtn: {
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
