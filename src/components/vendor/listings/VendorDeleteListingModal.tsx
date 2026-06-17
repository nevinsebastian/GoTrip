import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VENDOR_DASHBOARD_BTN_RED, VENDOR_DASHBOARD_CARD_BORDER } from '@/src/constants/vendorDashboardConstants';
import {
  VENDOR_LISTINGS_COPY,
  type VendorListingCardData,
} from '@/src/constants/vendorListingsConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

type VendorDeleteListingModalProps = {
  listing: VendorListingCardData;
  bottomInset: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function VendorDeleteListingModal({
  listing,
  bottomInset,
  onClose,
  onConfirm,
}: VendorDeleteListingModalProps) {
  return (
    <View style={[styles.overlay, { bottom: bottomInset }]} pointerEvents="box-none">
      <Pressable style={styles.scrim} onPress={onClose} accessibilityRole="button">
        <View style={styles.backdropDim} />
        <View
          style={[
            styles.backdropFrost,
            Platform.OS === 'web'
              ? ({
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                } as object)
              : null,
          ]}
        />
      </Pressable>

      <View style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <Text style={styles.refText}>
            Property Number # : <Text style={styles.refBold}>{listing.listingRef}</Text>
          </Text>
          <Text style={styles.subtitle}>{listing.cardTitle}</Text>
          <View style={styles.divider} />

          <Text style={styles.deleteTitle}>{VENDOR_LISTINGS_COPY.deletePropertyTitle}</Text>
          <Text style={styles.deleteBody}>{VENDOR_LISTINGS_COPY.deletePropertyBody}</Text>

          <View style={styles.actions}>
            <Pressable style={styles.goBackBtn} onPress={onClose}>
              <View style={styles.goBackIcon}>
                <Ionicons name="chevron-back" size={14} color={colors.surface.white} />
              </View>
              <Text style={styles.goBackText}>{VENDOR_LISTINGS_COPY.goBack}</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteBtnText}>{VENDOR_LISTINGS_COPY.deletePropertyCta}</Text>
              <Ionicons name="trash" size={14} color={colors.surface.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: 'flex-end',
  },
  backdropDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  backdropFrost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrap: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['3'],
  },
  sheet: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: 24,
    padding: 16,
    gap: 10,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  refText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.primary,
  },
  refBold: {
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: VENDOR_DASHBOARD_CARD_BORDER,
    marginVertical: 2,
  },
  deleteTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_DASHBOARD_BTN_RED,
    textAlign: 'center',
    marginTop: 4,
  },
  deleteBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: '#E57373',
    textAlign: 'center',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.surface.white,
  },
  goBackIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: VENDOR_DASHBOARD_BTN_RED,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  deleteBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
