import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import { VendorUploadOptionsSheet } from '@/src/components/vendor/VendorUploadOptionsSheet';
import {
  DEFAULT_PACKAGE_ITINERARY_DAYS,
  VENDOR_PACKAGE_ITINERARY_COPY,
  type VendorPackageDayItinerary,
} from '@/src/constants/vendorPackageConstants';
import {
  VENDOR_MOCK_PHOTO_SOURCES,
  type VendorListingPhoto,
} from '@/src/constants/vendorListingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

function DayNavigator({
  activeIndex,
  total,
  activeLabel,
  onPrev,
  onNext,
  onOpenDayPicker,
}: {
  activeIndex: number;
  total: number;
  activeLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenDayPicker: () => void;
}) {
  return (
    <View style={styles.dayNav}>
      <Pressable
        style={({ pressed }) => [styles.dayPill, pressed && styles.pressed]}
        onPress={onOpenDayPicker}
        accessibilityRole="button"
      >
        <Text style={styles.dayPillText}>{activeLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
      </Pressable>
      <View style={styles.dayPager}>
        <Pressable
          style={({ pressed }) => [styles.pagerBtn, pressed && styles.pressed]}
          onPress={onPrev}
          disabled={activeIndex === 0}
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={activeIndex === 0 ? 'rgba(28,32,36,0.25)' : colors.text.primary}
          />
        </Pressable>
        <Text style={styles.pagerText}>
          Day {activeIndex + 1}/{total}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.pagerBtn, pressed && styles.pressed]}
          onPress={onNext}
          disabled={activeIndex >= total - 1}
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={activeIndex >= total - 1 ? 'rgba(28,32,36,0.25)' : colors.text.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

function NamedField({
  label,
  primaryValue,
  secondaryValue,
  onPrimaryChange,
  onSecondaryChange,
  primaryMax,
  secondaryMax,
  primaryAccent,
}: {
  label: string;
  primaryValue: string;
  secondaryValue: string;
  onPrimaryChange: (v: string) => void;
  onSecondaryChange: (v: string) => void;
  primaryMax: number;
  secondaryMax: number;
  primaryAccent?: boolean;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={[styles.primaryFieldRow, primaryAccent && styles.primaryFieldAccent]}>
        <TextInput
          value={primaryValue}
          onChangeText={(v) => onPrimaryChange(v.slice(0, primaryMax))}
          style={[styles.primaryInput, primaryAccent && styles.primaryInputAccent]}
          placeholderTextColor={colors.text.placeholder}
        />
        <Ionicons name="pencil-outline" size={16} color="rgba(28, 32, 36, 0.45)" />
      </View>
      <TextInput
        value={secondaryValue}
        onChangeText={(v) => onSecondaryChange(v.slice(0, secondaryMax))}
        multiline
        style={styles.secondaryInput}
        textAlignVertical="top"
        placeholderTextColor={colors.text.placeholder}
      />
      <Text style={styles.charCount}>
        {secondaryValue.length}/{secondaryMax}
      </Text>
    </View>
  );
}

export function MobileVendorPackageItineraryScreen() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [days, setDays] = useState<VendorPackageDayItinerary[]>(DEFAULT_PACKAGE_ITINERARY_DAYS);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [photosByDay, setPhotosByDay] = useState<Record<string, VendorListingPhoto[]>>({});
  const [mockUploadIndex, setMockUploadIndex] = useState(0);

  const activeDay = days[activeDayIndex] ?? days[0];
  const dayPhotos = photosByDay[activeDay.id] ?? [];

  const updateDay = (patch: Partial<VendorPackageDayItinerary>) => {
    setDays((prev) => prev.map((day, i) => (i === activeDayIndex ? { ...day, ...patch } : day)));
  };

  const dayOptions = days.map((day) => ({ id: day.id, label: day.label }));

  const handleUpload = () => {
    const source = VENDOR_MOCK_PHOTO_SOURCES[mockUploadIndex % VENDOR_MOCK_PHOTO_SOURCES.length];
    const nextPhoto: VendorListingPhoto = {
      id: `day-photo-${Date.now()}-${mockUploadIndex}`,
      source: source as ImageSourcePropType,
      label: `Photo ${mockUploadIndex + 1}`,
    };
    setPhotosByDay((prev) => {
      const current = prev[activeDay.id] ?? [];
      if (current.length >= VENDOR_PACKAGE_ITINERARY_COPY.maxPhotos) return prev;
      return { ...prev, [activeDay.id]: [...current, nextPhoto] };
    });
    setMockUploadIndex((i) => i + 1);
    setUploadOpen(false);
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
              <Text style={styles.title}>{VENDOR_PACKAGE_ITINERARY_COPY.title}</Text>
              <Text style={styles.subtitle}>{VENDOR_PACKAGE_ITINERARY_COPY.subtitle}</Text>
            </View>

            <DayNavigator
              activeIndex={activeDayIndex}
              total={days.length}
              activeLabel={activeDay.label}
              onPrev={() => setActiveDayIndex((i) => Math.max(0, i - 1))}
              onNext={() => setActiveDayIndex((i) => Math.min(days.length - 1, i + 1))}
              onOpenDayPicker={() => setDayPickerOpen(true)}
            />

            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>{VENDOR_PACKAGE_ITINERARY_COPY.titleFieldLabel}</Text>
              <TextInput
                value={activeDay.title}
                onChangeText={(v) => updateDay({ title: v.slice(0, VENDOR_PACKAGE_ITINERARY_COPY.titleMax) })}
                multiline
                style={[styles.titleInput, styles.titleInputAccent]}
                textAlignVertical="top"
              />
              <Text style={styles.sectionLabel}>{VENDOR_PACKAGE_ITINERARY_COPY.aboutLabel}</Text>
              <TextInput
                value={activeDay.aboutExperience}
                onChangeText={(v) =>
                  updateDay({ aboutExperience: v.slice(0, VENDOR_PACKAGE_ITINERARY_COPY.aboutMax) })
                }
                multiline
                style={styles.textArea}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {activeDay.aboutExperience.length}/{VENDOR_PACKAGE_ITINERARY_COPY.aboutMax}
              </Text>
            </View>

            <NamedField
              label={VENDOR_PACKAGE_ITINERARY_COPY.hotelLabel}
              primaryValue={activeDay.hotelPrimary}
              secondaryValue={activeDay.hotelSecondary}
              onPrimaryChange={(hotelPrimary) => updateDay({ hotelPrimary })}
              onSecondaryChange={(hotelSecondary) => updateDay({ hotelSecondary })}
              primaryMax={VENDOR_PACKAGE_ITINERARY_COPY.hotelPrimaryMax}
              secondaryMax={VENDOR_PACKAGE_ITINERARY_COPY.hotelSecondaryMax}
              primaryAccent
            />

            <NamedField
              label={VENDOR_PACKAGE_ITINERARY_COPY.activityLabel}
              primaryValue={activeDay.activityPrimary}
              secondaryValue={activeDay.activitySecondary}
              onPrimaryChange={(activityPrimary) => updateDay({ activityPrimary })}
              onSecondaryChange={(activitySecondary) => updateDay({ activitySecondary })}
              primaryMax={VENDOR_PACKAGE_ITINERARY_COPY.activityPrimaryMax}
              secondaryMax={VENDOR_PACKAGE_ITINERARY_COPY.activitySecondaryMax}
              primaryAccent
            />

            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>{VENDOR_PACKAGE_ITINERARY_COPY.photosLabel}</Text>
              <Pressable
                style={({ pressed }) => [styles.uploadBtn, pressed && styles.pressed]}
                onPress={() => setUploadOpen(true)}
                disabled={dayPhotos.length >= VENDOR_PACKAGE_ITINERARY_COPY.maxPhotos}
              >
                <Ionicons name="cloud-upload-outline" size={16} color={colors.accent.main} />
                <Text style={styles.uploadBtnText}>{VENDOR_PACKAGE_ITINERARY_COPY.uploadCta}</Text>
              </Pressable>
              {dayPhotos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
                  {dayPhotos.map((photo) => (
                    <Image key={photo.id} source={photo.source} style={styles.thumb} resizeMode="cover" />
                  ))}
                </ScrollView>
              ) : null}
            </View>

            <DayNavigator
              activeIndex={activeDayIndex}
              total={days.length}
              activeLabel={activeDay.label}
              onPrev={() => setActiveDayIndex((i) => Math.max(0, i - 1))}
              onNext={() => setActiveDayIndex((i) => Math.min(days.length - 1, i + 1))}
              onOpenDayPicker={() => setDayPickerOpen(true)}
            />
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/inclusions-exclusions')}
          nextLabel="Next"
          nextSuffix={VENDOR_PACKAGE_ITINERARY_COPY.nextSuffix}
        />
      </View>

      <VendorPropertyOptionSheet
        visible={dayPickerOpen}
        title="Select day"
        options={dayOptions as Parameters<typeof VendorPropertyOptionSheet>[0]['options']}
        selectedId={activeDay.id}
        onClose={() => setDayPickerOpen(false)}
        onSelect={(id) => {
          const index = days.findIndex((day) => day.id === id);
          if (index >= 0) setActiveDayIndex(index);
          setDayPickerOpen(false);
        }}
      />

      <VendorUploadOptionsSheet
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSelect={handleUpload}
        title="Add day photos"
        subtitle="Choose how you want to upload itinerary photos"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: spacing['4'], alignItems: 'center' },
  contentColumn: { alignSelf: 'stretch', gap: 8 },
  intro: { gap: 4 },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 28,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  dayNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  dayPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  dayPager: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pagerBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  pagerText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    minWidth: 52,
    textAlign: 'center',
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
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
    minHeight: 44,
    ...Platform.select({ web: { outlineStyle: 'none' } as Record<string, unknown> }),
  },
  titleInputAccent: {
    borderColor: colors.accent.main,
    color: colors.accent.main,
    backgroundColor: colors.surface.lightPink,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.primary,
    ...Platform.select({ web: { outlineStyle: 'none' } as Record<string, unknown> }),
  },
  primaryFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    height: 40,
  },
  primaryFieldAccent: {
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.lightPink,
  },
  primaryInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
    paddingVertical: 0,
    ...Platform.select({ web: { outlineStyle: 'none' } as Record<string, unknown> }),
  },
  primaryInputAccent: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  secondaryInput: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.primary,
    ...Platform.select({ web: { outlineStyle: 'none' } as Record<string, unknown> }),
  },
  charCount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.45)',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  uploadBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  thumbRow: { gap: 8, paddingVertical: 4 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  pressed: { opacity: 0.85 },
});
