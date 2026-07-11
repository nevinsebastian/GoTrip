import { Platform } from 'react-native';
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreatePackageRequest,
  CreatePackageResponse,
  SubmitPackageListingResponse,
  UploadPackageImagesResponse,
  UpsertPackageItineraryRequest,
  UpsertPackageItineraryResponse,
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

export { extractBackendErrorMessage as getPackageApiErrorMessage };

export function extractPackageListingId(response: CreatePackageResponse): string | null {
  const listingId = response.listing?.id;
  if (typeof listingId === 'string' && listingId.trim()) return listingId.trim();
  if (typeof response.id === 'string' && response.id.trim()) return response.id.trim();
  const packageId = response.package?.id;
  if (typeof packageId === 'string' && packageId.trim()) return packageId.trim();
  return null;
}

export async function createPackageListing(
  payload: CreatePackageRequest,
): Promise<CreatePackageResponse> {
  logApi('POST /packages (request)', payload);
  try {
    const response = await apiClient.post<CreatePackageResponse>(
      ENDPOINTS.packages.create,
      payload,
    );
    logApi('POST /packages (response)', response.data);
    return response.data;
  } catch (error) {
    logApiError('POST /packages', error);
    throw error;
  }
}

export async function upsertPackageItineraryDay(
  listingId: string,
  payload: UpsertPackageItineraryRequest,
): Promise<UpsertPackageItineraryResponse> {
  logApi(`POST /packages/${listingId}/itineraries (request)`, payload);
  try {
    const response = await apiClient.post<UpsertPackageItineraryResponse>(
      ENDPOINTS.packages.itineraries(listingId),
      payload,
    );
    logApi(`POST /packages/${listingId}/itineraries (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /packages/${listingId}/itineraries`, error);
    throw error;
  }
}

export async function uploadPackageImages(
  listingId: string,
  payload: { documents?: VendorLocalDocument[]; dataUrls?: string[] },
): Promise<UploadPackageImagesResponse> {
  const documents = payload.documents ?? [];
  const dataUrls = payload.dataUrls ?? [];
  const formData =
    documents.length > 0
      ? buildActivityImageUploadFormData(documents, dataUrls)
      : buildActivityImageUploadFormDataFromUrls(dataUrls);

  logApi(`POST /packages/${listingId}/images (request multipart)`, {
    documentCount: documents.length,
    dataUrlCount: dataUrls.length,
    platform: Platform.OS,
  });

  try {
    const response = await apiClient.post<UploadPackageImagesResponse>(
      ENDPOINTS.packages.images(listingId),
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
    logApi(`POST /packages/${listingId}/images (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /packages/${listingId}/images`, error);
    throw error;
  }
}

export async function submitPackageListing(
  listingId: string,
): Promise<SubmitPackageListingResponse> {
  logApi(`POST /packages/${listingId}/submit (request)`, {});
  try {
    const response = await apiClient.post<SubmitPackageListingResponse>(
      ENDPOINTS.packages.submit(listingId),
    );
    logApi(`POST /packages/${listingId}/submit (response)`, response.data);
    return response.data;
  } catch (error) {
    logApiError(`POST /packages/${listingId}/submit`, error);
    throw error;
  }
}
