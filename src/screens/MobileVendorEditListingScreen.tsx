import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardCategoryTabs } from '@/src/components/vendor/dashboard/VendorDashboardCategoryTabs';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import {
  VENDOR_EDIT_LISTING_AMENITIES,
  VENDOR_EDIT_LISTING_COPY,
  VENDOR_EDIT_LISTING_DEFAULT,
  VENDOR_EDIT_LISTING_HIGHLIGHTS,
} from '@/src/constants/vendorEditListingConstants';
import { VENDOR_DASHBOARD_CARD_BORDER, VENDOR_DASHBOARD_CARD_RADIUS } from '@/src/constants/vendorDashboardConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const MAROON = '#9F1239';
const SAVE_GREEN = '#22C55E';
const TITLE_BG = '#F4F8FA';
const NAME_BANNER_BG = '#F9E8EE';

export function MobileVendorEditListingScreen() {
  const storedCategory = useVendorListingCategory();
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
  const tabInset = useVendorTabBarInset();

  const [photos, setPhotos] = useState(VENDOR_EDIT_LISTING_DEFAULT.photos);
  const [title, setTitle] = useState(VENDOR_EDIT_LISTING_DEFAULT.title);
  const [description, setDescription] = useState(VENDOR_EDIT_LISTING_DEFAULT.description);
  const [highlights, setHighlights] = useState<string[]>(VENDOR_EDIT_LISTING_DEFAULT.defaultHighlights);
  const [amenities, setAmenities] = useState(VENDOR_EDIT_LISTING_AMENITIES);
  const [price, setPrice] = useState(VENDOR_EDIT_LISTING_DEFAULT.price);

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const toggleHighlight = (id: string) => {
    setHighlights((prev) => {
      if (prev.includes(id)) return prev.filter((h) => h !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAmenity = (id: string) => {
    setAmenities((prev) => prev.filter((a) => a.id !== id));
  };

  const adjustPrice = (delta: number) => {
    setPrice((prev) => Math.max(0, prev + delta));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset + 72 }]}
          showsVerticalScrollIndicator={false}
        >
          <VendorDashboardCategoryTabs selectedId={categoryId} onSelect={setCategoryId} />

          <View style={styles.screenHeader}>
            <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
            </Pressable>
            <Text style={styles.screenTitle}>
              {VENDOR_EDIT_LISTING_COPY.propertyNumber(VENDOR_EDIT_LISTING_DEFAULT.listingRef)}
            </Text>
          </View>

          <View style={styles.nameBanner}>
            <Text style={styles.nameBannerText}>{VENDOR_EDIT_LISTING_DEFAULT.propertyName}</Text>
            <Ionicons name="create-outline" size={16} color={MAROON} />
          </View>

          <View style={styles.photoSection}>
            <View style={styles.photoGrid}>
              {photos[0] ? (
                <View style={styles.photoLargeWrap}>
                  <Image source={photos[0]} style={styles.photoLarge} resizeMode="cover" />
                  <Pressable style={styles.deletePhotoBtn} onPress={() => removePhoto(0)}>
                    <Ionicons name="trash" size={10} color={colors.surface.white} />
                  </Pressable>
                </View>
              ) : null}
              {photos[1] ? (
                <View style={styles.photoLargeWrap}>
                  <Image source={photos[1]} style={styles.photoLarge} resizeMode="cover" />
                  <Pressable style={styles.deletePhotoBtn} onPress={() => removePhoto(1)}>
                    <Ionicons name="trash" size={10} color={colors.surface.white} />
                  </Pressable>
                </View>
              ) : null}
            </View>
            <View style={styles.photoRowSmall}>
              {photos.slice(2, 5).map((photo, index) => {
                const photoIndex = index + 2;
                return (
                  <View key={photoIndex} style={styles.photoSmallWrap}>
                    <Image source={photo} style={styles.photoSmall} resizeMode="cover" />
                    <Pressable style={styles.deletePhotoBtn} onPress={() => removePhoto(photoIndex)}>
                      <Ionicons name="trash" size={10} color={colors.surface.white} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
            <View style={styles.uploadRow}>
              <Text style={styles.addPhotosLabel}>{VENDOR_EDIT_LISTING_COPY.addNewPhotos}</Text>
              <Pressable style={styles.uploadBtn}>
                <Ionicons name="cloud-upload-outline" size={14} color={colors.surface.white} />
                <Text style={styles.uploadBtnText}>{VENDOR_EDIT_LISTING_COPY.uploadFromDevice}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.titleLabel}</Text>
            <View style={styles.titleField}>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                multiline
              />
              <Ionicons name="create-outline" size={16} color="rgba(28, 32, 36, 0.45)" />
            </View>

            <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.descriptionLabel}</Text>
            <View style={styles.descriptionBox}>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={(text) =>
                  setDescription(text.slice(0, VENDOR_EDIT_LISTING_DEFAULT.descriptionMax))
                }
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {description.length}/{VENDOR_EDIT_LISTING_DEFAULT.descriptionMax}
              </Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.highlightsLabel}</Text>
            <View style={styles.highlightRow}>
              {VENDOR_EDIT_LISTING_HIGHLIGHTS.map((item) => {
                const selected = highlights.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.highlightPill, selected && styles.highlightPillSelected]}
                    onPress={() => toggleHighlight(item.id)}
                  >
                    <Text style={[styles.highlightText, selected && styles.highlightTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.amenitiesHeader}>
              <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.amenitiesLabel}</Text>
              <Pressable style={styles.addNewBtn}>
                <Text style={styles.addNewText}>{VENDOR_EDIT_LISTING_COPY.addNew}</Text>
              </Pressable>
            </View>
            <View style={styles.amenityList}>
              {amenities.map((amenity) => (
                <View key={amenity.id} style={styles.amenityRow}>
                  <View style={styles.amenityLeft}>
                    <Ionicons name={amenity.icon} size={14} color="rgba(28, 32, 36, 0.55)" />
                    <Text style={styles.amenityName}>{amenity.label}</Text>
                  </View>
                  <Pressable onPress={() => removeAmenity(amenity.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={16} color={MAROON} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{VENDOR_EDIT_LISTING_COPY.priceLabel}</Text>
            <View style={styles.priceRow}>
              <Pressable style={styles.priceAdjustBtn} onPress={() => adjustPrice(-100)}>
                <Text style={styles.priceAdjustText}>−</Text>
              </Pressable>
              <View style={styles.priceInputBox}>
                <Text style={styles.priceCurrency}>₹</Text>
                <Text style={styles.priceValue}>{price.toLocaleString('en-IN')}</Text>
              </View>
              <Pressable style={styles.priceAdjustBtn} onPress={() => adjustPrice(100)}>
                <Text style={styles.priceAdjustText}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.priceHint}>{VENDOR_EDIT_LISTING_COPY.priceHint}</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { bottom: tabInset }]}>
          <Pressable style={styles.goBackBtn} onPress={() => router.back()}>
            <View style={styles.goBackIcon}>
              <Ionicons name="chevron-back" size={14} color={colors.surface.white} />
            </View>
            <Text style={styles.goBackText}>{VENDOR_EDIT_LISTING_COPY.goBack}</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={() => router.back()}>
            <Text style={styles.saveBtnText}>{VENDOR_EDIT_LISTING_COPY.saveChanges}</Text>
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
