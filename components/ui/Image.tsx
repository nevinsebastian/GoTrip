import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, StyleSheet, ViewStyle } from 'react-native';
import { borderRadius } from '@/constants/DesignTokens';

export interface ImageProps extends RNImageProps {
  variant?: 'default' | 'cardImage' | 'categoryIcon';
  containerStyle?: ViewStyle;
}

/**
 * Image component wrapper for consistent image styling
 * 
 * Variants:
 * - default: Standard image
 * - cardImage: Image for resort cards with rounded top corners
 * - categoryIcon: Square icon/image for category items with rounded corners
 * 
 * Resorts screen usage:
 * - cardImage: Resort card images (rounded top corners matching card radius)
 * - categoryIcon: Category filter icons (square with rounded corners)
 */
export const Image: React.FC<ImageProps> = ({
  variant = 'default',
  containerStyle,
  style,
  ...imageProps
}) => {
  const variantStyle = variant === 'cardImage' 
    ? styles.cardImage
    : variant === 'categoryIcon'
    ? styles.categoryIcon
    : undefined;

  return (
    <RNImage
      style={[
        styles.base,
        variantStyle,
        style,
      ]}
      {...imageProps}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    resizeMode: 'cover',
  },
  cardImage: {
    borderTopLeftRadius: borderRadius.xl, // Match card border radius
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
  },
  categoryIcon: {
    borderRadius: borderRadius.lg,
    width: '100%',
    height: '100%',
  },
});
