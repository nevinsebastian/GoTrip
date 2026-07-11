import { router } from 'expo-router';
import {
  createPackageListing,
  extractPackageListingId,
  getPackageApiErrorMessage,
  submitPackageListing,
  uploadPackageImages,
  upsertPackageItineraryDay,
} from '@/src/api/package.service';
import { PACKAGE_PHOTO_LIMITS } from '@/src/constants/vendorPackageConstants';
import type { APIError } from '@/src/api/types';
import {
  buildPackageCreatePayload,
  buildPackageItineraryPayloads,
  validatePackageDraft,
} from '@/src/utils/buildPackageCreatePayload';
import { getErrorMessage } from '@/src/utils/errorHandler';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { goToVendorLogin } from '@/src/utils/vendorNavigation';
import {
  clearVendorPackageDraft,
  getVendorPackageDraft,
} from '@/src/utils/vendorPackageDraft';
import {
  clearVendorPackageListingId,
  getVendorPackageListingId,
  saveVendorPackageListingId,
} from '@/src/utils/vendorPackageSession';

export type PackageStepResult = {
  success: boolean;
  message?: string;
  packageListingId?: string;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function requirePackageListingId(): Promise<string | null> {
  const id = await getVendorPackageListingId();
  if (!id || !isUuid(id)) return null;
  return id;
}

function formatValidationErrors(details: unknown): string | null {
  if (!Array.isArray(details)) return null;
  const messages = details
    .map((item) => {
      if (!item || typeof item !== 'object' || !('msg' in item)) return null;
      const field = item as { path?: string; msg?: string };
      if (field.path && field.msg) return `${field.path}: ${field.msg}`;
      return field.msg ?? null;
    })
    .filter((msg): msg is string => Boolean(msg));
  return messages.length ? messages.join('\n') : null;
}

async function handlePackageAuthErrors(error: unknown): Promise<boolean> {
  const apiError = error as APIError;
  if (apiError.statusCode === 401) {
    goToVendorLogin();
    return true;
  }
  if (apiError.statusCode === 403) {
    const payload = apiError.details as Record<string, unknown> | undefined;
    const backendMessage = String(payload?.error ?? payload?.message ?? apiError.message ?? '');
    if (backendMessage.toLowerCase().includes('vendor profile')) {
      router.push('/become-vendor');
      return true;
    }
  }
  return false;
}

function mapPackageStepError(error: unknown): string {
  const apiError = error as APIError;
  const payload = apiError.details as Record<string, unknown> | undefined;
  const validationMessage = formatValidationErrors(payload?.details);
  if (validationMessage) return validationMessage;
  return getPackageApiErrorMessage(error);
}

export async function ensureVendorPackageListingCreated(): Promise<PackageStepResult> {
  try {
    const existingId = await getVendorPackageListingId();
    if (existingId && isUuid(existingId)) {
      return { success: true, packageListingId: existingId };
    }

    const draft = await getVendorPackageDraft();
    const validationError = validatePackageDraft(draft);
    if (validationError) {
      return { success: false, message: validationError };
    }

    const payload = buildPackageCreatePayload(draft!);
    const res = await createPackageListing(payload);
    const listingId = extractPackageListingId(res);
    if (!listingId) {
      return { success: false, message: res?.message ?? 'Could not create package listing.' };
    }

    await saveVendorPackageListingId(listingId);
    return { success: true, packageListingId: listingId };
  } catch (error) {
    if (await handlePackageAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapPackageStepError(error) };
  }
}

export async function saveVendorPackageItinerariesStep(): Promise<PackageStepResult> {
  try {
    const id = await requirePackageListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not created yet. Please complete the previous steps first.',
      };
    }

    const draft = await getVendorPackageDraft();
    const itineraryPayloads = buildPackageItineraryPayloads(draft?.itineraryDays);
    if (!itineraryPayloads.length) {
      return { success: true, packageListingId: id };
    }

    for (const dayPayload of itineraryPayloads) {
      const res = await upsertPackageItineraryDay(id, dayPayload);
      if (res?.success === false) {
        return {
          success: false,
          message: res.message ?? `Could not save itinerary for day ${dayPayload.dayNumber}.`,
        };
      }
    }

    return { success: true, packageListingId: id };
  } catch (error) {
    if (await handlePackageAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapPackageStepError(error) };
  }
}

export async function createVendorPackageListingWithItineraries(): Promise<PackageStepResult> {
  const createRes = await ensureVendorPackageListingCreated();
  if (!createRes.success) return createRes;
  return saveVendorPackageItinerariesStep();
}

export async function uploadVendorPackageImagesStep(
  documents: VendorLocalDocument[],
  dataUrls?: string[],
): Promise<PackageStepResult> {
  try {
    const id = await requirePackageListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not created yet. Please complete the previous steps first.',
      };
    }

    if (!documents.length && !dataUrls?.length) {
      return { success: false, message: 'Please upload at least one image.' };
    }
    if (documents.length > PACKAGE_PHOTO_LIMITS.max) {
      return {
        success: false,
        message: `You can upload up to ${PACKAGE_PHOTO_LIMITS.max} images.`,
      };
    }

    const imagesRes = await uploadPackageImages(id, { documents, dataUrls });
    if (imagesRes?.success === false) {
      return { success: false, message: imagesRes.message ?? 'Could not upload images.' };
    }

    return { success: true, packageListingId: id };
  } catch (error) {
    if (await handlePackageAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapPackageStepError(error) };
  }
}

export async function submitVendorPackageListingForApproval(): Promise<PackageStepResult> {
  try {
    const id = await requirePackageListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not found. Please complete all previous steps first.',
      };
    }

    const submitRes = await submitPackageListing(id);
    if (submitRes?.success === false) {
      return { success: false, message: submitRes.message ?? 'Could not submit listing for approval.' };
    }

    await clearVendorPackageDraft();
    await clearVendorPackageListingId();
    return { success: true, message: submitRes?.message, packageListingId: id };
  } catch (error) {
    if (await handlePackageAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapPackageStepError(error) };
  }
}
