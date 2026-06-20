import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  formatSearchDate,
  HOME_SEARCH_BY_TAB,
  totalGuests,
} from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import {
  DESKTOP_HERO_SPECS,
  DESKTOP_WEB_ICONS,
} from '@/src/constants/desktopHomeConstants';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const SPECS = DESKTOP_HERO_SPECS;
const BuildingIcon = DESKTOP_WEB_ICONS.building;
const CalendarIcon = DESKTOP_WEB_ICONS.calendar;
const SofaIcon = DESKTOP_WEB_ICONS.sofa;
const SearchIcon = DESKTOP_WEB_ICONS.search;

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
        <View style={styles.locationField}>
          <View style={styles.fieldLabelRow}>
            <BuildingIcon width={18} height={18} />
            <Text style={styles.fieldLabel}>{config.locationLabel}</Text>
          </View>
          <View style={styles.valueBox}>
            <Text style={styles.valuePrimary} numberOfLines={1}>
              {config.defaultLocation}
            </Text>
          </View>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <View style={styles.fieldLabelRow}>
              <CalendarIcon width={18} height={18} />
              <Text style={styles.fieldLabel}>Check In</Text>
            </View>
            <View style={styles.valueBox}>
              <View style={styles.dateValueRow}>
                <Text style={styles.dateValueSmall}>{checkIn.date}</Text>
                <Text style={styles.dateValueDay}>{checkIn.day}</Text>
              </View>
            </View>
          </View>
          <View style={styles.dateField}>
            <View style={styles.fieldLabelRow}>
              <CalendarIcon width={18} height={18} />
              <Text style={styles.fieldLabel}>Check Out</Text>
            </View>
            <View style={styles.valueBox}>
              <View style={styles.dateValueRow}>
                <Text style={styles.dateValueSmall}>{checkOut.date}</Text>
                <Text style={styles.dateValueDay}>{checkOut.day}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.guestsField}>
          <View style={styles.fieldLabelRow}>
            <SofaIcon width={18} height={18} />
            <Text style={styles.fieldLabel}>{config.guestsLabel}</Text>
          </View>
          <View style={styles.valueBox}>
            <View style={styles.guestValueRow}>
              <View style={styles.guestPart}>
                <Text style={styles.guestNum}>{guests}</Text>
                <Text style={styles.guestUnit}>{config.guestUnit}</Text>
              </View>
              <View style={styles.guestDivider} />
              <View style={styles.guestPart}>
                <Text style={styles.guestNum}>{config.defaultRooms}</Text>
                <Text style={styles.guestUnit}>
                  {config.roomUnit}
                  {config.defaultRooms === 1 ? '' : 's'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable style={styles.searchBtn} onPress={handleSearch} accessibilityLabel="Search">
          <SearchIcon width={24} height={24} />
        </Pressable>
      </View>

      {config.showPriceFilter ? (
        <Pressable style={styles.priceBtn}>
          <Text style={styles.priceText}>Price</Text>
          <Ionicons name="options-outline" size={18} color={SPECS.accent} />
          <Ionicons name="chevron-down" size={18} color={colors.text.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    width: '100%',
  },
  bar: {
    flex: 1,
    maxWidth: 1052,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: SPECS.searchBorderTopLeft,
    borderTopRightRadius: SPECS.searchBorderTopRight,
    borderBottomLeftRadius: SPECS.searchBorderBottomLeft,
    borderBottomRightRadius: SPECS.searchBorderBottomRight,
    padding: 12,
    gap: 12,
    height: SPECS.searchHeight,
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
  locationField: {
    width: 270,
    height: 88,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    justifyContent: 'center',
    flexShrink: 0,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    width: 424,
    height: 80,
    alignItems: 'center',
    flexShrink: 0,
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    justifyContent: 'center',
    minWidth: 0,
  },
  guestsField: {
    flex: 1,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    justifyContent: 'center',
    minWidth: 120,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.8)',
    flexShrink: 1,
  },
  valueBox: {
    backgroundColor: SPECS.valueBoxBg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    minHeight: 35,
  },
  valuePrimary: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dateValueSmall: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
  dateValueDay: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
  guestValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestPart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  guestNum: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 20,
  },
  guestUnit: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 20,
    paddingBottom: 2,
  },
  guestDivider: {
    width: 1,
    height: 11,
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginHorizontal: 8,
  },
  vDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginVertical: 4,
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
  priceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    minWidth: 119,
    height: 34,
    alignSelf: 'center',
    gap: 8,
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
