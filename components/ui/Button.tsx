import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle, ActivityIndicator, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, spacing, borderRadius, components, shadows } from '@/constants/DesignTokens';
import { useResponsive } from './useResponsive';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'outline' | 'outlineSoft' | 'link' | 'category' | 'navSelected' | 'navUnselected';
  size?: 'compact' | 'default' | 'large';
  children: React.ReactNode;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  // Resorts screen variants
  icon?: keyof typeof Ionicons.glyphMap; // For link variant (right icon) and nav variants
  iconPosition?: 'left' | 'right'; // For link variant
  categoryIcon?: React.ReactNode; // For category variant (image/icon component)
  leftAdornment?: React.ReactNode; // For outline/outlineSoft buttons (Login social icons)
}

/**
 * Button component extracted from Figma Login and Signup screens
 * Extended for Resorts screen
 * 
 * Variants:
 * - primary: Solid background button (e.g., "Get OTP" in Signup screen)
 * - outline: White background with border (e.g., "Log in with mail", social buttons)
 * - link: Text link with optional icon (e.g., "View all" in Resorts screen)
 * - category: Icon/image + label vertical layout (e.g., category filter items)
 * - navSelected: Pill background with icon + text (e.g., selected "Home" nav item)
 * - navUnselected: Icon only, no background (e.g., unselected nav items)
 * 
 * Note: The Login screen shows a gray gradient for "Get OTP" which may indicate
 * a disabled state. The Signup screen shows a solid red primary button.
 * We implement the active primary state as solid red, and gray as disabled.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  children,
  style,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  categoryIcon,
  leftAdornment,
  ...pressableProps
}) => {
  const isDisabled = disabled || loading;
  const { isMobile } = useResponsive();
  const height =
    size === 'compact'
      ? components.button.height['2']
      : size === 'large'
        ? components.button.height.large
        : components.button.height.default;

  // Special handling for variants that don't use standard height
  const useStandardHeight = !['link', 'category', 'navSelected', 'navUnselected'].includes(variant);

  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    ...(useStandardHeight ? [{ height }] : []),
    ...(isDisabled ? [styles.disabled] : []),
    ...(style ? [style] : []),
  ];

  // Render content based on variant
  const renderContent = () => {
    if (loading && variant !== 'link') {
      return (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'navSelected' ? colors.surface.white : colors.primary}
          size="small"
        />
      );
    }

    switch (variant) {
      case 'link':
        return (
          <View style={styles.linkContent}>
            <Text variant="link" color="primaryBrand">
              {children}
            </Text>
            {icon && (
              <Ionicons 
                name={icon} 
                size={16} 
                color={colors.primary} 
                style={iconPosition === 'right' ? styles.linkIconRight : styles.linkIconLeft}
              />
            )}
          </View>
        );

      case 'category':
        return (
          <View style={styles.categoryContent}>
            <View style={[
              styles.categoryIconContainer,
              isMobile && { maxWidth: components.categoryItem.maxWidth },
            ]}>
              {categoryIcon}
            </View>
            <Text variant="caption" color="primary" style={styles.categoryLabel}>
              {children}
            </Text>
          </View>
        );

      case 'navSelected':
        return (
          <View style={styles.navSelectedContent}>
            {icon && (
              <Ionicons 
                name={icon} 
                size={components.bottomNav.iconSize} 
                color={colors.surface.white}
                style={styles.navIcon}
              />
            )}
            <Text variant="body" style={{ color: colors.surface.white }}>
              {children}
            </Text>
          </View>
        );

      case 'navUnselected':
        return icon ? (
          <Ionicons 
            name={icon} 
            size={components.bottomNav.iconSize} 
            color={colors.primary}
          />
        ) : null;

      default:
        const textVariant = size === 'compact' ? 'bodyMedium' : 'bodySemibold';
        const isSolid = variant === 'primary' || variant === 'navSelected';
        const textColor = isSolid
          ? (isDisabled ? colors.text.secondary : colors.surface.white)
          : (isDisabled ? colors.text.caption : colors.primary);

        // Outline buttons in Login have left icons and tighter height.
        const withLeftAdornment = (variant === 'outline' || variant === 'outlineSoft') && leftAdornment;

        return (
          <View style={withLeftAdornment ? styles.rowContent : undefined}>
            {withLeftAdornment ? <View style={styles.leftAdornment}>{leftAdornment}</View> : null}
            <Text variant={textVariant} style={{ color: textColor }}>
              {children}
            </Text>
          </View>
        );
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && !isDisabled && styles.pressed,
      ]}
      disabled={isDisabled}
      {...pressableProps}
    >
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  primary: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: components.button.padding.horizontal,
    paddingVertical: components.button.padding.vertical,
    minHeight: components.button.height.default,
    backgroundColor: colors.primary,
    ...Platform.select({
      ios: shadows.button,
      android: { elevation: shadows.button.elevation } as ViewStyle,
      web: shadows.button,
    }),
  },
  outline: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: components.button.padding.horizontal,
    paddingVertical: components.button.padding.vertical,
    minHeight: components.button.height.default,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...Platform.select({
      ios: shadows.button,
      android: { elevation: shadows.button.elevation } as ViewStyle,
      web: shadows.button,
    }),
  },
  // Login/Signup social buttons (from Figma): accent-surface bg, accent-alpha border, radius 4, height 32.
  outlineSoft: {
    borderRadius: borderRadius['2'],
    paddingHorizontal: spacing['3'],
    paddingVertical: 0,
    minHeight: components.button.height['2'],
    backgroundColor: colors.accent.surface,
    borderWidth: 1,
    borderColor: colors.accent.alpha['7'],
  },
  link: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 'auto',
  },
  category: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 0,
    minHeight: 'auto',
    // Width handled dynamically - maxWidth on mobile, flexible on larger screens
    // Category items should be used in horizontal ScrollView on mobile
    // and in grid/flex layouts on tablet/desktop
  },
  navSelected: {
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: components.bottomNav.selectedPillPadding.horizontal,
    paddingVertical: components.bottomNav.selectedPillPadding.vertical,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 'auto',
  },
  navUnselected: {
    backgroundColor: 'transparent',
    padding: spacing.xs,
    minWidth: 44, // Touch target
    minHeight: 44,
  },
  disabled: {
    backgroundColor: colors.neutral['9'],
    borderColor: colors.border.light,
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftAdornment: {
    marginRight: spacing['2'],
  },
  // Link variant styles
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIconRight: {
    marginLeft: spacing.xs,
  },
  linkIconLeft: {
    marginRight: spacing.xs,
  },
  // Category variant styles
  categoryContent: {
    alignItems: 'center',
    width: '100%',
  },
  categoryIconContainer: {
    width: components.categoryItem.iconSize,
    height: components.categoryItem.iconSize,
    borderRadius: borderRadius.lg,
    marginBottom: components.categoryItem.labelSpacing,
    overflow: 'hidden',
  },
  categoryLabel: {
    textAlign: 'center',
  },
  // Nav selected variant styles
  navSelectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: spacing.xs,
  },
});
