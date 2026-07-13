import { register, verifyRegistrationOtp, hasAuthTokens } from '@/src/api/auth.service';
import { createVendorProfile, uploadVendorKycDocuments } from '@/src/api/vendor.service';
import type { OtpChannel } from '@/src/api/types';
import type {
  VendorProfileForm,
  VendorRegistrationForm,
} from '@/src/constants/vendorOnboardingConstants';
import { getErrorMessage, normalizeApiError } from '@/src/utils/errorHandler';
import { normalizePhoneForApi } from '@/src/utils/phone';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';

export type VendorOtpSendResult = {
  success: boolean;
  message?: string;
  channel?: OtpChannel;
};

export type VendorOtpVerifyResult = {
  success: boolean;
  message?: string;
};

export type VendorRegisterPayload = VendorRegistrationForm & {
  channel: OtpChannel;
};

export type VendorVerifyOtpPayload = VendorRegistrationForm & {
  otp: string;
  channel: OtpChannel;
};

export async function sendVendorRegistrationOtp(
  payload: VendorRegisterPayload,
): Promise<VendorOtpSendResult> {
  try {
    const trimmedName = payload.fullName.trim();
    const phone =
      payload.channel === 'phone' ? normalizePhoneForApi(payload.phone) : undefined;

    if (payload.channel === 'phone' && !phone) {
      return { success: false, message: 'Please enter a valid phone number.' };
    }

    const body = {
      fullName: trimmedName,
      password: payload.password,
      role: 'vendor',
      ...(payload.channel === 'email'
        ? { email: payload.email.trim() }
        : { phone }),
    };

    const res = await register(body);
    return {
      success: Boolean(res.success ?? res.message),
      message: res.message,
      channel: res.channel ?? payload.channel,
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function verifyVendorRegistrationOtp(
  payload: VendorVerifyOtpPayload,
): Promise<VendorOtpVerifyResult> {
  try {
    const phone =
      payload.channel === 'phone' ? normalizePhoneForApi(payload.phone) : undefined;

    const res = await verifyRegistrationOtp({
      otp: payload.otp,
      ...(payload.channel === 'email'
        ? { email: payload.email.trim() }
        : { phone }),
    });

    if (hasAuthTokens(res)) {
      return { success: true };
    }

    return { success: false, message: res?.message ?? 'Invalid or expired OTP.' };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function resendVendorRegistrationOtp(
  payload: VendorRegisterPayload,
): Promise<VendorOtpSendResult> {
  return sendVendorRegistrationOtp(payload);
}

export type VendorProfileCreateResult = {
  success: boolean;
  message?: string;
  alreadyExists?: boolean;
};

export async function createVendorBusinessProfile(
  payload: VendorProfileForm,
): Promise<VendorProfileCreateResult> {
  try {
    const body = {
      businessName: payload.businessName.trim(),
      panNumber: payload.panNumber.trim() || null,
      gstNumber: payload.gstNumber.trim() || null,
    };

    const res = await createVendorProfile(body);
    if (res.success !== false) {
      return { success: true };
    }

    return { success: false, message: res.message ?? 'Could not create vendor profile.' };
  } catch (error) {
    const apiError = normalizeApiError(error);
    if (apiError.statusCode === 409) {
      return { success: true, alreadyExists: true };
    }
    return { success: false, message: getErrorMessage(error) };
  }
}

export type VendorKycUploadResult = {
  success: boolean;
  message?: string;
};

export async function submitVendorKycDocuments(
  documents: VendorLocalDocument[],
): Promise<VendorKycUploadResult> {
  if (documents.length === 0) {
    return { success: false, message: 'Please upload at least one document.' };
  }

  try {
    const res = await uploadVendorKycDocuments(documents);
    if (res.success !== false) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message ?? 'Could not upload documents.' };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
