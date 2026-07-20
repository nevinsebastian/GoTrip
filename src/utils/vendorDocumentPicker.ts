import { NativeModules, Platform } from 'react-native';

export type VendorLocalDocument = {
  id: string;
  name: string;
  mimeType: string;
  uri: string;
  file?: File;
};

export type VendorDocumentPickSource = 'camera' | 'gallery' | 'files';

export const VENDOR_DOCUMENT_PICKER_REBUILD_MESSAGE =
  'Document upload is not available in this app build. Rebuild and reinstall the app with: npx expo run:android';

export class VendorDocumentPickerError extends Error {
  constructor(message: string = VENDOR_DOCUMENT_PICKER_REBUILD_MESSAGE) {
    super(message);
    this.name = 'VendorDocumentPickerError';
  }
}

type ImagePickerAsset = {
  uri?: string;
  fileName?: string | null;
  mimeType?: string;
  file?: File;
};

type ImagePickerModule = typeof import('expo-image-picker');
type DocumentPickerModule = typeof import('expo-document-picker');

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function fromWebFile(file: File): VendorLocalDocument {
  return {
    id: makeId(),
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    uri: URL.createObjectURL(file),
    file,
  };
}

function pickFilesOnWeb(multiple: boolean): Promise<VendorLocalDocument[]> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve([]);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = 'image/*,.pdf,application/pdf';
    input.onchange = () => {
      const files = Array.from(input.files ?? []).map(fromWebFile);
      resolve(files);
    };
    input.click();
  });
}

async function fromImageAsset(asset: ImagePickerAsset): Promise<VendorLocalDocument | null> {
  if (!asset.uri) return null;

  const name = asset.fileName ?? asset.uri.split('/').pop() ?? `photo-${makeId()}.jpg`;
  const mimeType = asset.mimeType ?? 'image/jpeg';

  if (Platform.OS === 'web' && asset.file) {
    return fromWebFile(asset.file);
  }

  return {
    id: makeId(),
    name,
    mimeType,
    uri: asset.uri,
  };
}

function isNativeModuleAvailable(moduleName: string): boolean {
  return Boolean((NativeModules as Record<string, unknown>)[moduleName]);
}

async function loadImagePickerModule(): Promise<ImagePickerModule> {
  if (!isNativeModuleAvailable('ExponentImagePicker')) {
    throw new VendorDocumentPickerError();
  }

  const module = await import('expo-image-picker');
  if (typeof module.requestMediaLibraryPermissionsAsync !== 'function') {
    throw new VendorDocumentPickerError();
  }
  return module;
}

async function loadDocumentPickerModule(): Promise<DocumentPickerModule> {
  if (!isNativeModuleAvailable('ExpoDocumentPicker')) {
    throw new VendorDocumentPickerError();
  }

  const module = await import('expo-document-picker');
  if (typeof module.getDocumentAsync !== 'function') {
    throw new VendorDocumentPickerError();
  }
  return module;
}

function isAllowedDocumentMime(mimeType: string | undefined, name: string): boolean {
  const mime = (mimeType ?? '').toLowerCase();
  const lowerName = name.toLowerCase();
  if (mime.startsWith('image/')) return true;
  if (mime === 'application/pdf') return true;
  if (lowerName.endsWith('.pdf')) return true;
  if (/\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i.test(lowerName)) return true;
  // Android file managers sometimes omit mimeType — allow unknown so selection isn't blocked
  if (!mime || mime === 'application/octet-stream') return true;
  return false;
}

export async function pickVendorDocument(
  source: VendorDocumentPickSource,
): Promise<VendorLocalDocument | null> {
  if (Platform.OS === 'web') {
    const files = await pickFilesOnWeb(false);
    return files[0] ?? null;
  }

  try {
    if (source === 'files') {
      const DocumentPicker = await loadDocumentPickerModule();
      // Android often returns an empty list when multiple MIME types are passed.
      // Prefer a broad filter and validate the selected file client-side.
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'android' ? '*/*' : ['image/*', 'application/pdf'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return null;

      const asset = result.assets[0];
      if (!isAllowedDocumentMime(asset.mimeType, asset.name)) {
        throw new VendorDocumentPickerError('Please choose an image or PDF file.');
      }

      return {
        id: makeId(),
        name: asset.name,
        mimeType: asset.mimeType ?? 'application/octet-stream',
        uri: asset.uri,
      };
    }

    const ImagePicker = await loadImagePickerModule();

    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        throw new VendorDocumentPickerError('Camera permission is required to take a photo.');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.[0]) return null;
      return fromImageAsset(result.assets[0]);
    }

    // Gallery — request permission, but on Android 13+ the system photo picker
    // can still open without a legacy grant if the permission dialog is denied.
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted && Platform.OS !== 'android') {
      throw new VendorDocumentPickerError('Photo library permission is required to choose a file.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsMultipleSelection: false,
      // Prefer the Android system photo picker when available
      ...(Platform.OS === 'android' ? { legacy: false } : null),
    });

    if (result.canceled || !result.assets?.[0]) return null;
    return fromImageAsset(result.assets[0]);
  } catch (error) {
    if (error instanceof VendorDocumentPickerError) throw error;
    throw new VendorDocumentPickerError();
  }
}
