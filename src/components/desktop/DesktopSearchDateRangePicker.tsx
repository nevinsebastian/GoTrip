import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import CalendarClockIcon from '@/assets/webassets/Vector.svg';
import { formatSearchDate, getDatesInRange } from '@/src/components/home/homeSearchConfig';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

const SPECS = DESKTOP_HERO_SPECS;

type DateDraft = { checkIn: string; checkOut: string | null };

type DesktopSearchDateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  draft: DateDraft;
  onDraftChange: (draft: DateDraft) => void;
  onCancel: () => void;
  onSelect: () => void;
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

function buildMarkedDates(draft: DateDraft) {
  const lightFill = 'rgba(229, 77, 46, 0.12)';
  const primary = SPECS.accent;
  const out: Record<string, { customStyles?: { container?: object; text?: object } }> = {};
  const { checkIn: start, checkOut: end } = draft;
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
  'stylesheet.calendar.header': {
    week: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 4,
    },
  },
};

function DateHeaderField({ label, iso }: { label: string; iso: string }) {
  const display = formatSearchDate(iso);
  return (
    <View style={styles.dateHeaderField}>
      <View style={styles.fieldLabelRow}>
        <CalendarClockIcon width={18} height={18} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <View style={styles.valueBox}>
        <View style={styles.dateValueRow}>
          <Text style={styles.dateValueSmall}>{display.date}</Text>
          <Text style={styles.dateValueDay}>{display.day}</Text>
        </View>
      </View>
    </View>
  );
}

function formatMonthLabel(isoMonth: string) {
  const d = new Date(`${isoMonth.slice(0, 7)}-01T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

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

export function DesktopSearchDateRangePicker({
  checkIn,
  checkOut,
  draft,
  onDraftChange,
  onCancel,
  onSelect,
}: DesktopSearchDateRangePickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(draft.checkIn || checkIn));

  const markedDates = useMemo(() => buildMarkedDates(draft), [draft]);

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (!draft.checkIn || (draft.checkIn && draft.checkOut)) {
      onDraftChange({ checkIn: date, checkOut: null });
      return;
    }
    if (new Date(`${date}T12:00:00`).getTime() < new Date(`${draft.checkIn}T12:00:00`).getTime()) {
      onDraftChange({ checkIn: date, checkOut: null });
      return;
    }
    onDraftChange({ ...draft, checkOut: date });
  };

  const draftCheckIn = draft.checkIn || checkIn;
  const draftCheckOut = draft.checkOut || checkOut;

  return (
    <View style={styles.panel}>
      <View style={styles.dateHeaderRow}>
        <DateHeaderField label="Check In" iso={draftCheckIn} />
        <DateHeaderField label="Check Out" iso={draftCheckOut} />
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

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.selectBtn} onPress={onSelect}>
          <Text style={styles.selectBtnText}>Select</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  dateHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateHeaderField: {
    flex: 1,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
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
  },
  valueBox: {
    backgroundColor: SPECS.valueBoxBg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 35,
    justifyContent: 'center',
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
    marginHorizontal: 8,
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
    borderColor: SPECS.fieldBorder,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    minWidth: 120,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  selectBtn: {
    minWidth: 120,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SPECS.accent,
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  selectBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
});
