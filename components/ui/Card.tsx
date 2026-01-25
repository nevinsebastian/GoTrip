import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Platform } from 'react-native';
import { componentTokens, semanticColors, shadows, spacing, radius } from '@/constants/DesignSystem';
import { useColorScheme } from '@/components/useColorScheme';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Card variant style
   * @default 'default'
   */
  variant?: CardVariant;
  /**
   * Whether card is pressable
   * @default false
   */
  pressable?: boolean;
  /**
   * Callback fired when card is pressed (requires pressable=true)
   */
  onPress?: () => void;
  /**
   * Additional container styles
   */
  style?: ViewStyle;
  /**
   * Padding override
   */
  padding?: number;
  /**
   * Border radius override
   */
  borderRadius?: number;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Full width card
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Card Component
 * 
 * A container component for grouping related content:
 * - Multiple variants (default, elevated, outlined)
 * - Optional pressable behavior
 * - Consistent spacing and radius
 * - Accessible touch targets
 * 
 * @example
 * <Card variant="elevated">
 *   <Text>Card content</Text>
 * </Card>
 */
export function Card({
  children,
  variant = 'default',
  pressable = false,
  onPress,
  style,
  padding,
  borderRadius,
  accessibilityLabel,
  fullWidth = false,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? 'light'];

  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      padding: padding ?? componentTokens.card.padding,
      borderRadius: borderRadius ?? componentTokens.card.borderRadius,
      backgroundColor: colors.surface,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          ...shadows.md,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: componentTokens.card.borderWidth,
          borderColor: colors.border,
        };
      case 'default':
      default:
        return baseStyles;
    }
  };

  const containerStyle = [
    getVariantStyles(),
    fullWidth && styles.fullWidth,
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          containerStyle,
          pressed && {
            opacity: 0.8,
          },
        ]}
        // Web-specific props
        {...(Platform.OS === 'web' && {
          onKeyDown: (e: any) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPress?.();
            }
          },
          tabIndex: 0,
        })}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});
