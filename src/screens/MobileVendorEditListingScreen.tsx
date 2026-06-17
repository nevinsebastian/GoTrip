import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_AMENITIES,
} from '@/src/constants/vendorListingConstants';
import {
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_PINK,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const MOCK_PHOTOS = [require('../../loginimage.png'), require('../../loginimage.png')];
const DEFAULT_AMENITIES = ['kitchen', 'parking', 'ac', 'wifi'];

export function MobileVendorEditListingScreen() {
  const [title, setTitle] = useState('Luxury Glamping Tent');
  const [description, setDescription] = useState(
    'A serene glamping experience with ocean views and premium amenities.',
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(DEFAULT_AMENITIES);
  const [price, setPrice] = useState('4500');

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.topTitle}>Edit Listing</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.photoGrid}>
            {MOCK_PHOTOS.map((photo, index) => (
              <Image key={index} source={photo} style={styles.photo} resizeMode="cover" />
            ))}
            <Pressable style={styles.addPhoto}>
              <Ionicons name="add" size={24} color="rgba(28, 32, 36, 0.45)" />
              <Text style={styles.addPhotoText}>Add Photos</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Title</Text>
          <Input value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Description</Text>
          <Input value={description} onChangeText={setDescription} multiline numberOfLines={4} />

          <Text style={styles.label}>Price per night (₹)</Text>
          <Input value={price} onChangeText={setPrice} keyboardType="numeric" />

          <Text style={styles.label}>Amenities</Text>
          <View style={styles.amenityGrid}>
            {VENDOR_AMENITIES.slice(0, 8).map((amenity) => {
              const selected = selectedAmenities.includes(amenity.id);
              return (
                <Pressable
                  key={amenity.id}
                  style={[styles.amenityChip, selected && styles.amenityChipSelected]}
                  onPress={() => toggleAmenity(amenity.id)}
                >
                  <Ionicons
                    name={amenity.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={selected ? VENDOR_WORKSPACE_PINK : 'rgba(28, 32, 36, 0.55)'}
                  />
                  <Text style={[styles.amenityLabel, selected && styles.amenityLabelSelected]}>
                    {amenity.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.mapPlaceholder}>
            <Ionicons name="location-outline" size={20} color="rgba(28, 32, 36, 0.45)" />
            <Text style={styles.mapText}>Varkala, Kerala</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.saveBtn} onPress={() => router.back()}>
            <Text style={styles.saveBtnText}>{VENDOR_WORKSPACE_COPY.saveChanges}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  topTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
  },
  addPhoto: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginTop: 4,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  amenityChipSelected: {
    borderColor: VENDOR_WORKSPACE_PINK,
    backgroundColor: 'rgba(194, 24, 91, 0.06)',
  },
  amenityLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  amenityLabelSelected: {
    color: VENDOR_WORKSPACE_PINK,
    fontWeight: typography.fontWeight.semibold,
  },
  mapPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 14,
    marginTop: 4,
  },
  mapText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  footer: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
  },
  saveBtn: {
    backgroundColor: VENDOR_WORKSPACE_PINK,
    borderRadius: borderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
