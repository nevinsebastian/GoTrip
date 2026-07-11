import { colors } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const PIN_SIZE = 52;

/** Fixed center pin — tip anchors on the map center (property spot). */
export function VendorMapCenterPin() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={styles.shadow} />
      <Ionicons name="location" size={PIN_SIZE} color={colors.accent.main} />
      <View style={styles.tipDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: PIN_SIZE,
    height: PIN_SIZE,
    marginLeft: -PIN_SIZE / 2,
    marginTop: -PIN_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1,
    elevation: 12,
  },
  shadow: {
    position: 'absolute',
    bottom: -2,
    width: 14,
    height: 6,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    ...Platform.select({
      web: { filter: 'blur(1px)' as unknown as undefined },
      default: {},
    }),
  },
  tipDot: {
    position: 'absolute',
    bottom: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface.white,
    borderWidth: 1.5,
    borderColor: colors.accent.main,
  },
});
