import type {
  BookingHoldRequest,
  BookingHoldResponse,
  BookingPriceBreakdown,
  InitiatePaymentResponse,
} from '@/src/api/types';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value.trim());
}

/** Pull booking UUID from any known hold-response shape. */
export function extractHeldBookingId(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const data = (r.data && typeof r.data === 'object' ? r.data : null) as Record<
    string,
    unknown
  > | null;
  const booking = (r.booking ?? data?.booking) as Record<string, unknown> | undefined;

  const candidates = [
    r.bookingId,
    data?.bookingId,
    booking?.id,
    data?.id,
    r.id,
  ];

  for (const c of candidates) {
    if (isUuid(c)) return c.trim();
  }
  return null;
}

export function extractHoldPriceBreakdown(raw: unknown): BookingPriceBreakdown | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const data = (r.data && typeof r.data === 'object' ? r.data : null) as Record<
    string,
    unknown
  > | null;
  const breakdown = (r.priceBreakdown ?? data?.priceBreakdown) as BookingPriceBreakdown | undefined;
  return breakdown ?? null;
}

/** Body matching OpenAPI `BookingRequest` (+ optional guests / activitySlotId from product docs). */
export function buildHoldPayload(input: BookingHoldRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {
    listingId: input.listingId,
    entityType: input.entityType,
    entityId: input.entityId,
    checkIn: input.checkIn,
    adults: Math.max(1, input.adults),
  };

  if (input.checkOut) body.checkOut = input.checkOut;
  if (input.infants != null && input.infants > 0) body.infants = input.infants;
  if (input.unitsBooked != null && input.unitsBooked > 0) body.unitsBooked = input.unitsBooked;
  if (input.mealPlanId && isUuid(input.mealPlanId)) body.mealPlanId = input.mealPlanId;
  if (input.couponCode?.trim()) body.couponCode = input.couponCode.trim();
  if (input.specialRequests?.trim()) body.specialRequests = input.specialRequests.trim();
  if (input.activitySlotId && isUuid(input.activitySlotId)) {
    body.activitySlotId = input.activitySlotId;
  }
  if (Array.isArray(input.guests) && input.guests.length > 0) {
    body.guests = input.guests.map((g) => ({
      fullName: g.fullName,
      ...(g.age != null ? { age: g.age } : {}),
      ...(g.idType ? { idType: g.idType } : {}),
      ...(g.idNumber ? { idNumber: g.idNumber } : {}),
    }));
  }

  return body;
}

export function normalizeHoldResponse(raw: unknown): BookingHoldResponse {
  const bookingId = extractHeldBookingId(raw) ?? undefined;
  const priceBreakdown = extractHoldPriceBreakdown(raw) ?? undefined;
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const data = (r.data && typeof r.data === 'object' ? r.data : null) as Record<
    string,
    unknown
  > | null;
  const booking = (r.booking ?? data?.booking ?? (bookingId ? { id: bookingId } : undefined)) as
    | BookingHoldResponse['booking']
    | undefined;

  return {
    success: r.success === false ? false : Boolean(bookingId) || r.success === true,
    holdId: (r.holdId as string | undefined) ?? (data?.holdId as string | undefined),
    bookingId,
    booking: booking as BookingHoldResponse['booking'],
    expiresAt: (r.expiresAt as string | undefined) ?? (data?.expiresAt as string | undefined),
    priceBreakdown,
  };
}

/** Normalize initiate response → checkout fields used by RazorpayCheckoutModal. */
export function normalizeInitiateResponse(
  raw: unknown,
  bookingId: string,
): InitiatePaymentResponse {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const nested = (r.data && typeof r.data === 'object' ? r.data : null) as Record<
    string,
    unknown
  > | null;
  const razorpay = (r.razorpayOrder ?? nested?.razorpayOrder) as
    | {
        id?: string;
        amount?: number;
        currency?: string;
        key?: string;
      }
    | undefined;
  const payment = (r.payment ?? nested?.payment) as
    | { id?: string; gatewayOrderId?: string; amount?: number }
    | undefined;

  const orderId =
    (nested?.order_id as string | undefined) ??
    razorpay?.id ??
    payment?.gatewayOrderId;
  const keyId =
    (nested?.key_id as string | undefined) ??
    razorpay?.key;
  const amount =
    (typeof nested?.amount === 'number' ? nested.amount : undefined) ??
    razorpay?.amount ??
    payment?.amount;
  const currency =
    (nested?.currency as string | undefined) ?? razorpay?.currency ?? 'INR';

  const data =
    orderId && keyId && amount != null
      ? {
          order_id: orderId,
          amount,
          currency,
          key_id: keyId,
          booking_id: bookingId,
        }
      : undefined;

  return {
    success: r.success === false ? false : Boolean(data) || r.success === true,
    message: (r.message as string | undefined) ?? (r.error as string | undefined),
    data,
    razorpayOrder: razorpay?.id
      ? {
          id: razorpay.id,
          amount: razorpay.amount ?? amount ?? 0,
          currency: razorpay.currency ?? currency,
          key: razorpay.key,
        }
      : undefined,
    payment,
  };
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
