import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  VENDOR_LISTINGS_COPY,
  type VendorListingCardData,
} from '@/src/constants/vendorListingsConstants';
import { VendorListingStatusBadge } from '@/src/components/vendor/listings/VendorListingStatusBadge';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

const FIGMA_BLUE = '#2C6F9C';
const FIGMA_RED = '#D72626';
const FIGMA_TITLE = '#0F1A20';
const FIGMA_BORDER = 'rgba(15, 26, 32, 0.2)';
const FIGMA_DIVIDER = 'rgba(15, 26, 32, 0.14902)';
const FIGMA_PILL_BG = 'rgba(44, 111, 156, 0.1)';

type DesktopVendorListingCardProps = {
  listing: VendorListingCardData;
  onPricing?: () => void;
  onDelete?: () => void;
};

function Separator() {
  return (
    <View style={styles.separatorWrap}>
      <View style={styles.separatorLine} />
    </View>
  );
}

export function DesktopVendorListingCard({ listing, onPricing, onDelete }: DesktopVendorListingCardProps) {
  const rating = listing.rating ?? 4.5;
  const customerCount = listing.customerCount ?? 0;
  const priceLabel = listing.priceRowLabel ?? VENDOR_LISTINGS_COPY.totalPriceOneNight;
  const priceAmount = listing.priceAmount ?? listing.priceDisplay;
  const priceTaxNote = listing.priceTaxNote ?? 'including tax';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderMain}>
          <Text style={styles.refText}>
            Property Number # : <Text style={styles.refBold}>{listing.listingRef}</Text>
          </Text>
          {listing.status ? <VendorListingStatusBadge status={listing.status} /> : null}
        </View>
        <View style={styles.locationPill}>
          <Text style={styles.locationPillText} numberOfLines={1}>
            {listing.locationPill}
          </Text>
        </View>
      </View>

      <Separator />

      <View style={styles.propertyRow}>
        <Image source={listing.image} style={styles.thumb} resizeMode="cover" />
        <View style={styles.propertyInfo}>
          <Text style={styles.description}>{listing.description}</Text>

          <View style={styles.hostRow}>
            <Image source={listing.hostAvatar} style={styles.hostAvatar} resizeMode="cover" />
            <Text style={styles.hostText}>
              {VENDOR_LISTINGS_COPY.hostLabel}
              {'\n'}
              <Text style={styles.hostName}>{listing.hostName}</Text>
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingGroup}>
              <Ionicons name="star" size={14} color={FIGMA_BLUE} />
              <Text style={styles.ratingValue}>{rating}</Text>
            </View>
            <Text style={styles.ratingDivider}>|</Text>
            <Text style={styles.customerText}>
              {VENDOR_LISTINGS_COPY.customersLabel(customerCount)}
            </Text>
          </View>
        </View>
      </View>

      <Separator />

      <View style={styles.amenityRow}>
        {listing.amenities.slice(0, 3).map((amenity) => (
          <View key={amenity.id} style={styles.amenityItem}>
            <View style={styles.amenityIconWrap}>
              <Ionicons name={amenity.icon} size={18} color={FIGMA_BLUE} />
            </View>
            <Text style={styles.amenityLabel} numberOfLines={1}>
              {amenity.label}
            </Text>
          </View>
        ))}
      </View>

      <Separator />

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>{priceLabel}</Text>
        <View style={styles.priceCol}>
          <Text style={styles.priceAmount}>{priceAmount}</Text>
          <Text style={styles.priceTaxNote}>{priceTaxNote}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.pricingBtn, pressed && styles.pressed]}
          onPress={onPricing}
          accessibilityRole="button"
        >
          <Text style={styles.pricingSymbol}>₹</Text>
          <Text style={styles.pricingText}>{VENDOR_LISTINGS_COPY.pricing}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
          onPress={() => router.push('/vendor/edit-listing')}
          accessibilityRole="button"
        >
          <Ionicons name="home-outline" size={18} color={colors.surface.white} />
          <Text style={styles.editText}>{VENDOR_LISTINGS_COPY.edit}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
          onPress={onDelete}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color={colors.surface.white} />
          <Text style={styles.deleteText}>{VENDOR_LISTINGS_COPY.delete}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 280,
    borderWidth: 1,
    borderColor: FIGMA_BORDER,
    borderRadius: 24,
    padding: 18,
    gap: 16,
    backgroundColor: colors.surface.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 34,
  },
  cardHeaderMain: {
    flex: 1,
    gap: 8,
  },
  refText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  refBold: {
    fontWeight: typography.fontWeight.bold,
  },
  locationPill: {
    maxWidth: '48%',
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: FIGMA_PILL_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    letterSpacing: 0.28,
    color: FIGMA_TITLE,
  },
  separatorWrap: {
    height: 8,
    justifyContent: 'center',
  },
  separatorLine: {
    height: 1,
    backgroundColor: FIGMA_DIVIDER,
  },
  propertyRow: {
    flexDirection: 'row',
    gap: 24,
    minHeight: 141,
  },
  thumb: {
    width: 205,
    height: 141,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.1)',
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 8,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
  },
  hostAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  hostText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  hostName: {
    fontWeight: typography.fontWeight.medium,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingRight: 8,
  },
  ratingValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_BLUE,
  },
  ratingDivider: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: FIGMA_TITLE,
    marginHorizontal: 4,
  },
  customerText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_BLUE,
    paddingHorizontal: 8,
  },
  amenityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    minHeight: 32,
  },
  amenityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  amenityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FIGMA_PILL_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_TITLE,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    minHeight: 32,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    color: FIGMA_TITLE,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: FIGMA_BLUE,
    textAlign: 'right',
  },
  priceTaxNote: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.55)',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  pricingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderWidth: 2,
    borderColor: FIGMA_BLUE,
    borderRadius: 24,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  pricingSymbol: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: FIGMA_BLUE,
  },
  pricingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: FIGMA_BLUE,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 24,
    backgroundColor: FIGMA_BLUE,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  editText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: colors.surface.white,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 24,
    backgroundColor: FIGMA_RED,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  deleteText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: colors.surface.white,
  },
  pressed: { opacity: 0.88 },
});
