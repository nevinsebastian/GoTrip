import { colors, spacing, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type VendorDocTypePickerSheetProps = {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export function VendorDocTypePickerSheet({
  visible,
  title,
  options,
  selected,
  onClose,
  onSelect,
}: VendorDocTypePickerSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <View style={styles.options}>
            {options.map((option) => {
              const isSelected = option === selected;
              return (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => onSelect(option)}
                  accessibilityRole="button"
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option}
                  </Text>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent.main} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['6'],
    gap: spacing['3'],
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.15)',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  options: { gap: 8 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: 12,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  optionRowSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  optionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  optionPressed: { opacity: 0.85 },
});
