import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export function PillButton({
  label,
  onPress,
  variant = 'dark',
  fontSize = 12,
  height = 34,
  showArrow = true,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'dark' | 'white' | 'outline';
  fontSize?: number;
  height?: number;
  showArrow?: boolean;
}) {
  const isDark = variant === 'dark';
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          height,
          paddingLeft: isDark ? 12 : 18,
          paddingRight: 4,
          backgroundColor: isDark
            ? colors.text.primary
            : isOutline
              ? 'transparent'
              : colors.surface.white,
          borderWidth: isOutline ? 1 : 1,
          borderColor: isOutline ? colors.accent.main : isDark ? colors.text.primary : '#FFFFFF',
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize,
            color: isDark
              ? '#FCFCFC'
              : isOutline
                ? colors.accent.main
                : colors.text.primary,
          },
        ]}
      >
        {label}
      </Text>
      {showArrow ? (
        <View
          style={[
            styles.iconCircle,
            {
              width: height - 8,
              height: height - 8,
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(28, 32, 36, 0.2)',
            },
          ]}
        >
          <Ionicons
            name="arrow-up"
            size={Math.max(8, fontSize - 4)}
            color={isDark ? '#FFFFFF' : colors.text.primary}
            style={{ transform: [{ rotate: '45deg' }] }}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    borderRadius: 9999,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.04,
  },
  iconCircle: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
