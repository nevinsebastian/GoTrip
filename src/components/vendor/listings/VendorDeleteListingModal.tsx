import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  VENDOR_LISTINGS_COPY,
  type VendorListingCardData,
} from '@/src/constants/vendorListingsConstants';
import { VendorListingModalShell } from '@/src/components/vendor/listings/VendorListingModalShell';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const FIGMA_TITLE = '#0F1A20';
const FIGMA_RED = '#D72626';
const FIGMA_DIVIDER = 'rgba(15, 26, 32, 0.2)';

type VendorDeleteListingModalProps = {
  listing: VendorListingCardData;
  onClose: () => void;
  onConfirm: () => void;
  /** @deprecated Mobile tab bar inset; centered modal ignores this. */
  bottomInset?: number;
  variant?: 'centered' | 'sheet';
};

export function VendorDeleteListingModal({
  listing,
  onClose,
  onConfirm,
  variant = 'centered',
}: VendorDeleteListingModalProps) {
  if (variant === 'sheet') {
    return (
      <LegacySheetDeleteModal listing={listing} onClose={onClose} onConfirm={onConfirm} />
    );
  }

  return (
    <VendorListingModalShell onClose={onClose} cardStyle={styles.compactCard}>
      <Text style={styles.refText}>
        Property Number # : <Text style={styles.refBold}>{listing.listingRef}</Text>
      </Text>
      <Text style={styles.subtitle}>{listing.description}</Text>

      <View style={styles.separator} />

      <Text style={styles.deleteTitle}>{VENDOR_LISTINGS_COPY.deletePropertyTitle}</Text>
      <Text style={styles.deleteBody}>{VENDOR_LISTINGS_COPY.deletePropertyBody}</Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.goBackBtn, pressed && styles.pressed]}
          onPress={onClose}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={18} color={FIGMA_TITLE} />
          <Text style={styles.goBackText}>{VENDOR_LISTINGS_COPY.goBack}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
          onPress={onConfirm}
          accessibilityRole="button"
        >
          <Text style={styles.deleteBtnText}>{VENDOR_LISTINGS_COPY.confirmDeleteCta}</Text>
        </Pressable>
      </View>
    </VendorListingModalShell>
  );
}

/** Bottom-sheet variant kept for narrow mobile layouts. */
function LegacySheetDeleteModal({
  listing,
  onClose,
  onConfirm,
}: Pick<VendorDeleteListingModalProps, 'listing' | 'onClose' | 'onConfirm'>) {
  return (
    <VendorListingModalShell onClose={onClose} centered={false}>
      <Text style={styles.refText}>
        Property Number # : <Text style={styles.refBold}>{listing.listingRef}</Text>
      </Text>
      <Text style={styles.subtitle}>{listing.description}</Text>
      <View style={styles.separator} />
      <Text style={styles.deleteTitle}>{VENDOR_LISTINGS_COPY.deletePropertyTitle}</Text>
      <Text style={styles.deleteBody}>{VENDOR_LISTINGS_COPY.deletePropertyBody}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.goBackBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={18} color={FIGMA_TITLE} />
          <Text style={styles.goBackText}>{VENDOR_LISTINGS_COPY.goBack}</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={onConfirm}>
          <Text style={styles.deleteBtnText}>{VENDOR_LISTINGS_COPY.confirmDeleteCta}</Text>
        </Pressable>
      </View>
    </VendorListingModalShell>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    maxWidth: 624,
    minHeight: 315,
    justifyContent: 'space-between',
  },
  refText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    lineHeight: 24,
    color: FIGMA_TITLE,
    textAlign: 'center',
  },
  refBold: {
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    lineHeight: 18,
    color: '#1C2024',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: FIGMA_DIVIDER,
    alignSelf: 'stretch',
  },
  deleteTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: FIGMA_RED,
    textAlign: 'center',
  },
  deleteBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_RED,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    alignSelf: 'stretch',
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: FIGMA_TITLE,
    borderRadius: 24,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    lineHeight: 20,
    color: FIGMA_TITLE,
  },
  deleteBtn: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    backgroundColor: FIGMA_RED,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  deleteBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: colors.surface.white,
  },
  pressed: { opacity: 0.88 },
});
