import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  VENDOR_HIGHLIGHTS,
  VENDOR_MOCK_PHOTO_SOURCES,
  VENDOR_TITLE_COPY,
  type VendorHighlightId,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorCreateTitleScreen() {
  const listingCategoryId = useVendorListingCategory();

  const [titlePrimary, setTitlePrimary] = useState(VENDOR_TITLE_COPY.titlePrimaryDefault);
  const [titleSecondary, setTitleSecondary] = useState(VENDOR_TITLE_COPY.titleSecondaryDefault);
  const [highlights, setHighlights] = useState<VendorHighlightId[]>(['peaceful', 'central']);
  const [description, setDescription] = useState(VENDOR_TITLE_COPY.descriptionDefault);

  const toggleHighlight = (id: VendorHighlightId) => {
    setHighlights((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= VENDOR_TITLE_COPY.highlightsMax) return prev;
      return [...prev, id];
    });
  };

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId={listingCategoryId}
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.title}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/set-pricing')}
          nextSuffix={VENDOR_TITLE_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.pageTitle}>{VENDOR_TITLE_COPY.title}</Text>
          <Text style={styles.pageSubtitle}>{VENDOR_TITLE_COPY.subtitle}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>{VENDOR_TITLE_COPY.titleLabel}</Text>

          <View style={styles.titlePrimaryRow}>
            <TextInput
              value={titlePrimary}
              onChangeText={setTitlePrimary}
              style={styles.titlePrimaryInput}
              placeholderTextColor={colors.text.placeholder}
            />
            <Ionicons name="pencil-outline" size={16} color="rgba(28, 32, 36, 0.45)" />
          </View>

          <TextInput
            value={titleSecondary}
            onChangeText={(v) => setTitleSecondary(v.slice(0, VENDOR_TITLE_COPY.titleSecondaryMax))}
            multiline
            style={styles.titleSecondaryInput}
            placeholderTextColor={colors.text.placeholder}
          />

          <Text style={styles.charCount}>
            {titleSecondary.length}/{VENDOR_TITLE_COPY.titleSecondaryMax}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>{VENDOR_TITLE_COPY.highlightsLabel}</Text>
          <View style={styles.highlightGrid}>
            {VENDOR_HIGHLIGHTS.map((item) => {
              const selected = highlights.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.highlightPill,
                    selected && styles.highlightPillSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggleHighlight(item.id)}
                >
                  <Ionicons
                    name={item.icon}
                    size={14}
                    color={selected ? colors.accent.main : 'rgba(28, 32, 36, 0.45)'}
                  />
                  <Text style={[styles.highlightText, selected && styles.highlightTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.photoRow}>
          <Image
            source={VENDOR_MOCK_PHOTO_SOURCES[0]}
            style={styles.photoPreview}
            resizeMode="cover"
          />
          <Image
            source={VENDOR_MOCK_PHOTO_SOURCES[1]}
            style={styles.photoPreview}
            resizeMode="cover"
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>{VENDOR_TITLE_COPY.descriptionLabel}</Text>
          <TextInput
            value={description}
            onChangeText={(v) => setDescription(v.slice(0, VENDOR_TITLE_COPY.descriptionMax))}
            multiline
            style={styles.descriptionInput}
            placeholderTextColor={colors.text.placeholder}
          />
          <Text style={styles.charCount}>
            {description.length}/{VENDOR_TITLE_COPY.descriptionMax}
          </Text>
        </View>
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 8,
  },
  intro: {
    gap: 4,
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 26,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 32,
    color: colors.accent.main,
  },
  pageSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 20,
    color: colors.text.primary,
  },
  titlePrimaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface.lightPink,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    paddingHorizontal: 12,
    height: 44,
  },
  titlePrimaryInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 0,
    ...Platform.select({
      android: { textAlignVertical: 'center', includeFontPadding: false },
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  titleSecondaryInput: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  highlightPillSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  highlightText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  highlightTextSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  photoPreview: {
    flex: 1,
    height: 110,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  descriptionInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
    textAlignVertical: 'top',
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  pressed: { opacity: 0.85 },
});
