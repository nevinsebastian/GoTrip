import type { AvailabilityDay } from '@/src/api/types';

/** Date is bookable when not blocked and has at least one unit. */
export function isAvailabilityDayOpen(day: AvailabilityDay): boolean {
  if (day.is_blocked) return false;
  return (day.available_units ?? 0) > 0;
}

export function buildDisabledDatesFromAvailability(
  days: AvailabilityDay[] | undefined | null,
): Set<string> {
  const blocked = new Set<string>();
  for (const day of days ?? []) {
    if (!day.date) continue;
    if (!isAvailabilityDayOpen(day)) blocked.add(day.date);
  }
  return blocked;
}

export function monthRangeAround(dateIso: string, monthsAhead = 2) {
  const d = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    const today = new Date();
    return monthRangeAround(today.toISOString().slice(0, 10), monthsAhead);
  }
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + monthsAhead, 0));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function formatPriceBreakdownTotal(total?: number | null, currency = 'INR'): string {
  if (total == null || !Number.isFinite(total)) return '—';
  if (currency === 'INR') {
    return `₹ ${total.toLocaleString('en-IN')} including tax`;
  }
  return `${currency} ${total.toLocaleString('en-IN')}`;
}
