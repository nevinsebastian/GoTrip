import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import {
  formatSearchDate,
  getDatesInRange,
  HOME_SEARCH_BY_TAB,
} from '@/src/components/home/homeSearchConfig';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import {
  GLAMPING_CAMP_SUGGESTIONS,
  GLAMPING_POPULAR_CAMPS,
} from '@/src/constants/homeGlampingConfig';

function DateField({
  label,
  date,
  day,
  active,
  onPress,
}: {
  label: string;
  date: string;
  day: string;
  active: boolean;
  onPress: () => void;
}) {
  const { s } = useHomeScale();
  return (
    <Pressable
      style={[
        styles.dateBox,
        {
          padding: s(8),
          gap: s(12),
          borderRadius: s(12),
          flex: 1,
          borderColor: active ? colors.accent.main : 'rgba(28, 32, 36, 0.1)',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.labelRow}>
        <Ionicons name="calendar-outline" size={s(14)} color={colors.accent.main} />
        <Text style={[styles.fieldLabel, { fontSize: s(10), lineHeight: s(14) }]}>{label}</Text>
      </View>
      <View style={[styles.valuePill, { padding: s(8), minHeight: s(24) }]}>
        <View style={styles.dateValueRow}>
          <Text style={[styles.dateText, { fontSize: s(10), lineHeight: s(14) }]}>{date}</Text>
          <View style={styles.hDivider} />
          <Text style={[styles.dayText, { fontSize: s(12), lineHeight: s(14) }]}>{day}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeGlampingSearchCard() {
  const { s } = useHomeScale();
  const { enterSearchMode } = useHomeSearch();
  const config = HOME_SEARCH_BY_TAB.glamping;
  const locationInputRef = useRef<TextInput>(null);

  const [locationOpen, setLocationOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [location, setLocation] = useState(config.defaultLocation);
  const [checkIn, setCheckIn] = useState(config.defaultCheckIn);
  const [checkOut, setCheckOut] = useState(config.defaultCheckOut);
  const [dateDraft, setDateDraft] = useState<{ checkIn: string; checkOut: string | null }>({
    checkIn: config.defaultCheckIn,
    checkOut: config.defaultCheckOut,
  });

  const filteredSuggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return GLAMPING_CAMP_SUGGESTIONS;
    return GLAMPING_CAMP_SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [location]);

  const markedDates = useMemo(() => {
    const lightFill = 'rgba(229, 77, 46, 0.12)';
    const primary = colors.accent.main;
    const out: Record<string, { customStyles?: { container?: object; text?: object } }> = {};
    const { checkIn: start, checkOut: end } = dateDraft;
    if (!start) return out;

    if (!end) {
      out[start] = {
        customStyles: {
          container: { backgroundColor: primary, borderRadius: 999 },
          text: { color: colors.surface.white, fontWeight: '600' },
        },
      };
      return out;
    }

    getDatesInRange(start, end).forEach((d, idx, range) => {
      const isEdge = idx === 0 || idx === range.length - 1;
      out[d] = {
        customStyles: {
          container: {
            backgroundColor: isEdge ? primary : lightFill,
            borderRadius: 999,
          },
          text: { color: isEdge ? colors.surface.white : colors.text.primary, fontWeight: '600' },
        },
      };
    });
    return out;
  }, [dateDraft]);

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (!dateDraft.checkIn || (dateDraft.checkIn && dateDraft.checkOut)) {
      setDateDraft({ checkIn: date, checkOut: null });
      return;
    }
    if (new Date(`${date}T12:00:00`).getTime() < new Date(`${dateDraft.checkIn}T12:00:00`).getTime()) {
      setDateDraft({ checkIn: date, checkOut: null });
      return;
    }
    setDateDraft({ ...dateDraft, checkOut: date });
  };

  const handleSearch = () => {
    setLocationOpen(false);
    setDatesOpen(false);
    enterSearchMode({
      location,
      checkIn,
      checkOut,
      guests: {
        adults: config.defaultAdults,
        children: config.defaultChildren,
        infants: config.defaultInfants,
        rooms: config.defaultRooms,
      },
      tab: 'glamping',
    });
  };

  const checkInDisplay = formatSearchDate(checkIn);
  const checkOutDisplay = formatSearchDate(checkOut);

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
          <Ionicons name="flame-outline" size={s(16)} color={colors.text.primary} />
          <TextInput
            ref={locationInputRef}
            value={location}
            onChangeText={setLocation}
            onFocus={() => {
              setDatesOpen(false);
              setLocationOpen(true);
            }}
            style={[styles.locationInput, { fontSize: s(14), lineHeight: s(20) }]}
            placeholder="Wildlife safari camps"
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
              {GLAMPING_POPULAR_CAMPS.map((camp) => (
                <Pressable
                  key={camp}
                  style={[styles.destChip, { paddingVertical: s(8), paddingHorizontal: s(12) }]}
                  onPress={() => {
                    setLocation(camp);
                    setLocationOpen(false);
                    locationInputRef.current?.blur();
                  }}
                >
                  <Text style={[styles.destChipText, { fontSize: s(12), lineHeight: s(16) }]}>
                    {camp}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.dateRow, { gap: s(8) }]}>
        <DateField
          label="Check In"
          date={checkInDisplay.date}
          day={checkInDisplay.day}
          active={datesOpen}
          onPress={() => {
            setLocationOpen(false);
            locationInputRef.current?.blur();
            setDateDraft({ checkIn, checkOut });
            setDatesOpen(true);
          }}
        />
        <DateField
          label="Check Out"
          date={checkOutDisplay.date}
          day={checkOutDisplay.day}
          active={datesOpen}
          onPress={() => {
            setLocationOpen(false);
            locationInputRef.current?.blur();
            setDateDraft({ checkIn, checkOut });
            setDatesOpen(true);
          }}
        />
      </View>

      {datesOpen ? (
        <View style={[styles.calendarPanel, { borderRadius: s(8), padding: s(12) }]}>
          <Calendar
            current={dateDraft.checkIn || undefined}
            markingType="custom"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            hideExtraDays={false}
            enableSwipeMonths
            renderArrow={(direction) => (
              <Ionicons
                name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                size={s(16)}
                color={colors.text.primary}
              />
            )}
            theme={{
              textDayFontFamily: typography.fontFamily.text,
              textMonthFontFamily: typography.fontFamily.text,
              textDayHeaderFontFamily: typography.fontFamily.text,
              textMonthFontWeight: '600',
              textDayFontWeight: '500',
              monthTextColor: colors.text.primary,
              textSectionTitleColor: 'rgba(28, 32, 36, 0.6)',
              dayTextColor: colors.text.primary,
              textDisabledColor: '#e0e0e0',
              todayTextColor: colors.accent.main,
              textDayFontSize: s(12),
              textMonthFontSize: s(14),
              textDayHeaderFontSize: s(10),
            }}
            style={{ width: '100%' }}
          />
          <View style={[styles.panelActions, { marginTop: s(12), gap: s(12) }]}>
            <Pressable
              style={[styles.cancelBtn, { height: s(36), borderRadius: s(8) }]}
              onPress={() => {
                setDateDraft({ checkIn, checkOut });
                setDatesOpen(false);
              }}
            >
              <Text style={[styles.cancelBtnText, { fontSize: s(14) }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.selectBtn, { height: s(36), borderRadius: s(8) }]}
              onPress={() => {
                if (!dateDraft.checkIn) return;
                const out = dateDraft.checkOut || dateDraft.checkIn;
                setCheckIn(dateDraft.checkIn);
                setCheckOut(out);
                setDatesOpen(false);
              }}
            >
              <Text style={[styles.selectBtnText, { fontSize: s(14) }]}>Select</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={[styles.actionRow, { gap: s(12) }]}>
        <Pressable
          style={[styles.priceBtn, { height: s(32), paddingHorizontal: s(12), borderRadius: s(100) }]}
          onPress={() => {
            setLocationOpen(false);
            setDatesOpen(false);
          }}
        >
          <Text style={[styles.priceText, { fontSize: s(12) }]}>Price</Text>
          <Ionicons name="filter-outline" size={s(14)} color={colors.accent.main} />
          <Ionicons name="chevron-down" size={s(12)} color={colors.text.primary} />
        </Pressable>

        <Pressable
          style={[styles.searchBtn, { height: s(42), paddingLeft: s(18), paddingRight: s(8), flex: 1 }]}
          onPress={handleSearch}
          accessibilityLabel="Search glamping"
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
  dateRow: {
    flexDirection: 'row',
  },
  dateBox: {
    borderWidth: 1,
    backgroundColor: colors.surface.white,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  dateText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  hDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(28, 32, 36, 0.2)',
  },
  dayText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    letterSpacing: 0.04,
  },
  calendarPanel: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  panelActions: {
    flexDirection: 'row',
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    backgroundColor: colors.surface.white,
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  selectBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.main,
  },
  selectBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
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
