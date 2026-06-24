import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  getCurrentVendorLocation,
  reverseGeocodeVendorLocation,
  searchVendorLocations,
  type GeocodedLocation,
} from '@/src/api/vendorGeocoding.service';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { VendorLocationMap } from '@/src/components/vendor/VendorLocationMap';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
  EMPTY_VENDOR_ADDRESS,
  VENDOR_COUNTRIES,
  VENDOR_DEFAULT_COORDINATE,
  VENDOR_LOCATION_COPY,
  type VendorAddress,
  type VendorMapCoordinate,
} from '@/src/constants/vendorPropertyConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

export function DesktopVendorSelectLocationScreen() {
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>('property');
  const [coordinate, setCoordinate] = useState<VendorMapCoordinate>(VENDOR_DEFAULT_COORDINATE);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [address, setAddress] = useState<VendorAddress>(EMPTY_VENDOR_ADDRESS);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const applyGeocodedLocation = useCallback((location: GeocodedLocation) => {
    setCoordinate(location.coordinate);
    setSearchQuery(location.searchLabel);
    setAddress(location.address);
    setSearchResults([]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    reverseGeocodeVendorLocation(VENDOR_DEFAULT_COORDINATE).then((location) => {
      if (!cancelled) applyGeocodedLocation(location);
    });
    return () => {
      cancelled = true;
    };
  }, [applyGeocodedLocation]);

  const scheduleReverseGeocode = (nextCoordinate: VendorMapCoordinate) => {
    setCoordinate(nextCoordinate);
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const location = await reverseGeocodeVendorLocation(nextCoordinate);
        applyGeocodedLocation(location);
      } finally {
        setIsGeocoding(false);
      }
    }, 350);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchVendorLocations(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (location: GeocodedLocation) => {
    Keyboard.dismiss();
    applyGeocodedLocation(location);
  };

  const handleUseCurrentLocation = async () => {
    setIsUsingCurrentLocation(true);
    try {
      const location = await getCurrentVendorLocation();
      applyGeocodedLocation(location);
    } finally {
      setIsUsingCurrentLocation(false);
    }
  };

  const updateAddress = (field: keyof VendorAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    if (categoryId === 'property') {
      router.push('/vendor/guest-room-details');
      return;
    }
    if (categoryId === 'glamping') {
      router.push('/vendor/guest-tent-details');
      return;
    }
    if (categoryId === 'activities') {
      router.push('/vendor/guest-activity-details');
      return;
    }
    router.replace('/(tabs)');
  };

  const mapPanel = (
    <View style={styles.mapPanel}>
      <VendorLocationMap
        coordinate={coordinate}
        onCoordinateChange={scheduleReverseGeocode}
        style={styles.map}
      />

      <View style={styles.searchOverlay}>
        <View style={styles.searchBar}>
          <Ionicons name="location" size={16} color={colors.text.primary} />
          <Input
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={VENDOR_LOCATION_COPY.searchPlaceholder}
            placeholderTextColor={colors.text.placeholder}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {isSearching || isGeocoding ? (
            <ActivityIndicator size="small" color={colors.accent.main} />
          ) : null}
        </View>

        {searchResults.length > 0 ? (
          <View style={styles.searchResults}>
            {searchResults.map((result) => (
              <Pressable
                key={result.searchLabel}
                style={({ pressed }) => [styles.searchResultRow, pressed && styles.pressed]}
                onPress={() => handleSelectSearchResult(result)}
              >
                <Text style={styles.searchResultText} numberOfLines={2}>
                  {result.searchLabel}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [styles.currentLocationBtn, pressed && styles.pressed]}
        onPress={handleUseCurrentLocation}
        disabled={isUsingCurrentLocation}
      >
        {isUsingCurrentLocation ? (
          <ActivityIndicator size="small" color={colors.surface.white} />
        ) : (
          <Text style={styles.currentLocationText}>{VENDOR_LOCATION_COPY.useCurrentLocation}</Text>
        )}
      </Pressable>

      <View style={styles.dragHint}>
        <Text style={styles.dragHintText}>{VENDOR_LOCATION_COPY.dragHint}</Text>
      </View>
    </View>
  );

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId="property"
      leftPanelContent={mapPanel}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleConfirm}
          nextLabel={VENDOR_LOCATION_COPY.confirmCta}
        />
      }
    >
      <View style={styles.form}>
        <Text style={styles.title}>{VENDOR_LOCATION_COPY.title}</Text>
        <Text style={styles.subtitle}>{VENDOR_LOCATION_COPY.countryLabel}</Text>

        <DesktopInlineSelect
          value={address.country}
          options={VENDOR_COUNTRIES}
          onSelect={(value) => updateAddress('country', value)}
          placeholder={VENDOR_LOCATION_COPY.countryPlaceholder}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{VENDOR_LOCATION_COPY.addressLabel}</Text>
          <View style={styles.addressGroup}>
            <Input
              value={address.streetAddress}
              onChangeText={(value) => updateAddress('streetAddress', value)}
              placeholder={VENDOR_LOCATION_COPY.streetPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.addressInput}
            />
            <View style={styles.addressDivider} />
            <Input
              value={address.unit}
              onChangeText={(value) => updateAddress('unit', value)}
              placeholder={VENDOR_LOCATION_COPY.unitPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.addressInput}
            />
            <View style={styles.addressDivider} />
            <Input
              value={address.city}
              onChangeText={(value) => updateAddress('city', value)}
              placeholder={VENDOR_LOCATION_COPY.cityPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.addressInput}
            />
            <View style={styles.addressDivider} />
            <Input
              value={address.state}
              onChangeText={(value) => updateAddress('state', value)}
              placeholder={VENDOR_LOCATION_COPY.statePlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.addressInput}
            />
            <View style={styles.addressDivider} />
            <Input
              value={address.pinCode}
              onChangeText={(value) => updateAddress('pinCode', value)}
              placeholder={VENDOR_LOCATION_COPY.pinPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              keyboardType="number-pad"
              style={styles.addressInput}
            />
          </View>
        </View>
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  mapPanel: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchOverlay: {
    position: 'absolute',
    top: spacing['4'],
    left: spacing['4'],
    right: spacing['4'],
    zIndex: 4,
    gap: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    paddingHorizontal: spacing['3'],
    minHeight: 44,
    zIndex: 2,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 40,
    paddingHorizontal: 0,
    fontSize: typography.fontSize['1'],
  },
  searchResults: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    overflow: 'hidden',
    zIndex: 3,
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' },
      default: {},
    }),
  },
  searchResultRow: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.08)',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  searchResultText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  currentLocationBtn: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['4'],
    paddingVertical: 8,
    minHeight: 34,
    justifyContent: 'center',
    zIndex: 3,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  currentLocationText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  dragHint: {
    position: 'absolute',
    bottom: spacing['4'],
    alignSelf: 'center',
    backgroundColor: 'rgba(28, 32, 36, 0.72)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    paddingVertical: 8,
    zIndex: 3,
  },
  dragHintText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.surface.white,
  },
  form: {
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 26,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: -8,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  addressGroup: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  addressInput: {
    ...authFieldInputStyle.field,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: colors.surface.white,
    height: 44,
  },
  addressDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(28, 32, 36, 0.12)',
  },
  pressed: { opacity: 0.85 },
});
