import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorDashboardOverlay } from '@/src/components/desktop/DesktopVendorDashboardOverlay';
import {
  DesktopVendorRangeCalendar,
  formatVendorDateSummary,
} from '@/src/components/desktop/DesktopVendorRangeCalendar';
import { VENDOR_DASHBOARD_COPY } from '@/src/constants/vendorDashboardConstants';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const FIGMA_PINK = '#AA1155';
const FIGMA_SUMMARY = '#1C2024';
const FIGMA_CLEAR = 'rgba(0, 7, 20, 0.623529)';

type DesktopVendorFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (checkIn: string | null, checkOut: string | null) => void;
};

export function DesktopVendorFilterModal({ visible, onClose, onApply }: DesktopVendorFilterModalProps) {
  const [checkIn, setCheckIn] = useState<string | null>('2026-04-03');
  const [checkOut, setCheckOut] = useState<string | null>('2026-04-05');

  const summary = formatVendorDateSummary(checkIn, checkOut);

  const handleClear = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleApply = () => {
    onApply(checkIn, checkOut);
    onClose();
  };

  return (
    <DesktopVendorDashboardOverlay visible={visible} onClose={onClose} align="right">
      <View style={styles.card}>
        <Text style={styles.title}>{VENDOR_DASHBOARD_COPY.filterByDates}</Text>

        <DesktopVendorRangeCalendar
          variant="filter"
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          initialMonth="2026-04-01"
          padding={24}
        />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>{summary || 'Select dates'}</Text>
          <Pressable onPress={handleClear} accessibilityRole="button">
            <Text style={styles.clearText}>{VENDOR_DASHBOARD_COPY.clearSelectionDesktop}</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.applyBtn, !checkIn && styles.applyBtnDisabled]}
          onPress={handleApply}
          disabled={!checkIn}
          accessibilityRole="button"
        >
          <Text style={styles.applyBtnText}>{VENDOR_DASHBOARD_COPY.applyFilter}</Text>
        </Pressable>
      </View>
    </DesktopVendorDashboardOverlay>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 342,
    maxWidth: '100%',
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: 18,
    gap: 32,
    ...Platform.select({
      web: { boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.1)' },
    }),
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: '#0F1A20',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  summaryText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: FIGMA_SUMMARY,
  },
  clearText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_CLEAR,
    textDecorationLine: 'underline',
  },
  applyBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: FIGMA_PINK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  applyBtnDisabled: {
    opacity: 0.5,
  },
  applyBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: colors.surface.white,
  },
});
