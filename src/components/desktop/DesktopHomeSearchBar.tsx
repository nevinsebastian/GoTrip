import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopSearchDateRangePicker } from '@/src/components/desktop/DesktopSearchDateRangePicker';
import {
  formatSearchDate,
  HOME_SEARCH_BY_TAB,
  LOCATION_SUGGESTIONS,
  POPULAR_DESTINATIONS,
  totalGuests,
  type ExpandedSection,
  type GuestCounts,
} from '@/src/components/home/homeSearchConfig';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import {
  DESKTOP_HERO_SPECS,
  DESKTOP_WEB_ICONS,
} from '@/src/constants/desktopHomeConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

const SPECS = DESKTOP_HERO_SPECS;
const BuildingIcon = DESKTOP_WEB_ICONS.building;
const CalendarIcon = DESKTOP_WEB_ICONS.calendar;
const SofaIcon = DESKTOP_WEB_ICONS.sofa;
const SearchIcon = DESKTOP_WEB_ICONS.search;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function DesktopHomeSearchBar() {
  const { activeCategoryTab, enterSearchMode } = useHomeSearch();
  const config = HOME_SEARCH_BY_TAB[activeCategoryTab];
  const locationInputRef = useRef<TextInput>(null);

  const [expanded, setExpanded] = useState<ExpandedSection>(null);
  const [location, setLocation] = useState(config.defaultLocation);
  const [checkIn, setCheckIn] = useState(config.defaultCheckIn);
  const [checkOut, setCheckOut] = useState(config.defaultCheckOut);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: config.defaultAdults,
    children: config.defaultChildren,
    infants: config.defaultInfants,
    rooms: config.defaultRooms,
  });

  const [dateDraft, setDateDraft] = useState<{ checkIn: string; checkOut: string | null }>({
    checkIn: config.defaultCheckIn,
    checkOut: config.defaultCheckOut,
  });
  const [guestDraft, setGuestDraft] = useState<GuestCounts>({
    adults: config.defaultAdults,
    children: config.defaultChildren,
    infants: config.defaultInfants,
    rooms: config.defaultRooms,
  });

  useEffect(() => {
    setExpanded(null);
    setLocation(config.defaultLocation);
    setCheckIn(config.defaultCheckIn);
    setCheckOut(config.defaultCheckOut);
    const nextGuests = {
      adults: config.defaultAdults,
      children: config.defaultChildren,
      infants: config.defaultInfants,
      rooms: config.defaultRooms,
    };
    setGuests(nextGuests);
    setDateDraft({ checkIn: config.defaultCheckIn, checkOut: config.defaultCheckOut });
    setGuestDraft(nextGuests);
  }, [activeCategoryTab, config]);

  const openSection = (section: ExpandedSection) => {
    if (section !== 'location') {
      locationInputRef.current?.blur();
    }
    if (section === 'dates') {
      setDateDraft({ checkIn, checkOut });
    }
    if (section === 'guests') {
      setGuestDraft({ ...guests });
    }
    setExpanded(section);
    if (section === 'location') {
      setTimeout(() => locationInputRef.current?.focus(), 50);
    }
  };

  const closeSection = () => setExpanded(null);

  const filteredSuggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return LOCATION_SUGGESTIONS;
    return LOCATION_SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [location]);

  const checkInDisplay = formatSearchDate(checkIn);
  const checkOutDisplay = formatSearchDate(checkOut);
  const guestTotal = totalGuests(guests);

  const handleSearch = () => {
    closeSection();
    enterSearchMode({
      location,
      checkIn,
      checkOut,
      guests,
      tab: activeCategoryTab,
    });
    router.push(config.searchRoute);
  };

  const stackRef = useRef<View>(null);
  const [panelAnchor, setPanelAnchor] = useState({ top: 0, left: 0, width: 350 });

  useEffect(() => {
    if (!expanded || Platform.OS !== 'web') return;

    const measure = () => {
      stackRef.current?.measureInWindow((x, y, _width, height) => {
        const top = y + height + 8;
        if (expanded === 'location') {
          setPanelAnchor({ top, left: x, width: 350 });
        } else if (expanded === 'dates') {
          setPanelAnchor({ top, left: x + 282, width: 720 });
        } else if (expanded === 'guests') {
          setPanelAnchor({ top, left: x + _width - 320, width: 320 });
        }
      });
    };

    measure();
    const timer = setTimeout(measure, 0);
    return () => clearTimeout(timer);
  }, [expanded]);

  const locationPanelContent = (
    <View style={styles.locationPanel}>
      {filteredSuggestions.map((item) => (
        <Pressable
          key={item.title}
          style={styles.suggestionRow}
          onPress={() => {
            setLocation(item.short);
            closeSection();
            locationInputRef.current?.blur();
          }}
        >
          <Text style={styles.suggestionTitle}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.suggestionSub}>{item.subtitle}</Text> : null}
        </Pressable>
      ))}

      <Text style={styles.popularLabel}>Popular destintions</Text>
      <View style={styles.chipRow}>
        {POPULAR_DESTINATIONS.slice(0, 5).map((city, index) => (
          <Pressable
            key={`${city}-${index}`}
            style={styles.destChip}
            onPress={() => {
              setLocation(city);
              closeSection();
              locationInputRef.current?.blur();
            }}
          >
            <Text style={styles.destChipText}>{city}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const guestsPanelContent = (
    <View style={styles.guestsPanel}>
      <GuestStepperRow
        label="Adults"
        sublabel="Age 13+"
        value={guestDraft.adults}
        min={1}
        onChange={(v) => setGuestDraft((g) => ({ ...g, adults: v }))}
      />
      <GuestStepperRow
        label="Children"
        sublabel="Age 2-12"
        value={guestDraft.children}
        min={0}
        onChange={(v) => setGuestDraft((g) => ({ ...g, children: v }))}
      />
      <GuestStepperRow
        label="Infants"
        sublabel="Under 2"
        value={guestDraft.infants}
        min={0}
        onChange={(v) => setGuestDraft((g) => ({ ...g, infants: v }))}
      />
      <GuestStepperRow
        label="Rooms"
        sublabel=""
        value={guestDraft.rooms}
        min={1}
        onChange={(v) => setGuestDraft((g) => ({ ...g, rooms: v }))}
      />
      <View style={styles.panelActions}>
        <Pressable
          style={styles.cancelBtn}
          onPress={() => {
            setGuestDraft({ ...guests });
            closeSection();
          }}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={styles.selectBtn}
          onPress={() => {
            setGuests({ ...guestDraft });
            closeSection();
          }}
        >
          <Text style={styles.selectBtnText}>Select</Text>
        </Pressable>
      </View>
    </View>
  );

  const datePanelContent = (
    <DesktopSearchDateRangePicker
      checkIn={checkIn}
      checkOut={checkOut}
      draft={dateDraft}
      onDraftChange={setDateDraft}
      onCancel={() => {
        setDateDraft({ checkIn, checkOut });
        closeSection();
      }}
      onSelect={() => {
        if (!dateDraft.checkIn) return;
        const out = dateDraft.checkOut || dateDraft.checkIn;
        setCheckIn(dateDraft.checkIn);
        setCheckOut(out);
        closeSection();
      }}
    />
  );

  const useFloatingPanels = Platform.OS === 'web';

  return (
    <View style={styles.wrap}>
      {!useFloatingPanels && expanded ? (
        <Pressable style={styles.backdrop} onPress={closeSection} accessibilityLabel="Close search panel" />
      ) : null}

      <View ref={stackRef} style={styles.stack} collapsable={false}>
        <View style={styles.bar}>
          <View
            style={[
              styles.locationField,
              expanded === 'location' && styles.fieldActive,
            ]}
          >
            <View style={styles.fieldLabelRow}>
              <BuildingIcon width={18} height={18} />
              <Text style={styles.fieldLabel}>{config.locationLabel}</Text>
            </View>
            <View style={styles.valueBox}>
              <TextInput
                ref={locationInputRef}
                value={location}
                onChangeText={setLocation}
                onFocus={() => openSection('location')}
                style={styles.locationInput}
                placeholder="Search city or hotel"
                placeholderTextColor="rgba(28, 32, 36, 0.4)"
              />
            </View>
          </View>

          <View style={styles.vDivider} />

          <Pressable
            style={[styles.dateRow, expanded === 'dates' && styles.fieldActiveSoft]}
            onPress={() => openSection('dates')}
            {...Platform.select({
              web: { accessibilityRole: 'button' as const },
              default: {},
            })}
          >
            <View style={styles.dateField}>
              <View style={styles.fieldLabelRow}>
                <CalendarIcon width={18} height={18} />
                <Text style={styles.fieldLabel}>Check In</Text>
              </View>
              <View style={styles.valueBox}>
                <View style={styles.dateValueRow}>
                  <Text style={styles.dateValueSmall}>{checkInDisplay.date}</Text>
                  <Text style={styles.dateValueDay}>{checkInDisplay.day}</Text>
                </View>
              </View>
            </View>
            <View style={styles.dateField}>
              <View style={styles.fieldLabelRow}>
                <CalendarIcon width={18} height={18} />
                <Text style={styles.fieldLabel}>Check Out</Text>
              </View>
              <View style={styles.valueBox}>
                <View style={styles.dateValueRow}>
                  <Text style={styles.dateValueSmall}>{checkOutDisplay.date}</Text>
                  <Text style={styles.dateValueDay}>{checkOutDisplay.day}</Text>
                </View>
              </View>
            </View>
          </Pressable>

          <View style={styles.vDivider} />

          <View style={[styles.guestsField, expanded === 'guests' && styles.fieldActiveSoft]}>
            <Pressable style={styles.guestsHeader} onPress={() => openSection('guests')}>
              <View style={styles.fieldLabelRow}>
                <SofaIcon width={18} height={18} />
                <Text style={styles.fieldLabel}>{config.guestsLabel}</Text>
              </View>
              <View style={styles.valueBox}>
                <View style={styles.guestValueRow}>
                  <View style={styles.guestPart}>
                    <Text style={styles.guestNum}>{guestTotal}</Text>
                    <Text style={styles.guestUnit}>{config.guestUnit}</Text>
                  </View>
                  <View style={styles.guestDivider} />
                  <View style={styles.guestPart}>
                    <Text style={styles.guestNum}>{guests.rooms}</Text>
                    <Text style={styles.guestUnit}>
                      {config.roomUnit}
                      {guests.rooms === 1 ? '' : 's'}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

          </View>

          <Pressable style={styles.searchBtn} onPress={handleSearch} accessibilityLabel="Search">
            <SearchIcon width={24} height={24} />
          </Pressable>
        </View>

        {!useFloatingPanels && expanded === 'location' ? (
          <View style={styles.locationPanelWrap}>{locationPanelContent}</View>
        ) : null}

        {!useFloatingPanels && expanded === 'dates' ? (
          <View style={styles.datePanelWrap}>{datePanelContent}</View>
        ) : null}

        {!useFloatingPanels && expanded === 'guests' ? (
          <View style={styles.guestsPanelWrap}>{guestsPanelContent}</View>
        ) : null}
      </View>

      {useFloatingPanels ? (
        <Modal visible={expanded !== null} transparent animationType="none" onRequestClose={closeSection}>
          <View style={styles.modalRoot} pointerEvents="box-none">
            {expanded !== 'location' ? (
              <Pressable
                style={styles.modalBackdrop}
                onPress={closeSection}
                accessibilityLabel="Close search panel"
              />
            ) : null}
            {expanded ? (
              <View
                pointerEvents="auto"
                style={[
                  styles.floatingPanel,
                  {
                    top: panelAnchor.top,
                    left: panelAnchor.left,
                    width: panelAnchor.width,
                  },
                ]}
              >
                {expanded === 'location' ? locationPanelContent : null}
                {expanded === 'dates' ? datePanelContent : null}
                {expanded === 'guests' ? guestsPanelContent : null}
              </View>
            ) : null}
          </View>
        </Modal>
      ) : null}

      {config.showPriceFilter ? (
        <Pressable style={styles.priceBtn} onPress={closeSection}>
          <Text style={styles.priceText}>Price</Text>
          <Ionicons name="options-outline" size={18} color={SPECS.accent} />
          <Ionicons name="chevron-down" size={18} color={colors.text.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function GuestStepperRow({
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
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.stepperRow}>
      <View>
        <Text style={styles.stepperLabel}>{label}</Text>
        {sublabel ? <Text style={styles.stepperSub}>{sublabel}</Text> : null}
      </View>
      <View style={styles.stepper}>
        <Pressable
          style={styles.stepperBtn}
          onPress={() => onChange(clamp(value - 1, min, 10))}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Ionicons name="remove" size={16} color={SPECS.accent} />
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable
          style={styles.stepperBtn}
          onPress={() => onChange(clamp(value + 1, min, 10))}
          accessibilityLabel={`Increase ${label}`}
        >
          <Ionicons name="add" size={16} color={SPECS.accent} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    width: '100%',
    zIndex: 50,
    overflow: 'visible',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    top: -2000,
    bottom: -2000,
    left: -2000,
    right: -2000,
    zIndex: 0,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  modalRoot: {
    flex: 1,
  },
  floatingPanel: {
    position: 'absolute',
    zIndex: 2,
  },
  stack: {
    flex: 1,
    maxWidth: 1052,
    position: 'relative',
    zIndex: 2,
    overflow: 'visible',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: SPECS.searchBorderTopLeft,
    borderTopRightRadius: SPECS.searchBorderTopRight,
    borderBottomLeftRadius: SPECS.searchBorderBottomLeft,
    borderBottomRightRadius: SPECS.searchBorderBottomRight,
    padding: 12,
    gap: 12,
    minHeight: SPECS.searchHeight,
    overflow: 'visible',
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  locationField: {
    width: 270,
    height: 88,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
    zIndex: 3,
  },
  fieldActive: {
    borderColor: SPECS.accent,
  },
  fieldActiveSoft: {
    borderWidth: 1,
    borderColor: SPECS.accent,
    borderRadius: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    width: 424,
    height: 88,
    alignItems: 'center',
    flexShrink: 0,
    paddingHorizontal: 0,
    ...Platform.select({
      web: { outlineStyle: 'none' } as object,
      default: {},
    }),
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    justifyContent: 'center',
    minWidth: 0,
    height: '100%',
  },
  guestsField: {
    flex: 1,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    justifyContent: 'center',
    minWidth: 120,
    position: 'relative',
    zIndex: 2,
  },
  guestsHeader: {
    gap: 12,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.8)',
    flexShrink: 1,
  },
  valueBox: {
    backgroundColor: SPECS.valueBoxBg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    minHeight: 35,
  },
  locationInput: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  locationPanelWrap: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    width: 350,
    zIndex: 40,
  },
  locationPanel: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  suggestionRow: {
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 77, 46, 0.2)',
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.regular,
    color: SPECS.accent,
    lineHeight: 16,
  },
  suggestionSub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: '300',
    color: 'rgba(28, 32, 36, 0.6)',
    lineHeight: 14,
    marginTop: 2,
  },
  popularLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 16,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  destChip: {
    backgroundColor: SPECS.valueBoxBg,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  destChipText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    lineHeight: 16,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dateValueSmall: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
  dateValueDay: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
  guestValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestPart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  guestNum: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 20,
  },
  guestUnit: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 20,
    paddingBottom: 2,
  },
  guestDivider: {
    width: 1,
    height: 11,
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginHorizontal: 8,
  },
  vDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(28, 32, 36, 0.25)',
    marginVertical: 4,
  },
  searchBtn: {
    width: 88,
    height: 88,
    borderRadius: 100,
    backgroundColor: SPECS.accent,
    borderWidth: 7,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  datePanelWrap: {
    position: 'absolute',
    top: '100%',
    left: 282,
    marginTop: 8,
    width: 720,
    maxWidth: '100%',
    zIndex: 40,
  },
  guestsPanelWrap: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 320,
    zIndex: 40,
  },
  guestsPanel: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: SPECS.fieldBorder,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: 20,
  },
  stepperSub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
    lineHeight: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: SPECS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    minWidth: 16,
    textAlign: 'center',
  },
  panelActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 8,
    backgroundColor: colors.surface.white,
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  selectBtn: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SPECS.accent,
    borderRadius: 8,
  },
  selectBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  priceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    minWidth: 119,
    height: 34,
    marginTop: 39,
    gap: 8,
    zIndex: 1,
  },
  priceText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
