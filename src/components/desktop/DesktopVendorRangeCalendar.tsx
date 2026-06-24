import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { getDatesInRange } from '@/src/components/home/homeSearchConfig';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

const FIGMA_PINK = '#AA1155';
const FIGMA_MARK_ACCENT = '#E54D2E';
const FIGMA_MARK_RANGE = 'rgba(229, 77, 46, 0.15)';
const FIGMA_FILTER_RANGE = 'rgba(170, 17, 85, 0.15)';

export type DesktopVendorCalendarVariant = 'mark' | 'filter';

type DesktopVendorRangeCalendarProps = {
  variant: DesktopVendorCalendarVariant;
  checkIn: string | null;
  checkOut: string | null;
  onCheckInChange: (date: string | null) => void;
  onCheckOutChange: (date: string | null) => void;
  initialMonth?: string;
  padding?: number;
};

function monthStart(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function shiftMonth(isoMonth: string, delta: number) {
  const d = new Date(`${isoMonth.slice(0, 7)}-01T12:00:00`);
  d.setMonth(d.getMonth() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function formatMonthLabel(isoMonth: string) {
  const d = new Date(`${isoMonth.slice(0, 7)}-01T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function buildMarkedDates(
  checkIn: string | null,
  checkOut: string | null,
  variant: DesktopVendorCalendarVariant,
) {
  const primary = variant === 'mark' ? FIGMA_MARK_ACCENT : FIGMA_PINK;
  const rangeFill = variant === 'mark' ? FIGMA_MARK_RANGE : FIGMA_FILTER_RANGE;
  const radius = variant === 'mark' ? 8 : 999;
  const out: Record<string, { customStyles?: { container?: object; text?: object } }> = {};
  if (!checkIn) return out;

  if (!checkOut) {
    out[checkIn] = {
      customStyles: {
        container: { backgroundColor: primary, borderRadius: radius },
        text: { color: colors.surface.white, fontWeight: '500' },
      },
    };
    return out;
  }

  getDatesInRange(checkIn, checkOut).forEach((d, idx, range) => {
    const isStart = idx === 0;
    const isEnd = idx === range.length - 1;
    const isEdge = isStart || isEnd;
    let borderRadius: number | object = radius;
    if (variant === 'mark' && range.length > 1) {
      if (isStart && !isEnd) borderRadius = { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 };
      else if (isEnd && !isStart) borderRadius = { borderTopRightRadius: 8, borderBottomRightRadius: 8 };
      else if (!isEdge) borderRadius = 0;
    }
    out[d] = {
      customStyles: {
        container: {
          backgroundColor: isEdge ? primary : rangeFill,
          borderRadius,
        },
        text: {
          color: isEdge ? colors.surface.white : '#1C2024',
          fontWeight: '500',
        },
      },
    };
  });
  return out;
}

export function formatVendorDateSummary(checkIn: string | null, checkOut: string | null) {
  if (!checkIn) return '';
  if (!checkOut) {
    const d = new Date(`${checkIn}T12:00:00`);
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    return `${month} ${d.getDate()}`;
  }
  const range = getDatesInRange(checkIn, checkOut);
  const first = new Date(`${range[0]}T12:00:00`);
  const month = first.toLocaleDateString('en-US', { month: 'long' });
  const days = range.map((d) => new Date(`${d}T12:00:00`).getDate()).join(',');
  return `${month} ${days}`;
}

export function DesktopVendorRangeCalendar({
  variant,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  initialMonth,
  padding = 16,
}: DesktopVendorRangeCalendarProps) {
  const seed = initialMonth ?? checkIn ?? new Date().toISOString().slice(0, 10);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(seed));
  const markedDates = useMemo(
    () => buildMarkedDates(checkIn, checkOut, variant),
    [checkIn, checkOut, variant],
  );

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(date);
      onCheckOutChange(null);
      return;
    }
    if (new Date(`${date}T12:00:00`).getTime() < new Date(`${checkIn}T12:00:00`).getTime()) {
      onCheckInChange(date);
      onCheckOutChange(null);
      return;
    }
    onCheckOutChange(date);
  };

  return (
    <View style={[styles.calendarCard, { padding }]}>
      <View style={styles.monthNav}>
        <Pressable style={styles.navBtn} onPress={() => setVisibleMonth((m) => shiftMonth(m, -1))}>
          <Ionicons name="chevron-back" size={16} color="#CECECE" />
        </Pressable>
        <Text style={styles.monthTitle}>{formatMonthLabel(visibleMonth)}</Text>
        <Pressable style={styles.navBtn} onPress={() => setVisibleMonth((m) => shiftMonth(m, 1))}>
          <Ionicons name="chevron-forward" size={16} color="#CECECE" />
        </Pressable>
      </View>
      <Calendar
        key={visibleMonth}
        current={visibleMonth}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        hideExtraDays={false}
        disableMonthChange
        hideArrows
        renderHeader={() => null}
        theme={{
          textDayFontFamily: typography.fontFamily.text,
          textMonthFontFamily: typography.fontFamily.text,
          textDayHeaderFontFamily: typography.fontFamily.text,
          textDayFontWeight: '400',
          monthTextColor: '#202020',
          textSectionTitleColor: '#8D8D8D',
          dayTextColor: '#4A5660',
          textDisabledColor: '#E0E0E0',
          textDayFontSize: 14,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    borderWidth: 1,
    borderColor: FIGMA_PINK,
    borderRadius: 12,
    backgroundColor: colors.surface.white,
    gap: 8,
    flex: 1,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 16,
  },
  navBtn: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 14,
    color: '#202020',
    textAlign: 'center',
  },
  calendar: {
    width: '100%',
  },
});
