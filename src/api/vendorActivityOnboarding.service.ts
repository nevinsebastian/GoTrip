import { router } from 'expo-router';
import {
  createActivityListing,
  createActivitySlot,
  getActivityApiErrorMessage,
  submitActivityListing,
  uploadActivityImages,
} from '@/src/api/activity.service';
import { buildActivitySlotFromDraft } from '@/src/api/mappers/activityListing';
import { ACTIVITY_PHOTO_LIMITS } from '@/src/constants/vendorActivityConstants';
import type { APIError } from '@/src/api/types';
import {
  buildActivityCreatePayload,
  validateActivityDraft,
} from '@/src/utils/buildActivityCreatePayload';
import { getErrorMessage } from '@/src/utils/errorHandler';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { goToVendorLogin } from '@/src/utils/vendorNavigation';
import {
  clearVendorActivityDraft,
  getVendorActivityDraft,
} from '@/src/utils/vendorActivityDraft';
import {
  clearVendorActivityListingId,
  getVendorActivityListingId,
  saveVendorActivityListingId,
} from '@/src/utils/vendorActivitySession';

export type ActivityStepResult = {
  success: boolean;
  message?: string;
  activityListingId?: string;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function requireActivityListingId(): Promise<string | null> {
  const id = await getVendorActivityListingId();
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

async function handleActivityAuthErrors(error: unknown): Promise<boolean> {
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

function mapActivityStepError(error: unknown): string {
  const apiError = error as APIError;
  const payload = apiError.details as Record<string, unknown> | undefined;
  const validationMessage = formatValidationErrors(payload?.details);
  if (validationMessage) return validationMessage;
  return getActivityApiErrorMessage(error);
}

export async function ensureVendorActivityListingCreated(): Promise<ActivityStepResult> {
  try {
    const existingId = await getVendorActivityListingId();
    if (existingId && isUuid(existingId)) {
      return { success: true, activityListingId: existingId };
    }

    const draft = await getVendorActivityDraft();
    const validationError = validateActivityDraft(draft);
    if (validationError) {
      return { success: false, message: validationError };
    }

    const payload = buildActivityCreatePayload(draft!);
    const res = await createActivityListing(payload);
    const listingId = res?.id;
    if (!listingId || typeof listingId !== 'string') {
      return { success: false, message: res?.message ?? 'Could not create activity listing.' };
    }

    await saveVendorActivityListingId(listingId);
    return { success: true, activityListingId: listingId };
  } catch (error) {
    if (await handleActivityAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapActivityStepError(error) };
  }
}

export async function saveVendorActivitySlotsStep(): Promise<ActivityStepResult> {
  try {
    const id = await requireActivityListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not created yet. Please complete the previous steps first.',
      };
    }

    const draft = await getVendorActivityDraft();
    const slotPayload = buildActivitySlotFromDraft(draft ?? {});
    const slotRes = await createActivitySlot(id, slotPayload);
    if (slotRes?.success === false) {
      return { success: false, message: slotRes.message ?? 'Could not save activity slot.' };
    }

    return { success: true, activityListingId: id };
  } catch (error) {
    if (await handleActivityAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapActivityStepError(error) };
  }
}

export async function createVendorActivityListingWithSlots(): Promise<ActivityStepResult> {
  const createRes = await ensureVendorActivityListingCreated();
  if (!createRes.success) return createRes;
  return saveVendorActivitySlotsStep();
}

export async function uploadVendorActivityImagesStep(
  documents: VendorLocalDocument[],
  dataUrls?: string[],
): Promise<ActivityStepResult> {
  try {
    const id = await requireActivityListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not created yet. Please complete the previous steps first.',
      };
    }

    if (!documents.length && !dataUrls?.length) {
      return { success: false, message: 'Please upload at least one image.' };
    }
    if (documents.length > ACTIVITY_PHOTO_LIMITS.max) {
      return {
        success: false,
        message: `You can upload up to ${ACTIVITY_PHOTO_LIMITS.max} images.`,
      };
    }

    const imagesRes = await uploadActivityImages(id, { documents, dataUrls });
    if (imagesRes?.success === false) {
      return { success: false, message: imagesRes.message ?? 'Could not upload images.' };
    }

    return { success: true, activityListingId: id };
  } catch (error) {
    if (await handleActivityAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapActivityStepError(error) };
  }
}

export async function submitVendorActivityListingForApproval(): Promise<ActivityStepResult> {
  try {
    const id = await requireActivityListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not found. Please complete all previous steps first.',
      };
    }

    const submitRes = await submitActivityListing(id);
    if (submitRes?.success === false) {
      return { success: false, message: submitRes.message ?? 'Could not submit listing for approval.' };
    }

    await clearVendorActivityDraft();
    await clearVendorActivityListingId();
    return { success: true, message: submitRes?.message, activityListingId: id };
  } catch (error) {
    if (await handleActivityAuthErrors(error)) {
      return { success: false, message: getErrorMessage(error) };
    }
    return { success: false, message: mapActivityStepError(error) };
  }
}
