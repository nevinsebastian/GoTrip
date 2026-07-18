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
  const checkOut = toDateOnly(input.checkOut);
  if (!checkIn) {
    throw Object.assign(new Error('Invalid check-in date.'), { statusCode: 400 });
  }

  return {
    listingId: input.listingId,
    entityType: input.entityType,
    entityId: input.entityId,
    checkIn,
    checkOut: checkOut || undefined,
    adults: Math.max(1, input.guests.adults),
    infants: input.guests.infants || undefined,
    unitsBooked: input.unitsBooked ?? 1,
    mealPlanId: mealPlanId && isUuid(mealPlanId) ? mealPlanId : undefined,
    activitySlotId:
      input.activitySlotId && isUuid(input.activitySlotId)
        ? input.activitySlotId
        : undefined,
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
