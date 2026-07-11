import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const VENDOR_HOTEL_DRAFT_KEY = 'vendor_hotel_draft';

export type VendorHotelDraft = {
  title: string;
  description: string;
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

export async function saveVendorHotelDraft(draft: VendorHotelDraft): Promise<void> {
  const serialized = JSON.stringify(draft);
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(VENDOR_HOTEL_DRAFT_KEY, serialized);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(VENDOR_HOTEL_DRAFT_KEY, serialized);
  } catch {
    // ignore
  }
}

export async function getVendorHotelDraft(): Promise<VendorHotelDraft | null> {
  const ls = webLocalStorage();
  let raw: string | null = null;
  if (ls) {
    try {
      raw = ls.getItem(VENDOR_HOTEL_DRAFT_KEY);
    } catch {
      raw = null;
    }
  } else {
    try {
      raw = await SecureStore.getItemAsync(VENDOR_HOTEL_DRAFT_KEY);
    } catch {
      raw = null;
    }
  }

  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as VendorHotelDraft;
    if (!parsed?.title) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearVendorHotelDraft(): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(VENDOR_HOTEL_DRAFT_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_HOTEL_DRAFT_KEY);
  } catch {
    // ignore
  }
}
