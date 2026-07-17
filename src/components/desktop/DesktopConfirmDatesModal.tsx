import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { getDatesInRange } from '@/src/components/home/homeSearchConfig';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

const SPECS = DESKTOP_HERO_SPECS;

type DesktopConfirmDatesModalProps = {
  checkIn: string | null;
  checkOut: string | null;
  onCheckInChange: (date: string | null) => void;
  onCheckOutChange: (date: string | null) => void;
  onClose: () => void;
  onSave: () => void;
  disabledDates?: Set<string>;
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

function formatSelectedSummary(checkIn: string | null, checkOut: string | null) {
  if (!checkIn) return 'Select dates';
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

function buildMarkedDates(
  checkIn: string | null,
  checkOut: string | null,
  disabledDates?: Set<string>,
) {
  const lightFill = 'rgba(229, 77, 46, 0.12)';
  const primary = SPECS.accent;
  const out: Record<
    string,
    { customStyles?: { container?: object; text?: object }; disabled?: boolean; disableTouchEvent?: boolean }
  > = {};

  disabledDates?.forEach((d) => {
    out[d] = {
      disabled: true,
      disableTouchEvent: true,
      customStyles: {
        container: { backgroundColor: 'transparent' },
        text: {
          color: '#c8c8c8',
          textDecorationLine: 'line-through',
        },
      },
    };
  });

  if (!checkIn) return out;

  if (!checkOut) {
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
        text: { color: isEdge ? colors.surface.white : colors.text.primary, fontWeight: '600' },
      },
    };
  });
  return out;
}

const calendarTheme = {
  textDayFontFamily: typography.fontFamily.text,
  textMonthFontFamily: typography.fontFamily.text,
  textDayHeaderFontFamily: typography.fontFamily.text,
  textMonthFontWeight: '600' as const,
  textDayFontWeight: '500' as const,
  monthTextColor: colors.text.primary,
  textSectionTitleColor: 'rgba(28, 32, 36, 0.6)',
  dayTextColor: colors.text.primary,
  textDisabledColor: '#e0e0e0',
  todayTextColor: SPECS.accent,
  textDayFontSize: 12,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 10,
};

function MonthCalendar({
  month,
  markedDates,
  onDayPress,
  showLeftArrow,
  showRightArrow,
  onPrev,
  onNext,
}: {
  month: string;
  markedDates: ReturnType<typeof buildMarkedDates>;
  onDayPress: (day: DateData) => void;
  showLeftArrow: boolean;
  showRightArrow: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.monthWrap}>
      <View style={styles.monthHeader}>
        {showLeftArrow ? (
          <Pressable style={styles.navBtn} onPress={onPrev} accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={16} color={colors.text.primary} />
          </Pressable>
        ) : (
          <View style={styles.navBtnPlaceholder} />
        )}
        <Text style={styles.monthTitle}>{formatMonthLabel(month)}</Text>
        {showRightArrow ? (
          <Pressable style={styles.navBtn} onPress={onNext} accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
          </Pressable>
        ) : (
          <View style={styles.navBtnPlaceholder} />
        )}
      </View>
      <Calendar
        key={month}
        current={month}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={onDayPress}
        hideExtraDays={false}
        disableMonthChange
        hideArrows
        renderHeader={() => null}
        theme={calendarTheme}
        style={styles.calendar}
      />
    </View>
  );
}

export function DesktopConfirmDatesModal({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onClose,
  onSave,
  disabledDates,
}: DesktopConfirmDatesModalProps) {
  const seed = checkIn ?? new Date().toISOString().slice(0, 10);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(seed));
  const markedDates = useMemo(
    () => buildMarkedDates(checkIn, checkOut, disabledDates),
    [checkIn, checkOut, disabledDates],
  );

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (disabledDates?.has(date)) return;
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

  const handleClear = () => {
    onCheckInChange(null);
    onCheckOutChange(null);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm dates</Text>
        <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
          <Ionicons name="close" size={22} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.calendarsRow}>
        <MonthCalendar
          month={visibleMonth}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          showLeftArrow
          showRightArrow={false}
          onPrev={() => setVisibleMonth((m) => shiftMonth(m, -1))}
          onNext={() => setVisibleMonth((m) => shiftMonth(m, 1))}
        />
        <View style={styles.monthDivider} />
        <MonthCalendar
          month={shiftMonth(visibleMonth, 1)}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          showLeftArrow={false}
          showRightArrow
          onPrev={() => setVisibleMonth((m) => shiftMonth(m, -1))}
          onNext={() => setVisibleMonth((m) => shiftMonth(m, 1))}
        />
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>{formatSelectedSummary(checkIn, checkOut)}</Text>
        <Pressable onPress={handleClear} accessibilityLabel="Clear selection">
          <Text style={styles.clearText}>Clear Selection</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.saveBtn, !checkIn && styles.saveBtnDisabled]}
        onPress={onSave}
        disabled={!checkIn}
        accessibilityLabel="Save dates"
      >
        <Text style={styles.saveBtnText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: 24,
    gap: 24,
    ...Platform.select({
      web: { boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: SPECS.accent,
  },
  calendarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  monthWrap: {
    flex: 1,
    minWidth: 0,
  },
  monthDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(28, 32, 36, 0.1)',
    marginHorizontal: 12,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  monthTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPlaceholder: {
    width: 28,
    height: 28,
  },
  calendar: {
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  summaryText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  clearText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: SPECS.accent,
  },
  saveBtn: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: SPECS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
