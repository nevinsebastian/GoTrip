import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorWorkspaceHeader } from '@/src/components/vendor/workspace/VendorWorkspaceHeader';
import {
  VENDOR_CALENDAR_BLOCKED_DATES,
  VENDOR_CALENDAR_BOOKED_DATES,
  VENDOR_WORKSPACE_BLUE,
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_PINK,
} from '@/src/constants/vendorWorkspaceConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorCalendarScreen() {
  const categoryId = useVendorListingCategory();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const markedDates = useMemo(() => {
    const marks: Record<string, object> = {};
    VENDOR_CALENDAR_BOOKED_DATES.forEach((d) => {
      marks[d] = { selected: true, selectedColor: VENDOR_WORKSPACE_PINK };
    });
    VENDOR_CALENDAR_BLOCKED_DATES.forEach((d) => {
      marks[d] = { selected: true, selectedColor: '#9CA3AF' };
    });
    selectedDates.forEach((d) => {
      marks[d] = { selected: true, selectedColor: VENDOR_WORKSPACE_BLUE };
    });
    return marks;
  }, [selectedDates]);

  const onDayPress = (day: DateData) => {
    setSelectedDates((prev) =>
      prev.includes(day.dateString)
        ? prev.filter((d) => d !== day.dateString)
        : [...prev, day.dateString],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorWorkspaceHeader categoryId={categoryId} showSearch={false} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Availability</Text>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.surface.white, borderWidth: 1, borderColor: '#D1D5DB' }]} />
              <Text style={styles.legendText}>{VENDOR_WORKSPACE_COPY.calendarLegendAvailable}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: VENDOR_WORKSPACE_PINK }]} />
              <Text style={styles.legendText}>{VENDOR_WORKSPACE_COPY.calendarLegendBooked}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9CA3AF' }]} />
              <Text style={styles.legendText}>{VENDOR_WORKSPACE_COPY.calendarLegendBlocked}</Text>
            </View>
          </View>

          <View style={styles.calendarCard}>
            <Calendar
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={{
                todayTextColor: VENDOR_WORKSPACE_BLUE,
                arrowColor: VENDOR_WORKSPACE_BLUE,
              }}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.updateBtn}>
            <Text style={styles.updateBtnText}>{VENDOR_WORKSPACE_COPY.updateAvailability}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  calendarCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface.white,
  },
  footer: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
  },
  updateBtn: {
    backgroundColor: VENDOR_WORKSPACE_PINK,
    borderRadius: borderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
