import { Text } from '@/components/ui';
import { typography } from '@/constants/DesignTokens';
import {
  VENDOR_LISTING_STATUS_COLORS,
  VENDOR_LISTING_STATUS_LABELS,
} from '@/src/constants/vendorListingsConstants';
import type { VendorListingApiStatus } from '@/src/api/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type VendorListingStatusBadgeProps = {
  status: VendorListingApiStatus;
  compact?: boolean;
};

export function VendorListingStatusBadge({ status, compact = false }: VendorListingStatusBadgeProps) {
  const colors = VENDOR_LISTING_STATUS_COLORS[status];
  const label = VENDOR_LISTING_STATUS_LABELS[status];

  return (
    <View style={[styles.badge, compact && styles.badgeCompact, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, compact && styles.labelCompact, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeCompact: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
  },
  labelCompact: {
    fontSize: 10,
  },
});
