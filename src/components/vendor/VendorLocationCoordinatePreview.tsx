import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import { formatCoordinatePreview } from '@/src/utils/formatCoordinatePreview';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type VendorLocationCoordinatePreviewProps = {
  coordinate: VendorMapCoordinate;
};

export function VendorLocationCoordinatePreview({ coordinate }: VendorLocationCoordinatePreviewProps) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="navigate-outline" size={14} color={colors.text.secondary} />
      <Text style={styles.label}>Lat, Lng</Text>
      <Text style={styles.value} selectable>
        {formatCoordinatePreview(coordinate)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    paddingHorizontal: spacing['3'],
    paddingVertical: 8,
    minHeight: 36,
    zIndex: 2,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  value: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'right',
  },
});
