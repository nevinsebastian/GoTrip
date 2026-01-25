import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '@/constants/DesignTokens';

export interface DividerProps {
  text?: string;
  style?: object;
}

/**
 * Divider component extracted from Figma Login and Signup screens
 * 
 * Used for: "OR" separator between form and social login buttons
 * 
 * Styling:
 * - Horizontal line with centered text
 * - Light gray line color
 * - Caption text style
 */
export const Divider: React.FC<DividerProps> = ({
  text = 'OR',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text variant="caption" color="caption" style={styles.text}>
        {text}
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  text: {
    marginHorizontal: spacing.md,
  },
});
