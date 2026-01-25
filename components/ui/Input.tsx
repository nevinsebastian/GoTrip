import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Platform,
  TextInputProps,
  Pressable,
} from 'react-native';
import { componentTokens, semanticColors, spacing, radius } from '@/constants/DesignSystem';
import { useColorScheme } from '@/components/useColorScheme';

export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Input label text
   */
  label?: string;
  /**
   * Helper text displayed below input
   */
  helperText?: string;
  /**
   * Error message (overrides helperText when provided)
   */
  error?: string;
  /**
   * Input variant style
   * @default 'default'
   */
  variant?: InputVariant;
  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon element (e.g., clear button, password toggle)
   */
  rightIcon?: React.ReactNode;
  /**
   * Whether input is required
   * @default false
   */
  required?: boolean;
  /**
   * Container style
   */
  containerStyle?: object;
  /**
   * Input style override
   */
  inputStyle?: object;
  /**
   * Full width input
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * Input Component
 * 
 * A text input component with:
 * - Label and helper text support
 * - Error state handling
 * - Icon support (left/right)
 * - Accessible touch targets
 * - Web keyboard navigation
 * 
 * @example
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 *   autoCapitalize="none"
 * />
 */
export function Input({
  label,
  helperText,
  error,
  variant = 'default',
  leftIcon,
  rightIcon,
  required = false,
  containerStyle,
  inputStyle,
  fullWidth = true,
  editable = true,
  ...textInputProps
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);

  const effectiveVariant: InputVariant = error ? 'error' : variant;
  const displayHelperText = error || helperText;

  const getBorderColor = () => {
    if (!editable) return colors.border;
    if (effectiveVariant === 'error') return colors.error;
    if (effectiveVariant === 'success') return colors.success;
    if (isFocused) return colors.primary.main;
    return colors.border;
  };

  const getTextColor = () => {
    if (!editable) return colors.text.tertiary;
    return colors.text.primary;
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: colors.text.primary,
              },
            ]}
          >
            {label}
            {required && (
              <Text
                style={{
                  color: colors.error,
                }}
              >
                {' '}
                *
              </Text>
            )}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: editable ? colors.background : colors.surface,
            minHeight: componentTokens.input.minHeight,
            ...(Platform.OS === 'web' && { outlineStyle: 'none' as any }),
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer} pointerEvents="none">
            {leftIcon}
          </View>
        )}

        <TextInput
          {...textInputProps}
          editable={editable}
          style={[
            styles.input,
            {
              color: getTextColor(),
              fontSize: componentTokens.input.fontSize,
              paddingLeft: leftIcon ? spacing.sm : spacing.lg,
              paddingRight: rightIcon ? spacing.sm : spacing.lg,
              ...(Platform.OS === 'web' && { outlineStyle: 'none' as any }),
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          accessibilityLabel={label || textInputProps.accessibilityLabel}
          accessibilityState={{ disabled: !editable }}
          // Web-specific props
          {...(Platform.OS === 'web' && {
            tabIndex: editable ? 0 : -1,
          })}
        />

        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {displayHelperText && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? colors.error : colors.text.secondary,
            },
          ]}
        >
          {displayHelperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: componentTokens.input.borderWidth,
    borderRadius: componentTokens.input.borderRadius,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  leftIconContainer: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
