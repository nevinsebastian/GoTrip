import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DESKTOP_WEB_COLORS } from '@/src/constants/desktopWebConstants';
import {
  formatSearchDate,
  HOME_SEARCH_BY_TAB,
  totalGuests,
  type HomeCategoryTab,
} from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export function DesktopHomeSearchBar() {
  const { activeCategoryTab } = useHomeSearch();
  const config = HOME_SEARCH_BY_TAB[activeCategoryTab];
  const checkIn = formatSearchDate(config.defaultCheckIn);
  const checkOut = formatSearchDate(config.defaultCheckOut);
  const guests = totalGuests({
    adults: config.defaultAdults,
    children: config.defaultChildren,
    infants: config.defaultInfants,
    rooms: config.defaultRooms,
  });

  const handleSearch = () => {
    router.push(config.searchRoute);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <SearchField
          icon="business-outline"
          label={config.locationLabel}
          value={config.defaultLocation}
        />
        <View style={styles.divider} />
        <SearchField icon="calendar-outline" label="Check In" value={checkIn.date} sub={checkIn.day} />
        <View style={styles.divider} />
        <SearchField icon="calendar-outline" label="Check Out" value={checkOut.date} sub={checkOut.day} />
        <View style={styles.divider} />
        <SearchField
          icon="bed-outline"
          label={config.guestsLabel}
          value={`${guests} ${config.guestUnit}${guests === 1 ? '' : 's'} | ${config.defaultRooms} ${config.roomUnit}${config.defaultRooms === 1 ? '' : 's'}`}
        />
        <Pressable style={styles.searchBtn} onPress={handleSearch} accessibilityLabel="Search">
          <Ionicons name="search" size={22} color={colors.surface.white} />
        </Pressable>
      </View>
      {config.showPriceFilter ? (
        <Pressable style={styles.priceBtn}>
          <Ionicons name="options-outline" size={16} color={colors.text.primary} />
          <Text style={styles.priceText}>Price</Text>
          <Ionicons name="chevron-down" size={14} color={colors.text.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function SearchField({
  icon,
  label,
  value,
  sub,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Ionicons name={icon} size={14} color={colors.accent.main} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <Text style={styles.fieldValue} numberOfLines={1}>
        {value}
      </Text>
      {sub ? (
        <Text style={styles.fieldSub} numberOfLines={1}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: 8,
    minHeight: 76,
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
      default: {},
    }),
  },
  field: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    gap: 2,
    minWidth: 120,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.caption,
  },
  fieldValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  fieldSub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.caption,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(28, 32, 36, 0.12)',
    marginVertical: 10,
  },
  searchBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DESKTOP_WEB_COLORS.searchOrange,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 4,
  },
  priceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 76,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
