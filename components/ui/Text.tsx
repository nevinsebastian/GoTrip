import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, semanticColors, FontSize, FontWeight } from '@/constants/DesignSystem';
import { useColorScheme } from '@/components/useColorScheme';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'error' | 'success' | 'warning';

export interface TextProps extends RNTextProps {
  /**
   * Text variant (predefined typography styles)
   */
  variant?: TextVariant;
  /**
   * Text color variant
   * @default 'primary'
   */
  color?: TextColor;
  /**
   * Font size override
   */
  size?: FontSize;
  /**
   * Font weight override
   */
  weight?: FontWeight;
  /**
   * Whether text should be bold
   * @default false
   */
  bold?: boolean;
  /**
   * Whether text should be semibold
   * @default false
   */
  semibold?: boolean;
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Number of lines (truncates with ellipsis)
   */
  numberOfLines?: number;
}

/**
 * Text Component
 * 
 * Enhanced text component with:
 * - Typography variants (h1-h6, body, caption, label)
 * - Semantic color system
 * - Consistent font sizing and weights
 * - Accessibility support
 * 
 * @example
 * <Text variant="h1" color="primary">
 *   Welcome
 * </Text>
 */
export function Text({
  variant = 'body',
  color = 'primary',
  size,
  weight,
  bold = false,
  semibold = false,
  align,
  numberOfLines,
  style,
  ...props
}: TextProps) {
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? 'light'];

  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize['4xl'],
          lineHeight: typography.lineHeight['4xl'],
          fontWeight: typography.fontWeight.bold,
        };
      case 'h2':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize['3xl'],
          lineHeight: typography.lineHeight['3xl'],
          fontWeight: typography.fontWeight.bold,
        };
      case 'h3':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize['2xl'],
          lineHeight: typography.lineHeight['2xl'],
          fontWeight: typography.fontWeight.bold,
        };
      case 'h4':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize.xl,
          lineHeight: typography.lineHeight.xl,
          fontWeight: typography.fontWeight.semibold,
        };
      case 'h5':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize.lg,
          lineHeight: typography.lineHeight.lg,
          fontWeight: typography.fontWeight.semibold,
        };
      case 'h6':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize.base,
          lineHeight: typography.lineHeight.base,
          fontWeight: typography.fontWeight.semibold,
        };
      case 'body':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize.base,
          lineHeight: typography.lineHeight.base,
          fontWeight: typography.fontWeight.regular,
        };
      case 'caption':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize.sm,
          lineHeight: typography.lineHeight.sm,
          fontWeight: typography.fontWeight.regular,
        };
      case 'label':
        return {
          fontSize: size ? typography.fontSize[size] : typography.fontSize.sm,
          lineHeight: typography.lineHeight.sm,
          fontWeight: typography.fontWeight.medium,
        };
      default:
        return {
          fontSize: typography.fontSize.base,
          lineHeight: typography.lineHeight.base,
          fontWeight: typography.fontWeight.regular,
        };
    }
  };

  const getColor = () => {
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'tertiary':
        return colors.text.tertiary;
      case 'inverse':
        return colors.text.inverse;
      case 'error':
        return colors.error;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.text.primary;
    }
  };

  const getFontWeight = () => {
    if (weight) return typography.fontWeight[weight];
    if (bold) return typography.fontWeight.bold;
    if (semibold) return typography.fontWeight.semibold;
    return getVariantStyles().fontWeight;
  };

  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily: typography.fontFamily.regular,
          color: getColor(),
          ...getVariantStyles(),
          fontWeight: getFontWeight(),
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    />
  );
}
