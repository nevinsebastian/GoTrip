import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useHomeScale } from '@/src/components/home/useHomeScale';
import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';
import { formatPackageDateRange, getPackageFixedDates } from '@/src/utils/packageDates';

export function PackageFixedDatesRow({
  listingId,
  checkIn,
  checkOut,
  showNote = false,
  compact = false,
}: {
  listingId?: string;
  checkIn?: string;
  checkOut?: string;
  showNote?: boolean;
  compact?: boolean;
}) {
  const { s } = useHomeScale();
  const fallback = getPackageFixedDates(listingId);
  const startDate = checkIn ?? fallback.startDate;
  const endDate = checkOut ?? fallback.endDate;
  const rangeLabel = formatPackageDateRange(startDate, endDate);

  return (
    <View style={{ gap: s(showNote ? 4 : 0) }}>
      <View style={[styles.row, { gap: s(6), paddingVertical: s(compact ? 0 : 2) }]}>
        <Ionicons name="calendar-outline" size={s(compact ? 12 : 14)} color={colors.accent.main} />
        <Text style={[styles.range, { fontSize: s(compact ? 10 : 12), lineHeight: s(compact ? 14 : 16) }]}>
          {rangeLabel}
        </Text>
      </View>
      {showNote ? (
        <Text style={[styles.note, { fontSize: s(9), lineHeight: s(12), marginLeft: s(20) }]}>
          {FIGMA_PACKAGE_DETAIL.datesFixedNote}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  range: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
    flex: 1,
  },
  note: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
});
