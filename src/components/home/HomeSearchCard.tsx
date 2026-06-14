import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  HOME_SEARCH_BY_TAB,
  LOCATION_SUGGESTIONS,
  POPULAR_DESTINATIONS,
  type HomeCategoryTab,
} from '@/src/components/home/homeSearchConfig';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function HomeSearchCard({ activeTab }: { activeTab: HomeCategoryTab }) {
  const { s } = useHomeScale();
  const [locationExpanded, setLocationExpanded] = useState(false);
  const config = HOME_SEARCH_BY_TAB[activeTab];

  useEffect(() => {
    setLocationExpanded(false);
  }, [activeTab]);

  return (
    <View
      style={[
        styles.card,
        {
          padding: s(12),
          gap: s(8),
          borderRadius: s(12),
        },
      ]}
    >
      <Pressable
        style={[styles.locationBox, { padding: s(12), borderRadius: s(12) }]}
        onPress={() => setLocationExpanded((v) => !v)}
      >
        <View style={{ gap: s(12) }}>
          <View style={styles.labelRow}>
            <Ionicons name="business-outline" size={s(14)} color={colors.accent.main} />
            <Text style={[styles.fieldLabel, { fontSize: s(10), lineHeight: s(14) }]}>
              {config.locationLabel}
            </Text>
          </View>
          <View style={[styles.valuePill, { paddingVertical: s(10), paddingHorizontal: s(12), minHeight: s(30) }]}>
            <Text style={[styles.locationValue, { fontSize: s(14), lineHeight: s(20) }]}>
              {config.locationValue}
            </Text>
          </View>
        </View>

        {locationExpanded ? (
          <View style={{ gap: s(8), marginTop: s(18) }}>
            {LOCATION_SUGGESTIONS.map((item) => (
              <Pressable
                key={item.title}
                style={[
                  styles.suggestionRow,
                  {
                    paddingVertical: s(8),
                    paddingHorizontal: s(12),
                  },
                ]}
                onPress={() => setLocationExpanded(false)}
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

            <Text style={[styles.popularLabel, { fontSize: s(12), lineHeight: s(16) }]}>
              Popular destintions
            </Text>

            <View style={[styles.chipRow, { gap: s(12) }]}>
              {POPULAR_DESTINATIONS.map((city) => (
                <View
                  key={city}
                  style={[styles.destChip, { paddingVertical: s(8), paddingHorizontal: s(12) }]}
                >
                  <Text style={[styles.destChipText, { fontSize: s(12), lineHeight: s(16) }]}>
                    {city}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Pressable>

      <View style={[styles.dateRow, { gap: s(8) }]}>
        <DateField
          label="Check In"
          date={config.checkIn}
          day={config.checkInDay}
        />
        <DateField
          label="Check Out"
          date={config.checkOut}
          day={config.checkOutDay}
        />
      </View>

      <View style={[styles.guestsRow, { padding: s(6), borderRadius: s(12) }]}>
        <View style={[styles.labelRow, { paddingLeft: s(6), flexShrink: 1 }]}>
          <Ionicons name="bed-outline" size={s(14)} color={colors.accent.main} />
          <Text
            style={[styles.guestLabel, { fontSize: s(10), lineHeight: s(14) }]}
            numberOfLines={1}
          >
            {config.guestsLabel}
          </Text>
        </View>
        <View style={[styles.guestValueBox, { paddingVertical: s(10), paddingHorizontal: s(8) }]}>
          <GuestStat count={config.guestCount} unit={config.guestUnit} />
          <View style={styles.vDivider} />
          <GuestStat count={config.roomCount} unit={config.roomUnit} />
        </View>
      </View>

      <View style={[styles.actionRow, { gap: s(16) }]}>
        {config.showPriceFilter ? (
          <Pressable style={[styles.priceBtn, { height: s(32), paddingHorizontal: s(12) }]}>
            <Text style={[styles.priceText, { fontSize: s(12) }]}>Price</Text>
            <Ionicons name="filter-outline" size={s(16)} color={colors.accent.main} />
            <Ionicons name="chevron-down" size={s(12)} color={colors.text.primary} />
          </Pressable>
        ) : null}

        <Pressable
          style={[
            styles.searchBtn,
            {
              height: s(42),
              paddingLeft: s(18),
              paddingRight: s(8),
              flex: config.showPriceFilter ? 1 : undefined,
              width: config.showPriceFilter ? undefined : '100%',
            },
          ]}
          onPress={() => router.push(config.searchRoute)}
          accessibilityLabel="Search"
        >
          <Text style={[styles.searchText, { fontSize: s(14), lineHeight: s(16) }]}>Search</Text>
          <View style={styles.searchIconCircle}>
            <Ionicons name="search" size={s(16)} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function DateField({
  label,
  date,
  day,
}: {
  label: string;
  date: string;
  day: string;
}) {
  const { s } = useHomeScale();
  return (
    <View style={[styles.dateBox, { padding: s(8), gap: s(12), borderRadius: s(12), flex: 1 }]}>
      <View style={styles.labelRow}>
        <Ionicons name="calendar-outline" size={s(14)} color={colors.accent.main} />
        <Text style={[styles.guestLabel, { fontSize: s(10), lineHeight: s(14) }]}>{label}</Text>
      </View>
      <View style={[styles.valuePill, { padding: s(8), minHeight: s(24) }]}>
        <View style={styles.dateValueRow}>
          <Text style={[styles.dateText, { fontSize: s(10), lineHeight: s(14) }]}>{date}</Text>
          <View style={styles.hDivider} />
          <Text style={[styles.dayText, { fontSize: s(12), lineHeight: s(14) }]}>{day}</Text>
        </View>
      </View>
    </View>
  );
}

function GuestStat({ count, unit }: { count: string; unit: string }) {
  const { s } = useHomeScale();
  return (
    <View style={styles.guestStat}>
      <Text style={[styles.guestCount, { fontSize: s(16), lineHeight: s(20) }]}>{count}</Text>
      <Text style={[styles.guestUnit, { fontSize: s(12), lineHeight: s(14) }]}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  locationBox: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    flexShrink: 1,
  },
  valuePill: {
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: 6,
    justifyContent: 'center',
  },
  locationValue: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  suggestionRow: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.2)',
    borderRadius: 2,
  },
  suggestionTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
  },
  suggestionSub: {
    fontFamily: typography.fontFamily.text,
    fontWeight: '300',
    color: 'rgba(28, 32, 36, 0.6)',
  },
  popularLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  destChip: {
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: 6,
  },
  destChipText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
  },
  dateRow: {
    flexDirection: 'row',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  guestLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.8)',
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    flexWrap: 'wrap',
  },
  dateText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#202020',
  },
  dayText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#202020',
  },
  hDivider: {
    width: 1,
    height: 8,
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginHorizontal: 2,
    alignSelf: 'center',
  },
  guestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    gap: 12,
  },
  guestValueBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: 6,
    gap: 4,
    minWidth: 100,
  },
  guestStat: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  guestCount: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: '#202020',
  },
  guestUnit: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: '#202020',
  },
  vDivider: {
    width: 1,
    height: 11,
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginHorizontal: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: 8,
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
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.accent.main,
  },
  searchText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FCFCFC',
    letterSpacing: 0.04,
  },
  searchIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
