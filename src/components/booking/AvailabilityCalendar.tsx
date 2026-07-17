import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { getDatesInRange } from '@/src/components/home/homeSearchConfig';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

type AvailabilityCalendarProps = {
  checkIn: string | null;
  checkOut: string | null;
  /** Unavailable / blocked dates from GET /availability */
  disabledDates?: Set<string>;
  /** Activity: select a single day as checkIn (checkOut mirrors checkIn) */
  singleDay?: boolean;
  loading?: boolean;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
  minDate?: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Airbnb-style range calendar: unavailable days are greyed + blocked;
 * selected range uses accent fill.
 */
export function AvailabilityCalendar({
  checkIn,
  checkOut,
  disabledDates,
  singleDay = false,
  loading = false,
  onChange,
  minDate,
}: AvailabilityCalendarProps) {
  const markedDates = useMemo(() => {
    const lightFill = 'rgba(229, 77, 46, 0.12)';
    const primary = colors.accent.main;
    const out: Record<
      string,
      {
        customStyles?: { container?: object; text?: object };
        disabled?: boolean;
        disableTouchEvent?: boolean;
      }
    > = {};

    disabledDates?.forEach((d) => {
      out[d] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: '#c8c8c8',
            textDecorationLine: 'line-through',
          },
        },
      };
    });

    if (!checkIn) return out;

    if (singleDay || !checkOut || checkIn === checkOut) {
      out[checkIn] = {
        customStyles: {
          container: { backgroundColor: primary, borderRadius: 999 },
          text: { color: colors.surface.white, fontWeight: '600' },
        },
      };
      return out;
    }

    getDatesInRange(checkIn, checkOut).forEach((d, idx, range) => {
      const isEdge = idx === 0 || idx === range.length - 1;
      out[d] = {
        customStyles: {
          container: {
            backgroundColor: isEdge ? primary : lightFill,
            borderRadius: 999,
          },
          text: {
            color: isEdge ? colors.surface.white : colors.text.primary,
            fontWeight: '600',
          },
        },
      };
    });
    return out;
  }, [checkIn, checkOut, disabledDates, singleDay]);

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (disabledDates?.has(date)) return;

    if (singleDay) {
      onChange(date, date);
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      onChange(date, null);
      return;
    }

    if (new Date(`${date}T12:00:00`).getTime() < new Date(`${checkIn}T12:00:00`).getTime()) {
      onChange(date, null);
      return;
    }

    // Block ranges that include unavailable nights (Airbnb-style)
    const nights = getDatesInRange(checkIn, date);
    const blockedInRange = nights.some((d, i) => {
      // checkout day itself can be unavailable for stay nights; block intermediate nights
      if (i === nights.length - 1) return false;
      return disabledDates?.has(d);
    });
    if (blockedInRange) return;

    onChange(checkIn, date);
  };

  return (
    <View style={styles.wrap}>
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accent.main} />
          <Text style={styles.loadingText}>Loading availability…</Text>
        </View>
      ) : null}
      <Calendar
        current={checkIn ?? minDate ?? todayIso()}
        minDate={minDate ?? todayIso()}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="custom"
        enableSwipeMonths
        theme={{
          textDayFontFamily: typography.fontFamily.text,
          textMonthFontFamily: typography.fontFamily.text,
          textDayHeaderFontFamily: typography.fontFamily.text,
          todayTextColor: colors.accent.main,
          arrowColor: colors.accent.main,
          monthTextColor: colors.text.primary,
          textDisabledColor: '#d0d0d0',
          dayTextColor: colors.text.primary,
        }}
      />
      <Text style={styles.legend}>
        Greyed dates are unavailable. {singleDay ? 'Pick an activity date.' : 'Select check-in, then check-out.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  loadingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
  },
  legend: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 15,
    color: colors.text.secondary,
    paddingHorizontal: 8,
  },
});
