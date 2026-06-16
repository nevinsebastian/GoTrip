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
