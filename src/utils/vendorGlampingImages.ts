import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const VENDOR_GLAMPING_IMAGES_KEY = 'vendor_glamping_images';

function webSessionStorage(): Storage | null {
  if (Platform.OS !== 'web') return null;
  try {
    const storage = (globalThis as unknown as { sessionStorage?: Storage }).sessionStorage;
    if (!storage || typeof storage.getItem !== 'function') return null;
    return storage;
  } catch {
    return null;
  }
}

export async function saveVendorGlampingImages(images: string[]): Promise<void> {
  const serialized = JSON.stringify(images);
  const session = webSessionStorage();
  if (session) {
    try {
      session.setItem(VENDOR_GLAMPING_IMAGES_KEY, serialized);
      return;
    } catch {
      // fall through to SecureStore on web if sessionStorage is full
    }
  }
  try {
    await SecureStore.setItemAsync(VENDOR_GLAMPING_IMAGES_KEY, serialized);
  } catch {
    // ignore
  }
}

export async function getVendorGlampingImages(): Promise<string[]> {
  const session = webSessionStorage();
  let raw: string | null = null;
  if (session) {
    try {
      raw = session.getItem(VENDOR_GLAMPING_IMAGES_KEY);
    } catch {
      raw = null;
    }
  } else {
    try {
      raw = await SecureStore.getItemAsync(VENDOR_GLAMPING_IMAGES_KEY);
    } catch {
      raw = null;
    }
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export async function clearVendorGlampingImages(): Promise<void> {
  const session = webSessionStorage();
  if (session) {
    try {
      session.removeItem(VENDOR_GLAMPING_IMAGES_KEY);
    } catch {
      // ignore
    }
  }
  try {
    await SecureStore.deleteItemAsync(VENDOR_GLAMPING_IMAGES_KEY);
  } catch {
    // ignore
  }
}
