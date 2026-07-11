import { saveVendorGlampingDraft, getVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import {
  clearVendorGlampingImages,
  getVendorGlampingImages,
  saveVendorGlampingImages,
} from '@/src/utils/vendorGlampingImages';

export async function persistVendorGlampingImages(images: string[]): Promise<void> {
  await saveVendorGlampingImages(images);
  const draft = (await getVendorGlampingDraft()) ?? {};
  await saveVendorGlampingDraft({ ...draft, images });
}

export async function loadVendorGlampingImages(): Promise<string[]> {
  const stored = await getVendorGlampingImages();
  if (stored.length) return stored;

  const draft = await getVendorGlampingDraft();
  return Array.isArray(draft?.images) ? draft.images : [];
}

export async function clearVendorGlampingImageStore(): Promise<void> {
  await clearVendorGlampingImages();
}
