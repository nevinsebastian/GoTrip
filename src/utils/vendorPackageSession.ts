import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const VENDOR_PACKAGE_LISTING_ID_KEY = 'vendor_package_listing_id';

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

export async function saveVendorPackageListingId(listingId: string): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.setItem(VENDOR_PACKAGE_LISTING_ID_KEY, listingId);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(VENDOR_PACKAGE_LISTING_ID_KEY, listingId);
  } catch {
    // ignore
  }
}

export async function getVendorPackageListingId(): Promise<string | null> {
  const ls = webLocalStorage();
  let raw: string | null = null;
  if (ls) {
    try {
      raw = ls.getItem(VENDOR_PACKAGE_LISTING_ID_KEY);
    } catch {
      raw = null;
    }
  } else {
    try {
      raw = await SecureStore.getItemAsync(VENDOR_PACKAGE_LISTING_ID_KEY);
    } catch {
      raw = null;
    }
  }
  return raw?.trim() || null;
}

export async function clearVendorPackageListingId(): Promise<void> {
  const ls = webLocalStorage();
  if (ls) {
    try {
      ls.removeItem(VENDOR_PACKAGE_LISTING_ID_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_PACKAGE_LISTING_ID_KEY);
  } catch {
    // ignore
  }
}
