import { Input, Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { submitVendorHotelListing } from '@/src/api/vendorHotelApproval.service';
import { createVendorHotelRoomTypes } from '@/src/api/vendorHotelRoom.service';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { VendorStepper } from '@/src/components/vendor/VendorStepper';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
    createDefaultRooms,
    VENDOR_BED_TYPES,
    VENDOR_FOOD_OPTIONS,
    VENDOR_GUEST_ROOM_COPY,
    VENDOR_ROOM_TYPES,
    type VendorFoodOptionId,
    type VendorRoomConfig,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const ACCENT = colors.accent.main;
const FIELD_BORDER = 'rgba(0, 0, 47, 0.15)';

function RoomCard({
  index,
  room,
  onChange,
}: {
  index: number;
  room: VendorRoomConfig;
  onChange: (next: VendorRoomConfig) => void;
}) {
  const toggleFood = (id: VendorFoodOptionId) => {
    const has = room.food.includes(id);
    onChange({
      ...room,
      food: has ? room.food.filter((item) => item !== id) : [...room.food, id],
    });
  };

  return (
    <View style={styles.roomCard}>
      <Text style={styles.roomCardTitle}>Room {index + 1} type</Text>

      <View style={styles.roomTypeRow}>
        <Input
          value={room.roomType}
          onChangeText={(v) => onChange({ ...room, roomType: v })}
          placeholder="Deluxe AC"
          placeholderTextColor={colors.text.placeholder}
          style={[authFieldInputStyle.field, styles.field, styles.roomTypeInput]}
        />
        <View style={styles.selectWrap}>
          <DesktopInlineSelect
            value={room.roomType}
            options={VENDOR_ROOM_TYPES}
            onSelect={(v) => onChange({ ...room, roomType: v })}
            menuMaxHeight={220}
          />
        </View>
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
          <View style={styles.bedSelectWrap}>
            <DesktopInlineSelect
              value={room.bedType}
              options={VENDOR_BED_TYPES}
              onSelect={(v) => onChange({ ...room, bedType: v })}
              menuMaxHeight={180}
            />
          </View>
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

export function DesktopVendorGuestRoomDetailsScreen() {
  const listingCategoryId = useVendorListingCategory();
  const [roomCount, setRoomCount] = useState(1);
  const [rooms, setRooms] = useState<VendorRoomConfig[]>(createDefaultRooms(1));
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
    <DesktopVendorOnboardingShell
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.guestRooms}
      listingCategoryId={listingCategoryId}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Submit"
          nextSuffix="for approval"
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{VENDOR_GUEST_ROOM_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_GUEST_ROOM_COPY.subtitle}</Text>
        </View>

        <View style={styles.roomsBar}>
          <Text style={styles.roomsLabel}>{VENDOR_GUEST_ROOM_COPY.roomsLabel}</Text>
          <VendorStepper variant="pill" value={roomCount} min={1} max={5} onChange={updateRoomCount} />
        </View>

        <View style={styles.roomList}>
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              index={index}
              room={room}
              onChange={(next) => updateRoom(index, next)}
            />
          ))}
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 4,
  },
  intro: {
    gap: 4,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 28,
    color: ACCENT,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  roomsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 32, 36, 0.06)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  roomsLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  roomList: {
    gap: 10,
  },
  roomCard: {
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      },
    }),
  },
  roomCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 18,
    color: 'rgba(28, 32, 36, 0.65)',
    width: '100%',
  },
  roomTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  field: {
    height: 40,
  },
  roomTypeInput: {
    flex: 1,
    borderColor: FIELD_BORDER,
  },
  selectWrap: {
    flex: 1,
    minWidth: 0,
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
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.primary,
    flexShrink: 0,
  },
  rowLabelFixed: {
    width: 72,
  },
  floorAreaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  floorAreaInput: {
    width: 72,
    borderColor: ACCENT,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  suffix: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  subSection: {
    width: '100%',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: borderRadius.lg,
    padding: 10,
    gap: 8,
  },
  subSectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 18,
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
    gap: 6,
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
    minWidth: 0,
  },
  bedSelectWrap: {
    flex: 1,
    maxWidth: 160,
    minWidth: 0,
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
    gap: 6,
  },
  foodPill: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  foodPillSelected: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  foodPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  foodPillTextSelected: {
    color: ACCENT,
    fontWeight: typography.fontWeight.medium,
  },
  priceInput: {
    width: 120,
    textAlign: 'right',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.primaryAlt,
  },
  pressed: { opacity: 0.85 },
});
