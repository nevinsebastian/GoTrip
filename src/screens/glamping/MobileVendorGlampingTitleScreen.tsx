import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { getVendorGlampingDraft, saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function MobileVendorGlampingTitleScreen() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const draft = await getVendorGlampingDraft();
      // Keep empty by default; only restore if user already typed.
      setTitle(draft?.title ?? '');
      setDescription(draft?.description ?? '');
    })();
  }, []);

  const handleNext = async () => {
    const t = title.trim();
    if (!t) {
      setSubmitError('Please enter a title for your glamping listing.');
      return;
    }
    setSubmitError(null);
    const prev = (await getVendorGlampingDraft()) ?? {};
    await saveVendorGlampingDraft({ ...prev, title: t, description: description.trim() });
    router.push('/vendor/select-location');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.contentColumn, { width: contentWidth }]}>
            <VendorListingHeader />

            <View style={styles.intro}>
              <Text style={styles.pageTitle}>Create your title</Text>
              <Text style={styles.pageSubtitle}>Add a clear title and description for your glamping site.</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Title</Text>
              <TextInput
                value={title}
                onChangeText={(v) => setTitle(v)}
                style={styles.titleInput}
                placeholder="Enter title"
                placeholderTextColor={colors.text.placeholder}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Description</Text>
              <TextInput
                value={description}
                onChangeText={(v) => setDescription(v)}
                style={styles.descriptionInput}
                placeholder="Enter description (optional)"
                placeholderTextColor={colors.text.placeholder}
                multiline
              />
            </View>

            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix="Select Location"
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
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  pageSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  sectionCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface.white,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  titleInput: {
    height: 44,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 24,
    paddingHorizontal: 12,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    ...Platform.select({ web: { outlineStyle: 'none' } as Record<string, unknown> }),
  },
  descriptionInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    textAlignVertical: 'top',
    ...Platform.select({ web: { outlineStyle: 'none' } as Record<string, unknown> }),
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});

