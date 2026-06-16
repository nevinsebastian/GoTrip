import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingSummaryCard } from '@/src/components/booking/BookingSummaryCard';
import { MobileBottomTabBar } from '@/src/components/navigation/MobileBottomTabBar';
import { useMobileTabBarInset } from '@/src/components/navigation/MobileFloatingTabBar';
import { FIGMA_PROPERTY } from '@/src/components/resort/resortConstants';
import { FIGMA_BOOKING } from '@/src/constants/bookingConstants';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { formatPackageDayLabel } from '@/src/utils/packageDates';

type GuestCounts = { adults: number; children: number; infants: number };

type MobileBookingReviewScreenProps = {
  imageUri?: string | null;
  listingType?: 'hotel' | 'package';
  propertyTitle?: string;
  fixedCheckIn?: string;
  fixedCheckOut?: string;
  onConfirm: (payload: {
    checkIn: string;
    checkOut: string;
    guests: GuestCounts;
  }) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

function formatDayLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}

function getDatesInRange(start: string, end: string) {
  const out: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  const a = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  const b = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || a.getTime() > b.getTime()) return out;
  const cur = new Date(a);
  while (cur.getTime() <= b.getTime()) {
    const yyyy = cur.getUTCFullYear();
    const mm = String(cur.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(cur.getUTCDate()).padStart(2, '0');
    out.push(`${yyyy}-${mm}-${dd}`);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

function formatSummaryDates(checkIn: string, checkOut: string) {
  const range = getDatesInRange(checkIn, checkOut);
  if (!range.length) return 'Select dates';
  const month = new Date(range[0]).toLocaleString('en-US', { month: 'long' });
  const days = range.map((d) => new Date(d).getDate()).join(',');
  return `${month} ${days}`;
}

function formatGuestsSummary(counts: GuestCounts) {
  const parts: string[] = [];
  if (counts.adults) parts.push(`${counts.adults} Adult${counts.adults === 1 ? '' : 's'}`);
  if (counts.children) parts.push(`${counts.children} Child${counts.children === 1 ? '' : 'ren'}`);
  if (counts.infants) parts.push(`${counts.infants} Infant${counts.infants === 1 ? '' : 's'}`);
  return parts.join(', ') || '0 Guests';
}

function GuestStepper({
  label,
  subLabel,
  value,
  min,
  max,
  onChange,
  dimmed,
}: {
  label: string;
  subLabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  dimmed?: boolean;
}) {
  const { s } = useHomeScale();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <View style={[styles.guestRow, { paddingVertical: s(8) }, dimmed && styles.dimmed]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.guestLabel, { fontSize: s(16), lineHeight: s(24) }]}>{label}</Text>
        <Text style={[styles.guestSubLabel, { fontSize: s(10), lineHeight: s(12) }]}>{subLabel}</Text>
      </View>
      <View style={[styles.stepper, { height: s(36), borderRadius: s(8), paddingHorizontal: s(12), gap: s(16) }]}>
        <Pressable onPress={() => onChange(clamp(value - 1))} hitSlop={8}>
          <Ionicons name="remove" size={s(16)} color={colors.accent.main} />
        </Pressable>
        <Text style={[styles.stepperValue, { fontSize: s(14), minWidth: s(16), textAlign: 'center' }]}>
          {value}
        </Text>
        <Pressable onPress={() => onChange(clamp(value + 1))} hitSlop={8}>
          <Ionicons name="add" size={s(16)} color={colors.accent.main} />
        </Pressable>
      </View>
    </View>
  );
}

function DateTile({
  label,
  dayLabel,
  timeLabel,
  active,
  onPress,
  readOnly,
}: {
  label: string;
  dayLabel: string;
  timeLabel: string;
  active?: boolean;
  onPress: () => void;
  readOnly?: boolean;
}) {
  const { s } = useHomeScale();

  return (
    <Pressable
      style={[
        styles.dateTile,
        readOnly && styles.dateTileReadOnly,
        {
          padding: s(12),
          borderRadius: s(12),
          flex: 1,
          borderColor: active ? colors.accent.main : 'rgba(28, 32, 36, 0.1)',
        },
      ]}
      onPress={readOnly ? undefined : onPress}
      disabled={readOnly}
    >
      <Text style={[styles.dateTileLabel, { fontSize: s(12), lineHeight: s(16) }]}>{label}</Text>
      <Text style={[styles.dateTileDay, { fontSize: s(12), lineHeight: s(16) }]}>{dayLabel}</Text>
      <Text style={[styles.dateTileTime, { fontSize: s(10), lineHeight: s(14) }]}>{timeLabel}</Text>
    </Pressable>
  );
}

export function MobileBookingReviewScreen({
  imageUri,
  listingType = 'hotel',
  propertyTitle,
  fixedCheckIn,
  fixedCheckOut,
  onConfirm,
  isSubmitting,
  errorMessage,
}: MobileBookingReviewScreenProps) {
  const { s } = useHomeScale();
  const insets = useSafeAreaInsets();
  const tabBarInset = useMobileTabBarInset();
  const isPackage = listingType === 'package';

  const packageCheckIn = fixedCheckIn ?? FIGMA_PACKAGE_DETAIL.fixedCheckIn;
  const packageCheckOut = fixedCheckOut ?? FIGMA_PACKAGE_DETAIL.fixedCheckOut;

  const [checkInDate, setCheckInDate] = useState(
    isPackage ? packageCheckIn : FIGMA_BOOKING.checkIn.iso,
  );
  const [checkOutDate, setCheckOutDate] = useState(
    isPackage ? packageCheckOut : FIGMA_BOOKING.checkOut.iso,
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [guests, setGuests] = useState<GuestCounts>({
    adults: FIGMA_BOOKING.defaultAdults,
    children: FIGMA_BOOKING.defaultChildren,
    infants: FIGMA_BOOKING.defaultInfants,
  });

  const markedDates = useMemo(() => {
    const lightFill = colors.surface.lightPink ?? '#feebe7';
    const primary = colors.accent.main;
    const out: Record<string, { customStyles?: { container?: object; text?: object } }> = {};
    if (!checkInDate) return out;

    if (!checkOutDate) {
      out[checkInDate] = {
        customStyles: {
          container: { backgroundColor: primary, borderRadius: 999 },
          text: { color: colors.surface.white, fontWeight: '600' },
        },
      };
      return out;
    }

    getDatesInRange(checkInDate, checkOutDate).forEach((d, idx, arr) => {
      const isEdge = idx === 0 || idx === arr.length - 1;
      out[d] = {
        customStyles: {
          container: { backgroundColor: isEdge ? primary : lightFill, borderRadius: 999 },
          text: { color: isEdge ? colors.surface.white : colors.text.primary, fontWeight: '600' },
        },
      };
    });
    return out;
  }, [checkInDate, checkOutDate]);

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (activeDateField === 'checkIn' || !checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate('');
      setActiveDateField('checkOut');
      return;
    }
    if (new Date(date).getTime() < new Date(checkInDate).getTime()) {
      setCheckInDate(date);
      setCheckOutDate('');
      setActiveDateField('checkOut');
      return;
    }
    setCheckOutDate(date);
  };

  const openCalendar = (field: 'checkIn' | 'checkOut') => {
    setActiveDateField(field);
    setCalendarOpen(true);
  };

  const handleCalendarSelect = () => {
    if (!checkInDate) return;
    setCalendarOpen(false);
  };

  const handleClearSelection = () => {
    if (!isPackage) {
      setCheckInDate(FIGMA_BOOKING.checkIn.iso);
      setCheckOutDate(FIGMA_BOOKING.checkOut.iso);
    }
    setGuests({
      adults: FIGMA_BOOKING.defaultAdults,
      children: FIGMA_BOOKING.defaultChildren,
      infants: FIGMA_BOOKING.defaultInfants,
    });
    setCalendarOpen(false);
  };

  const resolvedCheckIn = isPackage ? packageCheckIn : checkInDate;
  const resolvedCheckOut = isPackage ? packageCheckOut : checkOutDate;
  const checkInLabel = isPackage
    ? formatPackageDayLabel(packageCheckIn)
    : checkInDate
      ? formatDayLabel(checkInDate)
      : FIGMA_BOOKING.checkIn.dayLabel;
  const checkOutLabel = isPackage
    ? formatPackageDayLabel(packageCheckOut)
    : checkOutDate
      ? formatDayLabel(checkOutDate)
      : FIGMA_BOOKING.checkOut.dayLabel;
  const checkInFieldLabel = isPackage ? FIGMA_PACKAGE_DETAIL.tripStartLabel : FIGMA_BOOKING.checkIn.label;
  const checkOutFieldLabel = isPackage ? FIGMA_PACKAGE_DETAIL.tripEndLabel : FIGMA_BOOKING.checkOut.label;
  const checkInTimeLabel = isPackage ? FIGMA_PACKAGE_DETAIL.tripStartTime : FIGMA_BOOKING.checkIn.timeLabel;
  const checkOutTimeLabel = isPackage ? FIGMA_PACKAGE_DETAIL.tripEndTime : FIGMA_BOOKING.checkOut.timeLabel;
  const summaryLine = `${formatSummaryDates(resolvedCheckIn, resolvedCheckOut)} | ${formatGuestsSummary(guests)}`;
  const displayTitle = propertyTitle ?? (isPackage ? FIGMA_PACKAGE_DETAIL.title : FIGMA_PROPERTY.title);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + s(8), paddingHorizontal: s(16) }]}>
        <Pressable
          style={[styles.backBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={s(22)} color={colors.surface.white} />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: s(18), lineHeight: s(24) }]}>
          {FIGMA_BOOKING.screenTitle}
        </Text>
        <View style={{ width: s(40) }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: s(16), paddingBottom: tabBarInset + s(16), gap: s(16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.propertyRow, { gap: s(8) }]}>
          <Text style={[styles.propertyTitle, { fontSize: s(16), lineHeight: s(22), flex: 1 }]}>
            {displayTitle}
          </Text>
          <Pressable style={[styles.viewLocationBtn, { paddingVertical: s(6), paddingHorizontal: s(10), borderRadius: s(9999) }]}>
            <Ionicons name="location-outline" size={s(12)} color="#FFFFFF" />
            <Text style={[styles.viewLocationText, { fontSize: s(10) }]}>
              {FIGMA_PROPERTY.viewLocationLabel}
            </Text>
          </Pressable>
        </View>

        <BookingSummaryCard imageUri={imageUri} />

        <View
          style={[
            styles.bookingPanel,
            {
              padding: s(16),
              borderRadius: s(18),
              gap: s(16),
            },
          ]}
        >
          <View style={[styles.dateRow, { gap: s(12) }]}>
            <DateTile
              label={checkInFieldLabel}
              dayLabel={checkInLabel}
              timeLabel={checkInTimeLabel}
              active={!isPackage && calendarOpen && activeDateField === 'checkIn'}
              readOnly={isPackage}
              onPress={() => openCalendar('checkIn')}
            />
            <DateTile
              label={checkOutFieldLabel}
              dayLabel={checkOutLabel}
              timeLabel={checkOutTimeLabel}
              active={!isPackage && calendarOpen && activeDateField === 'checkOut'}
              readOnly={isPackage}
              onPress={() => openCalendar('checkOut')}
            />
          </View>

          {isPackage ? (
            <Text style={[styles.fixedDatesNote, { fontSize: s(10), lineHeight: s(14) }]}>
              {FIGMA_PACKAGE_DETAIL.datesFixedNote}
            </Text>
          ) : null}

          {!isPackage && calendarOpen ? (
            <View style={[styles.calendarCard, { borderRadius: s(18), padding: s(8) }]}>
              <Calendar
                current={checkInDate || undefined}
                markingType="custom"
                markedDates={markedDates}
                onDayPress={handleDayPress}
                hideExtraDays={false}
                enableSwipeMonths
                renderArrow={(direction) => (
                  <View style={[styles.calendarArrow, { width: s(32), height: s(32), borderRadius: s(16) }]}>
                    <Ionicons
                      name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                      size={s(16)}
                      color={colors.text.primary}
                    />
                  </View>
                )}
                theme={{
                  textDayFontFamily: 'Poppins',
                  textMonthFontFamily: 'Poppins',
                  textDayHeaderFontFamily: 'Poppins',
                  textMonthFontWeight: '500',
                  textDayFontWeight: '500',
                  monthTextColor: colors.text.primary,
                  textSectionTitleColor: colors.text.caption,
                  dayTextColor: '#4A5660',
                  textDisabledColor: '#e0e0e0',
                  arrowColor: colors.text.secondary,
                  todayTextColor: colors.text.primary,
                  textDayFontSize: 14,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                } as object}
              />
              <View style={[styles.calendarActions, { gap: s(12), marginTop: s(12) }]}>
                <Pressable
                  style={[styles.calendarCancelBtn, { height: s(42), borderRadius: s(9999), flex: 1 }]}
                  onPress={() => setCalendarOpen(false)}
                >
                  <Text style={[styles.calendarCancelText, { fontSize: s(14) }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.calendarSelectBtn, { height: s(42), borderRadius: s(9999), flex: 1 }]}
                  onPress={handleCalendarSelect}
                >
                  <Text style={[styles.calendarSelectText, { fontSize: s(14) }]}>Select</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <View style={!isPackage && calendarOpen ? styles.dimmed : undefined}>
            <GuestStepper
              label="Adults"
              subLabel="Age 13+"
              value={guests.adults}
              min={1}
              max={10}
              dimmed={!isPackage && calendarOpen}
              onChange={(adults) => setGuests((g) => ({ ...g, adults }))}
            />
            <GuestStepper
              label="Children"
              subLabel="Age 2-12"
              value={guests.children}
              min={0}
              max={10}
              dimmed={!isPackage && calendarOpen}
              onChange={(children) => setGuests((g) => ({ ...g, children }))}
            />
            <GuestStepper
              label="Infants"
              subLabel="Under 2"
              value={guests.infants}
              min={0}
              max={10}
              dimmed={!isPackage && calendarOpen}
              onChange={(infants) => setGuests((g) => ({ ...g, infants }))}
            />
          </View>

          <View style={[styles.summaryRow, !isPackage && calendarOpen && styles.dimmed]}>
            <Text style={[styles.summaryText, { fontSize: s(12), flex: 1 }]} numberOfLines={1}>
              {summaryLine}
            </Text>
            {!isPackage ? (
              <Pressable onPress={handleClearSelection}>
                <Text style={[styles.clearText, { fontSize: s(10) }]}>Clear Selection</Text>
              </Pressable>
            ) : null}
          </View>

          {errorMessage ? (
            <Text style={[styles.errorText, { fontSize: s(12) }]}>{errorMessage}</Text>
          ) : null}

          <View style={[styles.actionRow, { gap: s(12) }, !isPackage && calendarOpen && styles.dimmed]}>
            <Pressable
              style={[styles.goBackBtn, { height: s(48), borderRadius: s(9999), flex: 1 }]}
              onPress={() => router.back()}
            >
              <View style={[styles.goBackIcon, { width: s(28), height: s(28), borderRadius: s(14) }]}>
                <Ionicons name="chevron-back" size={s(16)} color={colors.surface.white} />
              </View>
              <Text style={[styles.goBackText, { fontSize: s(14) }]}>Go back</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmBtn, { height: s(48), borderRadius: s(9999), flex: 1.4 }, isSubmitting && styles.btnDisabled]}
              onPress={() => {
                if (!isPackage && (!checkInDate || !checkOutDate)) {
                  setCalendarOpen(true);
                  return;
                }
                onConfirm({
                  checkIn: resolvedCheckIn,
                  checkOut: resolvedCheckOut,
                  guests,
                });
              }}
              disabled={isSubmitting}
            >
              <Text style={[styles.confirmText, { fontSize: s(14) }]}>
                {isSubmitting ? 'Processing...' : 'Confirm and Proceed'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <MobileBottomTabBar activeTab="index" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    backgroundColor: colors.surface.white,
  },
  backBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.text.primary,
  },
  viewLocationText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  bookingPanel: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  dateRow: {
    flexDirection: 'row',
  },
  dateTile: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    gap: 4,
  },
  dateTileReadOnly: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
  },
  fixedDatesNote: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  dateTileLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  dateTileDay: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  dateTileTime: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  calendarCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  calendarArrow: {
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarActions: {
    flexDirection: 'row',
  },
  calendarCancelBtn: {
    borderWidth: 1,
    borderColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  calendarCancelText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  calendarSelectBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarSelectText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  guestSubLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
  },
  stepperValue: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  dimmed: {
    opacity: 0.35,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  clearText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#D72400',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
  },
  goBackIcon: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  confirmBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
