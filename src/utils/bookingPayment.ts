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

/** Normalize any date-ish string to `YYYY-MM-DD` for booking APIs. */
export function toDateOnly(value: string | null | undefined): string | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  const direct = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (direct) return direct[1];
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

/** Default hotel stay: check-in in 7 days, 2-night stay (never past mock Figma dates). */
export function defaultHotelStayDates(nights = 2, daysAhead = 7): {
  checkIn: string;
  checkOut: string;
} {
  const checkIn = new Date();
  checkIn.setHours(12, 0, 0, 0);
  checkIn.setDate(checkIn.getDate() + daysAhead);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + Math.max(1, nights));
  return {
    checkIn: checkIn.toISOString().slice(0, 10),
    checkOut: checkOut.toISOString().slice(0, 10),
  };
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
    // Prefer nested booking before treating `data` itself as the booking row
    data && !data.booking ? data.id : undefined,
    r.id,
  ];

  for (const c of candidates) {
    if (isUuid(c)) return c.trim();
  }
  return null;
}

export function coerceMoney(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value.replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Normalize API price objects (camelCase or snake_case). */
export function normalizePriceBreakdown(raw: unknown): BookingPriceBreakdown | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const totalAmount =
    coerceMoney(r.totalAmount) ??
    coerceMoney(r.total_amount) ??
    coerceMoney(r.grandTotal) ??
    coerceMoney(r.grand_total) ??
    coerceMoney(r.payableAmount) ??
    coerceMoney(r.payable_amount);

  // Keep basePrice separate — do not promote it to subtotal/total.
  // Backend often returns totalAmount:null with meal plans while basePrice is set;
  // inventing a total here would skip our meal-plan retry and still fail initiate.
  const subtotal = coerceMoney(r.subtotal) ?? coerceMoney(r.sub_total);
  const basePrice = coerceMoney(r.basePrice) ?? coerceMoney(r.base_price);
  const taxAmount = coerceMoney(r.taxAmount) ?? coerceMoney(r.tax_amount);
  const discountAmount = coerceMoney(r.discountAmount) ?? coerceMoney(r.discount_amount);
  const nights = coerceMoney(r.nights);
  const currency =
    typeof r.currency === 'string' && r.currency.trim()
      ? r.currency
      : 'INR';

  if (
    totalAmount == null &&
    subtotal == null &&
    basePrice == null &&
    taxAmount == null &&
    discountAmount == null &&
    nights == null
  ) {
    return null;
  }

  return {
    nights: nights != null ? Math.round(nights) : undefined,
    basePrice: basePrice ?? undefined,
    extraPersonCharge:
      coerceMoney(r.extraPersonCharge) ?? coerceMoney(r.extra_person_charge) ?? undefined,
    mealCharge: coerceMoney(r.mealCharge) ?? coerceMoney(r.meal_charge) ?? undefined,
    subtotal: subtotal ?? undefined,
    discountAmount: discountAmount ?? undefined,
    taxableAmount: coerceMoney(r.taxableAmount) ?? coerceMoney(r.taxable_amount) ?? undefined,
    taxRatePct: coerceMoney(r.taxRatePct) ?? coerceMoney(r.tax_rate_pct) ?? undefined,
    taxAmount: taxAmount ?? undefined,
    platformFee: coerceMoney(r.platformFee) ?? coerceMoney(r.platform_fee) ?? undefined,
    platformFeePct: coerceMoney(r.platformFeePct) ?? coerceMoney(r.platform_fee_pct) ?? undefined,
    totalAmount: totalAmount ?? undefined,
    currency,
  };
}

export function extractHoldPriceBreakdown(raw: unknown): BookingPriceBreakdown | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const data = (r.data && typeof r.data === 'object' ? r.data : null) as Record<
    string,
    unknown
  > | null;
  const booking = (r.booking ?? data?.booking) as Record<string, unknown> | undefined;

  const fromBreakdown =
    normalizePriceBreakdown(r.priceBreakdown) ??
    normalizePriceBreakdown(r.price_breakdown) ??
    normalizePriceBreakdown(data?.priceBreakdown) ??
    normalizePriceBreakdown(data?.price_breakdown) ??
    normalizePriceBreakdown(booking?.priceBreakdown) ??
    normalizePriceBreakdown(booking?.price_breakdown);

  if (fromBreakdown?.totalAmount != null) return fromBreakdown;

  // Fallback: total lives on the booking row
  const bookingTotal =
    coerceMoney(booking?.totalAmount) ??
    coerceMoney(booking?.total_amount) ??
    coerceMoney(booking?.payableAmount) ??
    coerceMoney(booking?.payable_amount) ??
    coerceMoney(r.totalAmount) ??
    coerceMoney(r.total_amount) ??
    coerceMoney(data?.totalAmount) ??
    coerceMoney(data?.total_amount);

  if (bookingTotal == null) return fromBreakdown;

  return {
    ...(fromBreakdown ?? {}),
    totalAmount: bookingTotal,
    currency: fromBreakdown?.currency ?? 'INR',
  };
}

/** Best-effort payable total from hold + prior check-availability breakdown. */
export function resolveBookingPayableTotal(
  holdRes: { priceBreakdown?: BookingPriceBreakdown | null; booking?: unknown },
  prior?: BookingPriceBreakdown | null,
): number | null {
  return (
    coerceMoney(holdRes.priceBreakdown?.totalAmount) ??
    coerceMoney(holdRes.priceBreakdown?.subtotal) ??
    coerceMoney(holdRes.priceBreakdown?.taxableAmount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.totalAmount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.total_amount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.payableAmount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.payable_amount) ??
    coerceMoney(prior?.totalAmount) ??
    coerceMoney(prior?.subtotal) ??
    coerceMoney(holdRes.priceBreakdown?.basePrice)
  );
}

/** True when the hold response itself includes a positive payable total (not prior check / basePrice). */
export function holdHasPayableTotal(holdRes: {
  priceBreakdown?: BookingPriceBreakdown | null;
  booking?: unknown;
}): boolean {
  const total =
    coerceMoney(holdRes.priceBreakdown?.totalAmount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.totalAmount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.total_amount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.payableAmount) ??
    coerceMoney((holdRes.booking as Record<string, unknown> | undefined)?.payable_amount);
  return total != null && total > 0;
}

/** Body matching OpenAPI `BookingRequest` (+ optional guests / activitySlotId from product docs). */
export function buildHoldPayload(input: BookingHoldRequest): Record<string, unknown> {
  const checkIn = toDateOnly(input.checkIn);
  const checkOut = toDateOnly(input.checkOut);

  const body: Record<string, unknown> = {
    listingId: input.listingId,
    entityType: input.entityType,
    entityId: input.entityId,
    checkIn,
    adults: Math.max(1, input.adults),
  };

  if (checkOut) body.checkOut = checkOut;
  if (input.infants != null && input.infants > 0) body.infants = input.infants;
  if (input.unitsBooked != null && input.unitsBooked > 0) body.unitsBooked = input.unitsBooked;
  if (input.mealPlanId && isUuid(input.mealPlanId)) body.mealPlanId = input.mealPlanId;
  if (input.couponCode?.trim()) body.couponCode = input.couponCode.trim();
  if (input.specialRequests?.trim()) body.specialRequests = input.specialRequests.trim();
  if (input.activitySlotId && isUuid(input.activitySlotId)) {
    body.activitySlotId = input.activitySlotId;
  }
  if (Array.isArray(input.guests) && input.guests.length > 0) {
    body.guests = input.guests.map((g, index) => ({
      fullName: g.fullName,
      ...(g.age != null ? { age: g.age } : {}),
      // Backend payment/prefill often expects a primary guest
      isPrimary: g.isPrimary ?? index === 0,
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
  const keyId = (nested?.key_id as string | undefined) ?? razorpay?.key;
  const amount =
    (typeof nested?.amount === 'number' ? nested.amount : undefined) ??
    razorpay?.amount ??
    payment?.amount;
  const currency =
    (nested?.currency as string | undefined) ?? razorpay?.currency ?? 'INR';

  const data =
    orderId && keyId && amount != null && Number(amount) > 0
      ? {
          order_id: orderId,
          amount: Number(amount),
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

export function friendlyPaymentError(message: string | null | undefined): string {
  const raw = (message ?? '').trim();
  const lower = raw.toLowerCase();
  if (
    !raw ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower === 'internal server error' ||
    lower === 'internal servererror' ||
    lower.includes('pick future dates')
  ) {
    return 'Payment could not be started (server payment error). Please try again in a moment. If it keeps failing, Razorpay may be misconfigured on the API.';
  }
  return raw;
}

export function buildPaymentReceipt(bookingId: string): string {
  // Razorpay receipt max length is 40
  const compact = `gt${bookingId.replace(/-/g, '')}`;
  return compact.slice(0, 40);
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
