import React from 'react';
import { View, ViewProps, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, components, shadows } from '@/constants/DesignTokens';
import { useResponsive } from './useResponsive';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'default' | 'none' | 'small' | 'large';
  variant?: 'default' | 'listing'; // Resorts screen: listing variant for resort cards
}

/**
 * Card component extracted from Figma Login and Signup screens
 * Extended for Resorts screen
 * 
 * Variants:
 * - default: Main content container for forms (Login/Signup screens)
 * - listing: Resort listing card (Resorts screen)
 * 
 * Styling:
 * - White background
 * - Large border radius (20-24px for default, 8-12px for listing)
 * - Subtle drop shadow
 * - Generous padding (24px horizontal, 32px vertical for default)
 * - Listing variant: Less padding, more image-focused, responsive width
 * 
 * Responsive Behavior:
 * - Mobile: Fixed maxWidth for horizontal scroll
 * - Tablet/Desktop: Flexible width (use in grid layouts)
 */
export const Card: React.FC<CardProps> = ({
  children,
  padding = 'default',
  variant = 'default',
  style,
  ...viewProps
}) => {
  const isListing = variant === 'listing';
  const { isMobile } = useResponsive();
  
  const paddingStyle = padding === 'none' 
    ? {} 
    : padding === 'small'
    ? { paddingHorizontal: spacing.md, paddingVertical: spacing.lg }
    : padding === 'large'
    ? { paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl }
    : isListing
    ? { padding: components.resortCard.contentPadding }
    : {
        paddingHorizontal: components.card.padding.horizontal,
        paddingVertical: components.card.padding.vertical,
      };

  // Listing cards: fixed maxWidth on mobile, flexible on tablet/desktop
  const listingStyle = isListing
    ? [
        styles.cardListing,
        isMobile && { maxWidth: components.resortCard.maxWidth },
        !isMobile && { flex: 1, minWidth: 200 }, // Flexible on larger screens
      ]
    : null;

  return (
    <View
      style={[
        styles.card,
        listingStyle,
        paddingStyle,
        style,
      ]}
      {...viewProps}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: components.card.borderRadius,
    width: '100%',
    ...Platform.select({
      ios: shadows.card,
      android: { elevation: shadows.card.elevation },
      web: {
        ...shadows.card,
      },
    }),
  },
  cardListing: {
    borderRadius: borderRadius.xl, // 8-12px for listing cards
    overflow: 'hidden', // For image rounded corners
    // Width handled dynamically based on screen size
  },
});
