import type { VendorRegistrationForm } from '@/src/constants/vendorOnboardingConstants';

export type VendorOtpSendResult = {
  success: boolean;
  message?: string;
};

export type VendorOtpVerifyResult = {
  success: boolean;
  message?: string;
};

/** API-ready stub — replace with real endpoints when backend is available. */
export async function sendVendorRegistrationOtp(
  _payload: VendorRegistrationForm,
): Promise<VendorOtpSendResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}

/** API-ready stub — replace with real endpoints when backend is available. */
export async function verifyVendorRegistrationOtp(
  _payload: VendorRegistrationForm & { otp: string },
): Promise<VendorOtpVerifyResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}

export async function resendVendorRegistrationOtp(
  _payload: VendorRegistrationForm,
): Promise<VendorOtpSendResult> {
  return sendVendorRegistrationOtp(_payload);
}

export type VendorDocumentUploadPayload = {
  field: 'id' | 'property';
  source: 'camera' | 'gallery' | 'files';
  documentType: string;
  fileName?: string;
};

export type VendorDocumentUploadResult = {
  success: boolean;
  fileName?: string;
  message?: string;
};

/** API-ready stub — wire to storage/upload endpoint when available. */
export async function uploadVendorDocument(
  payload: VendorDocumentUploadPayload,
): Promise<VendorDocumentUploadResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const fallbackName =
    payload.fileName ??
    `${payload.field}-${payload.source}-${Date.now()}.${payload.source === 'files' ? 'pdf' : 'jpg'}`;
  return { success: true, fileName: fallbackName };
}

export type VendorCompleteSetupResult = {
  success: boolean;
  message?: string;
};

/** API-ready stub — finalize vendor onboarding on the server. */
export async function completeVendorAccountSetup(
  _payload: VendorRegistrationForm & { documents: VendorDocumentUploadPayload[] },
): Promise<VendorCompleteSetupResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}
