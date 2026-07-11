import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  getCurrentVendorLocation,
  reverseGeocodeVendorLocation,
  searchVendorLocations,
  type GeocodedLocation,
} from '@/src/api/vendorGeocoding.service';
import { createVendorGlampingListing } from '@/src/api/vendorGlampingOnboarding.service';
import { createVendorHotelListing } from '@/src/api/vendorHotelOnboarding.service';
import { VendorDocTypePickerSheet } from '@/src/components/vendor/VendorDocTypePickerSheet';
import { VendorLocationCoordinatePreview } from '@/src/components/vendor/VendorLocationCoordinatePreview';
import { VendorMapCenterPin } from '@/src/components/vendor/VendorMapCenterPin';
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
import { clearVendorHotelDraft } from '@/src/utils/vendorHotelDraft';
import { formatCoordinatePreview } from '@/src/utils/formatCoordinatePreview';
import { buildHotelLocationJson } from '@/src/utils/buildHotelLocationJson';
import { saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
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
  const [locationError, setLocationError] = useState<string | null>(null);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [address, setAddress] = useState<VendorAddress>(EMPTY_VENDOR_ADDRESS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    reverseGeocodeVendorLocation(VENDOR_DEFAULT_COORDINATE)
      .then((location) => {
        if (!cancelled) applyGeocodedLocation(location);
      })
      .catch(() => {
        if (!cancelled) setLocationError('Could not load the default map location.');
      });
    return () => {
      cancelled = true;
    };
  }, [applyGeocodedLocation]);

  useEffect(() => {
    return () => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const scheduleReverseGeocode = (nextCoordinate: VendorMapCoordinate) => {
    setCoordinate(nextCoordinate);
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      setIsGeocoding(true);
      setLocationError(null);
      try {
        const location = await reverseGeocodeVendorLocation(nextCoordinate);
        applyGeocodedLocation(location);
      } catch {
        setLocationError('Could not look up this address. You can still edit the fields below.');
      } finally {
        setIsGeocoding(false);
      }
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLocationError(null);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchVendorLocations(query);
        setSearchResults(results);
      } catch {
        setLocationError('Location search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectSearchResult = (location: GeocodedLocation) => {
    Keyboard.dismiss();
    applyGeocodedLocation(location);
  };

  const handleUseCurrentLocation = async () => {
    setIsUsingCurrentLocation(true);
    setLocationError(null);
    try {
      const location = await getCurrentVendorLocation();
      applyGeocodedLocation(location);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Could not get your current location.');
    } finally {
      setIsUsingCurrentLocation(false);
    }
  };

  const updateAddress = (field: keyof VendorAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = async () => {
    if (categoryId === 'property') {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await createVendorHotelListing(address, coordinate, searchQuery);
        if (res.success) {
          await clearVendorHotelDraft();
          router.replace('/vendor/guest-room-details');
          return;
        }
        setSubmitError(res.message ?? 'Could not create hotel listing.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (categoryId === 'glamping') {
      // For glamping, we first collect tent counts (totalCamps). Save location for later create call.
      await saveVendorGlampingDraft({
        locationJson: buildHotelLocationJson(address, coordinate, searchQuery),
      });
      router.push('/vendor/guest-tent-details');
      return;
    }
    if (categoryId === 'activities') {
      await saveVendorActivityDraft({
        locationJson: buildHotelLocationJson(address, coordinate, searchQuery),
      });
      router.push('/vendor/create-title');
      return;
    }
    if (categoryId === 'packages') {
      await saveVendorPackageDraft({
        locationJson: buildHotelLocationJson(address, coordinate, searchQuery),
      });
      router.push('/vendor/create-title');
      return;
    }
    router.replace('/(tabs)');
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

              <View style={styles.pinOverlay} pointerEvents="none">
                <VendorMapCenterPin />
              </View>

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

                <VendorLocationCoordinatePreview coordinate={coordinate} />

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
              {locationError ? <Text style={styles.mapErrorText}>{locationError}</Text> : null}
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
            <Text style={styles.label}>{VENDOR_LOCATION_COPY.coordinatesLabel}</Text>
            <Input
              value={formatCoordinatePreview(coordinate)}
              editable={false}
              placeholder={VENDOR_LOCATION_COPY.coordinatesPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.coordinateInput}
            />
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

          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleConfirm}
          nextLabel={VENDOR_LOCATION_COPY.confirmCta}
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
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
    zIndex: 5,
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
    zIndex: 0,
  },
  pinOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    elevation: 12,
  },
  currentLocationBtn: {
    position: 'absolute',
    top: 116,
    alignSelf: 'center',
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['4'],
    paddingVertical: 8,
    minHeight: 34,
    justifyContent: 'center',
    zIndex: 6,
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
    zIndex: 6,
  },
  dragHintText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.surface.white,
  },
  mapErrorText: {
    position: 'absolute',
    bottom: 52,
    left: spacing['3'],
    right: spacing['3'],
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.primaryAlt,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing['3'],
    paddingVertical: 8,
    zIndex: 3,
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
  coordinateInput: {
    ...authFieldInputStyle.field,
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
    color: colors.text.secondary,
  },
  pressed: { opacity: 0.85 },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
