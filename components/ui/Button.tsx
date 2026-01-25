import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  PressableStateCallbackType,
} from 'react-native';
import { componentTokens, semanticColors, spacing, radius } from '@/constants/DesignSystem';
import { useColorScheme } from '@/components/useColorScheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /**
   * Button label text
   */
  children: React.ReactNode;
  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether button is in loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Callback fired when button is pressed
   */
  onPress?: () => void;
  /**
   * Accessibility label (if different from children)
   */
  accessibilityLabel?: string;
  /**
   * Additional styles for the button container
   */
  style?: object;
  /**
   * Additional styles for the text
   */
  textStyle?: object;
  /**
   * Whether button should take full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * 
 * A versatile button component following Radix UI principles:
 * - Accessible touch targets (min 44px height)
 * - Multiple variants and sizes
 * - Proper state management (default, pressed, disabled, loading)
 * - Web keyboard navigation support
 * 
 * @example
 * <Button variant="primary" onPress={handlePress}>
 *   Book Now
 * </Button>
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
  style,
  textStyle,
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? 'light'];

  const isDisabled = disabled || loading;

  // Size-based styles
  const sizeStyles = {
    sm: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minHeight: 36,
      fontSize: 14,
    },
    md: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      minHeight: componentTokens.button.minHeight,
      fontSize: 16,
    },
    lg: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      minHeight: 52,
      fontSize: 18,
    },
  };

  const getVariantStyles = (pressed: boolean) => {
    const baseStyles = {
      borderRadius: radius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: spacing.sm,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: pressed
            ? colors.primary.pressed
            : isDisabled
            ? colors.primary.disabled
            : colors.primary.main,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: pressed
            ? colors.neutral[300]
            : isDisabled
            ? colors.neutral[200]
            : colors.neutral[100],
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: pressed
            ? colors.primary.pressed
            : isDisabled
            ? colors.border
            : colors.primary.main,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: pressed ? colors.neutral[100] : 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getTextColor = () => {
    if (isDisabled && variant !== 'outline' && variant !== 'ghost') {
      return colors.text.tertiary;
    }

    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'secondary':
        return colors.text.primary;
      case 'outline':
        return isDisabled ? colors.text.tertiary : colors.primary.main;
      case 'ghost':
        return isDisabled ? colors.text.tertiary : colors.primary.main;
      default:
        return colors.text.primary;
    }
  };

  const pressableStyle = ({ pressed }: PressableStateCallbackType) => [
    getVariantStyles(pressed),
    sizeStyles[size],
    fullWidth && { width: '100%' },
    style,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled }}
      style={pressableStyle}
      // Web-specific props
      {...(Platform.OS === 'web' && {
        onKeyDown: (e: any) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isDisabled && onPress) {
              onPress();
            }
          }
        },
        tabIndex: isDisabled ? -1 : 0,
      })}
    >
      {({ pressed }) => (
        <>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variant === 'primary' ? colors.text.inverse : colors.primary.main}
            />
          ) : (
            <>
              {leftIcon && <View>{leftIcon}</View>}
              <Text
                style={[
                  {
                    color: getTextColor(),
                    fontSize: sizeStyles[size].fontSize,
                    fontWeight: componentTokens.button.fontWeight,
                    textAlign: 'center',
                  },
                  textStyle,
                ]}
              >
                {children}
              </Text>
              {rightIcon && <View>{rightIcon}</View>}
            </>
          )}
        </>
      )}
    </Pressable>
  );
}
