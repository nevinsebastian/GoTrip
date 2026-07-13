import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import type { PackageEnquiry } from '@/src/api/types';
import { formatPackageDayLabel } from '@/src/utils/packageDates';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type PackageEnquiryCardProps = {
  enquiry: PackageEnquiry;
  expanded?: boolean;
  onToggle?: () => void;
  onViewPackage?: () => void;
};

function statusLabel(status: string) {
  switch (status) {
    case 'open':
      return 'Open';
    case 'replied':
      return 'Vendor replied';
    case 'closed':
      return 'Closed';
    case 'converted':
      return 'Converted to booking';
    default:
      return status;
  }
}

export function PackageEnquiryCard({
  enquiry,
  expanded,
  onToggle,
  onViewPackage,
}: PackageEnquiryCardProps) {
  const title = enquiry.listing?.title ?? 'Package enquiry';
  const dateLabel = enquiry.travelDate ? formatPackageDayLabel(enquiry.travelDate) : 'Flexible dates';

  return (
    <Pressable style={styles.card} onPress={onToggle}>
      <View style={styles.header}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.meta}>
            {dateLabel} · {enquiry.adults} adult{enquiry.adults === 1 ? '' : 's'}
            {enquiry.infants ? ` · ${enquiry.infants} infant${enquiry.infants === 1 ? '' : 's'}` : ''}
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{statusLabel(enquiry.status)}</Text>
        </View>
      </View>

      {expanded ? (
        <View style={styles.body}>
          {enquiry.message ? <Text style={styles.message}>{enquiry.message}</Text> : null}
          {enquiry.vendorReply ? (
            <View style={styles.replyBox}>
              <Text style={styles.replyLabel}>Vendor reply</Text>
              <Text style={styles.replyText}>{enquiry.vendorReply}</Text>
            </View>
          ) : null}
          {onViewPackage ? (
            <Pressable style={styles.linkBtn} onPress={onViewPackage}>
              <Text style={styles.linkText}>View package</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.accent.main} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.surface.white,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
  },
  statusPill: {
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  body: {
    gap: 10,
    paddingTop: 4,
  },
  message: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.secondary,
  },
  replyBox: {
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  replyLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  replyText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
});
