import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  PressableStateCallbackType,
  ActivityIndicator,
} from 'react-native';
import { componentTokens, semanticColors, spacing, radius } from '@/constants/DesignSystem';
import { useColorScheme } from '@/components/useColorScheme';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  /**
   * Icon element to display
   */
  icon: React.ReactNode;
  /**
   * Button variant style
   * @default 'ghost'
   */
  variant?: IconButtonVariant;
  /**
   * Button size
   * @default 'md'
   */
  size?: IconButtonSize;
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
   * Accessibility label (required for icon-only buttons)
   */
  accessibilityLabel: string;
  /**
   * Additional styles for the button container
   */
  style?: object;
  /**
   * Icon color override
   */
  iconColor?: string;
}

/**
 * IconButton Component
 * 
 * An icon-only button component:
 * - Square touch target (min 44x44px)
 * - Multiple variants and sizes
 * - Loading state support
 * - Accessible with required label
 * 
 * @example
 * <IconButton
 *   icon={<Icon name="heart" />}
 *   variant="ghost"
 *   accessibilityLabel="Add to favorites"
 *   onPress={handleFavorite}
 * />
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
  style,
  iconColor,
}: IconButtonProps) {
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? 'light'];

  const isDisabled = disabled || loading;

  // Size-based styles
  const sizeStyles = {
    sm: {
      minWidth: 36,
      minHeight: 36,
      padding: spacing.xs,
    },
    md: {
      minWidth: componentTokens.iconButton.minSize,
      minHeight: componentTokens.iconButton.minSize,
      padding: componentTokens.iconButton.padding,
    },
    lg: {
      minWidth: 52,
      minHeight: 52,
      padding: spacing.lg,
    },
  };

  const getVariantStyles = (pressed: boolean) => {
    const baseStyles = {
      borderRadius: radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
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

  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (isDisabled && variant !== 'outline' && variant !== 'ghost') {
      return colors.text.tertiary;
    }

    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'secondary':
        return colors.text.primary;
      case 'outline':
      case 'ghost':
        return isDisabled ? colors.text.tertiary : colors.primary.main;
      default:
        return colors.text.primary;
    }
  };

  const pressableStyle = ({ pressed }: PressableStateCallbackType) => [
    getVariantStyles(pressed),
    sizeStyles[size],
    style,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
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
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.text.inverse : colors.primary.main}
        />
      ) : (
        <View>
          {React.isValidElement(icon) && (iconColor || variant !== 'ghost')
            ? React.cloneElement(icon as React.ReactElement<any>, {
                color: getIconColor(),
              })
            : icon}
        </View>
      )}
    </Pressable>
  );
}
