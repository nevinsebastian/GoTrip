import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';

export const VENDOR_MODE_KEY = 'vendor_mode';
export const VENDOR_CATEGORY_KEY = 'vendor_listing_category';

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

export async function isVendorMode(): Promise<boolean> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      return ls.getItem(VENDOR_MODE_KEY) === '1';
    } catch {
      return false;
    }
  }
  try {
    const value = await SecureStore.getItemAsync(VENDOR_MODE_KEY);
    return value === '1';
  } catch {
    return false;
  }
}

export async function getStoredVendorListingCategory(): Promise<VendorListingCategoryId | null> {
  const ls = webLocalStorage();
  let value: string | null = null;
  if (ls) {
    try {
      value = ls.getItem(VENDOR_CATEGORY_KEY);
    } catch {
      value = null;
    }
  } else {
    try {
      value = await SecureStore.getItemAsync(VENDOR_CATEGORY_KEY);
    } catch {
      value = null;
    }
  }
  if (value === 'property' || value === 'packages' || value === 'glamping' || value === 'activities') {
    return value;
  }
  return null;
}

export async function activateVendorSession(category: VendorListingCategoryId): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(VENDOR_MODE_KEY, '1');
      ls.setItem(VENDOR_CATEGORY_KEY, category);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(VENDOR_MODE_KEY, '1');
    await SecureStore.setItemAsync(VENDOR_CATEGORY_KEY, category);
  } catch {
    // ignore
  }
}

export async function clearVendorSession(): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(VENDOR_MODE_KEY);
      ls.removeItem(VENDOR_CATEGORY_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_MODE_KEY);
    await SecureStore.deleteItemAsync(VENDOR_CATEGORY_KEY);
  } catch {
    // ignore
  }
}
