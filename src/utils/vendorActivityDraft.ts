import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const VENDOR_ACTIVITY_DRAFT_KEY = 'vendor_activity_draft';

export type VendorActivityDraft = {
  activityKindId?: string;
  activityTypeId?: string;
  title?: string;
  titleSecondary?: string;
  description?: string;
  locationJson?: Record<string, unknown>;
  highlightIds?: string[];
  guests?: number;
  hours?: number;
  minAge?: number;
  totalSlotsPerDay?: number;
  slotLabel?: string;
  slotStartTime?: string;
  basePriceAdult?: number;
  basePriceInfant?: number;
  aboutExperience?: string;
  thingsToCarry?: string;
  howToReach?: string;
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

export async function saveVendorActivityDraft(patch: Partial<VendorActivityDraft>): Promise<void> {
  const existing = (await getVendorActivityDraft()) ?? {};
  const serialized = JSON.stringify({ ...existing, ...patch });
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(VENDOR_ACTIVITY_DRAFT_KEY, serialized);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(VENDOR_ACTIVITY_DRAFT_KEY, serialized);
  } catch {
    // ignore
  }
}

export async function getVendorActivityDraft(): Promise<VendorActivityDraft | null> {
  const ls = webLocalStorage();
  let raw: string | null = null;
  if (ls) {
    try {
      raw = ls.getItem(VENDOR_ACTIVITY_DRAFT_KEY);
    } catch {
      raw = null;
    }
  } else {
    try {
      raw = await SecureStore.getItemAsync(VENDOR_ACTIVITY_DRAFT_KEY);
    } catch {
      raw = null;
    }
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VendorActivityDraft;
  } catch {
    return null;
  }
}

export async function clearVendorActivityDraft(): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(VENDOR_ACTIVITY_DRAFT_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_ACTIVITY_DRAFT_KEY);
  } catch {
    // ignore
  }
}
