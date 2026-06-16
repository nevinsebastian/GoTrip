import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VendorUploadOptionsSheet } from '@/src/components/vendor/VendorUploadOptionsSheet';
import {
  VENDOR_MOCK_PHOTO_SOURCES,
  VENDOR_PHOTOS_COPY,
  type VendorListingPhoto,
} from '@/src/constants/vendorListingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

function createPhotoFromSource(source: (typeof VENDOR_MOCK_PHOTO_SOURCES)[number], index: number): VendorListingPhoto {
  return {
    id: `photo-${Date.now()}-${index}`,
    source,
    label: `Photo ${index + 1}`,
  };
}

export function MobileVendorPhotosScreen() {
  const [photos, setPhotos] = useState<VendorListingPhoto[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mockUploadIndex, setMockUploadIndex] = useState(0);

  const hasPhotos = photos.length > 0;
  const activePhoto = photos[activeIndex] ?? photos[0] ?? null;
  const coverId = coverPhotoId ?? photos[0]?.id ?? null;

  const handleUpload = () => {
    const source = VENDOR_MOCK_PHOTO_SOURCES[mockUploadIndex % VENDOR_MOCK_PHOTO_SOURCES.length];
    const nextPhoto = createPhotoFromSource(source, mockUploadIndex);
    setPhotos((prev) => {
      const next = [...prev, nextPhoto];
      if (!coverPhotoId) setCoverPhotoId(nextPhoto.id);
      return next;
    });
    setMockUploadIndex((i) => i + 1);
    setActiveIndex(photos.length);
    setUploadOpen(false);
  };

  const setAsCover = (id: string) => {
    setCoverPhotoId(id);
    const index = photos.findIndex((p) => p.id === id);
    if (index >= 0) setActiveIndex(index);
  };

  const showNext = () => {
    if (!photos.length) return;
    setActiveIndex((i) => (i + 1) % photos.length);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId="property" />
          <Text style={styles.title}>{VENDOR_PHOTOS_COPY.title}</Text>
          <Text style={styles.subtitle}>
            {hasPhotos ? VENDOR_PHOTOS_COPY.subtitleFilled : VENDOR_PHOTOS_COPY.subtitleEmpty}
          </Text>

          {!hasPhotos ? (
            <Pressable
              style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}
              onPress={() => setUploadOpen(true)}
              accessibilityRole="button"
            >
              <Ionicons name="images-outline" size={40} color="rgba(28, 32, 36, 0.35)" />
              <Text style={styles.dragHint}>{VENDOR_PHOTOS_COPY.dragHint}</Text>
              <View style={styles.orRow}>
                <View style={styles.orLineAccent} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLineMuted} />
              </View>
              <Text style={styles.uploadLink}>{VENDOR_PHOTOS_COPY.uploadLink}</Text>
            </Pressable>
          ) : (
            <>
              <View style={styles.previewWrap}>
                {activePhoto ? (
                  <Image source={activePhoto.source} style={styles.previewImage} resizeMode="cover" />
                ) : null}
                {activePhoto && activePhoto.id === coverId ? (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>{VENDOR_PHOTOS_COPY.coverBadge}</Text>
                  </View>
                ) : null}
                {activePhoto && activePhoto.id !== coverId ? (
                  <Pressable
                    style={({ pressed }) => [styles.makeCoverOverlay, pressed && styles.pressed]}
                    onPress={() => setAsCover(activePhoto.id)}
                  >
                    <Text style={styles.makeCoverOverlayText}>{VENDOR_PHOTOS_COPY.makeCover}</Text>
                  </Pressable>
                ) : null}
                {photos.length > 1 ? (
                  <Pressable style={styles.carouselNext} onPress={showNext} accessibilityRole="button">
                    <Ionicons name="chevron-forward" size={18} color={colors.text.primary} />
                  </Pressable>
                ) : null}
              </View>

              <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbList}
                renderItem={({ item, index }) => {
                  const isCover = item.id === coverId;
                  return (
                    <View style={styles.thumbCard}>
                      <Pressable onPress={() => setActiveIndex(index)} style={styles.thumbPressable}>
                        <Image source={item.source} style={styles.thumbImage} resizeMode="cover" />
                        {isCover ? (
                          <View style={styles.thumbCoverBadge}>
                            <Text style={styles.thumbCoverText}>Cover</Text>
                          </View>
                        ) : null}
                      </Pressable>
                      {!isCover ? (
                        <Pressable
                          style={({ pressed }) => [styles.makeCoverBtn, pressed && styles.pressed]}
                          onPress={() => setAsCover(item.id)}
                        >
                          <Text style={styles.makeCoverText}>{VENDOR_PHOTOS_COPY.makeCover}</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                }}
              />

              <Pressable
                style={({ pressed }) => [styles.addMoreBtn, pressed && styles.pressed]}
                onPress={() => setUploadOpen(true)}
              >
                <Ionicons name="add" size={18} color={colors.accent.main} />
                <Text style={styles.addMoreText}>Add more photos</Text>
              </Pressable>
            </>
          )}
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.replace('/vendor')}
          nextLabel="Next"
        />
      </View>

      <VendorUploadOptionsSheet
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSelect={handleUpload}
        title="Add photos"
        subtitle="Choose how you want to upload your listing photos"
      />
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
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['6'],
    paddingHorizontal: spacing['4'],
    gap: 12,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  dragHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    color: colors.text.primary,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: spacing['2'],
  },
  orLineAccent: { flex: 1, height: 1, backgroundColor: colors.accent.main },
  orLineMuted: { flex: 1, height: 1, backgroundColor: 'rgba(28, 32, 36, 0.15)' },
  orText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(0, 5, 29, 0.45)',
  },
  uploadLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textDecorationLine: 'underline',
  },
  previewWrap: {
    height: 220,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    top: spacing['3'],
    left: spacing['3'],
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    paddingVertical: 6,
  },
  coverBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  makeCoverOverlay: {
    position: 'absolute',
    bottom: spacing['3'],
    alignSelf: 'center',
    left: spacing['3'],
    right: spacing['3'],
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: borderRadius.pill,
    paddingVertical: 8,
    alignItems: 'center',
  },
  makeCoverOverlayText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  carouselNext: {
    position: 'absolute',
    right: spacing['3'],
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbList: {
    gap: 10,
    paddingVertical: 4,
  },
  thumbCard: {
    width: 120,
    gap: 6,
  },
  thumbPressable: {
    position: 'relative',
  },
  thumbImage: {
    width: 120,
    height: 80,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  thumbCoverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  thumbCoverText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 9,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  makeCoverBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  makeCoverText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: colors.accent.main,
    textDecorationLine: 'underline',
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
  },
  addMoreText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  pressed: { opacity: 0.85 },
});
