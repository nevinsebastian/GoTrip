import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingFooter } from '@/src/components/vendor/VendorOnboardingFooter';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VendorPropertyOptionSheet } from '@/src/components/vendor/VendorPropertyOptionSheet';
import {
  DEFAULT_VENDOR_ROOM_PRICING,
  VENDOR_PRICING_COPY,
  VENDOR_PRICING_ROOMS,
  type VendorRoomPricing,
} from '@/src/constants/vendorListingConstants';
import { VENDOR_GLAMPING_PRICING_COPY } from '@/src/constants/vendorGlampingConstants';
import { VENDOR_PACKAGE_PRICING_COPY } from '@/src/constants/vendorPackageConstants';
import { VENDOR_ACTIVITY_PRICING_COPY } from '@/src/constants/vendorActivityConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { getVendorGlampingDraft, saveVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { getVendorActivityDraft, saveVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { getVendorPackageDraft, saveVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

type EditingField = 'base' | 'adult' | 'infant' | null;

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

export function MobileVendorSetPricingScreen() {
  const categoryId = useVendorListingCategory();
  const isGlamping = categoryId === 'glamping';
  const isPackage = categoryId === 'packages';
  const isActivity = categoryId === 'activities';
  const isSimplePricing = isGlamping || isPackage || isActivity;

  const [glampingPrice, setGlampingPrice] = useState(0);
  const [glampingExtraAdult, setGlampingExtraAdult] = useState(0);
  const [glampingExtraInfant, setGlampingExtraInfant] = useState(0);
  const [glampingDiscountEnabled, setGlampingDiscountEnabled] = useState(true);
  const [editingGlampingPrice, setEditingGlampingPrice] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isActivity) return;
    (async () => {
      const draft = await getVendorActivityDraft();
      if (draft?.basePriceAdult != null) setGlampingPrice(draft.basePriceAdult);
      if (draft?.basePriceInfant != null) setGlampingExtraInfant(draft.basePriceInfant);
    })();
  }, [isActivity]);

  useEffect(() => {
    if (!isGlamping) return;
    (async () => {
      const draft = await getVendorGlampingDraft();
      if (draft?.pricePerCampNight != null) setGlampingPrice(draft.pricePerCampNight);
      if (draft?.extraAdultCharge != null) setGlampingExtraAdult(draft.extraAdultCharge);
      if (draft?.extraInfantCharge != null) setGlampingExtraInfant(draft.extraInfantCharge);
    })();
  }, [isGlamping]);

  useEffect(() => {
    if (!isPackage) return;
    (async () => {
      const draft = await getVendorPackageDraft();
      if (draft?.pricePerPerson != null) setGlampingPrice(draft.pricePerPerson);
    })();
  }, [isPackage]);

  const [activeRoomId, setActiveRoomId] = useState<string>(VENDOR_PRICING_ROOMS[0].id);
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
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
    id: room.id,
    label: `${room.roomIndex}/${room.roomTotal} ${room.label}`,
  }));

  const adjustGlampingPrice = (delta: number) => {
    setEditingGlampingPrice(false);
    setGlampingPrice((prev) => Math.max(0, prev + delta));
  };

  const handleNext = async () => {
    if (isGlamping) {
      if (glampingPrice <= 0) {
        setSubmitError('Please set a price per camp per night.');
        return;
      }
      setSubmitError(null);
      const prev = (await getVendorGlampingDraft()) ?? {};
      await saveVendorGlampingDraft({
        ...prev,
        pricePerCampNight: glampingPrice,
        extraAdultCharge: glampingExtraAdult,
        extraInfantCharge: glampingExtraInfant,
      });
      router.push('/vendor/camping-insights');
      return;
    }
    if (isPackage) {
      if (glampingPrice <= 0) {
        setSubmitError('Please set a price per person for this package.');
        return;
      }
      setSubmitError(null);
      const prev = (await getVendorPackageDraft()) ?? {};
      await saveVendorPackageDraft({
        ...prev,
        pricePerPerson: glampingPrice,
      });
      router.push('/vendor/package-itinerary');
      return;
    }
    if (isActivity) {
      if (glampingPrice <= 0) {
        setSubmitError('Please set a price for this activity.');
        return;
      }
      setSubmitError(null);
      await saveVendorActivityDraft({
        basePriceAdult: glampingPrice,
        basePriceInfant: glampingExtraInfant,
      });
      router.push('/vendor/camping-insights');
      return;
    }
    router.push('/vendor/terms');
  };

  const pricingSubtitle = isPackage
    ? VENDOR_PACKAGE_PRICING_COPY.subtitle
    : isActivity
      ? VENDOR_ACTIVITY_PRICING_COPY.subtitle
      : VENDOR_GLAMPING_PRICING_COPY.subtitle;
  const simpleBasePriceLabel = isPackage
    ? VENDOR_PACKAGE_PRICING_COPY.basePriceLabel
    : isActivity
      ? VENDOR_ACTIVITY_PRICING_COPY.basePriceLabel
      : VENDOR_GLAMPING_PRICING_COPY.basePriceLabel;
  const simpleNextSuffix = isPackage
    ? VENDOR_PACKAGE_PRICING_COPY.nextSuffix
    : isActivity
      ? VENDOR_ACTIVITY_PRICING_COPY.nextSuffix
      : VENDOR_GLAMPING_PRICING_COPY.nextSuffix;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero categoryId={categoryId} />
          <Text style={styles.title}>{VENDOR_PRICING_COPY.title}</Text>
          {isSimplePricing ? (
            <Text style={styles.subtitle}>{pricingSubtitle}</Text>
          ) : null}

          {isSimplePricing ? (
            <View style={styles.pricingCard}>
              <Text style={styles.basePriceLabel}>{simpleBasePriceLabel}</Text>

              <View style={styles.basePriceRow}>
                <Pressable
                  style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
                  onPress={() => adjustGlampingPrice(-VENDOR_PRICING_COPY.priceStep)}
                  accessibilityRole="button"
                >
                  <Ionicons name="remove" size={18} color={colors.text.primary} />
                </Pressable>

                <EditableRupeeField
                  value={glampingPrice}
                  editing={editingGlampingPrice}
                  onStartEdit={() => setEditingGlampingPrice(true)}
                  onEndEdit={() => setEditingGlampingPrice(false)}
                  onChange={setGlampingPrice}
                  containerStyle={styles.basePriceValue}
                  textStyle={styles.basePriceText}
                  inputStyle={styles.basePriceInput}
                />

                <Pressable
                  style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
                  onPress={() => adjustGlampingPrice(VENDOR_PRICING_COPY.priceStep)}
                  accessibilityRole="button"
                >
                  <Ionicons name="add" size={18} color={colors.text.primary} />
                </Pressable>
              </View>

              {isGlamping ? (
                <>
                  <View style={styles.orDividerRow}>
                    <View style={styles.orLineAccent} />
                    <View style={styles.orLineMuted} />
                  </View>

                  <View style={styles.extraChargeBar}>
                    <Text style={styles.extraChargeLabel}>{VENDOR_PRICING_COPY.extraChargeLabel}</Text>
                    <View style={styles.extraChargeDivider} />
                    <View style={styles.extraChargeFields}>
                      <View style={styles.extraChargeItem}>
                        <Text style={styles.extraChargeItemLabel}>
                          {VENDOR_GLAMPING_PRICING_COPY.extraAdultLabel}
                        </Text>
                        <EditableRupeeField
                          value={glampingExtraAdult}
                          editing={editingField === 'adult'}
                          onStartEdit={() => setEditingField('adult')}
                          onEndEdit={() => setEditingField(null)}
                          onChange={setGlampingExtraAdult}
                          containerStyle={styles.extraChargeInput}
                          textStyle={styles.extraChargeInputText}
                          inputStyle={styles.extraChargeInputField}
                        />
                      </View>
                      <View style={styles.extraChargeItem}>
                        <Text style={styles.extraChargeItemLabel}>
                          {VENDOR_GLAMPING_PRICING_COPY.extraInfantLabel}
                        </Text>
                        <EditableRupeeField
                          value={glampingExtraInfant}
                          editing={editingField === 'infant'}
                          onStartEdit={() => setEditingField('infant')}
                          onEndEdit={() => setEditingField(null)}
                          onChange={setGlampingExtraInfant}
                          containerStyle={styles.extraChargeInput}
                          textStyle={styles.extraChargeInputText}
                          inputStyle={styles.extraChargeInputField}
                        />
                      </View>
                    </View>
                  </View>
                </>
              ) : null}

              <View style={styles.orDividerRow}>
                <View style={styles.orLineAccent} />
                <View style={styles.orLineMuted} />
              </View>

              <Text style={styles.rangeHint}>
                {VENDOR_PRICING_COPY.rangeHintPrefix}{' '}
                <Text style={styles.rangeHintBold}>
                  ₹{VENDOR_PRICING_COPY.rangeMin.toLocaleString('en-IN')} - ₹
                  {VENDOR_PRICING_COPY.rangeMax.toLocaleString('en-IN')}
                </Text>
              </Text>

              <Pressable
                style={({ pressed }) => [styles.discountRow, pressed && styles.pressed]}
                onPress={() => setGlampingDiscountEnabled((v) => !v)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: glampingDiscountEnabled }}
              >
                <Text style={styles.discountText}>{VENDOR_PRICING_COPY.discountLabel}</Text>
                <View style={[styles.checkbox, glampingDiscountEnabled && styles.checkboxChecked]}>
                  {glampingDiscountEnabled ? (
                    <Ionicons name="checkmark" size={14} color={colors.surface.white} />
                  ) : null}
                </View>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.toolbar}>
                <Pressable
                  style={({ pressed }) => [styles.roomPill, pressed && styles.pressed]}
                  onPress={() => setRoomPickerOpen(true)}
                  accessibilityRole="button"
                >
                  <View style={styles.roomBadge}>
                    <Text style={styles.roomBadgeText}>
                      {activeRoom.roomIndex}/{activeRoom.roomTotal}
                    </Text>
                  </View>
                  <Text style={styles.roomPillText}>{activeRoom.label}</Text>
                  <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
                </Pressable>

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
            </>
          )}

          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
        </ScrollView>

        <VendorOnboardingFooter
          onBack={() => router.back()}
          onNext={handleNext}
          nextLabel="Next"
          nextSuffix={isSimplePricing ? simpleNextSuffix : VENDOR_PRICING_COPY.nextSuffix}
          isNextLoading={isSubmitting}
          nextDisabled={isSubmitting}
        />
      </View>

      {!isSimplePricing ? (
      <VendorPropertyOptionSheet
        visible={roomPickerOpen}
        title="Select room"
        options={roomOptions as Parameters<typeof VendorPropertyOptionSheet>[0]['options']}
        selectedId={activeRoom.id}
        onClose={() => setRoomPickerOpen(false)}
        onSelect={(id) => {
          setActiveRoomId(id);
          setRoomPickerOpen(false);
          setEditingField(null);
        }}
      />
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
  toolbar: { gap: 10 },
  roomPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.pill,
    paddingLeft: 6,
    paddingRight: spacing['3'],
    paddingVertical: 6,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  roomBadge: {
    backgroundColor: colors.surface.white,
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
    color: colors.accent.main,
  },
  roomPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
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
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  pricingCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 12,
    gap: 12,
    backgroundColor: colors.surface.white,
  },
  basePriceLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
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
    width: 36,
    height: 36,
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
    minWidth: 120,
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
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  basePriceInput: {
    minWidth: 100,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
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
    fontSize: typography.fontSize['1'],
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
    fontSize: 11,
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
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
    flexShrink: 0,
  },
  extraChargeInput: {
    flex: 1,
    minHeight: 32,
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
    minHeight: 32,
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
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  extraChargeInputField: {
    width: '100%',
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  orLineAccent: { flex: 1, height: 1, backgroundColor: colors.accent.main },
  orLineMuted: { flex: 1, height: 1, backgroundColor: 'rgba(28, 32, 36, 0.12)' },
  rangeHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
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
    fontSize: 11,
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
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.primaryAlt,
  },
});
