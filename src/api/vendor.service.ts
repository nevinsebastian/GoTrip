import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreateVendorProfileRequest,
  CreateVendorProfileResponse,
  UpdateVendorBankRequest,
  UpdateVendorProfileRequest,
  UploadVendorKycResponse,
  VendorProfileResponse,
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

  const res = response.data;
  if (res && typeof res === 'object' && 'success' in res) {
    return res;
  }
  return { success: true, ...(res ?? {}) };
};

export const fetchVendorProfile = async (): Promise<VendorProfileResponse> => {
  const response = await apiClient.get<VendorProfileResponse>(ENDPOINTS.vendors.profileMe);
  return response.data;
};

export const updateVendorProfile = async (
  payload: UpdateVendorProfileRequest,
): Promise<VendorProfileResponse> => {
  const response = await apiClient.patch<VendorProfileResponse>(
    ENDPOINTS.vendors.profileMe,
    payload,
  );
  return response.data;
};

export const updateVendorBankDetails = async (
  payload: UpdateVendorBankRequest,
): Promise<{ success: boolean; message?: string }> => {
  const response = await apiClient.patch<{ success: boolean; message?: string }>(
    ENDPOINTS.vendors.bank,
    payload,
  );
  return response.data;
};
