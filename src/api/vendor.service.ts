import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreateVendorProfileRequest,
  CreateVendorProfileResponse,
  UploadVendorKycResponse,
} from './types';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { Platform } from 'react-native';

export const createVendorProfile = async (
  payload: CreateVendorProfileRequest,
): Promise<CreateVendorProfileResponse> => {
  const response = await apiClient.post<CreateVendorProfileResponse>(
    ENDPOINTS.vendors.profile,
    payload,
  );
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data) {
    return data;
  }
  return { success: true, ...(data ?? {}) };
};

export const uploadVendorKycDocuments = async (
  documents: VendorLocalDocument[],
): Promise<UploadVendorKycResponse> => {
  const formData = new FormData();

  documents.forEach((doc) => {
    if (Platform.OS === 'web' && doc.file) {
      formData.append('docs', doc.file);
      return;
    }

    formData.append('docs', {
      uri: doc.uri,
      name: doc.name,
      type: doc.mimeType,
    } as unknown as Blob);
  });

  const response = await apiClient.post<UploadVendorKycResponse>(
    ENDPOINTS.vendors.kyc,
    formData,
    {
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

  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data) {
    return data;
  }
  return { success: true, ...(data ?? {}) };
};
