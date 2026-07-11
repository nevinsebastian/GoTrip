import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { VendorPackageDayItinerary } from '@/src/constants/vendorPackageConstants';
import type { PackageBookingMode } from '@/src/api/types';

const VENDOR_PACKAGE_DRAFT_KEY = 'vendor_package_draft';

export type VendorPackageDraft = {
  destination?: string;
  categoryId?: string;
  title?: string;
  description?: string;
  locationJson?: Record<string, unknown>;
  totalDays?: number;
  totalNights?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  pricePerPerson?: number;
  bookingMode?: PackageBookingMode;
  itineraryDays?: VendorPackageDayItinerary[];
  inclusionsText?: string;
  exclusionsText?: string;
  whatsprovidedText?: string;
  images?: string[];
};

function webLocalStorage(): Storage | null {
  if (Platform.OS !== 'web') return null;
  try {
    const ls = (globalThis as unknown as { localStorage?: Storage }).localStorage;
    if (!ls || typeof ls.getItem !== 'function') return null;
    return ls;
  } catch {
    return null;
  }
}

export async function saveVendorPackageDraft(patch: Partial<VendorPackageDraft>): Promise<void> {
  const existing = (await getVendorPackageDraft()) ?? {};
  const serialized = JSON.stringify({ ...existing, ...patch });
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(VENDOR_PACKAGE_DRAFT_KEY, serialized);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(VENDOR_PACKAGE_DRAFT_KEY, serialized);
  } catch {
    // ignore
  }
}

export async function getVendorPackageDraft(): Promise<VendorPackageDraft | null> {
  const ls = webLocalStorage();
  let raw: string | null = null;
  if (ls) {
    try {
      raw = ls.getItem(VENDOR_PACKAGE_DRAFT_KEY);
    } catch {
      raw = null;
    }
  } else {
    try {
      raw = await SecureStore.getItemAsync(VENDOR_PACKAGE_DRAFT_KEY);
    } catch {
      raw = null;
    }
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VendorPackageDraft;
  } catch {
    return null;
  }
}

export async function clearVendorPackageDraft(): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(VENDOR_PACKAGE_DRAFT_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_PACKAGE_DRAFT_KEY);
  } catch {
    // ignore
  }
}
