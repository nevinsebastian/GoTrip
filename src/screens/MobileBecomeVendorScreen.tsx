import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  completeVendorAccountSetup,
  resendVendorRegistrationOtp,
  sendVendorRegistrationOtp,
  uploadVendorDocument,
  verifyVendorRegistrationOtp,
} from '@/src/api/vendorOnboarding.service';
import { VendorDocTypePickerSheet } from '@/src/components/vendor/VendorDocTypePickerSheet';
import { VendorListingCategorySheet } from '@/src/components/vendor/VendorListingCategorySheet';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VendorUploadOptionsSheet } from '@/src/components/vendor/VendorUploadOptionsSheet';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
  EMPTY_VENDOR_FORM,
  getVendorListingCategory,
  VENDOR_ONBOARDING,
  type VendorDocumentField,
  type VendorListingCategoryId,
  type VendorRegistrationForm,
} from '@/src/constants/vendorOnboardingConstants';
import { activateVendorSession } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowTopRight from '@/assets/images/arrow-top-right.svg';
import MailIcon from '@/assets/images/mail.svg';

const GoogleIcon = require('../../assets/images/google.png');

const ACCENT = colors.accent.main;
const DESIGN_WIDTH = 402;
const OTP_LENGTH = VENDOR_ONBOARDING.otpLength;
const isWeb = Platform.OS === 'web';
const isIOS = Platform.OS === 'ios';

type VendorStep = 'landing' | 'register' | 'otp' | 'documents' | 'category';

function OrDivider() {
  return (
    <View style={styles.orDivider}>
      <View style={styles.orLinePrimary} />
      <Text style={styles.orText}>OR</Text>
      <View style={styles.orLineMuted} />
    </View>
  );
}

function LandingContent() {
  return (
    <View style={styles.landingContent}>
      <Text style={styles.sectionTitle}>{VENDOR_ONBOARDING.landingTitle}</Text>
      <Text style={styles.landingHeadline}>{VENDOR_ONBOARDING.landingHeadline}</Text>
      <Text style={styles.earningsLine}>
        {VENDOR_ONBOARDING.earningsPrefix}
        <Text style={styles.earningsAmount}>{VENDOR_ONBOARDING.earningsAmount}</Text>
      </Text>
      <View style={styles.featureList}>
        {VENDOR_ONBOARDING.features.map((feature) => (
          <View key={feature.id} style={styles.featureRow}>
            <Ionicons name={feature.icon} size={16} color={ACCENT} />
            <Text style={styles.featureText}>{feature.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

type RegisterContentProps = {
  form: VendorRegistrationForm;
  onChange: (field: keyof VendorRegistrationForm, value: string) => void;
  onFocusField?: () => void;
  error: string | null;
};

function RegisterContent({ form, onChange, onFocusField, error }: RegisterContentProps) {
  return (
    <View style={styles.registerContent}>
      <Text style={styles.registerTitle}>{VENDOR_ONBOARDING.registerTitle}</Text>
      <View style={styles.inputStack}>
        <Input
          placeholder="Full name"
          autoCapitalize="words"
          autoCorrect={false}
          placeholderTextColor={colors.text.placeholder}
          style={authFieldInputStyle.field}
          value={form.fullName}
          onChangeText={(v) => onChange('fullName', v)}
          onFocus={onFocusField}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.text.placeholder}
          style={authFieldInputStyle.field}
          value={form.email}
          onChangeText={(v) => onChange('email', v)}
          onFocus={onFocusField}
        />
        <View style={styles.phoneGroup}>
          <Input
            placeholder="+91 9744893210"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={colors.text.placeholder}
            style={authFieldInputStyle.field}
            value={form.phone}
            onChangeText={(v) => onChange('phone', v)}
            onFocus={onFocusField}
          />
          <Text style={styles.helper}>You’ll get OTP to this number.</Text>
        </View>
      </View>
      {error ? (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

type OtpContentProps = {
  digits: string[];
  inputRefs: React.MutableRefObject<(TextInput | null)[]>;
  onDigitChange: (index: number, value: string) => void;
  onKeyPress: (index: number, key: string) => void;
  onClose: () => void;
  onResend: () => void;
  isResending: boolean;
  error: string | null;
};

function OtpContent({
  digits,
  inputRefs,
  onDigitChange,
  onKeyPress,
  onClose,
  onResend,
  isResending,
  error,
}: OtpContentProps) {
  return (
    <View style={styles.otpContent}>
      <Text style={styles.otpHeading}>{VENDOR_ONBOARDING.otpTitle}</Text>
      <View style={styles.otpCard}>
        <View style={styles.otpCardHeader}>
          <Text style={styles.otpCardTitle}>Enter OTP</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close OTP">
            <Ionicons name="close" size={22} color={ACCENT} />
          </Pressable>
        </View>
        <Text style={styles.otpSubtitle}>
          Please enter the OTP as shared on your mobile as SMS/Email
        </Text>
        <View style={styles.otpIconWrap}>
          <Ionicons name="phone-portrait-outline" size={28} color={ACCENT} />
          <Ionicons name="shield-checkmark-outline" size={18} color={ACCENT} style={styles.otpShield} />
        </View>
        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChangeText={(value) => onDigitChange(index, value)}
              onKeyPress={({ nativeEvent }) => onKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={2}
              style={styles.otpBox}
              placeholder="•"
              placeholderTextColor="rgba(0, 5, 29, 0.25)"
              selectTextOnFocus
            />
          ))}
        </View>
        <View style={styles.resendRow}>
          <Text style={styles.resendHint}>Didn’t receive OTP?</Text>
          <Pressable onPress={onResend} disabled={isResending} accessibilityRole="button">
            {isResending ? (
              <ActivityIndicator size="small" color={ACCENT} />
            ) : (
              <Text style={styles.resendLink}>Resend OTP</Text>
            )}
          </Pressable>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
}

type DocumentRowProps = {
  label: string;
  value: string;
  fileName?: string;
  onOpenPicker: () => void;
  onUpload: () => void;
  isUploading?: boolean;
};

function DocumentRow({
  label,
  value,
  fileName,
  onOpenPicker,
  onUpload,
  isUploading,
}: DocumentRowProps) {
  return (
    <View style={styles.documentRow}>
      <Text style={styles.documentLabel}>{label}</Text>
      <View style={styles.documentControls}>
        <Pressable
          style={({ pressed }) => [styles.documentSelect, pressed && styles.buttonPressed]}
          onPress={onOpenPicker}
          accessibilityRole="button"
        >
          <Text style={styles.documentSelectText} numberOfLines={1}>
            {value}
          </Text>
          <Ionicons name="chevron-down" size={16} color="rgba(28, 32, 36, 0.45)" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.uploadButton,
            pressed && styles.buttonPressed,
            isUploading && styles.buttonDisabled,
          ]}
          onPress={onUpload}
          disabled={isUploading}
          accessibilityRole="button"
        >
          {isUploading ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={14} color={colors.surface.white} />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </>
          )}
        </Pressable>
      </View>
      {fileName ? <Text style={styles.uploadedFileName}>{fileName}</Text> : null}
    </View>
  );
}

type DocumentsContentProps = {
  idType: string;
  propertyDocType: string;
  idFileName?: string;
  propertyFileName?: string;
  onOpenIdPicker: () => void;
  onOpenPropertyPicker: () => void;
  onUploadId: () => void;
  onUploadProperty: () => void;
  uploadingField: VendorDocumentField | null;
  error: string | null;
};

function DocumentsContent({
  idType,
  propertyDocType,
  idFileName,
  propertyFileName,
  onOpenIdPicker,
  onOpenPropertyPicker,
  onUploadId,
  onUploadProperty,
  uploadingField,
  error,
}: DocumentsContentProps) {
  return (
    <View style={styles.documentsContent}>
      <Text style={styles.documentsTitle}>{VENDOR_ONBOARDING.documentsTitle}</Text>
      <DocumentRow
        label={VENDOR_ONBOARDING.idTypeLabel}
        value={idType}
        fileName={idFileName}
        onOpenPicker={onOpenIdPicker}
        onUpload={onUploadId}
        isUploading={uploadingField === 'id'}
      />
      <DocumentRow
        label={VENDOR_ONBOARDING.propertyDocLabel}
        value={propertyDocType}
        fileName={propertyFileName}
        onOpenPicker={onOpenPropertyPicker}
        onUpload={onUploadProperty}
        isUploading={uploadingField === 'property'}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

type CategorySelectionContentProps = {
  categoryId: VendorListingCategoryId;
  onOpenPicker: () => void;
};

function CategorySelectionContent({ categoryId, onOpenPicker }: CategorySelectionContentProps) {
  const category = getVendorListingCategory(categoryId);
  return (
    <View style={styles.categoryContent}>
      <Text style={styles.categoryTitle}>{VENDOR_ONBOARDING.categoryTitle}</Text>
      <Text style={styles.categorySubtitle}>{VENDOR_ONBOARDING.categorySubtitle}</Text>
      <Pressable
        style={({ pressed }) => [styles.categoryCard, pressed && styles.buttonPressed]}
        onPress={onOpenPicker}
        accessibilityRole="button"
      >
        <Image source={category.thumbnail} style={styles.categoryThumb} resizeMode="cover" />
        <View style={styles.categoryCardText}>
          <Text style={styles.categoryCardTitle}>{category.title}</Text>
          <Text style={styles.categoryCardSubtitle}>{category.subtitle}</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color="rgba(28, 32, 36, 0.45)" />
      </Pressable>
    </View>
  );
}

export function MobileBecomeVendorScreen() {
  const contentPadding = spacing['4'];
  const scrollRef = useRef<ScrollView>(null);
  const otpInputRefs = useRef<(TextInput | null)[]>([]);

  const [step, setStep] = useState<VendorStep>('landing');
  const [form, setForm] = useState<VendorRegistrationForm>(EMPTY_VENDOR_FORM);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [idType, setIdType] = useState(VENDOR_ONBOARDING.idTypes[0]);
  const [propertyDocType, setPropertyDocType] = useState(VENDOR_ONBOARDING.propertyDocTypes[0]);
  const [idFileName, setIdFileName] = useState<string | undefined>();
  const [propertyFileName, setPropertyFileName] = useState<string | undefined>();
  const [pickerField, setPickerField] = useState<VendorDocumentField | null>(null);
  const [uploadField, setUploadField] = useState<VendorDocumentField | null>(null);
  const [uploadingField, setUploadingField] = useState<VendorDocumentField | null>(null);
  const [isCompletingSetup, setIsCompletingSetup] = useState(false);
  const [listingCategory, setListingCategory] = useState<VendorListingCategoryId>('property');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [isProceedingCategory, setIsProceedingCategory] = useState(false);

  useEffect(() => {
    if (isWeb) return;
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardPadding(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardPadding(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (step === 'otp') {
      setDigits(Array(OTP_LENGTH).fill(''));
      setSubmitError(null);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    }
  }, [step]);

  const scrollToForm = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const updateForm = (field: keyof VendorRegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleBecomeVendor = () => {
    setSubmitError(null);
    setStep('register');
  };

  const validateForm = (): boolean => {
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!fullName) {
      setSubmitError('Please enter your full name.');
      return false;
    }
    if (!email) {
      setSubmitError('Please enter your email.');
      return false;
    }
    if (!phone) {
      setSubmitError('Please enter your phone number.');
      return false;
    }
    return true;
  };

  const handleGetOtp = async () => {
    if (!validateForm()) return;
    setIsSendingOtp(true);
    setSubmitError(null);
    try {
      const res = await sendVendorRegistrationOtp(form);
      if (res.success) {
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
      const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = num;
    setDigits(next);
    if (num && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
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
      await resendVendorRegistrationOtp(form);
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
      const res = await verifyVendorRegistrationOtp({ ...form, otp: code });
      if (res.success) {
        Keyboard.dismiss();
        setStep('documents');
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

  const handleUploadOption = async (source: 'camera' | 'gallery' | 'files') => {
    if (!uploadField) return;
    const field = uploadField;
    setUploadField(null);
    setUploadingField(field);
    setSubmitError(null);
    try {
      const documentType = field === 'id' ? idType : propertyDocType;
      const res = await uploadVendorDocument({ field, source, documentType });
      if (res.success) {
        if (field === 'id') setIdFileName(res.fileName);
        else setPropertyFileName(res.fileName);
        return;
      }
      setSubmitError(res.message ?? 'Upload failed. Please try again.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleCompleteSetup = async () => {
    setIsCompletingSetup(true);
    setSubmitError(null);
    try {
      const res = await completeVendorAccountSetup({
        ...form,
        documents: [
          ...(idFileName ? [{ field: 'id' as const, source: 'files' as const, documentType: idType, fileName: idFileName }] : []),
          ...(propertyFileName
            ? [{ field: 'property' as const, source: 'files' as const, documentType: propertyDocType, fileName: propertyFileName }]
            : []),
        ],
      });
      if (res.success) {
        setStep('category');
        return;
      }
      setSubmitError(res.message ?? 'Could not complete setup. Please try again.');
    } finally {
      setIsCompletingSetup(false);
    }
  };

  const handleCategoryNext = async () => {
    setIsProceedingCategory(true);
    try {
      await activateVendorSession(listingCategory);
      if (listingCategory === 'property') {
        router.replace('/vendor/describe-property');
        return;
      }
      if (listingCategory === 'glamping') {
        router.replace('/vendor/describe-camp');
        return;
      }
      router.replace('/vendor/select-location');
    } finally {
      setIsProceedingCategory(false);
    }
  };

  const dismissKeyboard = () => {
    if (!isWeb) Keyboard.dismiss();
  };

  const otpCode = digits.join('');
  const canSubmitOtp = otpCode.length === OTP_LENGTH && !isVerifyingOtp;

  const primaryButton = (() => {
    if (step === 'landing') {
      return (
        <Pressable
          style={({ pressed }) => [styles.landingCta, pressed && styles.buttonPressed]}
          onPress={handleBecomeVendor}
          accessibilityRole="button"
        >
          <Text style={styles.landingCtaText}>Become a Vendor</Text>
          <View style={styles.landingCtaIcon}>
            <ArrowTopRight width={14} height={14} />
          </View>
        </Pressable>
      );
    }
    if (step === 'register') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
            isSendingOtp && styles.buttonDisabled,
          ]}
          onPress={handleGetOtp}
          disabled={isSendingOtp}
          accessibilityRole="button"
        >
          {isSendingOtp ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Get OTP</Text>
          )}
        </Pressable>
      );
    }
    if (step === 'otp') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            (!canSubmitOtp || isVerifyingOtp) && styles.buttonDisabled,
            pressed && canSubmitOtp && styles.buttonPressed,
          ]}
          onPress={handleSubmitOtp}
          disabled={!canSubmitOtp}
          accessibilityRole="button"
        >
          {isVerifyingOtp ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Submit OTP</Text>
          )}
        </Pressable>
      );
    }
    if (step === 'documents') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.landingCta,
            pressed && styles.buttonPressed,
            isCompletingSetup && styles.buttonDisabled,
          ]}
          onPress={handleCompleteSetup}
          disabled={isCompletingSetup}
          accessibilityRole="button"
        >
          {isCompletingSetup ? (
            <ActivityIndicator color={colors.surface.white} size="small" style={styles.completeCtaLoader} />
          ) : (
            <>
              <Text style={styles.landingCtaText}>{VENDOR_ONBOARDING.completeSetupCta}</Text>
              <View style={styles.landingCtaIcon}>
                <Ionicons name="arrow-forward" size={16} color={colors.text.primary} />
              </View>
            </>
          )}
        </Pressable>
      );
    }
    if (step === 'category') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.categoryNextButton,
            pressed && styles.buttonPressed,
            isProceedingCategory && styles.buttonDisabled,
          ]}
          onPress={handleCategoryNext}
          disabled={isProceedingCategory}
          accessibilityRole="button"
        >
          {isProceedingCategory ? (
            <ActivityIndicator color={colors.surface.white} size="small" />
          ) : (
            <Text style={styles.categoryNextText}>
              {VENDOR_ONBOARDING.categoryNextCta}
              <Text style={styles.categoryNextChevron}> {'>'} </Text>
              {VENDOR_ONBOARDING.categoryNextSuffix}
            </Text>
          )}
        </Pressable>
      );
    }
    return null;
  })();

  const heroCategoryId = step === 'category' ? listingCategory : undefined;

  const shell = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.page}>
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingHorizontal: contentPadding },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={isIOS}
            showsVerticalScrollIndicator={false}
          >
            <VendorOnboardingHero categoryId={heroCategoryId} />

            <View style={styles.contentSlot}>
              {step === 'landing' ? <LandingContent /> : null}
              {step === 'register' ? (
                <RegisterContent
                  form={form}
                  onChange={updateForm}
                  onFocusField={scrollToForm}
                  error={submitError}
                />
              ) : null}
              {step === 'otp' ? (
                <OtpContent
                  digits={digits}
                  inputRefs={otpInputRefs}
                  onDigitChange={handleDigitChange}
                  onKeyPress={handleOtpKeyPress}
                  onClose={handleCloseOtp}
                  onResend={handleResendOtp}
                  isResending={isResending}
                  error={submitError}
                />
              ) : null}
              {step === 'documents' ? (
                <DocumentsContent
                  idType={idType}
                  propertyDocType={propertyDocType}
                  idFileName={idFileName}
                  propertyFileName={propertyFileName}
                  onOpenIdPicker={() => setPickerField('id')}
                  onOpenPropertyPicker={() => setPickerField('property')}
                  onUploadId={() => setUploadField('id')}
                  onUploadProperty={() => setUploadField('property')}
                  uploadingField={uploadingField}
                  error={submitError}
                />
              ) : null}
              {step === 'category' ? (
                <CategorySelectionContent
                  categoryId={listingCategory}
                  onOpenPicker={() => setCategoryPickerOpen(true)}
                />
              ) : null}
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              {
                paddingHorizontal: contentPadding,
                paddingBottom: spacing['4'] + keyboardPadding,
              },
            ]}
          >
            <View style={styles.actionArea}>
              {primaryButton}
              {step === 'landing' ? (
                <Pressable
                  style={({ pressed }) => [styles.helpButton, pressed && styles.buttonPressed]}
                  onPress={() => {}}
                  accessibilityRole="button"
                >
                  <Ionicons name="help-circle-outline" size={16} color={colors.text.primary} />
                  <Text style={styles.helpButtonText}>Help</Text>
                </Pressable>
              ) : null}
              {step === 'register' ? (
                <>
                  <OrDivider />
                  <View style={styles.socialStack}>
                    <Pressable
                      style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                      onPress={() => {}}
                      accessibilityRole="button"
                    >
                      <MailIcon width={16} height={16} />
                      <Text style={styles.socialButtonText}>Sign up with mail</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                      onPress={() => {}}
                      accessibilityRole="button"
                    >
                      <Image
                        source={GoogleIcon}
                        style={{ width: 16, height: 16 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </Pressable>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <VendorDocTypePickerSheet
        visible={pickerField === 'id'}
        title={VENDOR_ONBOARDING.idTypeLabel}
        options={VENDOR_ONBOARDING.idTypes}
        selected={idType}
        onClose={() => setPickerField(null)}
        onSelect={(value) => {
          setIdType(value);
          setPickerField(null);
        }}
      />
      <VendorDocTypePickerSheet
        visible={pickerField === 'property'}
        title={VENDOR_ONBOARDING.propertyDocLabel}
        options={VENDOR_ONBOARDING.propertyDocTypes}
        selected={propertyDocType}
        onClose={() => setPickerField(null)}
        onSelect={(value) => {
          setPropertyDocType(value);
          setPickerField(null);
        }}
      />
      <VendorUploadOptionsSheet
        visible={uploadField !== null}
        onClose={() => setUploadField(null)}
        onSelect={handleUploadOption}
      />
      <VendorListingCategorySheet
        visible={categoryPickerOpen}
        selectedId={listingCategory}
        onClose={() => setCategoryPickerOpen(false)}
        onSelect={(id) => {
          setListingCategory(id);
          setCategoryPickerOpen(false);
        }}
      />
    </SafeAreaView>
  );

  if (isWeb) return shell;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      {shell}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: spacing['3'],
    gap: 18,
    width: '100%',
  },
  contentSlot: {
    width: '100%',
  },
  footer: {
    width: '100%',
    paddingTop: spacing['2'],
    backgroundColor: colors.surface.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
  },
  landingContent: {
    gap: 10,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
  },
  landingHeadline: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 30,
    color: ACCENT,
  },
  earningsLine: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
  },
  earningsAmount: {
    textDecorationLine: 'underline',
    fontWeight: typography.fontWeight.medium,
  },
  featureList: {
    gap: 10,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['2'],
    color: colors.text.primary,
  },
  registerContent: {
    gap: 12,
    width: '100%',
  },
  registerTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 42,
    letterSpacing: typography.letterSpacing['3'],
    color: ACCENT,
  },
  inputStack: { gap: 12 },
  phoneGroup: { gap: 6 },
  helper: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['1'],
    letterSpacing: typography.letterSpacing['1'],
    color: 'rgba(28, 32, 36, 0.5)',
    textAlign: 'right',
    width: '100%',
  },
  otpContent: {
    gap: 12,
    width: '100%',
  },
  otpHeading: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 42,
    letterSpacing: typography.letterSpacing['3'],
    color: ACCENT,
  },
  otpCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.white,
    padding: spacing['4'],
    gap: spacing['3'],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' as unknown as undefined },
    }),
  },
  otpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otpCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  otpSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.regular,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  otpIconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(232, 84, 51, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  otpShield: {
    position: 'absolute',
    right: 14,
    bottom: 12,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  otpBox: {
    flex: 1,
    maxWidth: 44,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.md,
    textAlign: 'center',
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    paddingVertical: 0,
    ...Platform.select({
      android: { textAlignVertical: 'center', includeFontPadding: false },
      ios: { paddingTop: 10, paddingBottom: 10 },
    }),
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resendHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontStyle: 'italic',
    color: 'rgba(28, 32, 36, 0.45)',
  },
  resendLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: ACCENT,
    textDecorationLine: 'underline',
  },
  documentsContent: {
    gap: 18,
    width: '100%',
  },
  documentsTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 42,
    letterSpacing: typography.letterSpacing['3'],
    color: ACCENT,
  },
  documentRow: {
    gap: 8,
    width: '100%',
  },
  documentLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  documentControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  documentSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 47, 0.15)',
    backgroundColor: colors.surface.white,
    paddingHorizontal: spacing['3'],
    gap: 8,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  documentSelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 24,
    backgroundColor: colors.text.primary,
    paddingHorizontal: spacing['3'],
    minWidth: 96,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  uploadButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  uploadedFileName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  categoryContent: {
    gap: 10,
    width: '100%',
  },
  categoryTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 30,
    color: ACCENT,
  },
  categorySubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.white,
    padding: spacing['3'],
    marginTop: 6,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  categoryThumb: {
    width: 72,
    height: 48,
    borderRadius: 8,
  },
  categoryCardText: {
    flex: 1,
    gap: 4,
  },
  categoryCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  categoryCardSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  categoryNextButton: {
    height: 48,
    borderRadius: 28,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['4'],
    width: '100%',
  },
  categoryNextText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
  },
  categoryNextChevron: {
    fontWeight: typography.fontWeight.bold,
  },
  completeCtaLoader: {
    alignSelf: 'center',
  },
  actionArea: {
    width: '100%',
    gap: 12,
  },
  landingCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 28,
    backgroundColor: ACCENT,
    paddingLeft: spacing['5'],
    paddingRight: spacing['2'],
    width: '100%',
  },
  landingCtaText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  landingCtaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3'],
    width: '100%',
  },
  primaryButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight['2'],
    letterSpacing: typography.letterSpacing['2'],
    color: colors.surface.white,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    backgroundColor: colors.surface.white,
    width: '100%',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  helpButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.7 },
  errorText: { color: '#d32f2f' },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  orLinePrimary: {
    flex: 1,
    height: 1,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
  orLineMuted: {
    flex: 1,
    height: 1,
    borderRadius: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.2)',
  },
  orText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['1'],
    letterSpacing: typography.letterSpacing['1'],
    color: 'rgba(0, 5, 29, 0.45)',
  },
  socialStack: { gap: 8 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    height: 36,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    backgroundColor: colors.surface.white,
    paddingHorizontal: spacing['3'],
    width: '100%',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  socialButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['2'],
    letterSpacing: typography.letterSpacing['2'],
    color: colors.text.primary,
  },
});
