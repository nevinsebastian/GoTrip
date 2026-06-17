import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type VendorStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  variant?: 'default' | 'pill';
};

export function VendorStepper({
  value,
  min = 0,
  max = 99,
  onChange,
  variant = 'default',
}: VendorStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));
  const isPill = variant === 'pill';

  return (
    <View style={[styles.wrap, isPill && styles.wrapPill]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          isPill && styles.buttonPill,
          pressed && styles.pressed,
        ]}
        onPress={decrement}
        disabled={value <= min}
        accessibilityRole="button"
      >
        <Ionicons
          name="remove"
          size={14}
          color={value <= min ? 'rgba(232, 84, 51, 0.35)' : colors.accent.main}
        />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          isPill && styles.buttonPill,
          pressed && styles.pressed,
        ]}
        onPress={increment}
        disabled={value >= max}
        accessibilityRole="button"
      >
        <Ionicons
          name="add"
          size={14}
          color={value >= max ? 'rgba(232, 84, 51, 0.35)' : colors.accent.main}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wrapPill: {
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 4,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  buttonPill: {
    width: 24,
    height: 24,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  value: {
    minWidth: 18,
    textAlign: 'center',
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  pressed: { opacity: 0.85 },
});
