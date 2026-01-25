import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { semanticColors, spacing } from '@/constants/DesignSystem';
import { useColorScheme } from '@/components/useColorScheme';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /**
   * Divider orientation
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * Divider thickness
   * @default 1
   */
  thickness?: number;
  /**
   * Spacing around divider (margin)
   */
  spacing?: number;
  /**
   * Vertical spacing (for horizontal dividers)
   */
  verticalSpacing?: number;
  /**
   * Horizontal spacing (for vertical dividers)
   */
  horizontalSpacing?: number;
  /**
   * Custom color override
   */
  color?: string;
  /**
   * Additional styles
   */
  style?: ViewStyle;
  /**
   * Full width (horizontal) or full height (vertical)
   * @default true
   */
  fullLength?: boolean;
}

/**
 * Divider Component
 * 
 * A simple divider/separator component:
 * - Horizontal or vertical orientation
 * - Configurable spacing and thickness
 * - Adapts to color scheme
 * 
 * @example
 * <Divider spacing={16} />
 * <Divider orientation="vertical" horizontalSpacing={8} />
 */
export function Divider({
  orientation = 'horizontal',
  thickness = 1,
  spacing: spacingProp,
  verticalSpacing,
  horizontalSpacing,
  color,
  style,
  fullLength = true,
}: DividerProps) {
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? 'light'];

  const dividerColor = color || colors.border;

  const getSpacing = () => {
    if (spacingProp !== undefined) {
      return {
        marginVertical: orientation === 'horizontal' ? spacingProp : 0,
        marginHorizontal: orientation === 'vertical' ? spacingProp : 0,
      };
    }

    return {
      marginVertical: orientation === 'horizontal' ? verticalSpacing ?? spacing.md : 0,
      marginHorizontal: orientation === 'vertical' ? horizontalSpacing ?? spacing.md : 0,
    };
  };

  const dividerStyle: ViewStyle = {
    backgroundColor: dividerColor,
    ...(orientation === 'horizontal'
      ? {
          width: fullLength ? '100%' : undefined,
          height: thickness,
        }
      : {
          height: fullLength ? '100%' : undefined,
          width: thickness,
        }),
    ...getSpacing(),
  };

  return <View style={[dividerStyle, style]} accessibilityRole="none" />;
}
