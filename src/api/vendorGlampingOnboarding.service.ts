import {
  createGlampingListing,
  createGlampingMealPlans,
  getGlampingApiErrorMessage,
  submitGlampingListing,
  uploadGlampingImages,
} from '@/src/api/glamping.service';
import { mapGlampingMealPlansFromInclusions } from '@/src/api/mappers/glampingMealPlan';
import {
  DEFAULT_GLAMPING_MEAL_INCLUSIONS,
  GLAMPING_PHOTO_LIMITS,
} from '@/src/constants/vendorGlampingConstants';
import { buildGlampingCreatePayload, validateGlampingDraft } from '@/src/utils/buildGlampingCreatePayload';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { normalizeGlampingImagesForApi } from '@/src/utils/normalizeGlampingImageForApi';
import {
  clearVendorGlampingListingId,
  getVendorGlampingListingId,
  saveVendorGlampingListingId,
} from '@/src/utils/vendorGlampingSession';
import { clearVendorGlampingDraft, getVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { clearVendorGlampingImageStore } from '@/src/utils/vendorGlampingImageStore';

export type GlampingStepResult = {
  success: boolean;
  message?: string;
  glampingId?: string;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function requireGlampingListingId(): Promise<string | null> {
  const id = await getVendorGlampingListingId();
  if (!id || !isUuid(id)) return null;
  return id;
}

export async function ensureVendorGlampingListingCreated(): Promise<GlampingStepResult> {
  try {
    const existingId = await getVendorGlampingListingId();
    if (existingId && isUuid(existingId)) {
      return { success: true, glampingId: existingId };
    }

    const glampingDraft = await getVendorGlampingDraft();
    const validationError = validateGlampingDraft(glampingDraft);
    if (validationError) {
      return { success: false, message: validationError };
    }

    const payload = buildGlampingCreatePayload(glampingDraft!);
    const res = await createGlampingListing(payload);
    if (!res?.id || typeof res.id !== 'string') {
      return { success: false, message: 'Could not create glamping listing.' };
    }

    await saveVendorGlampingListingId(res.id);
    return { success: true, glampingId: res.id };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function uploadVendorGlampingImagesStep(
  rawImages: string[],
  files?: File[],
): Promise<GlampingStepResult> {
  try {
    const id = await requireGlampingListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not created yet. Please complete the previous steps first.',
      };
    }

    const images = normalizeGlampingImagesForApi(rawImages);
    if (images.length < GLAMPING_PHOTO_LIMITS.min) {
      return {
        success: false,
        message: `Please upload at least ${GLAMPING_PHOTO_LIMITS.min} images.`,
      };
    }
    if (images.length > GLAMPING_PHOTO_LIMITS.max) {
      return {
        success: false,
        message: `You can upload up to ${GLAMPING_PHOTO_LIMITS.max} images.`,
      };
    }

    const imagesRes = await uploadGlampingImages(id, { images: rawImages, files });
    if (imagesRes?.success === false) {
      return { success: false, message: imagesRes.message ?? 'Could not upload images.' };
    }

    return { success: true, glampingId: id };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function saveVendorGlampingMealPlansStep(): Promise<GlampingStepResult> {
  try {
    const id = await requireGlampingListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not created yet. Please complete the previous steps first.',
      };
    }

    const glampingDraft = await getVendorGlampingDraft();
    const inclusions = glampingDraft?.mealPlanInclusions ?? DEFAULT_GLAMPING_MEAL_INCLUSIONS;
    const mealPlans = mapGlampingMealPlansFromInclusions(inclusions);
    const mealRes = await createGlampingMealPlans(id, mealPlans);
    if (mealRes?.success === false) {
      return { success: false, message: mealRes.message ?? 'Could not save meal plans.' };
    }

    return { success: true, glampingId: id };
  } catch (error) {
    return { success: false, message: getGlampingApiErrorMessage(error) };
  }
}

export async function submitVendorGlampingListingForApproval(): Promise<GlampingStepResult> {
  try {
    const id = await requireGlampingListingId();
    if (!id) {
      return {
        success: false,
        message: 'Listing not found. Please complete all previous steps first.',
      };
    }

    const submitRes = await submitGlampingListing(id);
    if (submitRes?.success === false) {
      return { success: false, message: submitRes.message ?? 'Could not submit listing for approval.' };
    }

    await clearVendorGlampingDraft();
    await clearVendorGlampingImageStore();
    await clearVendorGlampingListingId();
    return { success: true, message: submitRes?.message, glampingId: id };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
