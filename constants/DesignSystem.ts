/**
 * Design System Constants
 * 
 * This file defines the design tokens that should match your Figma design system.
 * Update these values to match your Figma specifications exactly.
 * 
 * Based on Radix UI principles:
 * - Consistent spacing scale
 * - Accessible color contrast
 * - Typography hierarchy
 * - Border radius system
 */

// Spacing scale (4px base unit - common in design systems)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// Border radius scale
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    // Update with your Figma font families
    regular: 'System', // iOS: San Francisco, Android: Roboto
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
    '5xl': 56,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

// Color palette - Update these to match your Figma design
// Following Radix UI color principles with semantic naming
export const colors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Neutral grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  // Base colors
  white: '#ffffff',
  black: '#000000',
} as const;

// Semantic color mappings for light/dark mode
export const semanticColors = {
  light: {
    background: colors.white,
    surface: colors.neutral[50],
    border: colors.neutral[200],
    neutral: colors.neutral, // Expose neutral colors for component use
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[500],
      inverse: colors.white,
    },
    primary: {
      main: colors.primary[500],
      hover: colors.primary[600],
      pressed: colors.primary[700],
      disabled: colors.neutral[300],
    },
    error: colors.error[500],
    success: colors.success[500],
    warning: colors.warning[500],
  },
  dark: {
    background: colors.neutral[900],
    surface: colors.neutral[800],
    border: colors.neutral[700],
    neutral: colors.neutral, // Expose neutral colors for component use
    text: {
      primary: colors.white,
      secondary: colors.neutral[400],
      tertiary: colors.neutral[500],
      inverse: colors.neutral[900],
    },
    primary: {
      main: colors.primary[400],
      hover: colors.primary[300],
      pressed: colors.primary[500],
      disabled: colors.neutral[700],
    },
    error: colors.error[500],
    success: colors.success[500],
    warning: colors.warning[500],
  },
} as const;

// Component-specific tokens
export const componentTokens = {
  // Button
  button: {
    minHeight: 44, // Minimum touch target (accessibility)
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  // Input
  input: {
    minHeight: 44, // Minimum touch target
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
  },
  // Card
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  // IconButton
  iconButton: {
    minSize: 44, // Minimum touch target
    padding: spacing.md,
    borderRadius: radius.md,
  },
} as const;

// Shadow tokens (for elevation on mobile)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
