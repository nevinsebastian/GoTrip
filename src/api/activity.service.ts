import { Platform } from 'react-native';
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  ActivityHighlightsResponse,
  ActivityTypeEnum,
  CreateActivityRequest,
  CreateActivityResponse,
  CreateActivitySlotRequest,
  CreateActivitySlotResponse,
  SubmitActivityListingResponse,
  UploadActivityImagesResponse,
} from './types';
import {
  buildActivityImageUploadFormData,
  buildActivityImageUploadFormDataFromUrls,
} from '@/src/utils/normalizeActivityImageForApi';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { getErrorMessage } from '@/src/utils/errorHandler';
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
    const fieldDetails = Array.isArray(record.details) ? record.details : null;
    const firstFieldError = fieldDetails?.find(
      (item) => item && typeof item === 'object' && 'msg' in item,
    ) as { path?: string; msg?: string } | undefined;
    if (firstFieldError?.msg) {
      return firstFieldError.path
        ? `${firstFieldError.path}: ${firstFieldError.msg}`
        : firstFieldError.msg;
    }
  }
  return getErrorMessage(error);
}

export { extractBackendErrorMessage as getActivityApiErrorMessage };

export async function getActivityHighlights(
  activityType: ActivityTypeEnum,
): Promise<ActivityHighlightsResponse> {
  logApi('GET /admin/activity-highlights (request)', { activityType });
  const response = await apiClient.get<ActivityHighlightsResponse>(
    ENDPOINTS.admin.activityHighlights,
    { params: { activityType } },
  );
  logApi('GET /admin/activity-highlights (response)', response.data);
  return response.data;
}

export async function createActivityListing(
  payload: CreateActivityRequest,
): Promise<CreateActivityResponse> {
  logApi('POST /activities (request)', payload);
  try {
    const response = await apiClient.post<CreateActivityResponse>(
      ENDPOINTS.activities.create,
      payload,
    );
    logApi('POST /activities (response)', response.data);
    return response.data;
  } catch (error) {
    logApiError('POST /activities', error);
    throw error;
  }
}

export async function createActivitySlot(
  listingId: string,
  payload: CreateActivitySlotRequest,
): Promise<CreateActivitySlotResponse> {
  logApi(`POST /activities/${listingId}/slots (request)`, payload);
  try {
    const response = await apiClient.post<CreateActivitySlotResponse>(
      ENDPOINTS.activities.slots(listingId),
      payload,
    );
    logApi(`POST /activities/${listingId}/slots (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /activities/${listingId}/slots`, error);
    throw error;
  }
}

export async function uploadActivityImages(
  listingId: string,
  payload: { documents?: VendorLocalDocument[]; dataUrls?: string[] },
): Promise<UploadActivityImagesResponse> {
  const documents = payload.documents ?? [];
  const dataUrls = payload.dataUrls ?? [];
  const formData =
    documents.length > 0
      ? buildActivityImageUploadFormData(documents, dataUrls)
      : buildActivityImageUploadFormDataFromUrls(dataUrls);

  logApi(`POST /activities/${listingId}/images (request multipart)`, {
    documentCount: documents.length,
    dataUrlCount: dataUrls.length,
    platform: Platform.OS,
  });

  try {
    const response = await apiClient.post<UploadActivityImagesResponse>(
      ENDPOINTS.activities.images(listingId),
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
    logApi(`POST /activities/${listingId}/images (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /activities/${listingId}/images`, error);
    throw error;
  }
}

export async function submitActivityListing(
  listingId: string,
): Promise<SubmitActivityListingResponse> {
  logApi(`POST /activities/${listingId}/submit (request)`, {});
  try {
    const response = await apiClient.post<SubmitActivityListingResponse>(
      ENDPOINTS.activities.submit(listingId),
    );
    logApi(`POST /activities/${listingId}/submit (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /activities/${listingId}/submit`, error);
    throw error;
  }
}
