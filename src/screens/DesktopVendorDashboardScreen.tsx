import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorDashboardBookingList } from '@/src/components/desktop/DesktopVendorDashboardBookingList';
import { DesktopVendorDashboardCategoryTabs } from '@/src/components/desktop/DesktopVendorDashboardCategoryTabs';
import { DesktopVendorFilterModal } from '@/src/components/desktop/DesktopVendorFilterModal';
import { DesktopVendorMarkUnavailabilityModal } from '@/src/components/desktop/DesktopVendorMarkUnavailabilityModal';
import { DesktopVendorWebHeader } from '@/src/components/desktop/DesktopVendorWebHeader';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  VENDOR_DASHBOARD_COPY,
  VENDOR_DASHBOARD_PROPERTIES,
  VENDOR_DASHBOARD_SORT_OPTIONS,
} from '@/src/constants/vendorDashboardConstants';
import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FIGMA_PAGE_WIDTH = 1280;
const FIGMA_CONTENT_WIDTH = 1196;
const FIGMA_TITLE = '#0F1A20';
const FIGMA_MARK_RED = '#D72626';
const FIGMA_PROPERTY_BG = '#0F1A20';
const FIGMA_BLUE = '#2C6F9C';

export function DesktopVendorDashboardScreen() {
  const { width } = useResponsive();
  const compact = width > 0 && width < 980;
  const storedCategory = useVendorListingCategory();

  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(storedCategory);
  const [propertyId, setPropertyId] = useState(VENDOR_DASHBOARD_PROPERTIES[0].id);
  const [sortId, setSortId] = useState('date');
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [markUnavailableOpen, setMarkUnavailableOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  const activeProperty =
    VENDOR_DASHBOARD_PROPERTIES.find((p) => p.id === propertyId) ?? VENDOR_DASHBOARD_PROPERTIES[0];

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.pageShell}>
        <DesktopVendorWebHeader compact={compact} />

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyScrollContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          <View style={styles.content}>
            <DesktopVendorDashboardCategoryTabs selectedId={categoryId} onSelect={setCategoryId} />

            <View style={styles.toolbarRow}>
              <Text style={styles.dashboardTitle}>{VENDOR_DASHBOARD_COPY.dashboardTitle}</Text>

              <View style={styles.toolbarActions}>
                <Pressable
                  style={styles.propertySelect}
                  onPress={() => setPropertyOpen(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.propertySelectText} numberOfLines={1}>
                    {activeProperty.label}
                  </Text>
                  <Ionicons name="chevron-down" size={24} color={colors.surface.white} />
                </Pressable>

                <Pressable
                  style={styles.markUnavailableBtn}
                  onPress={() => setMarkUnavailableOpen(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.markUnavailableText}>
                    {VENDOR_DASHBOARD_COPY.markUnavailability}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color={colors.surface.white} />
                </Pressable>

                <Pressable
                  style={styles.filterBtn}
                  onPress={() => setFilterOpen(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.filterBtnText}>Filter</Text>
                  <Ionicons name="calendar-outline" size={18} color={FIGMA_TITLE} />
                </Pressable>

                <Pressable
                  style={styles.sortBtn}
                  onPress={() => setSortOpen(true)}
                  accessibilityRole="button"
                >
                  <Ionicons name="swap-vertical" size={24} color={FIGMA_TITLE} />
                </Pressable>
              </View>
            </View>

            <DesktopVendorDashboardBookingList />
          </View>
        </ScrollView>
      </View>

      <VendorPropertyOptionSheet
        visible={propertyOpen}
        title="Select property"
        options={VENDOR_DASHBOARD_PROPERTIES.map((p) => ({ id: p.id, label: p.label }))}
        selectedId={propertyId}
        onClose={() => setPropertyOpen(false)}
        onSelect={(id) => {
          setPropertyId(id);
          setPropertyOpen(false);
        }}
      />

      <VendorPropertyOptionSheet
        visible={sortOpen}
        title={VENDOR_DASHBOARD_COPY.sortLabel}
        options={VENDOR_DASHBOARD_SORT_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
        selectedId={sortId}
        onClose={() => setSortOpen(false)}
        onSelect={(id) => {
          setSortId(id);
          setSortOpen(false);
        }}
      />

      <DesktopVendorMarkUnavailabilityModal
        visible={markUnavailableOpen}
        propertyId={propertyId}
        onPropertyChange={setPropertyId}
        onClose={() => setMarkUnavailableOpen(false)}
      />

      <DesktopVendorFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  pageShell: {
    flex: 1,
    width: '100%',
    maxWidth: FIGMA_PAGE_WIDTH,
    alignSelf: 'center',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    paddingHorizontal: 42,
    paddingBottom: 48,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: FIGMA_CONTENT_WIDTH,
    gap: 36,
    paddingTop: 32,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 25,
    width: '100%',
    minHeight: 42,
  },
  dashboardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
    letterSpacing: 0.48,
    color: FIGMA_TITLE,
    flexShrink: 0,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexShrink: 1,
    justifyContent: 'flex-end',
  },
  propertySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    maxWidth: 313,
    flexShrink: 1,
    paddingHorizontal: 18,
    backgroundColor: FIGMA_PROPERTY_BG,
    borderRadius: 8,
    ...Platform.select({
      web: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)', cursor: 'pointer' as const },
    }),
  },
  propertySelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 21,
    letterSpacing: 0.28,
    color: colors.surface.white,
  },
  markUnavailableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    paddingHorizontal: 18,
    backgroundColor: FIGMA_MARK_RED,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  markUnavailableText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 21,
    letterSpacing: 0.28,
    color: colors.surface.white,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 26, 32, 0.4)',
    borderRadius: 8,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  filterBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 21,
    letterSpacing: 0.28,
    color: FIGMA_TITLE,
  },
  sortBtn: {
    width: 40,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(15, 26, 32, 0.4)',
    borderRadius: 8,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
});
