import { colors, typography } from '@/constants/DesignTokens';
import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type VendorLocationMapProps = {
  coordinate: VendorMapCoordinate;
  onCoordinateChange: (coordinate: VendorMapCoordinate) => void;
  style?: StyleProp<ViewStyle>;
};

/** Web fallback — tap corners to nudge the pin for demo autofill. */
export function VendorLocationMap({ coordinate, onCoordinateChange, style }: VendorLocationMapProps) {
  const nudge = (lat: number, lng: number) => {
    onCoordinateChange({
      latitude: coordinate.latitude + lat,
      longitude: coordinate.longitude + lng,
    });
  };

  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.hint}>Map preview — use search or nudge controls</Text>
      <View style={styles.controls}>
        <Pressable style={styles.control} onPress={() => nudge(0.004, 0)}>
          <Text style={styles.controlText}>N</Text>
        </Pressable>
        <View style={styles.row}>
          <Pressable style={styles.control} onPress={() => nudge(0, -0.004)}>
            <Text style={styles.controlText}>W</Text>
          </Pressable>
          <View style={styles.pin} />
          <Pressable style={styles.control} onPress={() => nudge(0, 0.004)}>
            <Text style={styles.controlText}>E</Text>
          </Pressable>
        </View>
        <Pressable style={styles.control} onPress={() => nudge(-0.004, 0)}>
          <Text style={styles.controlText}>S</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#d9e8ef',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  controls: {
    alignItems: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  control: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
  },
  controlText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: '600',
    color: colors.text.primary,
  },
  pin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1c2024',
  },
});
