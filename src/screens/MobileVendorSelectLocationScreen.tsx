import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  getCurrentVendorLocation,
  reverseGeocodeVendorLocation,
  searchVendorLocations,
  type GeocodedLocation,
} from '@/src/api/vendorGeocoding.service';
import { VendorDocTypePickerSheet } from '@/src/components/vendor/VendorDocTypePickerSheet';
import { VendorLocationMap } from '@/src/components/vendor/VendorLocationMap';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
  EMPTY_VENDOR_ADDRESS,
  VENDOR_COUNTRIES,
  VENDOR_DEFAULT_COORDINATE,
  VENDOR_LOCATION_COPY,
  type VendorAddress,
  type VendorMapCoordinate,
} from '@/src/constants/vendorPropertyConstants';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

const DESIGN_WIDTH = 402;

export function MobileVendorSelectLocationScreen() {
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>('property');
  const [coordinate, setCoordinate] = useState<VendorMapCoordinate>(VENDOR_DEFAULT_COORDINATE);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
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
    router.replace('/vendor');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VendorOnboardingHero categoryId={categoryId} />

          <Text style={styles.title}>{VENDOR_LOCATION_COPY.title}</Text>

          <View style={styles.mapSection}>
            <View style={styles.mapWrap}>
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
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{VENDOR_LOCATION_COPY.countryLabel}</Text>
            <Pressable
              style={({ pressed }) => [styles.selectRow, pressed && styles.pressed]}
              onPress={() => setCountryPickerOpen(true)}
            >
              <Text style={styles.selectText}>{address.country || VENDOR_LOCATION_COPY.countryPlaceholder}</Text>
              <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
            </Pressable>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{VENDOR_LOCATION_COPY.addressLabel}</Text>
            <View style={styles.addressGroup}>
              <Input
                value={address.streetAddress}
                onChangeText={(v) => updateAddress('streetAddress', v)}
                placeholder={VENDOR_LOCATION_COPY.streetPlaceholder}
                placeholderTextColor={colors.text.placeholder}
                style={styles.addressInput}
              />
              <View style={styles.addressDivider} />
              <Input
                value={address.unit}
                onChangeText={(v) => updateAddress('unit', v)}
                placeholder={VENDOR_LOCATION_COPY.unitPlaceholder}
                placeholderTextColor={colors.text.placeholder}
                style={styles.addressInput}
              />
              <View style={styles.addressDivider} />
              <Input
                value={address.city}
                onChangeText={(v) => updateAddress('city', v)}
                placeholder={VENDOR_LOCATION_COPY.cityPlaceholder}
                placeholderTextColor={colors.text.placeholder}
                style={styles.addressInput}
              />
              <View style={styles.addressDivider} />
              <Input
                value={address.state}
                onChangeText={(v) => updateAddress('state', v)}
                placeholder={VENDOR_LOCATION_COPY.statePlaceholder}
                placeholderTextColor={colors.text.placeholder}
                style={styles.addressInput}
              />
              <View style={styles.addressDivider} />
              <Input
                value={address.pinCode}
                onChangeText={(v) => updateAddress('pinCode', v)}
                placeholder={VENDOR_LOCATION_COPY.pinPlaceholder}
                placeholderTextColor={colors.text.placeholder}
                keyboardType="number-pad"
                style={styles.addressInput}
              />
            </View>
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleConfirm}
          nextLabel={VENDOR_LOCATION_COPY.confirmCta}
        />
      </View>

      <VendorDocTypePickerSheet
        visible={countryPickerOpen}
        title={VENDOR_LOCATION_COPY.countryPlaceholder}
        options={VENDOR_COUNTRIES}
        selected={address.country}
        onClose={() => setCountryPickerOpen(false)}
        onSelect={(value) => {
          updateAddress('country', value);
          setCountryPickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  mapSection: {
    gap: 0,
  },
  searchOverlay: {
    position: 'absolute',
    top: spacing['3'],
    left: spacing['3'],
    right: spacing['3'],
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
  },
  searchResultRow: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.08)',
  },
  searchResultText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  mapWrap: {
    height: 280,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  currentLocationBtn: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['4'],
    paddingVertical: 8,
    minHeight: 34,
    justifyContent: 'center',
  },
  currentLocationText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  dragHint: {
    position: 'absolute',
    bottom: spacing['3'],
    alignSelf: 'center',
    backgroundColor: 'rgba(28, 32, 36, 0.72)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    paddingVertical: 8,
  },
  dragHintText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.surface.white,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.65)',
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 24,
    paddingHorizontal: spacing['3'],
    height: 44,
  },
  selectText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    color: colors.text.primary,
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
  },
  addressDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(28, 32, 36, 0.12)',
  },
  pressed: { opacity: 0.85 },
});
