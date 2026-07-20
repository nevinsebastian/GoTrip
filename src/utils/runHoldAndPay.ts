import type {
  AvailabilityEntityType,
  BookingHoldRequest,
  BookingHoldResponse,
  BookingPriceBreakdown,
  InitiatePaymentResponse,
} from '@/src/api/types';
import { holdBooking, initiatePayment } from '@/src/api/booking.service';
import {
  isUuid,
  resolveBookingPayableTotal,
  toDateOnly,
} from '@/src/utils/bookingPayment';

export type CheckoutGuests = {
  adults: number;
  children?: number;
  infants?: number;
};

export type RunHoldAndPayInput = {
  listingId: string;
  entityType: AvailabilityEntityType;
  entityId: string;
  checkIn: string;
  checkOut?: string;
  guests: CheckoutGuests;
  unitsBooked?: number;
  /** Prefer omitting when backend returns null totals with meal plans. */
  mealPlanId?: string | null;
  activitySlotId?: string | null;
  pricePreview?: BookingPriceBreakdown | null;
  /** Optional combo link for cross_room_type multi-hold */
  comboRef?: string | null;
};

export type RunHoldAndPayResult = {
  bookingId: string;
  hold: BookingHoldResponse;
  payment: InitiatePaymentResponse;
  payableTotal: number | null;
};

function buildHoldBody(
  input: RunHoldAndPayInput,
  mealPlanId?: string | null,
): BookingHoldRequest {
  const checkIn = toDateOnly(input.checkIn);
  if (!checkIn) {
    throw Object.assign(new Error('Invalid check-in date.'), { statusCode: 400 });
  }

  const isActivity = input.entityType === 'activity_slot';
  // Overnight stays need checkOut; activities are priced for a single day (omit checkOut).
  const checkOut = isActivity ? undefined : toDateOnly(input.checkOut);
  if (!isActivity && !checkOut) {
    throw Object.assign(new Error('Please select check-out date.'), { statusCode: 400 });
  }

  const adults = Math.max(1, input.guests.adults);
  // Activity inventory is per participant — unitsBooked must match adults.
  const unitsBooked = isActivity
    ? adults
    : Math.max(1, input.unitsBooked ?? 1);

  return {
    listingId: input.listingId,
    entityType: input.entityType,
    entityId: input.entityId,
    checkIn,
    checkOut,
    adults,
    children: input.guests.children || undefined,
    infants: input.guests.infants || undefined,
    unitsBooked,
    mealPlanId: mealPlanId && isUuid(mealPlanId) ? mealPlanId : undefined,
    activitySlotId:
      isActivity && input.entityId
        ? input.entityId
        : input.activitySlotId && isUuid(input.activitySlotId)
          ? input.activitySlotId
          : undefined,
    comboRef: input.comboRef && isUuid(input.comboRef) ? input.comboRef : undefined,
    guests: [{ fullName: 'Guest', age: 30, isPrimary: true }],
  };
}

/**
 * Shared hotel/activity/glamping checkout used by web + native.
 *
 * Backend bug: holding with `mealPlanId` often returns `totalAmount: null`
 * and `/payments/initiate` then crashes (`error: undefined`). Working web
 * desktop succeeds when no meal plan is on the hold — we always omit it here.
 */
export async function runHoldAndPay(
  input: RunHoldAndPayInput,
): Promise<RunHoldAndPayResult> {
  if (input.mealPlanId && isUuid(input.mealPlanId) && __DEV__) {
    // eslint-disable-next-line no-console
    console.log('[checkout] omitting mealPlanId on hold (server cannot price meal holds)');
  }

  const hold = await holdBooking(buildHoldBody(input, undefined));
  const payable = resolveBookingPayableTotal(hold, input.pricePreview);

  const bookingId = hold.bookingId ?? hold.booking?.id;
  if (!bookingId || !isUuid(bookingId)) {
    throw Object.assign(new Error('Failed to hold booking — missing booking id.'), {
      statusCode: 400,
    });
  }

  if (payable == null || payable <= 0) {
    // Still attempt initiate — some backends store amount only on the booking row.
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[checkout] payable total still null; initiating anyway', {
        bookingId,
        breakdown: hold.priceBreakdown,
      });
    }
  }

  const payment = await initiatePayment({ bookingId });
  if (!payment.data?.order_id || !payment.data?.key_id || !payment.data?.amount) {
    throw Object.assign(
      new Error(payment.message ?? 'Failed to initiate payment.'),
      { statusCode: 400, details: payment },
    );
  }

  return { bookingId, hold, payment, payableTotal: payable };
}
