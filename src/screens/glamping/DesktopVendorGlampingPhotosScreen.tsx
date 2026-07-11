import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
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
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

export function DesktopVendorGlampingPhotosScreen() {
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
    <>
      <DesktopVendorOnboardingShell
        listingCategoryId="glamping"
        footer={
          <DesktopVendorOnboardingFooter
            onBack={() => router.back()}
            onNext={handleNext}
            nextLabel="Next"
            nextSuffix={VENDOR_GLAMPING_PHOTOS_COPY.nextSuffix}
            isNextLoading={isSubmitting}
            nextDisabled={isSubmitting}
          />
        }
      >
        <View style={styles.content}>
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
      </DesktopVendorOnboardingShell>

      <VendorUploadOptionsSheet
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSelect={handlePick}
        title="Add photos"
        subtitle={`Choose ${GLAMPING_PHOTO_LIMITS.min} to ${GLAMPING_PHOTO_LIMITS.max} listing photos`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, paddingBottom: 4 },
  intro: { gap: 4 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
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
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  uploadBtnTextDisabled: {
    color: 'rgba(28, 32, 36, 0.35)',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumb: {
    width: 140,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  pressed: { opacity: 0.85 },
  errorText: { fontFamily: typography.fontFamily.text, fontSize: 12, color: colors.primaryAlt },
});
