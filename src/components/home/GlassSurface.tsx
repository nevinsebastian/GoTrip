import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type GlassSurfaceProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  intensity?: 'light' | 'medium';
};

/** Glassmorphism surface — translucent fill + white border (Figma backdrop-filter fallback). */
export function GlassSurface({
  children,
  style,
  borderRadius = 12,
  intensity = 'medium',
}: GlassSurfaceProps) {
  const bg =
    intensity === 'light'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.15)';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderRadius,
          ...(Platform.OS === 'web'
            ? ({ backdropFilter: 'blur(2px)' } as object)
            : null),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
});
