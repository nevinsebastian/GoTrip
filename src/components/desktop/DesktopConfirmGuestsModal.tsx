import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const SPECS = DESKTOP_HERO_SPECS;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type DesktopConfirmGuestsModalProps = {
  adults: number;
  children: number;
  infants: number;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onInfantsChange: (n: number) => void;
  onClose: () => void;
  onBack: () => void;
  onSave: () => void;
};

function StepperRow({
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
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSub}>{sublabel}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable onPress={() => onChange(clamp(value - 1, min, 10))} hitSlop={10}>
          <Ionicons name="remove" size={16} color={SPECS.accent} />
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable onPress={() => onChange(clamp(value + 1, min, 10))} hitSlop={10}>
          <Ionicons name="add" size={16} color={SPECS.accent} />
        </Pressable>
      </View>
    </View>
  );
}

export function DesktopConfirmGuestsModal({
  adults,
  children,
  infants,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onClose,
  onBack,
  onSave,
}: DesktopConfirmGuestsModalProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Guest details</Text>
        <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
          <Ionicons name="close" size={22} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.list}>
        <StepperRow label="Adults" sublabel="Age 13+" value={adults} min={1} onChange={onAdultsChange} />
        <StepperRow
          label="Children"
          sublabel="Age 2-12"
          value={children}
          min={0}
          onChange={onChildrenChange}
        />
        <StepperRow label="Infants" sublabel="Under 2" value={infants} min={0} onChange={onInfantsChange} />
      </View>

      <View style={styles.summaryRow}>
        <Pressable onPress={onBack} accessibilityLabel="Back to dates">
          <Text style={styles.clearText}>Change dates</Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveBtn} onPress={onSave} accessibilityLabel="Save guests">
        <Text style={styles.saveBtnText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: 24,
    gap: 24,
    ...Platform.select({
      web: { boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)' },
      default: { elevation: 10 },
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
  list: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    gap: 4,
  },
  rowLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  rowSub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stepperValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  saveBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
