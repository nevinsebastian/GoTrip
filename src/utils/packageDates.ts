import { FIGMA_PACKAGE_DETAIL } from '@/src/constants/packageDetailConstants';

export type PackageFixedDates = {
  startDate: string;
  endDate: string;
};

const PACKAGE_DATES_BY_LISTING: Record<string, PackageFixedDates> = {
  'package-mock-1': { startDate: '2026-04-10', endDate: '2026-04-15' },
  'package-mock-2': { startDate: '2026-05-01', endDate: '2026-05-05' },
  'package-mock-3': { startDate: '2026-06-12', endDate: '2026-06-18' },
  'package-mock-4': { startDate: '2026-07-03', endDate: '2026-07-09' },
};

export function getPackageFixedDates(listingId?: string): PackageFixedDates {
  if (listingId && PACKAGE_DATES_BY_LISTING[listingId]) {
    return PACKAGE_DATES_BY_LISTING[listingId];
  }
  return {
    startDate: FIGMA_PACKAGE_DETAIL.fixedCheckIn,
    endDate: FIGMA_PACKAGE_DETAIL.fixedCheckOut,
  };
}

export function formatPackageDayLabel(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatPackageDateRange(start: string, end: string) {
  const startD = new Date(`${start}T12:00:00`);
  const endD = new Date(`${end}T12:00:00`);
  if (Number.isNaN(startD.getTime()) || Number.isNaN(endD.getTime())) return 'Dates TBA';

  const sameYear = startD.getFullYear() === endD.getFullYear();
  const startStr = startD.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endStr = endD.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
}
