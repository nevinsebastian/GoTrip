import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, colors } from '@/constants/DesignTokens';

export interface TextProps extends RNTextProps {
  variant?: 'heading1' | 'heading2' | 'body' | 'bodyMedium' | 'bodySemibold' | 'caption' | 'header' | 'screenTitle' | 'sectionTitle' | 'price' | 'ratingValue' | 'link';
  color?: 'primary' | 'secondary' | 'caption' | 'placeholder' | 'primaryBrand';
}

/**
 * Text component with typography variants extracted from Figma designs
 * 
 * Variants:
 * - heading1: Large headings (24px, semibold) - "Welcome Back..", "Welcome to gotripholiday"
 * - heading2: Medium headings (20px, semibold)
 * - header: Header titles (18px, medium) - "Log in", "Sign up"
 * - body: Body text (16px, regular) - Input placeholders, button text
 * - bodyMedium: Medium body text (14px, medium) - "Enter your Phone number."
 * - bodySemibold: Semibold body text (16px, medium) - Button text
 * - caption: Small text (12px, regular) - "You'll get OTP...", "OR"
 * 
 * Resorts Screen Variants:
 * - screenTitle: Screen title (24px, bold) - "Resorts" header
 * - sectionTitle: Section title (18px, bold) - "Suggested for you" etc.
 * - price: Price text (14px, regular) - "₹1199/night"
 * - ratingValue: Rating value (14px, regular) - "4.5"
 * - link: Link text (16px, medium, primary color) - "View all"
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...props
}) => {
  const variantStyle = typography.styles[variant];
  const colorValue = color === 'primaryBrand' 
    ? colors.primary 
    : colors.text[color];

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        { color: colorValue },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.text,
    // React Native will automatically use the correct font weight variant
    // based on the fontWeight property set in variantStyle
  },
});

// Convenience exports for common variants
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading1" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading2" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);
