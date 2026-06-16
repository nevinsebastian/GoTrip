import { colors, spacing, typography } from '@/constants/DesignTokens';
import type { VendorPlaceType, VendorSpaceType } from '@/src/constants/vendorPropertyConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type VendorPropertyOptionSheetProps = {
  visible: boolean;
  title: string;
  options: VendorPlaceType[] | VendorSpaceType[];
  selectedId: string;
  showThumbnails?: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function VendorPropertyOptionSheet({
  visible,
  title,
  options,
  selectedId,
  showThumbnails = false,
  onClose,
  onSelect,
}: VendorPropertyOptionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <View style={styles.options}>
            {options.map((option) => {
              const selected = option.id === selectedId;
              const placeOption = showThumbnails ? (option as VendorPlaceType) : null;
              return (
                <Pressable
                  key={option.id}
                  style={({ pressed }) => [
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onSelect(option.id)}
                  accessibilityRole="button"
                >
                  {placeOption ? (
                    <Image source={placeOption.thumbnail} style={styles.thumbnail} resizeMode="cover" />
                  ) : null}
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  {selected ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent.main} />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="rgba(28, 32, 36, 0.35)" />
                  )}
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
    maxHeight: '75%',
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
  options: { gap: 10 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: 12,
    padding: spacing['3'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  optionRowSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  thumbnail: {
    width: 56,
    height: 40,
    borderRadius: 8,
  },
  optionLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  pressed: { opacity: 0.85 },
});
