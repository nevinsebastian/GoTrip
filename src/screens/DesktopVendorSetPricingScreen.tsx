import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingFooter } from '@/src/components/desktop/DesktopVendorOnboardingFooter';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import {
  DEFAULT_VENDOR_ROOM_PRICING,
  VENDOR_PRICING_COPY,
  VENDOR_PRICING_ROOMS,
  type VendorRoomPricing,
} from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

type EditingField = 'base' | 'adult' | null;

function formatRupee(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

function parseRupeeInput(text: string) {
  const digits = text.replace(/[^\d]/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10);
}

type EditableRupeeFieldProps = {
  value: number;
  editing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onChange: (value: number) => void;
  containerStyle?: object;
  textStyle?: object;
  inputStyle?: object;
};

function EditableRupeeField({
  value,
  editing,
  onStartEdit,
  onEndEdit,
  onChange,
  containerStyle,
  textStyle,
  inputStyle,
}: EditableRupeeFieldProps) {
  const inputRef = useRef<TextInput>(null);

  if (editing) {
    return (
      <TextInput
        ref={inputRef}
        value={String(value)}
        onChangeText={(text) => onChange(parseRupeeInput(text))}
        onBlur={onEndEdit}
        keyboardType="number-pad"
        autoFocus
        selectTextOnFocus
        style={[styles.editableInput, inputStyle]}
      />
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
      onPress={onStartEdit}
      accessibilityRole="button"
      accessibilityLabel={`Edit price ${formatRupee(value)}`}
    >
      <Text style={textStyle}>{formatRupee(value)}</Text>
    </Pressable>
  );
}

export function DesktopVendorSetPricingScreen() {
  const listingCategoryId = useVendorListingCategory();

  const [activeRoomId, setActiveRoomId] = useState<string>(VENDOR_PRICING_ROOMS[0].id);
  const [applyToAllRooms, setApplyToAllRooms] = useState(true);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [pricingByRoom, setPricingByRoom] = useState<Record<string, VendorRoomPricing>>(() =>
    Object.fromEntries(
      VENDOR_PRICING_ROOMS.map((room) => [room.id, { ...DEFAULT_VENDOR_ROOM_PRICING }]),
    ),
  );

  const activeRoom = VENDOR_PRICING_ROOMS.find((room) => room.id === activeRoomId) ?? VENDOR_PRICING_ROOMS[0];
  const pricing = pricingByRoom[activeRoom.id] ?? DEFAULT_VENDOR_ROOM_PRICING;

  const updatePricing = (patch: Partial<VendorRoomPricing>) => {
    setPricingByRoom((prev) => {
      const next = { ...prev[activeRoom.id], ...patch };
      if (applyToAllRooms) {
        return Object.fromEntries(
          VENDOR_PRICING_ROOMS.map((room) => [room.id, { ...next }]),
        );
      }
      return { ...prev, [activeRoom.id]: next };
    });
  };

  const adjustBasePrice = (delta: number) => {
    setEditingField(null);
    updatePricing({
      basePrice: Math.max(0, pricing.basePrice + delta),
    });
  };

  const roomOptions = VENDOR_PRICING_ROOMS.map((room) => ({
    value: room.id,
    label: `${room.roomIndex}/${room.roomTotal} ${room.label}`,
  }));

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId={listingCategoryId}
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.pricing}
      footer={
        <DesktopVendorOnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/vendor/terms')}
          nextSuffix={VENDOR_PRICING_COPY.nextSuffix}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{VENDOR_PRICING_COPY.title}</Text>

        <View style={styles.toolbar}>
          <DesktopInlineSelect
            value={activeRoom.id}
            options={roomOptions}
            onSelect={(id) => {
              setActiveRoomId(id);
              setEditingField(null);
            }}
            menuMaxHeight={200}
            startAdornment={
              <View style={styles.roomBadge}>
                <Text style={styles.roomBadgeText}>
                  {activeRoom.roomIndex}/{activeRoom.roomTotal}
                </Text>
              </View>
            }
          />

          <View style={styles.applyRow}>
            <Text style={styles.applyLabel}>{VENDOR_PRICING_COPY.applyAll}</Text>
            <Switch
              value={applyToAllRooms}
              onValueChange={setApplyToAllRooms}
              trackColor={{ false: 'rgba(28,32,36,0.15)', true: 'rgba(232,84,51,0.35)' }}
              thumbColor={applyToAllRooms ? colors.accent.main : colors.surface.white}
            />
          </View>
        </View>

        <View style={styles.pricingCard}>
          <Text style={styles.basePriceLabel}>{VENDOR_PRICING_COPY.basePriceLabel}</Text>

          <View style={styles.basePriceRow}>
            <Pressable
              style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
              onPress={() => adjustBasePrice(-VENDOR_PRICING_COPY.priceStep)}
              accessibilityRole="button"
            >
              <Ionicons name="remove" size={18} color={colors.text.primary} />
            </Pressable>

            <EditableRupeeField
              value={pricing.basePrice}
              editing={editingField === 'base'}
              onStartEdit={() => setEditingField('base')}
              onEndEdit={() => setEditingField(null)}
              onChange={(basePrice) => updatePricing({ basePrice })}
              containerStyle={styles.basePriceValue}
              textStyle={styles.basePriceText}
              inputStyle={styles.basePriceInput}
            />

            <Pressable
              style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
              onPress={() => adjustBasePrice(VENDOR_PRICING_COPY.priceStep)}
              accessibilityRole="button"
            >
              <Ionicons name="add" size={18} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.extraChargeBar}>
            <Text style={styles.extraChargeLabel}>{VENDOR_PRICING_COPY.extraChargeLabel}</Text>
            <View style={styles.extraChargeDivider} />
            <View style={styles.extraChargeFields}>
              <View style={styles.extraChargeItem}>
                <Text style={styles.extraChargeItemLabel}>{VENDOR_PRICING_COPY.adultLabel}</Text>
                <EditableRupeeField
                  value={pricing.adultExtra}
                  editing={editingField === 'adult'}
                  onStartEdit={() => setEditingField('adult')}
                  onEndEdit={() => setEditingField(null)}
                  onChange={(adultExtra) => updatePricing({ adultExtra })}
                  containerStyle={styles.extraChargeInput}
                  textStyle={styles.extraChargeInputText}
                  inputStyle={styles.extraChargeInputField}
                />
              </View>
              <View style={styles.extraChargeItem}>
                <Text style={styles.extraChargeItemLabel}>{VENDOR_PRICING_COPY.childLabel}</Text>
                <View style={styles.extraChargeInputBox}>
                  <Text style={styles.extraChargeInputText}>{formatRupee(pricing.childExtra)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <Text style={styles.rangeHint}>
            {VENDOR_PRICING_COPY.rangeHintPrefix}{' '}
            <Text style={styles.rangeHintBold}>
              ₹{VENDOR_PRICING_COPY.rangeMin.toLocaleString('en-IN')} - ₹
              {VENDOR_PRICING_COPY.rangeMax.toLocaleString('en-IN')}
            </Text>
          </Text>

          <Pressable
            style={({ pressed }) => [styles.discountRow, pressed && styles.pressed]}
            onPress={() => updatePricing({ discountEnabled: !pricing.discountEnabled })}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: pricing.discountEnabled }}
          >
            <Text style={styles.discountText}>{VENDOR_PRICING_COPY.discountLabel}</Text>
            <View style={[styles.checkbox, pricing.discountEnabled && styles.checkboxChecked]}>
              {pricing.discountEnabled ? (
                <Ionicons name="checkmark" size={14} color={colors.surface.white} />
              ) : null}
            </View>
          </Pressable>
        </View>
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 8,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 26,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  toolbar: {
    gap: 10,
  },
  roomBadge: {
    backgroundColor: colors.accent.main,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  roomBadgeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  applyLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  pricingCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  basePriceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.65)',
    textAlign: 'center',
  },
  basePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  basePriceValue: {
    minWidth: 130,
    borderWidth: 1,
    borderColor: colors.accent.main,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.lightPink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'text' as const },
    }),
  },
  basePriceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  basePriceInput: {
    minWidth: 100,
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    padding: 0,
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  editableInput: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    padding: 0,
    minWidth: 56,
    ...Platform.select({
      web: { outlineStyle: 'none' } as Record<string, unknown>,
    }),
  },
  extraChargeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  extraChargeLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    flexShrink: 0,
  },
  extraChargeDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(28, 32, 36, 0.12)',
  },
  extraChargeFields: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  extraChargeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  extraChargeItemLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
    flexShrink: 0,
  },
  extraChargeInput: {
    flex: 1,
    minHeight: 36,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'text' as const },
    }),
  },
  extraChargeInputBox: {
    flex: 1,
    minHeight: 36,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraChargeInputText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  extraChargeInputField: {
    width: '100%',
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
  },
  rangeHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.55)',
    textAlign: 'center',
  },
  rangeHintBold: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  discountText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.accent.main,
    borderColor: colors.accent.main,
  },
  pressed: { opacity: 0.85 },
});
