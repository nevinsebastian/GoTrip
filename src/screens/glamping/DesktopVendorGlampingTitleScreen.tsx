import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { getVendorGlampingDraft, saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorGlampingTitleScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const draft = await getVendorGlampingDraft();
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
    <DesktopVendorOnboardingShell
      listingCategoryId="glamping"
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix="Select Location"
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.pageTitle}>Create your title</Text>
          <Text style={styles.pageSubtitle}>Add a clear title and description for your glamping site.</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
            placeholder="Enter title"
            placeholderTextColor={colors.text.placeholder}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={styles.descriptionInput}
            placeholder="Enter description (optional)"
            placeholderTextColor={colors.text.placeholder}
            multiline
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, paddingBottom: 4 },
  intro: { gap: 4 },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  pageSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    lineHeight: 18,
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
    fontSize: 13,
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
    fontSize: 14,
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
    fontSize: 13,
    lineHeight: 18,
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

