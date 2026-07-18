import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopConfirmDatesModal } from '@/src/components/desktop/DesktopConfirmDatesModal';
import { DesktopSearchResultsHeader } from '@/src/components/desktop/DesktopSearchResultsHeader';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import { getDatesInRange, type HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import { useEntityAvailability } from '@/src/hooks/useEntityAvailability';
import type { AvailabilityEntityType } from '@/src/api/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const ACCENT = DESKTOP_HERO_SPECS.accent;
const MUTED = 'rgba(0, 7, 20, 0.62)';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatDateCardLabel(iso: string | null): string {
  if (!iso) return 'Select date';
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSelectionSummary(
  checkIn: string | null,
  checkOut: string | null,
  adults: number,
  children: number,
  infants: number,
): string {
  const guestParts: string[] = [];
  if (adults > 0) guestParts.push(`${adults} Adult${adults === 1 ? '' : 's'}`);
  if (children > 0) guestParts.push(`${children} Child${children === 1 ? '' : 'ren'}`);
  if (infants > 0) guestParts.push(`${infants} Infant${infants === 1 ? '' : 's'}`);
  const guests = guestParts.join(', ') || 'No guests';

  if (!checkIn) return guests;
  if (!checkOut) {
    const d = new Date(`${checkIn}T12:00:00`);
    return `${d.toLocaleDateString('en-US', { month: 'long' })} ${d.getDate()} | ${guests}`;
  }
  const range = getDatesInRange(checkIn, checkOut);
  const first = new Date(`${range[0]}T12:00:00`);
  const month = first.toLocaleDateString('en-US', { month: 'long' });
  const days = range.map((d) => new Date(`${d}T12:00:00`).getDate()).join(',');
  return `${month} ${days} | ${guests}`;
}

type AmenityItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

type DesktopConfirmDatesGuestScreenProps = {
  roomName: string;
  guestRoomLabel: string;
  description: string;
  rating: string;
  customersLabel: string;
  amenities: AmenityItem[];
  priceLabel: string;
  priceSubLabel?: string;
  cancellationText: string;
  checkInTimeLabel: string;
  checkOutTimeLabel: string;
  entityType?: AvailabilityEntityType;
  entityId?: string;
  initialCheckIn?: string | null;
  initialCheckOut?: string | null;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
  confirming?: boolean;
  errorMessage?: string | null;
  activeTab?: HomeCategoryTab;
  isLoggedIn?: boolean;
  onTabChange?: (tab: HomeCategoryTab) => void;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
  onBack: () => void;
  onConfirm: (payload: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    infants: number;
  }) => void;
  onViewAmenities?: () => void;
};

function StepperRow({
  label,
  sublabel,
  value,
  min,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.stepperRow}>
      <View style={styles.stepperLeft}>
        <Text style={styles.stepperLabel}>{label}</Text>
        <Text style={styles.stepperSub}>{sublabel}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => onChange(clamp(value - 1, min, 10))}
          hitSlop={10}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Ionicons name="remove" size={16} color="rgba(205, 34, 0, 0.92)" />
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable
          onPress={() => onChange(clamp(value + 1, min, 10))}
          hitSlop={10}
          accessibilityLabel={`Increase ${label}`}
        >
          <Ionicons name="add" size={16} color="rgba(205, 34, 0, 0.92)" />
        </Pressable>
      </View>
    </View>
  );
}

export function DesktopConfirmDatesGuestScreen({
  roomName,
  guestRoomLabel,
  description,
  rating,
  customersLabel,
  amenities,
  priceLabel,
  priceSubLabel = 'including tax',
  cancellationText,
  checkInTimeLabel,
  checkOutTimeLabel,
  entityType,
  entityId,
  initialCheckIn = null,
  initialCheckOut = null,
  initialAdults = 2,
  initialChildren = 0,
  initialInfants = 0,
  confirming = false,
  errorMessage,
  activeTab = 'hotels',
  isLoggedIn,
  onTabChange,
  onMenuPress,
  onProfilePress,
  onLoginPress,
  onBack,
  onConfirm,
  onViewAmenities,
}: DesktopConfirmDatesGuestScreenProps) {
  const [checkIn, setCheckIn] = useState<string | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string | null>(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { disabledDates } = useEntityAvailability(
    entityType,
    entityId,
    checkIn ?? initialCheckIn,
    Boolean(entityType && entityId),
  );

  const summary = useMemo(
    () => formatSelectionSummary(checkIn, checkOut, adults, children, infants),
    [checkIn, checkOut, adults, children, infants],
  );

  const clearSelection = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
    setAdults(2);
    setChildren(0);
    setInfants(0);
    setLocalError(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!checkIn || !checkOut) {
      setLocalError('Please select check-in and check-out dates.');
      setCalendarOpen(true);
      return;
    }
    if (adults < 1) {
      setLocalError('At least one adult is required.');
      return;
    }
    setLocalError(null);
    onConfirm({ checkIn, checkOut, adults, children, infants });
  }, [checkIn, checkOut, adults, children, infants, onConfirm]);

  const displayError = localError ?? errorMessage;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={styles.headerWrap}>
          <DesktopSearchResultsHeader
            activeTab={activeTab}
            onTabChange={onTabChange ?? (() => undefined)}
            isLoggedIn={isLoggedIn}
            onMenuPress={onMenuPress}
            onProfilePress={onProfilePress}
            onLoginPress={onLoginPress}
          />
        </View>

        <View style={styles.mainShell}>
          <Text style={styles.pageTitle}>Confirm dates and Guest Details</Text>

          <View style={styles.columns}>
            <View style={styles.leftCard}>
              <View style={styles.roomTitleRow}>
                <Text style={styles.roomName}>{roomName}</Text>
                <Text style={styles.guestRoomLabel}>{guestRoomLabel}</Text>
              </View>

              <Text style={styles.description}>{description}</Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={ACCENT} />
                <Text style={styles.ratingText}>{rating}</Text>
                <Text style={styles.ratingDivider}>|</Text>
                <Text style={styles.ratingText}>{customersLabel}</Text>
              </View>

              <View style={styles.amenitiesBlock}>
                <View style={styles.amenitiesHeader}>
                  <Text style={styles.amenitiesTitle}>What we provide?</Text>
                  {onViewAmenities ? (
                    <Pressable onPress={onViewAmenities} hitSlop={8}>
                      <Text style={styles.viewAllLink}>View all amenities →</Text>
                    </Pressable>
                  ) : null}
                </View>
                <View style={styles.amenitiesRow}>
                  {amenities.slice(0, 3).map((item) => (
                    <View key={item.label} style={styles.amenityItem}>
                      <View style={styles.amenityIcon}>
                        <Ionicons name={item.icon} size={18} color={ACCENT} />
                      </View>
                      <Text style={styles.amenityLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.priceBox}>
                <View style={styles.priceLeft}>
                  <Text style={styles.priceForNight}>Price for one night</Text>
                  <Text style={styles.cancellation}>{cancellationText}</Text>
                </View>
                <View style={styles.priceRight}>
                  <Text style={styles.priceValue}>{priceLabel}</Text>
                  <Text style={styles.priceTax}>{priceSubLabel}</Text>
                </View>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.dateCardsRow}>
                <Pressable
                  style={styles.dateCard}
                  onPress={() => setCalendarOpen(true)}
                  accessibilityLabel="Edit check-in date"
                >
                  <Text style={styles.dateCardTitle}>Check In</Text>
                  <Text style={styles.dateCardBody}>
                    {formatDateCardLabel(checkIn)}
                    {'\n'}
                    {checkInTimeLabel}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.dateCard}
                  onPress={() => setCalendarOpen(true)}
                  accessibilityLabel="Edit check-out date"
                >
                  <Text style={styles.dateCardTitle}>Check Out</Text>
                  <Text style={styles.dateCardBody}>
                    {formatDateCardLabel(checkOut)}
                    {'\n'}
                    {checkOutTimeLabel}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.guestBlock}>
                <StepperRow
                  label="Adults"
                  sublabel="Age 13+"
                  value={adults}
                  min={1}
                  onChange={setAdults}
                />
                <StepperRow
                  label="Children"
                  sublabel="Age 2-12"
                  value={children}
                  min={0}
                  onChange={setChildren}
                />
                <StepperRow
                  label="Infants"
                  sublabel="Under 2"
                  value={infants}
                  min={0}
                  onChange={setInfants}
                />
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>{summary}</Text>
                <Pressable onPress={clearSelection} hitSlop={8}>
                  <Text style={styles.clearLink}>Clear Selection</Text>
                </Pressable>
              </View>

              {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.backBtn}
                  onPress={onBack}
                  accessibilityLabel="Go back"
                  disabled={confirming}
                >
                  <Text style={styles.backBtnText}>Go back</Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmBtn, confirming && styles.confirmBtnDisabled]}
                  onPress={handleConfirm}
                  accessibilityLabel="Confirm and proceed"
                  disabled={confirming}
                >
                  {confirming ? (
                    <ActivityIndicator color={colors.surface.white} />
                  ) : (
                    <Text style={styles.confirmBtnText}>Confirm and proceed</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <DesktopSiteFooter />
      </ScrollView>

      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <DesktopConfirmDatesModal
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onClose={() => setCalendarOpen(false)}
            onSave={() => {
              if (!checkIn) {
                setLocalError('Please select a check-in date.');
                return;
              }
              setLocalError(null);
              setCalendarOpen(false);
            }}
            disabledDates={disabledDates}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 46,
  },
  headerWrap: {
    width: '100%',
    alignItems: 'center',
  },
  mainShell: {
    ...desktopContentShellStyle,
    gap: 36,
    paddingVertical: 8,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  leftCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 422,
  },
  roomTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 11,
  },
  roomName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    color: ACCENT,
    lineHeight: 34,
  },
  guestRoomLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 34,
  },
  description: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.04,
    color: MUTED,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: ACCENT,
  },
  ratingDivider: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: MUTED,
    marginHorizontal: 4,
  },
  amenitiesBlock: {
    gap: 12,
    marginTop: 8,
  },
  amenitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amenitiesTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  viewAllLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: '300',
    color: ACCENT,
  },
  amenitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  amenityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 77, 46, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: MUTED,
    flexShrink: 1,
  },
  priceBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.2)',
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  priceLeft: {
    gap: 18,
    flex: 1,
  },
  priceForNight: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  cancellation: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: '#138808',
  },
  priceRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priceValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
  },
  priceTax: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: MUTED,
  },
  rightColumn: {
    flex: 1,
    gap: 24,
    justifyContent: 'center',
    minHeight: 422,
  },
  dateCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCard: {
    flex: 1,
    backgroundColor: colors.surface.white,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    minHeight: 102,
    justifyContent: 'space-between',
    ...Platform.select({
      web: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' },
      default: { elevation: 3 },
    }),
  },
  dateCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: '#202020',
  },
  dateCardBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: '#202020',
  },
  guestBlock: {
    gap: 24,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLeft: {
    gap: 4,
  },
  stepperLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  stepperSub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: MUTED,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    height: 32,
    backgroundColor: 'rgba(255, 32, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(231, 40, 0, 0.4)',
    borderRadius: 4,
  },
  stepperValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: '#000000',
    minWidth: 12,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  clearLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: MUTED,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: '#CD3E3E',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: ACCENT,
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      } as object,
      default: {},
    }),
  },
});
