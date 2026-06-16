import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
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
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

type PickerTarget = { roomIndex: number; field: 'roomType' | 'bedType' } | null;

function RoomCard({
  index,
  room,
  onChange,
  onOpenPicker,
}: {
  index: number;
  room: VendorRoomConfig;
  onChange: (next: VendorRoomConfig) => void;
  onOpenPicker: (field: 'roomType' | 'bedType') => void;
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
          style={[authFieldInputStyle.field, styles.roomTypeInput]}
        />
        <Pressable
          style={({ pressed }) => [styles.roomTypeSelect, pressed && styles.pressed]}
          onPress={() => onOpenPicker('roomType')}
        >
          <Text style={styles.roomTypeSelectText} numberOfLines={1}>
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
            style={[authFieldInputStyle.field, styles.floorAreaInput]}
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
              value={room.adultsDefault}
              min={1}
              onChange={(v) => onChange({ ...room, adultsDefault: v })}
            />
          </View>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{VENDOR_GUEST_ROOM_COPY.maxLabel}</Text>
            <VendorStepper
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
              value={room.childrenDefault}
              onChange={(v) => onChange({ ...room, childrenDefault: v })}
            />
          </View>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{VENDOR_GUEST_ROOM_COPY.maxLabel}</Text>
            <VendorStepper
              value={room.childrenMax}
              min={room.childrenDefault}
              onChange={(v) => onChange({ ...room, childrenMax: v })}
            />
          </View>
        </View>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.bedsLabel}</Text>
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
            value={room.bedCount}
            min={1}
            onChange={(v) => onChange({ ...room, bedCount: v })}
          />
        </View>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.bathroomsLabel}</Text>
        <VendorStepper
          value={room.bathrooms}
          min={1}
          onChange={(v) => onChange({ ...room, bathrooms: v })}
        />
      </View>

      <View style={styles.foodSection}>
        <Text style={styles.rowLabel}>{VENDOR_GUEST_ROOM_COPY.foodLabel}</Text>
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
    </View>
  );
}

export function MobileVendorGuestRoomDetailsScreen() {
  const [roomCount, setRoomCount] = useState(1);
  const [rooms, setRooms] = useState<VendorRoomConfig[]>(createDefaultRooms(1));
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const updateRoomCount = (count: number) => {
    setRoomCount(count);
    setRooms((prev) => {
      if (count > prev.length) {
        return [...prev, ...createDefaultRooms(count - prev.length)];
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId="property" />
          <Text style={styles.title}>{VENDOR_GUEST_ROOM_COPY.title}</Text>
          <Text style={styles.subtitle}>{VENDOR_GUEST_ROOM_COPY.subtitle}</Text>

          <View style={styles.roomsBar}>
            <Text style={styles.roomsLabel}>{VENDOR_GUEST_ROOM_COPY.roomsLabel}</Text>
            <VendorStepper value={roomCount} min={1} max={5} onChange={updateRoomCount} />
          </View>

          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              index={index}
              room={room}
              onChange={(next) => updateRoom(index, next)}
              onOpenPicker={(field) => setPickerTarget({ roomIndex: index, field })}
            />
          ))}
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/amenities')}
          nextLabel="Next"
          nextSuffix={VENDOR_GUEST_ROOM_COPY.nextSuffix}
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
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 14,
  },
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
  roomsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
  },
  roomsLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: borderRadius.xl,
    padding: spacing['4'],
    gap: 14,
    backgroundColor: colors.surface.white,
  },
  roomCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  roomTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roomTypeInput: { flex: 1 },
  roomTypeSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: 24,
    paddingHorizontal: spacing['3'],
    height: 40,
    gap: 6,
  },
  roomTypeSelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
    flex: 1,
  },
  floorAreaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  floorAreaInput: {
    width: 72,
    borderColor: colors.accent.main,
  },
  suffix: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  subSection: {
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
    borderRadius: borderRadius.lg,
    padding: spacing['3'],
    gap: 10,
  },
  subSectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  dualStepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepperItem: { flex: 1, gap: 6 },
  stepperLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  bedsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  bedSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: 24,
    paddingHorizontal: spacing['2'],
    height: 36,
    maxWidth: 130,
  },
  bedSelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.primary,
  },
  foodSection: { gap: 10 },
  foodPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  foodPill: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing['3'],
    paddingVertical: 8,
  },
  foodPillSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  foodPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  foodPillTextSelected: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.medium,
  },
  pressed: { opacity: 0.85 },
});
