import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { submitVendorGlampingListingForApproval } from '@/src/api/vendorGlampingOnboarding.service';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { buildGlampingPreviewData } from '@/src/utils/formatGlampingPreview';
import { getVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { loadVendorGlampingImages } from '@/src/utils/vendorGlampingImageStore';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );
}

export function MobileVendorGlampingPreviewScreen() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [preview, setPreview] = useState(() => buildGlampingPreviewData(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    const draft = await getVendorGlampingDraft();
    const images = await loadVendorGlampingImages();
    setPreview(buildGlampingPreviewData(draft, images));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPreview();
    }, [loadPreview]),
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitVendorGlampingListingForApproval();
      if (res.success) {
        router.replace('/vendor/home');
        return;
      }
      setSubmitError(res.message ?? 'Could not submit glamping listing.');
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Text style={styles.title}>Preview</Text>
              <Text style={styles.subtitle}>Review your glamping listing before submitting.</Text>
            </View>

            <View style={styles.card}>
              <PreviewRow label="Title" value={preview.title} />
              <PreviewRow label="Description" value={preview.description} />
              <PreviewRow label="Location" value={preview.location} />
              <PreviewRow label="Total camps" value={preview.totalCamps ? String(preview.totalCamps) : ''} />
              <PreviewRow label="Adults per camp" value={preview.adultsPerCamp ? String(preview.adultsPerCamp) : ''} />
              <PreviewRow label="Infants per camp" value={String(preview.infantsPerCamp)} />
              <PreviewRow label="Price per camp / night" value={preview.pricePerCampNight} />
              <PreviewRow label="Extra adult charge" value={preview.extraAdultCharge} />
              <PreviewRow label="Extra infant charge" value={preview.extraInfantCharge} />
              <PreviewRow label="Meal plans" value={preview.meals} />
              <PreviewRow label="About the experience" value={preview.aboutExperience} />
              <PreviewRow label="Things to carry" value={preview.thingsToCarry} />
              <PreviewRow label="How to reach" value={preview.howToReach} />
              <PreviewRow label="Inclusions" value={preview.inclusions} />
              <PreviewRow label="Exclusions" value={preview.exclusions} />
              <PreviewRow label="What's provided" value={preview.whatsprovided} />
            </View>

            {preview.images.length ? (
              <View style={styles.imagesSection}>
                <Text style={styles.imagesLabel}>Photos ({preview.images.length})</Text>
                <View style={styles.imagesRow}>
                  {preview.images.map((uri, idx) => (
                    <Image key={`${uri.slice(0, 32)}-${idx}`} source={{ uri }} style={styles.thumb} />
                  ))}
                </View>
              </View>
            ) : null}

            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleSubmit}
          nextLabel="Submit"
          nextSuffix="for approval"
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      </View>
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
  card: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 10,
  },
  row: { gap: 4 },
  label: { fontFamily: typography.fontFamily.text, fontSize: 11, color: 'rgba(28, 32, 36, 0.55)' },
  value: { fontFamily: typography.fontFamily.text, fontSize: 13, color: colors.text.primary },
  imagesSection: { gap: 8 },
  imagesLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  imagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumb: {
    width: 110,
    height: 80,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  errorText: { fontFamily: typography.fontFamily.text, fontSize: 12, color: colors.primaryAlt },
});
