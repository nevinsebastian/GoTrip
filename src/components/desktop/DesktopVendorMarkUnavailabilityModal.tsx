import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorDashboardOverlay } from '@/src/components/desktop/DesktopVendorDashboardOverlay';
import {
  DesktopVendorRangeCalendar,
  formatVendorDateSummary,
} from '@/src/components/desktop/DesktopVendorRangeCalendar';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_PROPERTIES,
} from '@/src/constants/vendorDashboardConstants';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

const FIGMA_TITLE = '#0F1A20';
const FIGMA_PROPERTY_BG = '#0F1A20';
const FIGMA_MARK_RED = '#D72626';
const FIGMA_CLEAR_RED = '#D72626';

type DesktopVendorMarkUnavailabilityModalProps = {
  visible: boolean;
  propertyId: string;
  onPropertyChange: (id: string) => void;
  onClose: () => void;
};

export function DesktopVendorMarkUnavailabilityModal({
  visible,
  propertyId,
  onPropertyChange,
  onClose,
}: DesktopVendorMarkUnavailabilityModalProps) {
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [entireProperty, setEntireProperty] = useState(false);
  const [roomCount, setRoomCount] = useState(2);
  const [checkIn, setCheckIn] = useState<string | null>('2026-04-03');
  const [checkOut, setCheckOut] = useState<string | null>('2026-04-05');

  const activeProperty =
    VENDOR_DASHBOARD_PROPERTIES.find((p) => p.id === propertyId) ?? VENDOR_DASHBOARD_PROPERTIES[0];
  const summary = formatVendorDateSummary(checkIn, checkOut);

  const handleClear = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <>
      <DesktopVendorDashboardOverlay visible={visible} onClose={onClose}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{VENDOR_DASHBOARD_COPY.markUnavailabilityFor}</Text>
            <Pressable
              style={styles.propertySelect}
              onPress={() => setPropertyOpen(true)}
              accessibilityRole="button"
            >
              <Text style={styles.propertySelectText} numberOfLines={1}>
                {activeProperty.label}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.surface.white} />
            </Pressable>
          </View>

          <View style={styles.bodyRow}>
            <View style={styles.calendarCol}>
              <DesktopVendorRangeCalendar
                variant="mark"
                checkIn={checkIn}
                checkOut={checkOut}
                onCheckInChange={setCheckIn}
                onCheckOutChange={setCheckOut}
                initialMonth="2026-04-01"
              />
            </View>

            <View style={styles.optionsCol}>
              <View style={styles.optionBlock}>
                <Text style={styles.optionLabel}>{VENDOR_DASHBOARD_COPY.entireProperty}</Text>
                <Switch
                  value={entireProperty}
                  onValueChange={setEntireProperty}
                  trackColor={{ false: 'rgba(15, 26, 32, 0.2)', true: FIGMA_TITLE }}
                  thumbColor={colors.surface.white}
                />
              </View>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>{VENDOR_DASHBOARD_COPY.orLabel}</Text>
                <View style={styles.orLine} />
              </View>

              <View style={[styles.optionBlock, entireProperty && styles.optionDisabled]}>
                <Text style={styles.optionLabel}>{VENDOR_DASHBOARD_COPY.numberOfRooms}</Text>
                <View style={styles.stepper}>
                  <Pressable
                    style={styles.stepBtn}
                    disabled={entireProperty || roomCount <= 1}
                    onPress={() => setRoomCount((n) => Math.max(1, n - 1))}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                  <View style={styles.stepValue}>
                    <Text style={styles.stepValueText}>{roomCount}</Text>
                  </View>
                  <Pressable
                    style={styles.stepBtn}
                    disabled={entireProperty}
                    onPress={() => setRoomCount((n) => n + 1)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.footerBlock}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>{summary || 'Select dates'}</Text>
                  <Pressable onPress={handleClear} accessibilityRole="button">
                    <Text style={styles.clearText}>{VENDOR_DASHBOARD_COPY.clearSelectionDesktop}</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={[styles.submitBtn, !checkIn && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={!checkIn}
                  accessibilityRole="button"
                >
                  <Text style={styles.submitBtnText}>{VENDOR_DASHBOARD_COPY.markUnavailability}</Text>
                  <Ionicons name="calendar-outline" size={18} color={colors.surface.white} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </DesktopVendorDashboardOverlay>

      <VendorPropertyOptionSheet
        visible={propertyOpen}
        title="Select property"
        options={VENDOR_DASHBOARD_PROPERTIES.map((p) => ({ id: p.id, label: p.label }))}
        selectedId={propertyId}
        onClose={() => setPropertyOpen(false)}
        onSelect={(id) => {
          onPropertyChange(id);
          setPropertyOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 719,
    maxWidth: '100%',
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: 24,
    gap: 18,
    ...Platform.select({
      web: { boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.1)' },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  propertySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 34,
    maxWidth: 258,
    paddingHorizontal: 12,
    backgroundColor: FIGMA_PROPERTY_BG,
    borderRadius: 8,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  propertySelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 18,
    letterSpacing: 0.24,
    color: colors.surface.white,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
  },
  calendarCol: {
    width: 284,
    minHeight: 312,
    flexShrink: 0,
  },
  optionsCol: {
    flex: 1,
    minWidth: 280,
    justifyContent: 'space-between',
    minHeight: 312,
    gap: 18,
  },
  optionBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(215, 38, 38, 0.05)',
    borderRadius: 12,
    minHeight: 56,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(15, 26, 32, 0.1)',
  },
  orText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: 'rgba(15, 26, 32, 0.4)',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  stepBtn: {
    width: 31,
    height: 31,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.4)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.05)', cursor: 'pointer' as const },
    }),
  },
  stepBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: FIGMA_TITLE,
  },
  stepValue: {
    minWidth: 47,
    height: 31,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.6)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  stepValueText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: FIGMA_TITLE,
  },
  footerBlock: {
    gap: 18,
    marginTop: 'auto' as unknown as number,
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
    color: FIGMA_TITLE,
  },
  clearText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_CLEAR_RED,
    textDecorationLine: 'underline',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    backgroundColor: FIGMA_MARK_RED,
    borderRadius: 12,
    paddingHorizontal: 12,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: colors.surface.white,
  },
});
