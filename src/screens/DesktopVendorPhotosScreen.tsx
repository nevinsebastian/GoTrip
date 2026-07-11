import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { VendorUploadOptionsSheet } from '@/src/components/vendor/VendorUploadOptionsSheet';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  VENDOR_MOCK_PHOTO_SOURCES,
  VENDOR_PHOTOS_COPY,
  type VendorListingPhoto,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { uploadVendorActivityImagesStep } from '@/src/api/vendorActivityOnboarding.service';
import { uploadVendorPackageImagesStep } from '@/src/api/vendorPackageOnboarding.service';
import { ACTIVITY_PHOTO_LIMITS, VENDOR_ACTIVITY_PHOTOS_COPY } from '@/src/constants/vendorActivityConstants';
import {
  PACKAGE_PHOTO_LIMITS,
  VENDOR_PACKAGE_PHOTOS_COPY,
} from '@/src/constants/vendorPackageConstants';
import { documentToDataUrl, documentsToDataUrls } from '@/src/utils/documentToDataUrl';
import { getVendorActivityDraft, saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { getVendorPackageDraft, saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { pickVendorDocument, type VendorDocumentPickSource, type VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { persistVendorGlampingImages } from '@/src/utils/vendorGlampingImageStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

function createPhotoFromSource(
  source: (typeof VENDOR_MOCK_PHOTO_SOURCES)[number],
  index: number,
): VendorListingPhoto {
  return {
    id: `photo-${Date.now()}-${index}`,
    source,
    label: `Photo ${index + 1}`,
  };
}

export function DesktopVendorPhotosScreen() {
  const listingCategoryId = useVendorListingCategory();
  const isActivity = listingCategoryId === 'activities';
  const isPackage = listingCategoryId === 'packages';
  const [photos, setPhotos] = useState<VendorListingPhoto[]>([]);
  const [glampingPhotos, setGlampingPhotos] = useState<VendorLocalDocument[]>([]);
  const [activityPhotos, setActivityPhotos] = useState<VendorLocalDocument[]>([]);
  const [packagePhotos, setPackagePhotos] = useState<VendorLocalDocument[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mockUploadIndex, setMockUploadIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const localPhotos =
    listingCategoryId === 'glamping'
      ? glampingPhotos
      : isActivity
        ? activityPhotos
        : isPackage
          ? packagePhotos
          : null;
  const hasPhotos = localPhotos ? localPhotos.length > 0 : photos.length > 0;
  const activePhoto = localPhotos
    ? localPhotos[activeIndex] ?? localPhotos[0] ?? null
    : photos[activeIndex] ?? photos[0] ?? null;
  const usesLocalPhotos = Boolean(localPhotos);
  const photoList = localPhotos ?? photos;
  const coverId = coverPhotoId ?? photoList[0]?.id ?? null;

  const handleUpload = async (source: VendorDocumentPickSource) => {
    if (listingCategoryId === 'glamping' || isActivity || isPackage) {
      const targetPhotos =
        listingCategoryId === 'glamping'
          ? glampingPhotos
          : isActivity
            ? activityPhotos
            : packagePhotos;
      const maxPhotos = isActivity
        ? ACTIVITY_PHOTO_LIMITS.max
        : isPackage
          ? PACKAGE_PHOTO_LIMITS.max
          : Number.MAX_SAFE_INTEGER;
      if (targetPhotos.length >= maxPhotos) {
        setSubmitError(`You can upload up to ${maxPhotos} images.`);
        setUploadOpen(false);
        return;
      }
      const doc = await pickVendorDocument(source);
      if (!doc) {
        setUploadOpen(false);
        return;
      }
      const setter =
        listingCategoryId === 'glamping'
          ? setGlampingPhotos
          : isActivity
            ? setActivityPhotos
            : setPackagePhotos;
      setter((prev) => {
        const next = [...prev, doc];
        if (!coverPhotoId) setCoverPhotoId(doc.id);
        return next;
      });
      setActiveIndex(targetPhotos.length);
      setUploadOpen(false);
      return;
    }

    const imgSource = VENDOR_MOCK_PHOTO_SOURCES[mockUploadIndex % VENDOR_MOCK_PHOTO_SOURCES.length];
    const nextPhoto = createPhotoFromSource(imgSource, mockUploadIndex);
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
    const list = localPhotos ?? photos;
    const index = list.findIndex((p) => p.id === id);
    if (index >= 0) setActiveIndex(index);
  };

  const showNext = () => {
    const list = localPhotos ?? photos;
    if (!list.length) return;
    setActiveIndex((i) => (i + 1) % list.length);
  };

  const handleNext = async () => {
    if (listingCategoryId === 'glamping') {
      const images = await Promise.all(glampingPhotos.map(documentToDataUrl));
      await persistVendorGlampingImages(images);
      router.push('/vendor/create-title');
      return;
    }
    if (isActivity) {
      if (activityPhotos.length < ACTIVITY_PHOTO_LIMITS.min) {
        setSubmitError(`Please add at least ${ACTIVITY_PHOTO_LIMITS.min} image.`);
        return;
      }
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const dataUrls = await documentsToDataUrls(activityPhotos);
        await saveVendorActivityDraft({
          ...((await getVendorActivityDraft()) ?? {}),
          images: dataUrls,
        });
        const res = await uploadVendorActivityImagesStep(
          activityPhotos,
          dataUrls.length ? dataUrls : undefined,
        );
        if (!res.success) {
          setSubmitError(res.message ?? 'Could not upload images.');
          return;
        }
        router.push('/vendor/terms');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (isPackage) {
      if (packagePhotos.length < PACKAGE_PHOTO_LIMITS.min) {
        setSubmitError(`Please add at least ${PACKAGE_PHOTO_LIMITS.min} image.`);
        return;
      }
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const dataUrls = await documentsToDataUrls(packagePhotos);
        await saveVendorPackageDraft({
          ...((await getVendorPackageDraft()) ?? {}),
          images: dataUrls,
        });
        const res = await uploadVendorPackageImagesStep(
          packagePhotos,
          dataUrls.length ? dataUrls : undefined,
        );
        if (!res.success) {
          setSubmitError(res.message ?? 'Could not upload images.');
          return;
        }
        router.push('/vendor/publish-listing');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    router.push('/vendor/create-title');
  };

  return (
    <>
      <DesktopVendorOnboardingShell
        listingCategoryId={listingCategoryId}
        heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.photos}
        footer={
          <DesktopVendorOnboardingFooter
            onBack={() => router.back()}
            onNext={handleNext}
            nextLabel="Next"
            nextSuffix={
              isActivity
                ? VENDOR_ACTIVITY_PHOTOS_COPY.nextSuffix
                : isPackage
                  ? VENDOR_PACKAGE_PHOTOS_COPY.nextSuffix
                  : VENDOR_PHOTOS_COPY.nextSuffix
            }
            isNextLoading={isSubmitting}
            nextDisabled={isSubmitting}
          />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {isActivity
              ? VENDOR_ACTIVITY_PHOTOS_COPY.title
              : isPackage
                ? VENDOR_PACKAGE_PHOTOS_COPY.title
                : VENDOR_PHOTOS_COPY.title}
          </Text>
          <Text style={styles.subtitle}>
            {isActivity
              ? VENDOR_ACTIVITY_PHOTOS_COPY.subtitle
              : isPackage
                ? VENDOR_PACKAGE_PHOTOS_COPY.subtitle
                : hasPhotos
                  ? VENDOR_PHOTOS_COPY.subtitleFilled
                  : VENDOR_PHOTOS_COPY.subtitleEmpty}
          </Text>
          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

          {!hasPhotos ? (
            <Pressable
              style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}
              onPress={() => setUploadOpen(true)}
              accessibilityRole="button"
            >
              <Ionicons name="images-outline" size={48} color="rgba(28, 32, 36, 0.35)" />
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
                  <Image
                    source={
                      usesLocalPhotos
                        ? { uri: (activePhoto as VendorLocalDocument).uri }
                        : (activePhoto as unknown as VendorListingPhoto).source
                    }
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
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
                {photoList.length > 1 ? (
                  <Pressable style={styles.carouselNext} onPress={showNext} accessibilityRole="button">
                    <Ionicons name="chevron-forward" size={18} color={colors.text.primary} />
                  </Pressable>
                ) : null}
              </View>

              <FlatList
                data={photoList as VendorLocalDocument[]}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbList}
                renderItem={({ item, index }) => {
                  const isCover = item.id === coverId;
                  return (
                    <View style={styles.thumbCard}>
                      <Pressable onPress={() => setActiveIndex(index)} style={styles.thumbPressable}>
                        <Image
                          source={
                            usesLocalPhotos
                              ? { uri: (item as VendorLocalDocument).uri }
                              : (item as unknown as VendorListingPhoto).source
                          }
                          style={styles.thumbImage}
                          resizeMode="cover"
                        />
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
        </View>
      </DesktopVendorOnboardingShell>

      <VendorUploadOptionsSheet
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSelect={handleUpload}
        title="Add photos"
        subtitle="Choose how you want to upload your listing photos"
      />
    </>
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
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
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
    gap: 14,
    minHeight: 240,
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
    fontSize: 12,
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
    height: 280,
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
    fontSize: 12,
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
    paddingVertical: 10,
    alignItems: 'center',
  },
  makeCoverOverlayText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  carouselNext: {
    position: 'absolute',
    right: spacing['3'],
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  thumbList: {
    gap: 12,
    paddingVertical: 4,
  },
  thumbCard: {
    width: 128,
    gap: 6,
  },
  thumbPressable: {
    position: 'relative',
  },
  thumbImage: {
    width: 128,
    height: 88,
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
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  makeCoverBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  makeCoverText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
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
    paddingVertical: 12,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  addMoreText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.accent.main,
  },
  pressed: { opacity: 0.85 },
});
