import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { VENDOR_PRICING_COPY } from '@/src/constants/vendorListingConstants';
import {
  VENDOR_LISTINGS_COPY,
  type VendorListingCardData,
} from '@/src/constants/vendorListingsConstants';
import { VendorListingModalShell } from '@/src/components/vendor/listings/VendorListingModalShell';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const FIGMA_TITLE = '#0F1A20';
const FIGMA_MAROON = '#AA1155';
const FIGMA_BLUE = '#2C6F9C';
const FIGMA_DIVIDER = 'rgba(15, 26, 32, 0.2)';

type VendorUpdatePricingModalProps = {
  listing: VendorListingCardData;
  onClose: () => void;
  onConfirm: (price: number) => void;
};

function parseListingPrice(listing: VendorListingCardData): number {
  const raw = listing.priceAmount ?? listing.priceDisplay;
  const digits = raw.replace(/[^\d]/g, '');
  const parsed = Number(digits);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2420;
}

function formatRupee(value: number): string {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function VendorUpdatePricingModal({
  listing,
  onClose,
  onConfirm,
}: VendorUpdatePricingModalProps) {
  const [price, setPrice] = useState(() => parseListingPrice(listing));

  useEffect(() => {
    setPrice(parseListingPrice(listing));
  }, [listing]);

  const adjustPrice = (delta: number) => {
    setPrice((prev) => Math.max(0, prev + delta));
  };

  const handleConfirm = () => {
    onConfirm(price);
    onClose();
  };

  return (
    <VendorListingModalShell onClose={onClose}>
      <Text style={styles.refText}>
        Property Number # : <Text style={styles.refBold}>{listing.listingRef}</Text>
      </Text>
      <Text style={styles.subtitle}>{listing.description}</Text>

      <View style={styles.separator} />

      <Text style={styles.sectionLabel}>{VENDOR_LISTINGS_COPY.updatePricingLabel}</Text>

      <View style={styles.stepperRow}>
        <Pressable
          style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
          onPress={() => adjustPrice(-VENDOR_PRICING_COPY.priceStep)}
          accessibilityRole="button"
          accessibilityLabel="Decrease price"
        >
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>

        <View style={styles.priceBox}>
          <Text style={styles.priceText}>{formatRupee(price)}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
          onPress={() => adjustPrice(VENDOR_PRICING_COPY.priceStep)}
          accessibilityRole="button"
          accessibilityLabel="Increase price"
        >
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.separator} />

      <Text style={styles.rangeHint}>
        {VENDOR_PRICING_COPY.rangeHintPrefix}{' '}
        <Text style={styles.rangeHintBold}>
          ₹{VENDOR_PRICING_COPY.rangeMin.toLocaleString('en-IN')} - ₹
          {VENDOR_PRICING_COPY.rangeMax.toLocaleString('en-IN')}
        </Text>
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.goBackBtn, pressed && styles.pressed]}
          onPress={onClose}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={18} color={FIGMA_MAROON} />
          <Text style={styles.goBackText}>{VENDOR_LISTINGS_COPY.goBack}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
          onPress={handleConfirm}
          accessibilityRole="button"
        >
          <Text style={styles.confirmText}>{VENDOR_LISTINGS_COPY.updatePricingCta}</Text>
        </Pressable>
      </View>
    </VendorListingModalShell>
  );
}

const styles = StyleSheet.create({
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
  sectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: 'rgba(15, 26, 32, 0.8)',
    textAlign: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    alignSelf: 'center',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FIGMA_DIVIDER,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.1)', cursor: 'pointer' as const },
    }),
  },
  stepBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 26,
    color: FIGMA_TITLE,
  },
  priceBox: {
    minWidth: 206,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FIGMA_BLUE,
    backgroundColor: 'rgba(44, 111, 156, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  rangeHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.04,
    color: FIGMA_TITLE,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 320,
  },
  rangeHintBold: {
    fontWeight: typography.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: FIGMA_MAROON,
    borderRadius: 24,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: FIGMA_MAROON,
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    backgroundColor: FIGMA_MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  confirmText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 24,
    letterSpacing: 0.32,
    color: colors.surface.white,
  },
  pressed: { opacity: 0.88 },
});
