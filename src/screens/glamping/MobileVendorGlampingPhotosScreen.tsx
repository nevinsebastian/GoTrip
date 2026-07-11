import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorUploadOptionsSheet } from '@/src/components/vendor/VendorUploadOptionsSheet';
import { uploadVendorGlampingImagesStep } from '@/src/api/vendorGlampingOnboarding.service';
import {
  GLAMPING_PHOTO_LIMITS,
  VENDOR_GLAMPING_PHOTOS_COPY,
} from '@/src/constants/vendorGlampingConstants';
import { documentsToDataUrls } from '@/src/utils/documentToDataUrl';
import { persistVendorGlampingImages, loadVendorGlampingImages } from '@/src/utils/vendorGlampingImageStore';
import { pickVendorDocument, type VendorDocumentPickSource, type VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;

export function MobileVendorGlampingPhotosScreen() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [docs, setDocs] = useState<VendorLocalDocument[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadVendorGlampingImages();
      if (!stored.length) return;
      setDocs(
        stored.map((uri, index) => ({
          id: `stored-${index}`,
          name: `photo-${index + 1}.jpg`,
          mimeType: uri.match(/^data:([^;]+)/)?.[1] ?? 'image/jpeg',
          uri,
        })),
      );
    })();
  }, []);

  const handlePick = async (source: VendorDocumentPickSource) => {
    if (docs.length >= GLAMPING_PHOTO_LIMITS.max) {
      setSubmitError(`You can upload up to ${GLAMPING_PHOTO_LIMITS.max} images.`);
      setUploadOpen(false);
      return;
    }
    const doc = await pickVendorDocument(source);
    if (doc) {
      setSubmitError(null);
      setDocs((prev) => [...prev, doc].slice(0, GLAMPING_PHOTO_LIMITS.max));
    }
    setUploadOpen(false);
  };

  const handleNext = async () => {
    if (docs.length < GLAMPING_PHOTO_LIMITS.min) {
      setSubmitError(`Please add at least ${GLAMPING_PHOTO_LIMITS.min} images.`);
      return;
    }
    if (docs.length > GLAMPING_PHOTO_LIMITS.max) {
      setSubmitError(`You can upload up to ${GLAMPING_PHOTO_LIMITS.max} images.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const images = await documentsToDataUrls(docs);
      const files = docs.map((doc) => doc.file).filter((file): file is File => Boolean(file));
      await persistVendorGlampingImages(images);
      const res = await uploadVendorGlampingImagesStep(images, files.length ? files : undefined);
      if (!res.success) {
        setSubmitError(res.message ?? 'Could not upload images.');
        return;
      }
      router.push('/vendor/glamping/meal-plans');
    } finally {
      setIsSubmitting(false);
    }
  };

  const atMax = docs.length >= GLAMPING_PHOTO_LIMITS.max;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentColumn, { width: contentWidth }]}>
            <VendorListingHeader />
            <View style={styles.intro}>
              <Text style={styles.title}>{VENDOR_GLAMPING_PHOTOS_COPY.title}</Text>
              <Text style={styles.subtitle}>{VENDOR_GLAMPING_PHOTOS_COPY.subtitle}</Text>
              <Text style={styles.countText}>
                {VENDOR_GLAMPING_PHOTOS_COPY.countLabel(docs.length)}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.uploadBtn,
                atMax && styles.uploadBtnDisabled,
                pressed && !atMax && styles.pressed,
              ]}
              onPress={() => !atMax && setUploadOpen(true)}
              disabled={atMax}
            >
              <Ionicons name="images-outline" size={18} color={atMax ? 'rgba(28,32,36,0.35)' : colors.accent.main} />
              <Text style={[styles.uploadBtnText, atMax && styles.uploadBtnTextDisabled]}>
                {VENDOR_GLAMPING_PHOTOS_COPY.addLabel}
              </Text>
            </Pressable>

            {docs.length ? (
              <View style={styles.grid}>
                {docs.map((d) => (
                  <Image key={d.id} source={{ uri: d.uri }} style={styles.thumb} />
                ))}
              </View>
            ) : null}

            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix={VENDOR_GLAMPING_PHOTOS_COPY.nextSuffix}
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      </View>

      <VendorUploadOptionsSheet
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSelect={handlePick}
        title="Add photos"
        subtitle={`Choose ${GLAMPING_PHOTO_LIMITS.min} to ${GLAMPING_PHOTO_LIMITS.max} listing photos`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: spacing['4'], alignItems: 'center' },
  contentColumn: { alignSelf: 'stretch', gap: 10 },
  intro: { gap: 4 },
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
  countText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  uploadBtn: {
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  uploadBtnDisabled: {
    opacity: 0.55,
    ...Platform.select({ web: { cursor: 'not-allowed' as const } }),
  },
  uploadBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  uploadBtnTextDisabled: {
    color: 'rgba(28, 32, 36, 0.35)',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumb: {
    width: 110,
    height: 80,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  pressed: { opacity: 0.85 },
  errorText: { fontFamily: typography.fontFamily.text, fontSize: 12, color: colors.primaryAlt },
});
