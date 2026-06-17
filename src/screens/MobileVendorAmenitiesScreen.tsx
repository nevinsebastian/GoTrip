import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import {
  VENDOR_AMENITIES,
  VENDOR_AMENITIES_COPY,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const DEFAULT_SELECTED = ['kitchen', 'parking', 'breakfast', 'ac', 'bathroom'];

export function MobileVendorAmenitiesScreen() {
  const categoryId = useVendorListingCategory();
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTED);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyToAllRooms, setApplyToAllRooms] = useState(true);

  const filteredAmenities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return VENDOR_AMENITIES;
    return VENDOR_AMENITIES.filter((item) => item.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const toggleAmenity = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId={categoryId} />
          <Text style={styles.title}>{VENDOR_AMENITIES_COPY.title}</Text>

          <View style={styles.toolbar}>
            <Pressable style={styles.roomPill} accessibilityRole="button">
              <Text style={styles.roomPillText}>1/2 Room 1 - Deluxe AC</Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </Pressable>
            <View style={styles.applyRow}>
              <Text style={styles.applyLabel}>{VENDOR_AMENITIES_COPY.applyAll}</Text>
              <Switch
                value={applyToAllRooms}
                onValueChange={setApplyToAllRooms}
                trackColor={{ false: 'rgba(28,32,36,0.15)', true: 'rgba(232,84,51,0.35)' }}
                thumbColor={applyToAllRooms ? colors.accent.main : colors.surface.white}
              />
            </View>
          </View>

          <View style={styles.searchBar}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={VENDOR_AMENITIES_COPY.searchPlaceholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.searchInput}
            />
            <Ionicons name="search" size={18} color="rgba(28, 32, 36, 0.45)" />
          </View>

          <View style={styles.grid}>
            {filteredAmenities.map((amenity) => {
              const selected = selectedIds.includes(amenity.id);
              return (
                <Pressable
                  key={amenity.id}
                  style={({ pressed }) => [
                    styles.amenityCard,
                    selected && styles.amenityCardSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggleAmenity(amenity.id)}
                  accessibilityRole="button"
                >
                  <View style={[styles.amenityIconWrap, selected && styles.amenityIconWrapSelected]}>
                    <Ionicons
                      name={amenity.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={selected ? colors.accent.main : 'rgba(28, 32, 36, 0.4)'}
                    />
                  </View>
                  <Text
                    style={[styles.amenityLabel, selected && styles.amenityLabelSelected]}
                    numberOfLines={2}
                  >
                    {amenity.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/photos')}
          nextLabel="Next"
          nextSuffix={VENDOR_AMENITIES_COPY.nextSuffix}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 14,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  toolbar: {
    gap: 10,
  },
  roomPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    paddingVertical: 8,
  },
  roomPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  applyLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 40,
    paddingHorizontal: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityCard: {
    width: '31%',
    minHeight: 88,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2'],
    gap: 8,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  amenityCardSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.04)',
  },
  amenityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(28, 32, 36, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityIconWrapSelected: {
    backgroundColor: 'rgba(232, 84, 51, 0.12)',
  },
  amenityLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(28, 32, 36, 0.55)',
  },
  amenityLabelSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  pressed: { opacity: 0.85 },
});
