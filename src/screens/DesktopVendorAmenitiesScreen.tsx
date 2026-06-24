import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import {
  VENDOR_AMENITIES,
  VENDOR_AMENITIES_COPY,
  VENDOR_PRICING_ROOMS,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

const DEFAULT_SELECTED = ['kitchen', 'parking', 'breakfast', 'ac', 'bathroom'];

const ROOM_OPTIONS = VENDOR_PRICING_ROOMS.map((room) => ({
  value: room.id,
  label: `${room.roomIndex}/${room.roomTotal} ${room.label}`,
}));

export function DesktopVendorAmenitiesScreen() {
  const listingCategoryId = useVendorListingCategory();
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTED);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyToAllRooms, setApplyToAllRooms] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOM_OPTIONS[0].value);

  const selectedRoomLabel =
    ROOM_OPTIONS.find((room) => room.value === selectedRoomId)?.label ?? ROOM_OPTIONS[0].label;

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
    <DesktopVendorOnboardingShell
      layout="single"
      listingCategoryId={listingCategoryId}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/photos')}
          nextLabel="Next"
          nextSuffix={VENDOR_AMENITIES_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{VENDOR_AMENITIES_COPY.title}</Text>

        <View style={styles.toolbar}>
          <View style={styles.roomPillWrap}>
            <View style={styles.roomPillVisual} pointerEvents="none">
              <Text style={styles.roomPillText}>{selectedRoomLabel}</Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </View>
            <View style={styles.roomPillSelectOverlay}>
              <DesktopInlineSelect
                value={selectedRoomId}
                options={ROOM_OPTIONS}
                onSelect={setSelectedRoomId}
                menuMaxHeight={160}
              />
            </View>
          </View>

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
                    size={20}
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
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 26,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  roomPillWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  roomPillVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    paddingVertical: 10,
    minHeight: 40,
  },
  roomPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  roomPillSelectOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    overflow: 'hidden',
    borderRadius: borderRadius.pill,
  },
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  applyLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
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
    width: '18%',
    minWidth: 88,
    minHeight: 96,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 32, 36, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityIconWrapSelected: {
    backgroundColor: 'rgba(232, 84, 51, 0.12)',
  },
  amenityLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    textAlign: 'center',
    color: 'rgba(28, 32, 36, 0.55)',
  },
  amenityLabelSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  pressed: { opacity: 0.85 },
});
