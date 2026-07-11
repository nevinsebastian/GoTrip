import { Platform } from 'react-native';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { normalizeGlampingImagesForApi } from '@/src/utils/normalizeGlampingImageForApi';

export { normalizeGlampingImagesForApi as normalizeActivityImagesForApi } from '@/src/utils/normalizeGlampingImageForApi';

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64 = ''] = dataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/i)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export function buildActivityImageUploadFormData(
  documents: VendorLocalDocument[],
  dataUrls?: string[],
): FormData {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append('images', doc.file, doc.file.name || doc.name || `image-${index}.jpg`);
        return;
      }
      const dataUrl = dataUrls?.[index];
      if (dataUrl?.startsWith('data:')) {
        const blob = dataUrlToBlob(dataUrl);
        const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
        formData.append('images', blob, doc.name || `image-${index}.${extension}`);
      }
    });
    return formData;
  }

  documents.forEach((doc, index) => {
    formData.append(
      'images',
      {
        uri: doc.uri,
        name: doc.name ?? `image-${index}.jpg`,
        type: doc.mimeType ?? 'image/jpeg',
      } as unknown as Blob,
    );
  });

  return formData;
}

export function buildActivityImageUploadFormDataFromUrls(images: string[]): FormData {
  const formData = new FormData();
  const prepared = normalizeGlampingImagesForApi(images);

  prepared.forEach((image, index) => {
    if (Platform.OS === 'web' && image.startsWith('data:')) {
      const blob = dataUrlToBlob(image);
      const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
      formData.append('images', blob, `image-${index + 1}.${extension}`);
      return;
    }

    formData.append(
      'images',
      {
        uri: image,
        name: `image-${index + 1}.jpg`,
        type: 'image/jpeg',
      } as unknown as Blob,
    );
  });

  return formData;
}
