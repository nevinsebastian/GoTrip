import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

type DesktopVendorOnboardingFooterProps = {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextSuffix?: string;
  isNextLoading?: boolean;
  nextDisabled?: boolean;
};

export function DesktopVendorOnboardingFooter({
  onBack,
  onNext,
  nextLabel = 'Next',
  nextSuffix,
  isNextLoading = false,
  nextDisabled = false,
}: DesktopVendorOnboardingFooterProps) {
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
              <Text style={styles.nextSuffix}>
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
    gap: 12,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
    paddingHorizontal: 20,
    flexShrink: 0,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  backIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  nextButton: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  nextText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
  },
  nextSuffix: {
    fontWeight: typography.fontWeight.bold,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.65 },
});
