import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import {
  HOME_SEARCH_BY_TAB,
  LOCATION_SUGGESTIONS,
  POPULAR_DESTINATIONS,
  formatSearchDate,
  getDatesInRange,
  totalGuests,
  type ExpandedSection,
  type GuestCounts,
  type HomeCategoryTab,
} from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { useHomeScale } from '@/src/components/home/useHomeScale';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function applyTabDefaults(tab: HomeCategoryTab) {
  const config = HOME_SEARCH_BY_TAB[tab];
  return {
    location: config.defaultLocation,
    checkIn: config.defaultCheckIn,
    checkOut: config.defaultCheckOut,
    guests: {
      adults: config.defaultAdults,
      children: config.defaultChildren,
      infants: config.defaultInfants,
      rooms: config.defaultRooms,
    } satisfies GuestCounts,
  };
}

export function HomeSearchCard({ activeTab }: { activeTab: HomeCategoryTab }) {
  const { s } = useHomeScale();
  const { enterSearchMode } = useHomeSearch();
  const config = HOME_SEARCH_BY_TAB[activeTab];
  const locationInputRef = useRef<TextInput>(null);

  const [expanded, setExpanded] = useState<ExpandedSection>(null);
  const [location, setLocation] = useState(config.defaultLocation);
  const [checkIn, setCheckIn] = useState(config.defaultCheckIn);
  const [checkOut, setCheckOut] = useState(config.defaultCheckOut);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: config.defaultAdults,
    children: config.defaultChildren,
    infants: config.defaultInfants,
    rooms: config.defaultRooms,
  });

  const [dateDraft, setDateDraft] = useState<{ checkIn: string; checkOut: string | null }>({
    checkIn: config.defaultCheckIn,
    checkOut: config.defaultCheckOut,
  });
  const [guestDraft, setGuestDraft] = useState<GuestCounts>({
    adults: config.defaultAdults,
    children: config.defaultChildren,
    infants: config.defaultInfants,
    rooms: config.defaultRooms,
  });

  useEffect(() => {
    const defaults = applyTabDefaults(activeTab);
    setExpanded(null);
    setLocation(defaults.location);
    setCheckIn(defaults.checkIn);
    setCheckOut(defaults.checkOut);
    setGuests(defaults.guests);
    setDateDraft({ checkIn: defaults.checkIn, checkOut: defaults.checkOut });
    setGuestDraft(defaults.guests);
  }, [activeTab]);

  const openSection = (section: ExpandedSection) => {
    if (section !== 'location') {
      locationInputRef.current?.blur();
    }
    if (section === 'dates') {
      setDateDraft({ checkIn, checkOut });
    }
    if (section === 'guests') {
      setGuestDraft({ ...guests });
    }
    setExpanded(section);
    if (section === 'location') {
      setTimeout(() => locationInputRef.current?.focus(), 50);
    }
  };

  const filteredSuggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return LOCATION_SUGGESTIONS;
    return LOCATION_SUGGESTIONS.filter(
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
    setExpanded(null);
    enterSearchMode({
      location,
      checkIn,
      checkOut,
      guests,
      tab: activeTab,
    });
  };

  const checkInDisplay = formatSearchDate(checkIn);
  const checkOutDisplay = formatSearchDate(checkOut);
  const guestTotal = totalGuests(guests);

  return (
    <View style={[styles.card, { padding: s(12), gap: s(8), borderRadius: s(12) }]}>
      <View
        style={[
          styles.locationBox,
          {
            padding: s(12),
            borderRadius: s(12),
            borderColor: expanded === 'location' ? colors.accent.main : 'rgba(28, 32, 36, 0.1)',
          },
        ]}
      >
        <View style={{ gap: s(12) }}>
          <View style={styles.labelRow}>
            <Ionicons name="business-outline" size={s(14)} color={colors.accent.main} />
            <Text style={[styles.fieldLabel, { fontSize: s(10), lineHeight: s(14) }]}>
              {config.locationLabel}
            </Text>
          </View>
          <View style={[styles.valuePill, { paddingVertical: s(6), paddingHorizontal: s(12), minHeight: s(30) }]}>
            <TextInput
              ref={locationInputRef}
              value={location}
              onChangeText={setLocation}
              onFocus={() => openSection('location')}
              style={[styles.locationInput, { fontSize: s(14), lineHeight: s(20) }]}
              placeholder="Search city or hotel"
              placeholderTextColor="rgba(28, 32, 36, 0.4)"
            />
          </View>
        </View>

        {expanded === 'location' ? (
          <View style={{ gap: s(8), marginTop: s(18) }}>
            {filteredSuggestions.map((item) => (
              <Pressable
                key={item.title}
                style={[styles.suggestionRow, { paddingVertical: s(8), paddingHorizontal: s(12) }]}
                onPress={() => {
                  setLocation(item.short);
                  setExpanded(null);
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

            <Text style={[styles.popularLabel, { fontSize: s(12), lineHeight: s(16) }]}>
              Popular destintions
            </Text>

            <View style={[styles.chipRow, { gap: s(12) }]}>
              {POPULAR_DESTINATIONS.map((city) => (
                <Pressable
                  key={city}
                  style={[styles.destChip, { paddingVertical: s(8), paddingHorizontal: s(12) }]}
                  onPress={() => {
                    setLocation(city);
                    setExpanded(null);
                    locationInputRef.current?.blur();
                  }}
                >
                  <Text style={[styles.destChipText, { fontSize: s(12), lineHeight: s(16) }]}>
                    {city}
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
          active={expanded === 'dates'}
          onPress={() => openSection('dates')}
        />
        <DateField
          label="Check Out"
          date={checkOutDisplay.date}
          day={checkOutDisplay.day}
          active={expanded === 'dates'}
          onPress={() => openSection('dates')}
        />
      </View>

      {expanded === 'dates' ? (
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
                setExpanded(null);
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
                setExpanded(null);
              }}
            >
              <Text style={[styles.selectBtnText, { fontSize: s(14) }]}>Select</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.guestsBox,
          {
            padding: s(6),
            borderRadius: s(12),
            borderColor: expanded === 'guests' ? colors.accent.main : 'rgba(28, 32, 36, 0.1)',
          },
        ]}
      >
        <Pressable
          style={styles.guestsHeader}
          onPress={() => openSection('guests')}
        >
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
            <GuestStat count={String(guestTotal)} unit={config.guestUnit} />
            <View style={styles.vDivider} />
            <GuestStat count={String(guests.rooms)} unit={config.roomUnit} />
          </View>
        </Pressable>

        {expanded === 'guests' ? (
          <View style={{ paddingHorizontal: s(6), paddingBottom: s(6), gap: s(12) }}>
            <GuestStepperRow
              label="Adults"
              sublabel="Age 13+"
              value={guestDraft.adults}
              min={1}
              onChange={(v) => setGuestDraft((g) => ({ ...g, adults: v }))}
            />
            <GuestStepperRow
              label="Children"
              sublabel="Age 2-12"
              value={guestDraft.children}
              min={0}
              onChange={(v) => setGuestDraft((g) => ({ ...g, children: v }))}
            />
            <GuestStepperRow
              label="Infants"
              sublabel="Under 2"
              value={guestDraft.infants}
              min={0}
              onChange={(v) => setGuestDraft((g) => ({ ...g, infants: v }))}
            />
            <GuestStepperRow
              label="Rooms"
              sublabel=""
              value={guestDraft.rooms}
              min={1}
              onChange={(v) => setGuestDraft((g) => ({ ...g, rooms: v }))}
            />

            <View style={[styles.panelActions, { gap: s(12) }]}>
              <Pressable
                style={[styles.cancelBtn, { height: s(36), borderRadius: s(8) }]}
                onPress={() => {
                  setGuestDraft({ ...guests });
                  setExpanded(null);
                }}
              >
                <Text style={[styles.cancelBtnText, { fontSize: s(14) }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.selectBtn, { height: s(36), borderRadius: s(8) }]}
                onPress={() => {
                  setGuests({ ...guestDraft });
                  setExpanded(null);
                }}
              >
                <Text style={[styles.selectBtnText, { fontSize: s(14) }]}>Select</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.actionRow, { gap: s(16) }]}>
        {config.showPriceFilter ? (
          <Pressable
            style={[styles.priceBtn, { height: s(32), paddingHorizontal: s(12) }]}
            onPress={() => setExpanded(null)}
          >
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
          onPress={handleSearch}
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
        <Text style={[styles.guestLabel, { fontSize: s(10), lineHeight: s(14) }]}>{label}</Text>
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

function GuestStepperRow({
  label,
  sublabel,
  value,
  min,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  const { s } = useHomeScale();
  return (
    <View style={styles.stepperRow}>
      <View>
        <Text style={[styles.stepperLabel, { fontSize: s(14), lineHeight: s(20) }]}>{label}</Text>
        {sublabel ? (
          <Text style={[styles.stepperSub, { fontSize: s(12), lineHeight: s(16) }]}>{sublabel}</Text>
        ) : null}
      </View>
      <View style={[styles.stepper, { gap: s(16) }]}>
        <Pressable
          style={[styles.stepperBtn, { width: s(28), height: s(28), borderRadius: s(4) }]}
          onPress={() => onChange(clamp(value - 1, min, 10))}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Ionicons name="remove" size={s(16)} color={colors.accent.main} />
        </Pressable>
        <Text style={[styles.stepperValue, { fontSize: s(16), minWidth: s(16), textAlign: 'center' }]}>
          {value}
        </Text>
        <Pressable
          style={[styles.stepperBtn, { width: s(28), height: s(28), borderRadius: s(4) }]}
          onPress={() => onChange(clamp(value + 1, min, 10))}
          accessibilityLabel={`Increase ${label}`}
        >
          <Ionicons name="add" size={s(16)} color={colors.accent.main} />
        </Pressable>
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
  locationInput: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    padding: 0,
    margin: 0,
    width: '100%',
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
  },
  calendarPanel: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
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
  guestsBox: {
    borderWidth: 1,
    backgroundColor: colors.surface.white,
  },
  guestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  stepperSub: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  panelActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text.primary,
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
