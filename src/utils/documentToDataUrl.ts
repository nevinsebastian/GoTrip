import { Platform } from 'react-native';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';

type FileSystemModule = typeof import('expo-file-system');

async function loadFileSystem(): Promise<FileSystemModule> {
  return await import('expo-file-system');
}

function readWebFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });
}

async function readWebBlobUrlAsDataUrl(uri: string, mimeType: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const file = blob instanceof File ? blob : new File([blob], 'photo.jpg', { type: mimeType || blob.type || 'image/jpeg' });
  return readWebFileAsDataUrl(file);
}

export async function documentToDataUrl(doc: VendorLocalDocument): Promise<string> {
  const uri = doc.uri?.trim() ?? '';

  if (uri.startsWith('data:')) {
    return uri;
  }

  if (Platform.OS === 'web') {
    if (doc.file) {
      return readWebFileAsDataUrl(doc.file);
    }
    if (uri.startsWith('blob:')) {
      return readWebBlobUrlAsDataUrl(uri, doc.mimeType);
    }
    throw new Error('Could not read image file on web.');
  }

  const FileSystem = await loadFileSystem();
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:${doc.mimeType};base64,${base64}`;
}

export async function documentsToDataUrls(docs: VendorLocalDocument[]): Promise<string[]> {
  return Promise.all(docs.map(documentToDataUrl));
}
