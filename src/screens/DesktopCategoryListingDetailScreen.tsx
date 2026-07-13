import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopSearchResultsHeader } from '@/src/components/desktop/DesktopSearchResultsHeader';
import { DesktopBookingFocusOverlay } from '@/src/components/desktop/DesktopBookingFocusOverlay';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import type { DesktopBookingFocusState } from '@/src/hooks/useDesktopBookingFocus';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import type { CategoryDetailDisplay } from '@/src/utils/categoryDetailDisplay';
import {
  mergeActivityDetailContent,
  mergeGlampingDetailContent,
  mergePackageDetailContent,
} from '@/src/utils/mergeCategoryDetailContent';
import {
  ACTIVITY_EXPANDED_IMAGE,
  GLAMPING_EXPANDED_IMAGE,
  PACKAGE_EXPANDED_IMAGE,
} from '@/src/constants/placeholderImages';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

type CategoryDetailCopy = {
  searchLabel: string;
  title: string;
  locationLabel: string;
  rating: string;
  customersLabel: string;
  description: string;
  providesTitle: string;
  providesLink: string;
  provides: Array<{ id: string; label: string; icon?: keyof typeof Ionicons.glyphMap }>;
  priceLabel: string;
  taxLabel: string;
  cancellationText: string;
  durationLabel: string;
  primaryButtons: { contact: string; book: string };
  heroImage: number;
};

function copyForTab(
  tab: HomeCategoryTab,
  title?: string,
  price?: string,
  display?: CategoryDetailDisplay,
): CategoryDetailCopy {
  if (tab === 'packages') {
    const figma = mergePackageDetailContent(display);
    return {
      searchLabel: figma.searchLabel,
      title: title ?? figma.title,
      locationLabel: display?.locationLabel ?? 'Singapore',
      rating: figma.rating,
      customersLabel: figma.customersLabel,
      description: figma.description,
      providesTitle: figma.providesTitle,
      providesLink: figma.providesLink,
      provides: figma.provides,
      priceLabel: price ?? figma.priceLabel,
      taxLabel: figma.taxLabel,
      cancellationText: figma.cancellationText,
      durationLabel: figma.nightsLabel,
      primaryButtons: { contact: 'Contact Us', book: display?.bookingMode === 'enquiry_only' ? 'Send Enquiry' : 'Book Now' },
      heroImage: PACKAGE_EXPANDED_IMAGE,
    };
  }
  if (tab === 'glamping') {
    const figma = mergeGlampingDetailContent(display);
    return {
      searchLabel: figma.searchLabel,
      title: title ?? figma.title,
      locationLabel: figma.locationLabel,
      rating: figma.rating,
      customersLabel: figma.customersLabel,
      description: figma.descriptionBlocks.join('\n\n'),
      providesTitle: figma.providesTitle,
      providesLink: figma.providesLink,
      provides: figma.provides.map((p) => ({ ...p, icon: 'leaf-outline' as const })),
      priceLabel: price ?? figma.priceLabel,
      taxLabel: figma.taxLabel,
      cancellationText: figma.cancellationText,
      durationLabel: figma.nightsLabel,
      primaryButtons: figma.primaryButtons,
      heroImage: GLAMPING_EXPANDED_IMAGE,
    };
  }
  const figma = mergeActivityDetailContent(display);
  return {
    searchLabel: figma.searchLabel,
    title: title ?? figma.title,
    locationLabel: figma.locationLabel,
    rating: figma.rating,
    customersLabel: figma.customersLabel,
    description: figma.descriptionBlocks.join('\n\n'),
    providesTitle: figma.providesTitle,
    providesLink: figma.providesLink,
    provides: figma.provides,
    priceLabel: price ?? figma.priceLabel,
    taxLabel: figma.taxLabel,
    cancellationText: figma.cancellationText,
    durationLabel: figma.durationLabel,
    primaryButtons: figma.primaryButtons,
    heroImage: ACTIVITY_EXPANDED_IMAGE,
  };
}

type DesktopCategoryListingDetailScreenProps = {
  tab: HomeCategoryTab;
  title?: string;
  priceLabel?: string;
  display?: CategoryDetailDisplay;
  onBookNow: () => void;
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
  onBack?: () => void;
  onTabChange?: (tab: HomeCategoryTab) => void;
  bookingFocus?: DesktopBookingFocusState;
};

export function DesktopCategoryListingDetailScreen({
  tab,
  title,
  priceLabel,
  display,
  onBookNow,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
  onBack,
  onTabChange,
  bookingFocus,
}: DesktopCategoryListingDetailScreenProps) {
  const copy = copyForTab(tab, title, priceLabel, display);

  return (
    <View style={styles.pageRoot}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        scrollEnabled={!bookingFocus?.visible}
      >
        <View style={styles.contentShell}>
          <View style={styles.headerWrap}>
            <DesktopSearchResultsHeader
              activeTab={tab}
              onTabChange={onTabChange ?? (() => {})}
              isLoggedIn={isLoggedIn}
              onMenuPress={onMenuPress}
              onProfilePress={onProfilePress}
              onLoginPress={onLoginPress}
            />
          </View>

          <View style={styles.main}>
          {onBack ? (
            <Pressable style={styles.backRow} onPress={onBack} accessibilityLabel="Back to search results">
              <Ionicons name="arrow-back" size={18} color={colors.text.primary} />
              <Text style={styles.backText}>Back to results</Text>
            </Pressable>
          ) : null}
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyTitle}>{copy.title}</Text>
            <Pressable style={styles.viewLocationBtn}>
              <Text style={styles.viewLocationText}>{copy.locationLabel}</Text>
              <Ionicons name="location-outline" size={16} color={colors.accent.main} />
            </Pressable>
          </View>

          <View style={styles.featuredRow}>
            <View style={styles.galleryCol}>
              <Image source={copy.heroImage} style={styles.galleryImage} resizeMode="cover" />
              <View style={styles.galleryActions}>
                <Pressable style={styles.shareBtn}>
                  <Ionicons name="share-outline" size={18} color={colors.text.primary} />
                </Pressable>
                <Pressable style={styles.saveBtn}>
                  <Ionicons name="heart" size={18} color={colors.surface.white} />
                </Pressable>
              </View>
            </View>

            <View style={styles.featuredPanel}>
              <View style={styles.coupleBadge}>
                <Text style={styles.coupleBadgeText}>COUPLE</Text>
              </View>

              <Text style={styles.featuredDesc}>{copy.description}</Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.accent.main} />
                <Text style={styles.ratingValue}>{copy.rating}</Text>
                <Text style={styles.ratingDivider}>|</Text>
                <Text style={styles.customersLabel}>{copy.customersLabel}</Text>
              </View>

              <View style={styles.amenitiesSection}>
                <View style={styles.amenitiesHeader}>
                  <Text style={styles.amenitiesTitle}>{copy.providesTitle}</Text>
                  <Pressable>
                    <Text style={styles.amenitiesLink}>{copy.providesLink}</Text>
                  </Pressable>
                </View>
                <View style={styles.providesGrid}>
                  {copy.provides.map((item) => (
                    <View key={item.id} style={styles.provideChip}>
                      <View style={styles.provideIcon}>
                        <Ionicons
                          name={item.icon ?? 'checkmark-circle-outline'}
                          size={18}
                          color={colors.text.primary}
                        />
                      </View>
                      <Text style={styles.provideLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.durationLabel}>{copy.durationLabel}</Text>
                  <Text style={styles.cancelText}>{copy.cancellationText}</Text>
                </View>
                <View style={styles.priceRight}>
                  <Text style={styles.price}>{copy.priceLabel}</Text>
                  <Text style={styles.tax}>{copy.taxLabel}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.outlineBtn}>
                  <Text style={styles.outlineBtnText}>{copy.primaryButtons.contact}</Text>
                </Pressable>
                <Pressable style={styles.bookBtn} onPress={onBookNow}>
                  <Text style={styles.bookBtnText}>{copy.primaryButtons.book}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        </View>

        <DesktopSiteFooter />
      </ScrollView>

      {bookingFocus ? (
        <DesktopBookingFocusOverlay
          visible={bookingFocus.visible}
          sectionTitle={bookingFocus.sectionTitle}
        >
          {bookingFocus.modalContent}
        </DesktopBookingFocusOverlay>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.surface.white,
    position: 'relative',
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  contentShell: {
    ...desktopContentShellStyle,
  },
  headerWrap: {
    width: '100%',
    paddingTop: 24,
    zIndex: 100,
  },
  main: {
    width: '100%',
    paddingTop: 24,
    gap: 24,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  propertyHeader: {
    gap: 12,
  },
  propertyTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewLocationBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewLocationText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  featuredRow: {
    flexDirection: 'row',
    gap: 24,
  },
  galleryCol: {
    flex: 1.15,
    minWidth: 480,
    height: 413,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryActions: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  shareBtn: {
    width: 40,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredPanel: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    borderRadius: 16,
    padding: 24,
    gap: 16,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
      default: {},
    }),
  },
  coupleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  coupleBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: '#D63384',
    letterSpacing: 0.5,
  },
  featuredDesc: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.75)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  ratingDivider: {
    color: 'rgba(28, 32, 36, 0.3)',
  },
  customersLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  amenitiesSection: {
    gap: 12,
  },
  amenitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenitiesTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  amenitiesLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.accent.main,
  },
  providesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  provideChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '45%',
    minWidth: 180,
  },
  provideIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 77, 46, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  provideLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderRadius: 12,
    padding: 18,
  },
  durationLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
  },
  cancelText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 8,
  },
  priceRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  tax: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  bookBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
