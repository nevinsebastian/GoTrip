import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  VENDOR_LISTING_THEME_COLORS,
  VENDOR_LISTINGS_COPY,
  type VendorListingCardData,
} from '@/src/constants/vendorListingsConstants';
import { VENDOR_DASHBOARD_BTN_RED } from '@/src/constants/vendorDashboardConstants';
import { VendorListingStatusBadge } from '@/src/components/vendor/listings/VendorListingStatusBadge';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type VendorListingCardProps = {
  listing: VendorListingCardData;
  onPricing?: () => void;
  onDelete?: () => void;
};

export function VendorListingCard({ listing, onPricing, onDelete }: VendorListingCardProps) {
  const theme = VENDOR_LISTING_THEME_COLORS[listing.theme];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderMain}>
          <Text style={styles.refText}>
            {listing.typeLabel} # : <Text style={styles.refValue}>{listing.listingRef}</Text>
          </Text>
          {listing.status ? <VendorListingStatusBadge status={listing.status} compact /> : null}
        </View>
        <View style={[styles.locationPill, { backgroundColor: theme.pillBg }]}>
          <Text style={[styles.locationPillText, { color: theme.accent }]} numberOfLines={1}>
            {listing.locationPill}
          </Text>
        </View>
      </View>

      <View style={styles.idDivider}>
        <View style={[styles.idDividerActive, { backgroundColor: theme.accent }]} />
        <View style={styles.idDividerRest} />
      </View>

      <View style={styles.propertyRow}>
        <Image source={listing.image} style={styles.thumb} resizeMode="cover" />
        <View style={styles.propertyInfo}>
          <Text style={styles.description}>{listing.description}</Text>
          <View style={styles.hostRow}>
            <Image source={listing.hostAvatar} style={styles.hostAvatar} resizeMode="cover" />
            <View>
              <Text style={styles.hostLabel}>{VENDOR_LISTINGS_COPY.hostLabel}</Text>
              <Text style={styles.hostName}>{listing.hostName}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.amenityGrid}>
        {listing.amenities.map((amenity) => (
          <View key={amenity.id} style={styles.amenityPill}>
            <View style={[styles.amenityIcon, { backgroundColor: theme.pillBg }]}>
              <Ionicons name={amenity.icon} size={12} color={theme.accent} />
            </View>
            <Text style={styles.amenityLabel} numberOfLines={1}>
              {amenity.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.priceBox, { backgroundColor: theme.priceBg }]}>
        <Text style={styles.priceLabel}>{VENDOR_LISTINGS_COPY.totalPrice}</Text>
        <Text style={[styles.priceValue, { color: theme.priceText }]}>{listing.priceDisplay}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.pricingBtn, { borderColor: theme.accent }]}
          onPress={onPricing}
        >
          <Text style={[styles.pricingSymbol, { color: theme.accent }]}>₹</Text>
          <Text style={[styles.pricingText, { color: theme.accent }]}>{VENDOR_LISTINGS_COPY.pricing}</Text>
        </Pressable>
        <Pressable
          style={[styles.editBtn, { backgroundColor: theme.accent }]}
          onPress={() =>
            router.push({
              pathname: '/vendor/edit-listing',
              params: { listingId: listing.id, categoryId: listing.categoryId, mode: 'edit' },
            })
          }
        >
          <Ionicons name="create-outline" size={14} color={colors.surface.white} />
          <Text style={styles.editText}>{VENDOR_LISTINGS_COPY.edit}</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={14} color={colors.surface.white} />
          <Text style={styles.deleteText}>{VENDOR_LISTINGS_COPY.delete}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.12)',
    borderRadius: 24,
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeaderMain: {
    flex: 1,
    gap: 6,
  },
  refText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  refValue: {
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  locationPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '48%',
  },
  locationPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
  },
  idDivider: {
    flexDirection: 'row',
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
  },
  idDividerActive: {
    width: '40%',
  },
  idDividerRest: {
    flex: 1,
  },
  propertyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  propertyInfo: {
    flex: 1,
    gap: 8,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 18,
    color: colors.text.primary,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  hostLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  hostName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  amenityIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: colors.text.primary,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pricingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 10,
    backgroundColor: colors.surface.white,
  },
  pricingSymbol: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
  },
  pricingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 24,
    paddingVertical: 10,
  },
  editText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: VENDOR_DASHBOARD_BTN_RED,
    borderRadius: 24,
    paddingVertical: 10,
  },
  deleteText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
