import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RESORT_AMENITIES } from '@/src/components/resort/resortConstants';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function ResortAmenitiesSection({ amenities }: { amenities?: string[] }) {
  const { s } = useHomeScale();
  const uniqueAmenities = [...new Set((amenities ?? []).filter(Boolean))];
  const fallbackItems = RESORT_AMENITIES;
  const items =
    uniqueAmenities.length > 0
      ? uniqueAmenities.map((label, index) => ({
          id: `amenity-${index}`,
          label,
          icon: 'checkmark-circle-outline' as const,
        }))
      : fallbackItems;
  const displayItems = [...items, ...items, ...items, ...items];

  const rows: (typeof RESORT_AMENITIES)[] = [];
  for (let i = 0; i < displayItems.length; i += 2) {
    rows.push(displayItems.slice(i, i + 2) as typeof RESORT_AMENITIES);
  }

  return (
    <View style={[styles.card, { padding: s(16), borderRadius: s(18), gap: s(16) }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: s(16), lineHeight: s(20) }]}>Amenities</Text>
        <Text style={[styles.subtitle, { fontSize: s(14), lineHeight: s(18) }]}>What we provide?</Text>
      </View>

      <View style={{ gap: s(12) }}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx}>
            <View style={[styles.row, { gap: s(16) }]}>
              {row.map((item, colIdx) => (
                <View key={`${rowIdx}-${colIdx}-${item.id}`} style={[styles.item, { gap: s(8) }]}>
                  <View style={[styles.icon, { width: s(28), height: s(28), borderRadius: s(14) }]}>
                    <Ionicons name={item.icon} size={s(14)} color={colors.accent.main} />
                  </View>
                  <Text style={[styles.label, { fontSize: s(12), lineHeight: s(16) }]}>{item.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.dividerRow}>
              <View style={[styles.dividerAccent, { height: 1 }]} />
              <View style={[styles.dividerMuted, { height: 1 }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: 'rgba(229, 77, 46, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
    flex: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerAccent: {
    flex: 1,
    backgroundColor: colors.accent.main,
  },
  dividerMuted: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.12)',
  },
});
