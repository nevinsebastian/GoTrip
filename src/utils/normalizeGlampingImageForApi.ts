import { Platform } from 'react-native';

function detectMimeTypeFromBase64(base64: string): string {
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  if (base64.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
}

export function normalizeGlampingImageForApi(image: string): string | null {
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('data:') && trimmed.includes('base64,')) {
    return trimmed;
  }

  if (trimmed.startsWith('blob:') || trimmed.startsWith('file:')) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const base64 = trimmed.replace(/\s/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(base64) && base64.length > 100) {
    const mimeType = detectMimeTypeFromBase64(base64);
    return `data:${mimeType};base64,${base64}`;
  }

  return null;
}

export function normalizeGlampingImagesForApi(images: string[]): string[] {
  return images
    .map(normalizeGlampingImageForApi)
    .filter((image): image is string => Boolean(image));
}

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

export function buildGlampingImageUploadFormData(
  images: string[],
  files?: File[],
): FormData {
  const formData = new FormData();

  if (Platform.OS === 'web' && files?.length) {
    files.slice(0, images.length).forEach((file, index) => {
      formData.append('images', file, file.name || `glamping-${index + 1}.jpg`);
    });
    return formData;
  }

  const prepared = normalizeGlampingImagesForApi(images);

  prepared.forEach((image, index) => {
    if (Platform.OS === 'web' && image.startsWith('data:')) {
      const blob = dataUrlToBlob(image);
      const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
      formData.append('images', blob, `glamping-${index + 1}.${extension}`);
      return;
    }

    if (!image.startsWith('data:') && !image.startsWith('http')) {
      formData.append('images', {
        uri: image,
        name: `glamping-${index + 1}.jpg`,
        type: 'image/jpeg',
      } as unknown as Blob);
    }
  });

  return formData;
}
