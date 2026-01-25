import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, components } from '@/constants/DesignTokens';

export interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  error?: boolean;
  variant?: 'default' | 'search';
  showSearchIcon?: boolean; // For search variant
}

/**
 * Input component extracted from Figma Login and Signup screens
 * Extended for Resorts screen
 * 
 * Used for: "Phone number", "Full name", "E mail" fields
 * Resorts screen: "Find resorts, rooms, etc.." search field
 * 
 * Variants:
 * - default: Standard input (Login/Signup screens)
 * - search: Search input with icon support (Resorts screen)
 * 
 * Styling:
 * - White background
 * - Light gray border (1px)
 * - Rounded corners (8-12px)
 * - Consistent height (48px)
 * - Placeholder text in light gray
 */
export const Input: React.FC<InputProps> = ({
  containerStyle,
  style,
  error = false,
  variant = 'default',
  showSearchIcon = false,
  placeholderTextColor = colors.text.placeholder,
  ...textInputProps
}) => {
  const isSearch = variant === 'search' || showSearchIcon;

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[
          styles.input,
          isSearch && styles.inputSearch,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={placeholderTextColor}
        {...textInputProps}
      />
      {isSearch && (
        <View style={styles.searchIconContainer}>
          <Ionicons 
            name="search" 
            size={components.searchInput.iconSize} 
            color={colors.text.caption}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  input: {
    height: components.input.height,
    backgroundColor: colors.surface.white,
    borderWidth: components.input.borderWidth,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    paddingHorizontal: components.input.padding.horizontal,
    paddingVertical: components.input.padding.vertical,
    fontSize: 16, // Typography/3
    fontFamily: 'poppins',
    fontWeight: '400',
    color: colors.text.primary,
  },
  inputSearch: {
    borderRadius: borderRadius.xl, // More rounded for search
    paddingRight: components.searchInput.iconSize + components.searchInput.iconPadding, // Space for icon
  },
  inputError: {
    borderColor: colors.primary,
  },
  searchIconContainer: {
    position: 'absolute',
    right: components.searchInput.iconPadding,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
