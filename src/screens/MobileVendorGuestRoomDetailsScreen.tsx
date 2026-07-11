import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { submitVendorHotelListing } from '@/src/api/vendorHotelApproval.service';
import { createVendorHotelRoomTypes } from '@/src/api/vendorHotelRoom.service';
import { VendorListingHeader } from '@/src/components/vendor/VendorListingHeader';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import { VendorStepper } from '@/src/components/vendor/VendorStepper';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
    createDefaultRooms,
    DEFAULT_VENDOR_ROOM,
    VENDOR_BED_TYPES,
    VENDOR_FOOD_OPTIONS,
    VENDOR_GUEST_ROOM_COPY,
    VENDOR_ROOM_TYPES,
    type VendorFoodOptionId,
    type VendorRoomConfig,
} from '@/src/constants/vendorListingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CONTENT_WIDTH = 370;
const ROOM_CARD_HEIGHT = 477;
const FIELD_BORDER = 'rgba(0, 0, 47, 0.15)';
const FIELD_HEIGHT = 40;

type PickerTarget = { roomIndex: number; field: 'roomType' | 'bedType' } | null;

function RoomCard({
  index,
  room,
  onChange,
  onOpenPicker,
  cardWidth,
}: {
  index: number;
  room: VendorRoomConfig;
  onChange: (next: VendorRoomConfig) => void;
  onOpenPicker: (field: 'roomType' | 'bedType') => void;
  cardWidth: number;
}) {
  const toggleFood = (id: VendorFoodOptionId) => {
    const has = room.food.includes(id);
    onChange({
      ...room,
      food: has ? room.food.filter((item) => item !== id) : [...room.food, id],
    });
  };

  return (
    <View style={[styles.roomCard, { width: cardWidth, minHeight: ROOM_CARD_HEIGHT }]}>
      <Text style={styles.roomCardTitle}>Room {index + 1} type</Text>

      <View style={styles.roomTypeRow}>
        <Input
          value={room.roomType}
          onChangeText={(v) => onChange({ ...room, roomType: v })}
          placeholder="Deluxe AC"
          placeholderTextColor={colors.text.placeholder}
          style={[authFieldInputStyle.field, styles.field, styles.roomTypeInput]}
        />
        <Pressable
          style={({ pressed }) => [styles.selectFieldAccent, styles.field, pressed && styles.pressed]}
          onPress={() => onOpenPicker('roomType')}
        >
          <Text style={styles.selectFieldText} numberOfLines={1}>
            {room.roomType}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.accent.main} />
        </Pressable>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.floorAreaLabel}</Text>
        <View style={styles.floorAreaWrap}>
          <Input
            value={room.floorArea}
            onChangeText={(v) => onChange({ ...room, floorArea: v })}
            keyboardType="number-pad"
            style={[authFieldInputStyle.field, styles.field, styles.floorAreaInput]}
          />
          <Text style={styles.suffix}>sq.ft</Text>
        </View>
      </View>

      <View style={styles.subSection}>
        <Text style={styles.subSectionTitle}>{VENDOR_GUEST_ROOM_COPY.adultsLabel}</Text>
        <View style={styles.dualStepper}>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{VENDOR_GUEST_ROOM_COPY.defaultLabel}</Text>
            <VendorStepper
              variant="pill"
              value={room.adultsDefault}
              min={1}
              onChange={(v) => onChange({ ...room, adultsDefault: v })}
            />
          </View>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{VENDOR_GUEST_ROOM_COPY.maxLabel}</Text>
            <VendorStepper
              variant="pill"
              value={room.adultsMax}
              min={room.adultsDefault}
              onChange={(v) => onChange({ ...room, adultsMax: v })}
            />
          </View>
        </View>
      </View>

      <View style={styles.subSection}>
        <Text style={styles.subSectionTitle}>{VENDOR_GUEST_ROOM_COPY.childrenLabel}</Text>
        <View style={styles.dualStepper}>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{VENDOR_GUEST_ROOM_COPY.defaultLabel}</Text>
            <VendorStepper
              variant="pill"
              value={room.childrenDefault}
              onChange={(v) => onChange({ ...room, childrenDefault: v })}
            />
          </View>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{VENDOR_GUEST_ROOM_COPY.maxLabel}</Text>
            <VendorStepper
              variant="pill"
              value={room.childrenMax}
              min={room.childrenDefault}
              onChange={(v) => onChange({ ...room, childrenMax: v })}
            />
          </View>
        </View>
      </View>

      <View style={styles.rowBetween}>
        <Text style={[styles.rowLabel, styles.rowLabelFixed]}>{VENDOR_GUEST_ROOM_COPY.bedsLabel}</Text>
        <View style={styles.bedsRow}>
          <Pressable
            style={({ pressed }) => [styles.bedSelect, pressed && styles.pressed]}
            onPress={() => onOpenPicker('bedType')}
          >
            <Text style={styles.bedSelectText} numberOfLines={1}>
              {room.bedType}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.accent.main} />
          </Pressable>
          <VendorStepper
            variant="pill"
            value={room.bedCount}
            min={1}
            onChange={(v) => onChange({ ...room, bedCount: v })}
          />
        </View>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.bathroomsLabel}</Text>
        <VendorStepper
          variant="pill"
          value={room.bathrooms}
          min={1}
          onChange={(v) => onChange({ ...room, bathrooms: v })}
        />
      </View>

      <View style={styles.foodRow}>
        <Text style={[styles.rowLabel, styles.rowLabelFixed]}>{VENDOR_GUEST_ROOM_COPY.foodLabel}</Text>
        <View style={styles.foodPills}>
          {VENDOR_FOOD_OPTIONS.map((option) => {
            const selected = room.food.includes(option.id);
            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.foodPill,
                  selected && styles.foodPillSelected,
                  pressed && styles.pressed,
                ]}
                onPress={() => toggleFood(option.id)}
              >
                <Text style={[styles.foodPillText, selected && styles.foodPillTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.totalUnitsLabel}</Text>
        <VendorStepper
          variant="pill"
          value={room.totalUnits}
          min={1}
          max={50}
          onChange={(v) => onChange({ ...room, totalUnits: v })}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={[styles.rowLabel, styles.rowLabelFixed]}>{VENDOR_GUEST_ROOM_COPY.basePriceLabel}</Text>
        <Input
          value={String(room.basePricePerNight)}
          onChangeText={(v) => onChange({ ...room, basePricePerNight: Number(v.replace(/\D/g, '')) || 0 })}
          keyboardType="number-pad"
          placeholder="2500"
          placeholderTextColor={colors.text.placeholder}
          style={[authFieldInputStyle.field, styles.field, styles.priceInput]}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.extraAdultLabel}</Text>
        <Input
          value={String(room.extraAdultCharge)}
          onChangeText={(v) => onChange({ ...room, extraAdultCharge: Number(v.replace(/\D/g, '')) || 0 })}
          keyboardType="number-pad"
          style={[authFieldInputStyle.field, styles.field, styles.priceInput]}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.extraChildLabel}</Text>
        <Input
          value={String(room.extraChildCharge)}
          onChangeText={(v) => onChange({ ...room, extraChildCharge: Number(v.replace(/\D/g, '')) || 0 })}
          keyboardType="number-pad"
          style={[authFieldInputStyle.field, styles.field, styles.priceInput]}
        />
      </View>
    </View>
  );
}

export function MobileVendorGuestRoomDetailsScreen() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const contentWidth = Math.round(CONTENT_WIDTH * scale);
  const horizontalPadding = Math.max(0, (width - contentWidth) / 2);

  const [roomCount, setRoomCount] = useState(1);
  const [rooms, setRooms] = useState<VendorRoomConfig[]>(createDefaultRooms(1));
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateRoomCount = (count: number) => {
    setRoomCount(count);
    setRooms((prev) => {
      if (count > prev.length) {
        return [...prev, ...createDefaultRooms(count - prev.length, prev.length)];
      }
      return prev.slice(0, count);
    });
  };

  const updateRoom = (index: number, next: VendorRoomConfig) => {
    setRooms((prev) => prev.map((room, i) => (i === index ? next : room)));
  };

  const pickerRoom = pickerTarget ? rooms[pickerTarget.roomIndex] : null;
  const roomTypeOptions = VENDOR_ROOM_TYPES.map((label, i) => ({
    id: `room-${i}`,
    label,
    thumbnail: require('../../assets/images/backgroundimagehomehotels.jpg'),
  }));
  const bedTypeOptions = VENDOR_BED_TYPES.map((label, i) => ({
    id: `bed-${i}`,
    label,
  }));

  const handleNext = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await createVendorHotelRoomTypes(rooms);
      if (res.success) {
        const submitRes = await submitVendorHotelListing();
        if (submitRes.success) {
          router.replace('/vendor/thanks');
          return;
        }
        setSubmitError(submitRes.message ?? 'Could not submit listing for approval.');
        return;
      }
      setSubmitError(res.message ?? 'Could not save room types.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.contentColumn, { width: contentWidth }]}>
            <VendorListingHeader />

            <View style={styles.intro}>
              <Text style={styles.title}>{VENDOR_GUEST_ROOM_COPY.title}</Text>
              <Text style={styles.subtitle}>{VENDOR_GUEST_ROOM_COPY.subtitle}</Text>
            </View>

            <View style={styles.roomsBar}>
              <Text style={styles.roomsLabel}>{VENDOR_GUEST_ROOM_COPY.roomsLabel}</Text>
              <VendorStepper variant="pill" value={roomCount} min={1} max={5} onChange={updateRoomCount} />
            </View>

            {rooms.map((room, index) => (
              <RoomCard
                key={index}
                index={index}
                room={room}
                cardWidth={contentWidth}
                onChange={(next) => updateRoom(index, next)}
                onOpenPicker={(field) => setPickerTarget({ roomIndex: index, field })}
              />
            ))}
            {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          </View>
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Submit"
          nextSuffix="for approval"
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      </View>

      {pickerTarget && pickerRoom ? (
        <>
          <VendorPropertyOptionSheet
            visible={pickerTarget.field === 'roomType'}
            title={VENDOR_GUEST_ROOM_COPY.roomTypeLabel}
            options={roomTypeOptions}
            selectedId={
              roomTypeOptions.find((o) => o.label === pickerRoom.roomType)?.id ?? roomTypeOptions[0].id
            }
            showThumbnails
            onClose={() => setPickerTarget(null)}
            onSelect={(id) => {
              const label = roomTypeOptions.find((o) => o.id === id)?.label ?? DEFAULT_VENDOR_ROOM.roomType;
              updateRoom(pickerTarget.roomIndex, { ...pickerRoom, roomType: label });
              setPickerTarget(null);
            }}
          />
          <VendorPropertyOptionSheet
            visible={pickerTarget.field === 'bedType'}
            title={VENDOR_GUEST_ROOM_COPY.bedsLabel}
            options={bedTypeOptions}
            selectedId={
              bedTypeOptions.find((o) => o.label === pickerRoom.bedType)?.id ?? bedTypeOptions[0].id
            }
            onClose={() => setPickerTarget(null)}
            onSelect={(id) => {
              const label = bedTypeOptions.find((o) => o.id === id)?.label ?? DEFAULT_VENDOR_ROOM.bedType;
              updateRoom(pickerTarget.roomIndex, { ...pickerRoom, bedType: label });
              setPickerTarget(null);
            }}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: spacing['4'],
    alignItems: 'center',
  },
  contentColumn: {
    alignSelf: 'stretch',
    gap: 8,
  },
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
  roomsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 32, 36, 0.06)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: '100%',
  },
  roomsLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  roomCard: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  roomCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight['2'],
    color: 'rgba(28, 32, 36, 0.65)',
    width: '100%',
  },
  roomTypeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  field: {
    height: FIELD_HEIGHT,
  },
  roomTypeInput: {
    flex: 1,
    borderColor: FIELD_BORDER,
  },
  selectFieldAccent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: 24,
    paddingHorizontal: 12,
    gap: 6,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  selectFieldText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  rowLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
    flexShrink: 0,
  },
  rowLabelFixed: {
    width: 64,
  },
  floorAreaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  floorAreaInput: {
    width: 72,
    borderColor: colors.accent.main,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  suffix: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  subSection: {
    width: '100%',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: borderRadius.lg,
    padding: 12,
    gap: 8,
  },
  subSectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
    width: '100%',
  },
  dualStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  stepperItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepperLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  bedsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  bedSelect: {
    flex: 1,
    maxWidth: 148,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 36,
    gap: 4,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  bedSelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.primary,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  foodPills: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  foodPill: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  foodPillSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  foodPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  foodPillTextSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  priceInput: {
    width: 110,
    textAlign: 'right',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
  pressed: { opacity: 0.85 },
});
