import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/constants/DesignTokens';

type Props = {
  latitude: number;
  longitude: number;
  style?: StyleProp<ViewStyle>;
};

export function ListingMap({ latitude, longitude, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Text variant="caption" style={styles.title}>
        Map preview not available on web
      </Text>
      <Text variant="caption" style={styles.subtitle}>
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(0, 9, 50, 0.06)',
    borderColor: 'rgba(0, 9, 50, 0.12)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.secondary,
    marginTop: 6,
  },
});

