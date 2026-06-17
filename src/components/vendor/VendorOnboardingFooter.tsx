import { colors, spacing, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type VendorOnboardingFooterProps = {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextSuffix?: string;
  isNextLoading?: boolean;
  nextFlex?: number;
  nextDisabled?: boolean;
};

export function VendorOnboardingFooter({
  onBack,
  onNext,
  nextLabel,
  nextSuffix,
  isNextLoading,
  nextFlex = 1.6,
  nextDisabled = false,
}: VendorOnboardingFooterProps) {
  return (
    <View style={styles.footer}>
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        onPress={onBack}
        accessibilityRole="button"
      >
        <View style={styles.backIcon}>
          <Ionicons name="arrow-back" size={14} color={colors.accent.main} />
        </View>
        <Text style={styles.backText}>Go back</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          { flex: nextFlex },
          pressed && !nextDisabled && styles.pressed,
          (isNextLoading || nextDisabled) && styles.disabled,
        ]}
        onPress={onNext}
        disabled={isNextLoading || nextDisabled}
        accessibilityRole="button"
      >
        {isNextLoading ? (
          <ActivityIndicator color={colors.surface.white} size="small" />
        ) : (
          <Text style={styles.nextText} numberOfLines={2}>
            {nextLabel}
            {nextSuffix ? (
              <Text style={styles.nextChevron}>
                {' '}
                {'>'} {nextSuffix}
              </Text>
            ) : null}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    paddingTop: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
    paddingHorizontal: spacing['2'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  backIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  nextButton: {
    height: 48,
    borderRadius: 28,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  nextText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
  },
  nextChevron: {
    fontWeight: typography.fontWeight.bold,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.7 },
});
