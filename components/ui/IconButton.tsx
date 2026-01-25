import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/DesignTokens';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

/**
 * IconButton component extracted from Figma Login and Signup screens
 * 
 * Used for: Back arrow in header
 * 
 * Styling:
 * - Primary brand color
 * - Touch-friendly size (44x44px minimum)
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 24,
  color = colors.primary,
  style,
  onPress,
  ...pressableProps
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      {...pressableProps}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
});
