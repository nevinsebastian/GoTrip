import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VENDOR_ONBOARDING } from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type VendorUploadOptionsSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (source: 'camera' | 'gallery' | 'files') => void;
  title?: string;
  subtitle?: string;
};

export function VendorUploadOptionsSheet({
  visible,
  onClose,
  onSelect,
  title = 'Upload document',
  subtitle = 'Choose how you want to add your file',
}: VendorUploadOptionsSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.options}>
            {VENDOR_ONBOARDING.uploadOptions.map((option) => (
              <Pressable
                key={option.id}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
                onPress={() => onSelect(option.id as 'camera' | 'gallery' | 'files')}
                accessibilityRole="button"
              >
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={20} color={colors.text.primary} />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(28, 32, 36, 0.35)" />
              </Pressable>
            ))}
          </View>
          <Pressable
            style={({ pressed }) => [styles.cancelButton, pressed && styles.optionPressed]}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
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
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  options: { gap: 8 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: 12,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(28, 32, 36, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  optionPressed: { opacity: 0.85 },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3'],
  },
  cancelText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
});
