import type { VendorGlampingMealInclusions } from '@/src/constants/vendorGlampingConstants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const VENDOR_GLAMPING_DRAFT_KEY = 'vendor_glamping_draft';

export type VendorGlampingDraft = {
  title?: string;
  description?: string;
  locationJson?: Record<string, unknown>;
  cancellationPolicyId?: string;
  totalCamps?: number;
  adultsPerCamp?: number;
  infantsPerCamp?: number;
  pricePerCampNight?: number;
  extraAdultCharge?: number;
  extraInfantCharge?: number;
  aboutExperience?: string;
  thingsToCarry?: string;
  howToReach?: string;
  inclusionsText?: string;
  exclusionsText?: string;
  whatsprovidedText?: string;
  images?: string[];
  mealPlanInclusions?: VendorGlampingMealInclusions;
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

export async function saveVendorGlampingDraft(patch: Partial<VendorGlampingDraft>): Promise<void> {
  const existing = (await getVendorGlampingDraft()) ?? {};
  const serialized = JSON.stringify({ ...existing, ...patch });
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(VENDOR_GLAMPING_DRAFT_KEY, serialized);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(VENDOR_GLAMPING_DRAFT_KEY, serialized);
  } catch {
    // ignore
  }
}

export async function getVendorGlampingDraft(): Promise<VendorGlampingDraft | null> {
  const ls = webLocalStorage();
  let raw: string | null = null;
  if (ls) {
    try {
      raw = ls.getItem(VENDOR_GLAMPING_DRAFT_KEY);
    } catch {
      raw = null;
    }
  } else {
    try {
      raw = await SecureStore.getItemAsync(VENDOR_GLAMPING_DRAFT_KEY);
    } catch {
      raw = null;
    }
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VendorGlampingDraft;
  } catch {
    return null;
  }
}

export async function clearVendorGlampingDraft(): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(VENDOR_GLAMPING_DRAFT_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_GLAMPING_DRAFT_KEY);
  } catch {
    // ignore
  }
}

