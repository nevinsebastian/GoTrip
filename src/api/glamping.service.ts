import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreateGlampingMealPlanResponse,
  CreateGlampingRequest,
  CreateGlampingResponse,
  GlampingMealPlanRequest,
  SubmitGlampingListingResponse,
  UploadGlampingImagesResponse,
} from './types';
import {
  buildGlampingImageUploadFormData,
  normalizeGlampingImagesForApi,
} from '@/src/utils/normalizeGlampingImageForApi';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Platform } from 'react-native';
import type { APIError } from './types';

function logApi(label: string, detail: unknown) {
  console.log(`[API] ${label}`, detail);
}

function logApiError(label: string, error: unknown) {
  const apiError = error as APIError;
  logApi(`${label} (error)`, {
    message: getErrorMessage(error),
    statusCode: apiError?.statusCode,
    details: apiError?.details,
  });
}

function extractBackendErrorMessage(error: unknown): string {
  const apiError = error as APIError;
  const details = apiError?.details;
  if (details && typeof details === 'object') {
    const record = details as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message;
    }
    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error;
    }
  }
  return getErrorMessage(error);
}

export async function createGlampingListing(
  payload: CreateGlampingRequest,
): Promise<CreateGlampingResponse> {
  logApi('POST /glamping (request)', payload);
  const response = await apiClient.post<CreateGlampingResponse>(
    ENDPOINTS.glamping.create,
    payload,
  );
  logApi('POST /glamping (response)', response.data);
  return response.data;
}

export async function createGlampingMealPlan(
  listingId: string,
  payload: GlampingMealPlanRequest,
): Promise<CreateGlampingMealPlanResponse> {
  logApi(`POST /glamping/${listingId}/meal-plans (request)`, payload);
  try {
    const response = await apiClient.post<CreateGlampingMealPlanResponse>(
      ENDPOINTS.glamping.mealPlans(listingId),
      payload,
    );
    logApi(`POST /glamping/${listingId}/meal-plans (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /glamping/${listingId}/meal-plans`, error);
    throw error;
  }
}

export async function createGlampingMealPlans(
  listingId: string,
  plans: GlampingMealPlanRequest[],
): Promise<CreateGlampingMealPlanResponse> {
  if (!plans.length) {
    return { success: false, message: 'No meal plans to save.' };
  }

  let lastResponse: CreateGlampingMealPlanResponse = { success: true };
  for (const plan of plans) {
    lastResponse = await createGlampingMealPlan(listingId, plan);
    if (lastResponse?.success === false) {
      return lastResponse;
    }
  }
  return lastResponse;
}

export { extractBackendErrorMessage as getGlampingApiErrorMessage };

async function postGlampingImagesJson(
  id: string,
  images: string[],
): Promise<UploadGlampingImagesResponse> {
  logApi(`POST /glamping/${id}/images (request json)`, {
    imageCount: images.length,
    samplePrefix: images[0]?.slice(0, 48),
  });
  const response = await apiClient.post<UploadGlampingImagesResponse>(
    ENDPOINTS.glamping.images(id),
    { images },
    { timeout: 120_000 },
  );
  logApi(`POST /glamping/${id}/images (response json)`, response.data);
  return response.data;
}

async function postGlampingImagesMultipart(
  id: string,
  images: string[],
  files?: File[],
): Promise<UploadGlampingImagesResponse> {
  const formData = buildGlampingImageUploadFormData(images, files);
  logApi(`POST /glamping/${id}/images (request multipart)`, {
    imageCount: images.length,
    platform: Platform.OS,
  });
  const response = await apiClient.post<UploadGlampingImagesResponse>(
    ENDPOINTS.glamping.images(id),
    formData,
    {
      timeout: 120_000,
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        if (typeof FormData !== 'undefined' && data instanceof FormData) {
          delete headers['Content-Type'];
        }
        return data;
      },
    },
  );
  logApi(`POST /glamping/${id}/images (response multipart)`, response.data);
  return response.data;
}

export async function uploadGlampingImages(
  id: string,
  payload: { images: string[]; files?: File[] },
): Promise<UploadGlampingImagesResponse> {
  const images = normalizeGlampingImagesForApi(payload.images);
  if (!images.length) {
    return { success: false, message: 'No valid images to upload.' };
  }

  if (Platform.OS === 'web') {
    try {
      return await postGlampingImagesMultipart(id, images, payload.files);
    } catch (multipartError) {
      logApi(`POST /glamping/${id}/images (multipart failed)`, getErrorMessage(multipartError));
    }
  }

  try {
    return await postGlampingImagesJson(id, images);
  } catch (jsonError) {
    if (Platform.OS === 'web') {
      throw jsonError;
    }
    logApi(`POST /glamping/${id}/images (json failed)`, getErrorMessage(jsonError));
    return postGlampingImagesMultipart(id, payload.images);
  }
}

export async function submitGlampingListing(
  id: string,
): Promise<SubmitGlampingListingResponse> {
  logApi(`POST /glamping/${id}/submit (request)`, {});
  const response = await apiClient.post<SubmitGlampingListingResponse>(ENDPOINTS.glamping.submit(id));
  logApi(`POST /glamping/${id}/submit (response)`, response.data);
  return response.data;
}
