import { DesktopConfirmDatesModal } from '@/src/components/desktop/DesktopConfirmDatesModal';
import { DesktopConfirmGuestsModal } from '@/src/components/desktop/DesktopConfirmGuestsModal';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import React, { useCallback, useEffect, useState } from 'react';

export type DesktopBookingFocusState = {
  visible: boolean;
  sectionTitle: string;
  modalContent: React.ReactNode;
};

type GuestSaveDetails = {
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  infants: number;
};

type UseDesktopBookingFocusOptions = {
  onGuestSave?: (details: GuestSaveDetails) => void;
};

export function useDesktopBookingFocus(options?: UseDesktopBookingFocusOptions) {
  const { searchParams } = useHomeSearch();
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateModalStep, setDateModalStep] = useState<'dates' | 'guests'>('dates');
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  useEffect(() => {
    if (!searchParams) return;
    setCheckInDate(searchParams.checkIn || null);
    setCheckOutDate(searchParams.checkOut || null);
    setAdultsCount(searchParams.guests.adults);
    setChildrenCount(searchParams.guests.children);
    setInfantsCount(searchParams.guests.infants);
  }, [searchParams]);

  const openDateModal = useCallback(() => {
    setDateModalStep('dates');
    setDateModalVisible(true);
  }, []);

  const closeDateModal = useCallback(() => {
    setDateModalVisible(false);
    setDateModalStep('dates');
  }, []);

  const handleDatesSave = useCallback(() => {
    if (!checkInDate) return;
    setDateModalStep('guests');
  }, [checkInDate]);

  const handleGuestSave = useCallback(() => {
    closeDateModal();
    options?.onGuestSave?.({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adultsCount,
      children: childrenCount,
      infants: infantsCount,
    });
  }, [
    closeDateModal,
    options,
    checkInDate,
    checkOutDate,
    adultsCount,
    childrenCount,
    infantsCount,
  ]);

  const bookingFocus: DesktopBookingFocusState | undefined = dateModalVisible
    ? {
        visible: true,
        sectionTitle: 'Confirm dates and Guest Details',
        modalContent:
          dateModalStep === 'dates' ? (
            <DesktopConfirmDatesModal
              checkIn={checkInDate}
              checkOut={checkOutDate}
              onCheckInChange={setCheckInDate}
              onCheckOutChange={setCheckOutDate}
              onClose={closeDateModal}
              onSave={handleDatesSave}
            />
          ) : (
            <DesktopConfirmGuestsModal
              adults={adultsCount}
              children={childrenCount}
              infants={infantsCount}
              onAdultsChange={setAdultsCount}
              onChildrenChange={setChildrenCount}
              onInfantsChange={setInfantsCount}
              onClose={closeDateModal}
              onBack={() => setDateModalStep('dates')}
              onSave={handleGuestSave}
            />
          ),
      }
    : undefined;

  return {
    openDateModal,
    closeDateModal,
    bookingFocus,
    checkInDate,
    checkOutDate,
    adultsCount,
    childrenCount,
    infantsCount,
  };
}
