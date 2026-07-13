import MailIcon from '@/assets/images/mail.svg';
import { Input, Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
    createVendorBusinessProfile,
    resendVendorRegistrationOtp,
    sendVendorRegistrationOtp,
    submitVendorKycDocuments,
    verifyVendorRegistrationOtp,
} from '@/src/api/vendorOnboarding.service';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DesktopVendorOtpStep } from '@/src/components/desktop/DesktopVendorOtpStep';
import { VendorKycDocumentsStep } from '@/src/components/vendor/VendorKycDocumentsStep';
import { VendorProfileFormFields } from '@/src/components/vendor/VendorProfileFormFields';
import { VendorUploadOptionsSheet } from '@/src/components/vendor/VendorUploadOptionsSheet';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
    EMPTY_VENDOR_FORM,
    EMPTY_VENDOR_PROFILE,
    getVendorListingCategory,
    VENDOR_LISTING_CATEGORIES,
    VENDOR_ONBOARDING,
    type VendorDocumentField,
    type VendorListingCategoryId,
    type VendorProfileForm,
    type VendorRegistrationForm,
    type VendorSignupMode,
} from '@/src/constants/vendorOnboardingConstants';
import { activateVendorSession } from '@/src/utils/vendorSession';
import { clearVendorOnboardingState } from '@/src/utils/clearVendorOnboardingState';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { pickVendorDocument } from '@/src/utils/vendorDocumentPicker';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

const GoogleIcon = require('../../assets/images/google.png');

const ACCENT = colors.accent.main;
const OTP_LENGTH = VENDOR_ONBOARDING.otpLength;

const FEATURE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  payments: 'people-outline',
  risk: 'shield-checkmark-outline',
  rules: 'clipboard-outline',
  steps: 'play-circle-outline',
};

type VendorStep = 'landing' | 'register' | 'otp' | 'profile' | 'documents' | 'setupDone' | 'category';

function OrDivider() {
  return (
    <View style={styles.orDivider}>
      <View style={styles.orLinePrimary} />
      <Text style={styles.orText}>OR</Text>
      <View style={styles.orLineMuted} />
    </View>
  );
}

export function DesktopBecomeVendorScreen({
  initialStep = 'landing',
}: {
  initialStep?: VendorStep;
}) {
  const otpInputRefs = useRef<(TextInput | null)[]>([]);

  const [step, setStep] = useState<VendorStep>(initialStep);
  const [signupMode, setSignupMode] = useState<VendorSignupMode>('phone');
  const [registrationChannel, setRegistrationChannel] = useState<VendorSignupMode>('phone');
  const [form, setForm] = useState<VendorRegistrationForm>(EMPTY_VENDOR_FORM);
  const [profile, setProfile] = useState<VendorProfileForm>(EMPTY_VENDOR_PROFILE);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [idType, setIdType] = useState(VENDOR_ONBOARDING.idTypes[0]);
  const [propertyDocType, setPropertyDocType] = useState(VENDOR_ONBOARDING.propertyDocTypes[0]);
  const [idDocument, setIdDocument] = useState<VendorLocalDocument | null>(null);
  const [propertyDocument, setPropertyDocument] = useState<VendorLocalDocument | null>(null);
  const [uploadField, setUploadField] = useState<VendorDocumentField | null>(null);
  const [uploadingField, setUploadingField] = useState<VendorDocumentField | null>(null);
  const [isUploadingKyc, setIsUploadingKyc] = useState(false);
  const [listingCategory, setListingCategory] = useState<VendorListingCategoryId>('property');
  const [isProceedingCategory, setIsProceedingCategory] = useState(false);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (step === 'otp') {
      setDigits(Array(OTP_LENGTH).fill(''));
      setSubmitError(null);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    }
  }, [step]);

  const updateForm = (field: keyof VendorRegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const updateProfile = (field: keyof VendorProfileForm, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const isEmailMode = signupMode === 'email';

  const switchSignupMode = () => {
    setSubmitError(null);
    setSignupMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

  const validateForm = (): boolean => {
    if (!form.fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return false;
    }
    if (!form.password.trim()) {
      setSubmitError('Please enter a password.');
      return false;
    }
    if (isEmailMode) {
      if (!form.email.trim()) {
        setSubmitError('Please enter your email.');
        return false;
      }
    } else if (!form.phone.trim()) {
      setSubmitError('Please enter your phone number.');
      return false;
    }
    return true;
  };

  const handleGetOtp = async () => {
    if (!validateForm()) return;
    const channel = isEmailMode ? 'email' : 'phone';
    setIsSendingOtp(true);
    setSubmitError(null);
    try {
      const res = await sendVendorRegistrationOtp({ ...form, channel });
      if (res.success) {
        setRegistrationChannel(res.channel === 'email' ? 'email' : 'phone');
        Keyboard.dismiss();
        setStep('otp');
        return;
      }
      setSubmitError(res.message ?? 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const num = value.replace(/\D/g, '');
    if (num.length > 1) {
      const chars = num.slice(0, OTP_LENGTH).split('');
      const next = [...digits];
      chars.forEach((c, i) => {
        if (index + i < OTP_LENGTH) next[index + i] = c;
      });
      setDigits(next);
      otpInputRefs.current[Math.min(index + chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = num;
    setDigits(next);
    if (num && index < OTP_LENGTH - 1) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setSubmitError(null);
    try {
      const res = await resendVendorRegistrationOtp({
        ...form,
        channel: registrationChannel,
      });
      if (!res.success) {
        setSubmitError(res.message ?? 'Failed to resend OTP. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmitOtp = async () => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH || isVerifyingOtp) return;
    setIsVerifyingOtp(true);
    setSubmitError(null);
    try {
      const res = await verifyVendorRegistrationOtp({
        ...form,
        otp: code,
        channel: registrationChannel,
      });
      if (res.success) {
        Keyboard.dismiss();
        setStep('profile');
        return;
      }
      setSubmitError(res.message ?? 'Invalid or expired OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCloseOtp = () => {
    setSubmitError(null);
    setDigits(Array(OTP_LENGTH).fill(''));
    setStep('register');
  };

  const validateProfile = (): boolean => {
    if (!profile.businessName.trim()) {
      setSubmitError('Please enter your business name.');
      return false;
    }
    return true;
  };

  const handleCreateProfile = async () => {
    if (!validateProfile()) return;
    setIsCreatingProfile(true);
    setSubmitError(null);
    try {
      const res = await createVendorBusinessProfile(profile);
      if (res.success) {
        Keyboard.dismiss();
        setStep('documents');
        return;
      }
      setSubmitError(res.message ?? 'Could not create vendor profile. Please try again.');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleUploadOption = async (source: 'camera' | 'gallery' | 'files') => {
    if (!uploadField) return;
    const field = uploadField;
    setUploadField(null);
    setUploadingField(field);
    setSubmitError(null);
    try {
      const picked = await pickVendorDocument(source);
      if (!picked) return;
      if (field === 'id') setIdDocument(picked);
      else setPropertyDocument(picked);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setUploadingField(null);
    }
  };

  const validateDocuments = (): boolean => {
    if (!idDocument && !propertyDocument) {
      setSubmitError('Please upload at least one document.');
      return false;
    }
    return true;
  };

  const handleSubmitKyc = async () => {
    if (!validateDocuments()) return;
    const documents = [idDocument, propertyDocument].filter(
      (doc): doc is VendorLocalDocument => doc !== null,
    );

    setIsUploadingKyc(true);
    setSubmitError(null);
    try {
      const res = await submitVendorKycDocuments(documents);
      if (res.success) {
        Keyboard.dismiss();
        setStep('category');
        return;
      }
      setSubmitError(res.message ?? 'Could not upload documents. Please try again.');
    } finally {
      setIsUploadingKyc(false);
    }
  };

  const handleCategoryNext = async () => {
    setIsProceedingCategory(true);
    try {
      await clearVendorOnboardingState();
      await activateVendorSession(listingCategory);
      if (listingCategory === 'property') {
        router.replace('/vendor/create-title');
        return;
      }
      if (listingCategory === 'glamping') {
        router.replace('/vendor/describe-camp');
        return;
      }
      if (listingCategory === 'packages') {
        router.replace('/vendor/describe-package');
        return;
      }
      if (listingCategory === 'activities') {
        router.replace('/vendor/describe-activity');
        return;
      }
      router.replace('/vendor/select-location');
    } finally {
      setIsProceedingCategory(false);
    }
  };

  const otpCode = digits.join('');
  const canSubmitOtp = otpCode.length === OTP_LENGTH && !isVerifyingOtp;
  const category = getVendorListingCategory(listingCategory);

  const heroPill =
    step === 'landing' ? VENDOR_ONBOARDING.listPropertyCategory : category.pillLabel;

  const renderContent = () => {
    if (step === 'landing') {
      return (
        <View style={styles.landingScroll}>
          <Text style={styles.landingTitle}>{VENDOR_ONBOARDING.landingTitle}</Text>
          <Text style={styles.headline}>{VENDOR_ONBOARDING.landingHeadline}</Text>
          <Text style={styles.earnings}>
            {VENDOR_ONBOARDING.earningsPrefix}
            <Text style={styles.earningsAmount}>{VENDOR_ONBOARDING.earningsAmount}</Text>
          </Text>
          <View style={styles.featureList}>
            {VENDOR_ONBOARDING.features.map((feature) => (
              <View key={feature.id} style={styles.featureRow}>
                <Ionicons name={FEATURE_ICONS[feature.id] ?? feature.icon} size={20} color={ACCENT} />
                <Text style={styles.featureText}>{feature.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.landingCtaRow}>
            <Pressable style={styles.primaryCta} onPress={() => setStep('register')}>
              <Text style={styles.primaryCtaText}>Become a Vendor</Text>
            </Pressable>
            <Pressable style={styles.helpBtn}>
              <Ionicons name="help-circle-outline" size={18} color={colors.text.primary} />
              <Text style={styles.helpText}>Help</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    if (step === 'register') {
      return (
        <View>
          <Text style={styles.stepTitle}>{VENDOR_ONBOARDING.registerTitle}</Text>
          <Text style={styles.stepSubtitle}>{VENDOR_ONBOARDING.landingTitle}</Text>
          <View style={styles.inputStack}>
            <Input
              placeholder="Full name"
              autoCapitalize="words"
              placeholderTextColor={colors.text.placeholder}
              style={authFieldInputStyle.field}
              value={form.fullName}
              onChangeText={(v) => updateForm('fullName', v)}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.text.placeholder}
              style={authFieldInputStyle.field}
              value={form.password}
              onChangeText={(v) => updateForm('password', v)}
            />
            {isEmailMode ? (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.text.placeholder}
                style={authFieldInputStyle.field}
                value={form.email}
                onChangeText={(v) => updateForm('email', v)}
              />
            ) : (
              <View>
                <Input
                  placeholder={VENDOR_ONBOARDING.defaultPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.text.placeholder}
                  style={authFieldInputStyle.field}
                  value={form.phone}
                  onChangeText={(v) => updateForm('phone', v)}
                />
                <Text style={styles.helper}>You&apos;ll get OTP to this number.</Text>
              </View>
            )}
          </View>
          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
        </View>
      );
    }

    if (step === 'otp') {
      return (
        <DesktopVendorOtpStep
          form={form}
          signupMode={registrationChannel}
          digits={digits}
          inputRefs={otpInputRefs}
          onDigitChange={handleDigitChange}
          onKeyPress={handleOtpKeyPress}
          onClose={handleCloseOtp}
          onResend={handleResendOtp}
          onSubmit={handleSubmitOtp}
          isResending={isResending}
          isVerifying={isVerifyingOtp}
          canSubmit={canSubmitOtp}
          error={submitError}
        />
      );
    }

    if (step === 'profile') {
      return (
        <View>
          <Text style={styles.stepTitle}>{VENDOR_ONBOARDING.profileTitle}</Text>
          <Text style={styles.stepSubtitle}>{VENDOR_ONBOARDING.profileSubtitle}</Text>
          <VendorProfileFormFields
            profile={profile}
            onChange={updateProfile}
            error={submitError}
            style={styles.profileFields}
          />
        </View>
      );
    }

    if (step === 'documents') {
      return (
        <VendorKycDocumentsStep
          variant="desktop"
          idType={idType}
          propertyDocType={propertyDocType}
          idDocument={idDocument}
          propertyDocument={propertyDocument}
          onIdTypeChange={setIdType}
          onPropertyDocTypeChange={setPropertyDocType}
          onUpload={setUploadField}
          uploadingField={uploadingField}
          error={submitError}
        />
      );
    }

    if (step === 'setupDone') {
      return (
        <View style={styles.setupDoneCenter}>
          <View style={styles.setupDoneCard}>
            <Text style={styles.setupDoneTitle}>{VENDOR_ONBOARDING.setupDoneTitle}</Text>
            <View style={styles.setupDoneIcon}>
              <Ionicons name="person-outline" size={28} color={colors.text.primary} />
            </View>
            <Text style={styles.setupDoneSubtitle}>{VENDOR_ONBOARDING.setupDoneSubtitle}</Text>
            <Pressable style={[styles.primaryCta, styles.setupDoneCta]} onPress={() => setStep('category')}>
              <Text style={styles.primaryCtaText}>{VENDOR_ONBOARDING.proceedToListingCta}</Text>
            </Pressable>
            <Pressable onPress={() => setStep('category')}>
              <Text style={styles.skipLink}>{VENDOR_ONBOARDING.skipSetupLink}</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.stepTitle}>{VENDOR_ONBOARDING.categoryTitle}</Text>
        <Text style={styles.stepSubtitle}>{VENDOR_ONBOARDING.categorySubtitle}</Text>
        <DesktopInlineSelect
          value={listingCategory}
          options={VENDOR_LISTING_CATEGORIES.map((item) => ({
            value: item.id,
            label: `${item.title} - ${item.subtitle}`,
          }))}
          onSelect={(value) => setListingCategory(value as VendorListingCategoryId)}
          menuMaxHeight={280}
          startAdornment={
            <Image source={category.thumbnail} style={styles.categoryThumb} resizeMode="cover" />
          }
          renderOption={(option, selected) => {
            const item = getVendorListingCategory(option.value as VendorListingCategoryId);
            return (
              <View style={styles.categoryOptionContent}>
                <Image source={item.thumbnail} style={styles.categoryOptionThumb} resizeMode="cover" />
                <View style={styles.categoryOptionText}>
                  <Text style={[styles.categoryOptionTitle, selected && styles.categoryOptionTitleSelected]}>
                    {item.title}
                  </Text>
                  <Text style={styles.categoryOptionSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark" size={16} color={ACCENT} />
                ) : null}
              </View>
            );
          }}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (step === 'register') {
      return (
        <>
          {submitError ? <Text style={styles.footerErrorText}>{submitError}</Text> : null}
          <Pressable
            style={[styles.primaryCta, styles.footerCta, isSendingOtp && styles.btnDisabled]}
            onPress={handleGetOtp}
            disabled={isSendingOtp}
            accessibilityRole="button"
          >
            {isSendingOtp ? (
              <ActivityIndicator color={colors.surface.white} size="small" />
            ) : (
              <Text style={styles.primaryCtaText}>Get OTP</Text>
            )}
          </Pressable>
          <OrDivider />
          <View style={styles.socialStack}>
            <Pressable style={styles.socialButton} onPress={switchSignupMode}>
              <MailIcon width={16} height={16} />
              <Text style={styles.socialButtonText}>
                {isEmailMode ? 'Sign up with phone' : 'Sign up with mail'}
              </Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Image source={GoogleIcon} style={{ width: 16, height: 16 }} resizeMode="contain" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Ionicons name="logo-apple" size={18} color={colors.text.primary} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={18} color="#1877F2" />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </Pressable>
          </View>
        </>
      );
    }

    if (step === 'profile') {
      return (
        <Pressable
          style={[styles.docNextBtn, isCreatingProfile && styles.btnDisabled]}
          onPress={handleCreateProfile}
          disabled={isCreatingProfile}
        >
          {isCreatingProfile ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <Text style={styles.docNextText}>{VENDOR_ONBOARDING.completeProfileCtaDesktop}</Text>
          )}
        </Pressable>
      );
    }

    if (step === 'documents') {
      return (
        <Pressable
          style={[styles.docNextBtn, isUploadingKyc && styles.btnDisabled]}
          onPress={handleSubmitKyc}
          disabled={isUploadingKyc}
        >
          {isUploadingKyc ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <Text style={styles.docNextText}>{VENDOR_ONBOARDING.completeSetupCtaDesktop}</Text>
          )}
        </Pressable>
      );
    }

    if (step === 'category') {
      return (
        <Pressable
          style={[styles.docNextBtn, isProceedingCategory && styles.btnDisabled]}
          onPress={handleCategoryNext}
          disabled={isProceedingCategory}
        >
          {isProceedingCategory ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <Text style={styles.docNextText}>
              {VENDOR_ONBOARDING.categoryNextCta} {'>'} {VENDOR_ONBOARDING.categoryNextSuffix}
            </Text>
          )}
        </Pressable>
      );
    }

    return null;
  };

  return (
    <>
      <DesktopVendorOnboardingShell
        heroPillLabel={heroPill}
        listingCategoryId={step === 'category' ? listingCategory : undefined}
        rightPanelBlur={step === 'setupDone'}
        rightPanelOverlay={step === 'otp' || step === 'setupDone'}
        footer={renderFooter()}
      >
        {renderContent()}
      </DesktopVendorOnboardingShell>

      <VendorUploadOptionsSheet
        visible={uploadField !== null}
        onClose={() => setUploadField(null)}
        onSelect={handleUploadOption}
      />
    </>
  );
}

const styles = StyleSheet.create({
  landingScroll: {
    gap: 16,
    paddingBottom: 8,
  },
  landingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  headline: {
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: ACCENT,
    lineHeight: 36,
  },
  earnings: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    color: colors.text.primary,
  },
  earningsAmount: {
    textDecorationLine: 'underline',
    fontWeight: typography.fontWeight.semibold,
  },
  featureList: {
    gap: 12,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    color: colors.text.primary,
  },
  landingCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  primaryCta: {
    backgroundColor: ACCENT,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryCtaText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.text.primary,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  helpText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 26,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  inputStack: {
    gap: 12,
  },
  profileFields: {
    marginTop: 12,
  },
  helper: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.5)',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.primaryAlt,
    marginTop: 8,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  orLinePrimary: {
    flex: 1,
    height: 1,
    backgroundColor: ACCENT,
  },
  orText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.text.secondary,
  },
  orLineMuted: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.15)',
  },
  socialStack: {
    gap: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 44,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    backgroundColor: colors.surface.white,
  },
  socialButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  footerCta: {
    width: '100%',
  },
  footerErrorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.primaryAlt,
    textAlign: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  documentRow: {
    marginBottom: 20,
    gap: 8,
  },
  documentLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
  },
  documentControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  uploadButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  uploadedFileName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.secondary,
  },
  docNextBtn: {
    alignSelf: 'flex-end',
    backgroundColor: ACCENT,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docNextText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  setupDoneCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  setupDoneCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' },
      default: {},
    }),
  },
  setupDoneTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  setupDoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupDoneSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  setupDoneCta: {
    width: '100%',
  },
  skipLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  categoryThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  categoryOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryOptionThumb: {
    width: 40,
    height: 32,
    borderRadius: 6,
  },
  categoryOptionText: {
    flex: 1,
    gap: 2,
  },
  categoryOptionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  categoryOptionTitleSelected: {
    color: ACCENT,
  },
  categoryOptionSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
});
