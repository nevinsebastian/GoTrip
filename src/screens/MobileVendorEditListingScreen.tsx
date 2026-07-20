import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import { VENDOR_EDIT_LISTING_COPY } from '@/src/constants/vendorEditListingConstants';
import { useVendorWorkspaceAuthGuard } from '@/src/hooks/useVendorWorkspaceAuthGuard';
import {
  createActivitySlotForListing,
  fetchVendorEditableListing,
  updateActivityHighlights,
  updateActivityListing,
  updateActivitySlot,
  updateAvailabilityPriceOverride,
  updateGlampingListing,
  updateHotelListing,
  updateHotelRoomType,
  updatePackageListing,
  upsertGlampingMealPlan,
  upsertHotelPropertyDetails,
  upsertPackageItinerary,
  type VendorEditableCategory,
} from '@/src/api/vendorListingEdit.service';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 860;
const MAROON = '#9F1239';
const SAVE_GREEN = '#22C55E';
const TITLE_BG = '#F4F8FA';
const NAME_BANNER_BG = '#F9E8EE';
const VENDOR_DASHBOARD_CARD_RADIUS = 12;
const VENDOR_DASHBOARD_CARD_BORDER = '#E5E7EB';

function parseNumber(value: string): number | undefined {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (!cleaned.trim()) return undefined;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function inferCategory(value: string | string[] | undefined): VendorEditableCategory {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'packages' || raw === 'glamping' || raw === 'activities') return raw;
  return 'property';
}

export function MobileVendorEditListingScreen() {
  useVendorWorkspaceAuthGuard();

  const tabInset = useVendorTabBarInset();
  const params = useLocalSearchParams<{
    listingId?: string;
    categoryId?: string;
    mode?: string;
  }>();
  const listingId = Array.isArray(params.listingId) ? params.listingId[0] : params.listingId;
  const categoryId = inferCategory(params.categoryId);
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [calendarDate, setCalendarDate] = useState('');
  const [calendarPrice, setCalendarPrice] = useState('');
  const [itineraryTitle, setItineraryTitle] = useState('');
  const [itineraryDescription, setItineraryDescription] = useState('');
  const [mealPlanPrice, setMealPlanPrice] = useState('');
  const [slotLabel, setSlotLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplyingCalendar, setIsApplyingCalendar] = useState(false);
  const [isSoftDisabling, setIsSoftDisabling] = useState(false);

  const query = useQuery({
    queryKey: ['vendor', 'editable-listing', categoryId, listingId],
    enabled: Boolean(listingId),
    queryFn: async () => fetchVendorEditableListing(categoryId, listingId!),
    staleTime: 30_000,
    retry: false,
  });

  const detailData = query.data;

  const headerRef = useMemo(() => {
    if (!detailData) return listingId ?? 'Listing';
    if (detailData.categoryId === 'property') return detailData.detail.hotel.id;
    if (detailData.categoryId === 'packages') return detailData.detail.package.id;
    if (detailData.categoryId === 'glamping') return detailData.detail.glamping.id;
    return detailData.detail.activity.id;
  }, [detailData, listingId]);

  const displayName = useMemo(() => {
    if (!detailData) return 'Edit listing';
    if (detailData.categoryId === 'property') return detailData.detail.hotel.title;
    if (detailData.categoryId === 'packages') return detailData.detail.package.title;
    if (detailData.categoryId === 'glamping') return detailData.detail.glamping.title;
    return detailData.detail.activity.title;
  }, [detailData]);

  const primaryEntity = useMemo(() => {
    if (!detailData) return null;
    if (detailData.categoryId === 'property') {
      const roomType = detailData.roomTypes.roomTypes?.[0];
      const listingType = detailData.detail.hotel.hotelProperty?.listingType;
      return roomType
        ? {
            entityType: listingType === 'full_property' ? 'full_property' : 'room_type',
            entityId: roomType.id,
            roomType,
            listingType,
          }
        : null;
    }
    if (detailData.categoryId === 'glamping') {
      const site = detailData.detail.glamping.glampingSite ?? detailData.detail.glamping.sites?.[0];
      return site ? { entityType: 'glamping_site' as const, entityId: site.id, site } : null;
    }
    if (detailData.categoryId === 'activities') {
      const slot = detailData.detail.activity.slots?.[0];
      return slot ? { entityType: 'activity_slot' as const, entityId: slot.id, slot } : null;
    }
    return null;
  }, [detailData]);

  useEffect(() => {
    if (!detailData) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    if (detailData.categoryId === 'property') {
      const hotel = detailData.detail.hotel;
      const roomType = detailData.roomTypes.roomTypes?.[0];
      setTitle(hotel.title ?? '');
      setDescription(hotel.description ?? '');
      setCity(hotel.locationJson?.city ?? '');
      setPrice(
        String(
          hotel.hotelProperty?.listingType === 'full_property'
            ? hotel.hotelProperty?.pricePerNight ?? roomType?.basePricePerNight ?? ''
            : roomType?.basePricePerNight ?? '',
        ),
      );
      return;
    }
    if (detailData.categoryId === 'packages') {
      const listing = detailData.detail.package;
      setTitle(listing.title ?? '');
      setDescription(listing.description ?? '');
      setCity(listing.locationJson?.city ?? '');
      setPrice(String(listing.pricePerPerson ?? ''));
      setItineraryTitle(listing.itineraries?.[0]?.title ?? '');
      setItineraryDescription(listing.itineraries?.[0]?.description ?? '');
      return;
    }
    if (detailData.categoryId === 'glamping') {
      const listing = detailData.detail.glamping;
      setTitle(listing.title ?? '');
      setDescription(listing.description ?? '');
      setCity(listing.locationJson?.city ?? '');
      setPrice(String(listing.pricePerCampNight ?? ''));
      const cpPlan = listing.mealPlans?.find((plan) => plan.planCode === 'CP');
      setMealPlanPrice(String(cpPlan?.includesBreakfast ? cpPlan?.breakfastPricePp ?? '' : ''));
      return;
    }
    const listing = detailData.detail.activity;
    setTitle(listing.title ?? '');
    setDescription(listing.description ?? '');
    setCity(listing.locationJson?.city ?? '');
    setPrice(String(listing.basePriceAdult ?? ''));
    setSlotLabel(listing.slots?.[0]?.label ?? '');
  }, [detailData]);

  const handleSave = async () => {
    if (!listingId || !detailData) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const numericPrice = parseNumber(price);
      if (detailData.categoryId === 'property') {
        await updateHotelListing(listingId, {
          title,
          description,
          locationJson: city.trim() ? { city: city.trim() } : undefined,
        });
        const roomType = detailData.roomTypes.roomTypes?.[0];
        if (roomType && numericPrice != null) {
          if (detailData.detail.hotel.hotelProperty?.listingType === 'full_property') {
            await upsertHotelPropertyDetails(listingId, { pricePerNight: numericPrice });
          } else {
            await updateHotelRoomType(listingId, roomType.id, { basePricePerNight: numericPrice });
          }
        }
      } else if (detailData.categoryId === 'packages') {
        await updatePackageListing(listingId, {
          title,
          description,
          pricePerPerson: numericPrice,
        });
        if (itineraryTitle.trim()) {
          await upsertPackageItinerary(listingId, {
            dayNumber: 1,
            title: itineraryTitle.trim(),
            description: itineraryDescription.trim() || undefined,
          });
        }
      } else if (detailData.categoryId === 'glamping') {
        await updateGlampingListing(listingId, {
          title,
          description,
          locationJson: city.trim() ? { city: city.trim() } : undefined,
          pricePerCampNight: numericPrice,
        });
        const breakfastPrice = parseNumber(mealPlanPrice);
        if (breakfastPrice != null) {
          await upsertGlampingMealPlan(listingId, {
            planCode: 'CP',
            label: 'With Breakfast',
            includesBreakfast: true,
            breakfastPricePp: breakfastPrice,
            isDefault: true,
          });
        }
      } else {
        await updateActivityListing(listingId, {
          title,
          description,
          locationJson: city.trim() ? { city: city.trim() } : undefined,
          basePriceAdult: numericPrice,
        });
        if (slotLabel.trim() && primaryEntity?.entityType === 'activity_slot') {
          await updateActivitySlot(listingId, primaryEntity.entityId, { label: slotLabel.trim() });
        }
      }
      await query.refetch();
      setSuccessMessage('Changes saved successfully.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalendarPricing = async () => {
    if (!primaryEntity || !calendarDate.trim()) {
      setErrorMessage('Enter a date and ensure this listing supports calendar pricing.');
      return;
    }
    const numericPrice = parseNumber(calendarPrice);
    if (numericPrice == null) {
      setErrorMessage('Enter a valid override price.');
      return;
    }
    setIsApplyingCalendar(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await updateAvailabilityPriceOverride(primaryEntity.entityType, primaryEntity.entityId, {
        overrides: [{ date: calendarDate.trim(), price: numericPrice }],
      });
      setSuccessMessage('Calendar price updated.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsApplyingCalendar(false);
    }
  };

  const handleSoftDisable = async () => {
    if (!listingId || !detailData || !primaryEntity) return;
    setIsSoftDisabling(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      if (detailData.categoryId === 'property' && 'roomType' in primaryEntity) {
        await updateHotelRoomType(listingId, primaryEntity.roomType.id, { isActive: false });
        setSuccessMessage('Room type disabled.');
      } else if (detailData.categoryId === 'activities' && 'slot' in primaryEntity) {
        await updateActivitySlot(listingId, primaryEntity.slot.id, { isActive: false });
        setSuccessMessage('Activity slot disabled.');
      } else {
        setErrorMessage('Soft disable is not supported for this listing type.');
      }
      await query.refetch();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSoftDisabling(false);
    }
  };

  const handleCreateSlot = async () => {
    if (!listingId || categoryId !== 'activities' || !slotLabel.trim()) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await createActivitySlotForListing(listingId, { label: slotLabel.trim() });
      await query.refetch();
      setSuccessMessage('Activity slot created.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (!listingId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.page}>
          <VendorDashboardTopBar />
          <View style={styles.centerState}>
            <Text style={styles.errorText}>No listing selected.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset + 72 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.screenHeader}>
            <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
            </Pressable>
            <Text style={styles.screenTitle}>
              {VENDOR_EDIT_LISTING_COPY.propertyNumber(headerRef)}
            </Text>
          </View>

          <View style={styles.nameBanner}>
            <Text style={styles.nameBannerText}>
              {mode === 'pricing' ? `Pricing: ${displayName}` : displayName}
            </Text>
            <Ionicons name="create-outline" size={16} color={MAROON} />
          </View>

          {query.isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={MAROON} />
            </View>
          ) : null}

          {query.error ? (
            <View style={styles.sectionCard}>
              <Text style={styles.errorText}>{getErrorMessage(query.error)}</Text>
            </View>
          ) : null}

          {!query.isLoading && detailData ? (
            <>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionNote}>
                  Delete is not supported by backend for listings or images. Use this screen for edits,
                  price updates, and soft-disable where supported.
                </Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.titleLabel}</Text>
                <View style={styles.titleField}>
                  <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} multiline />
                </View>

                <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.descriptionLabel}</Text>
                <View style={styles.descriptionBox}>
                  <TextInput
                    style={styles.descriptionInput}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <Text style={styles.fieldLabel}>City</Text>
                <View style={styles.titleField}>
                  <TextInput style={styles.titleInput} value={city} onChangeText={setCity} />
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.fieldLabel}>
                  {categoryId === 'packages'
                    ? 'Price per person'
                    : categoryId === 'glamping'
                      ? 'Price per camp night'
                      : categoryId === 'activities'
                        ? 'Base adult price'
                        : 'Base price'}
                </Text>
                <View style={styles.titleField}>
                  <TextInput
                    style={styles.titleInput}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="Enter amount"
                  />
                </View>
                <Text style={styles.priceHint}>{VENDOR_EDIT_LISTING_COPY.priceHint}</Text>
              </View>

              {categoryId === 'packages' ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.fieldLabel}>Day 1 itinerary</Text>
                  <View style={styles.titleField}>
                    <TextInput
                      style={styles.titleInput}
                      value={itineraryTitle}
                      onChangeText={setItineraryTitle}
                      placeholder="Itinerary title"
                    />
                  </View>
                  <View style={styles.descriptionBox}>
                    <TextInput
                      style={styles.descriptionInput}
                      value={itineraryDescription}
                      onChangeText={setItineraryDescription}
                      multiline
                      placeholder="Itinerary description"
                    />
                  </View>
                  <Text style={styles.sectionNote}>
                    Package API only supports editing `title`, `description`, `pricePerPerson`, and
                    itinerary day upserts. Other package fields are read-only until backend adds them.
                  </Text>
                </View>
              ) : null}

              {categoryId === 'glamping' ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.fieldLabel}>Meal plan breakfast price (CP)</Text>
                  <View style={styles.titleField}>
                    <TextInput
                      style={styles.titleInput}
                      value={mealPlanPrice}
                      onChangeText={setMealPlanPrice}
                      keyboardType="numeric"
                      placeholder="Breakfast price per person"
                    />
                  </View>
                </View>
              ) : null}

              {categoryId === 'activities' ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.fieldLabel}>Primary slot label</Text>
                  <View style={styles.titleField}>
                    <TextInput
                      style={styles.titleInput}
                      value={slotLabel}
                      onChangeText={setSlotLabel}
                      placeholder="Morning Batch"
                    />
                  </View>
                  <View style={styles.inlineActions}>
                    <Pressable style={styles.secondaryBtn} onPress={handleCreateSlot}>
                      <Text style={styles.secondaryBtnText}>Add slot</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.secondaryBtn, styles.softDeleteBtn]}
                      onPress={handleSoftDisable}
                      disabled={isSoftDisabling}
                    >
                      <Text style={styles.softDeleteText}>Disable slot</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              {categoryId === 'property' ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.fieldLabel}>Room management</Text>
                  <Text style={styles.sectionNote}>
                    Whole hotel delete is not supported. If needed, you can soft-disable the first room
                    type from here.
                  </Text>
                  <Pressable
                    style={[styles.secondaryBtn, styles.softDeleteBtn]}
                    onPress={handleSoftDisable}
                    disabled={isSoftDisabling}
                  >
                    <Text style={styles.softDeleteText}>Disable room type</Text>
                  </Pressable>
                </View>
              ) : null}

              {primaryEntity ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.fieldLabel}>Calendar pricing</Text>
                  <View style={styles.titleField}>
                    <TextInput
                      style={styles.titleInput}
                      value={calendarDate}
                      onChangeText={setCalendarDate}
                      placeholder="YYYY-MM-DD"
                    />
                  </View>
                  <View style={styles.titleField}>
                    <TextInput
                      style={styles.titleInput}
                      value={calendarPrice}
                      onChangeText={setCalendarPrice}
                      keyboardType="numeric"
                      placeholder="Override price"
                    />
                  </View>
                  <Pressable
                    style={styles.secondaryBtn}
                    onPress={handleCalendarPricing}
                    disabled={isApplyingCalendar}
                  >
                    <Text style={styles.secondaryBtnText}>
                      {isApplyingCalendar ? 'Applying…' : 'Apply calendar price'}
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              {errorMessage ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {successMessage ? (
                <View style={styles.sectionCard}>
                  <Text style={styles.successText}>{successMessage}</Text>
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { bottom: tabInset }]}>
          <Pressable style={styles.goBackBtn} onPress={() => router.back()}>
            <View style={styles.goBackIcon}>
              <Ionicons name="chevron-back" size={14} color={colors.surface.white} />
            </View>
            <Text style={styles.goBackText}>{VENDOR_EDIT_LISTING_COPY.goBack}</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={handleSave} disabled={isSaving || query.isLoading}>
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : VENDOR_EDIT_LISTING_COPY.saveChanges}</Text>
            <View style={styles.saveIcon}>
              <Ionicons name="save-outline" size={14} color={SAVE_GREEN} />
            </View>
          </Pressable>
        </View>

        <VendorWorkspaceFloatingTabBar activeTab="listings" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    gap: 14,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  nameBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NAME_BANNER_BG,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  nameBannerText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  photoSection: { gap: 8 },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  photoLargeWrap: {
    flex: 1,
    position: 'relative',
  },
  photoLarge: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  photoRowSmall: {
    flexDirection: 'row',
    gap: 8,
  },
  photoSmallWrap: {
    flex: 1,
    position: 'relative',
  },
  photoSmall: {
    width: '100%',
    height: 72,
    borderRadius: 10,
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  addPhotosLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MAROON,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  uploadBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  titleField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: TITLE_BG,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  titleInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.primary,
    padding: 0,
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    padding: 12,
    minHeight: 100,
  },
  descriptionInput: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.primary,
    minHeight: 72,
    padding: 0,
  },
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.45)',
    marginTop: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightPill: {
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface.white,
  },
  highlightPillSelected: {
    borderColor: '#2B6B9C',
    backgroundColor: '#F4F8FA',
  },
  highlightText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.primary,
  },
  highlightTextSelected: {
    fontWeight: typography.fontWeight.semibold,
    color: '#2B6B9C',
  },
  amenitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  addNewBtn: {
    backgroundColor: MAROON,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addNewText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  amenityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityRow: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingVertical: 4,
  },
  amenityLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amenityName: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: colors.text.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  priceAdjustBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  priceAdjustText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 20,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: VENDOR_DASHBOARD_CARD_RADIUS,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 120,
    justifyContent: 'center',
  },
  priceCurrency: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  priceHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: MAROON,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: VENDOR_DASHBOARD_CARD_BORDER,
    backgroundColor: colors.surface.white,
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
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: SAVE_GREEN,
    borderRadius: 24,
    paddingVertical: 12,
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  saveIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
