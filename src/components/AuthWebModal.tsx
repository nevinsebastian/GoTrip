/**
 * Desktop web login / signup modal (Figma split-panel).
 * Send OTP + verify OTP stay in this modal on web (no /otp navigation).
 */

import { Button, Divider, Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import MailIcon from '@/assets/images/mail.svg';
import MobileIcon from '@/assets/images/mobile.svg';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { useVerifyOtp } from '@/src/hooks/useVerifyOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

const WebLogo = require('@/assets/images/logogotrip.png');
const isWeb = Platform.OS === 'web';
const socialIconSize = 20;
const OTP_LENGTH = 4;
/** Below this width, use a centered single-column card instead of full-width split panel. */
const WEB_AUTH_COMPACT_MAX_WIDTH = 640;

function maskContact(value: string, isEmail: boolean): string {
  if (!value.trim()) return isEmail ? 'your email' : '+91 97******10';
  if (isEmail) {
    const at = value.indexOf('@');
    if (at <= 0) return value.charAt(0) + '***';
    return value.charAt(0) + '***' + value.slice(at);
  }
  const digits = value.replace(/\D/g, '').slice(-10);
  if (digits.length < 2) return '+91 ******' + digits;
  const first2 = digits.slice(0, 2);
  const last2 = digits.slice(-2);
  return '+91 ' + first2 + '******' + last2;
}

export type AuthWebModalMode = 'login' | 'signup';

export type AuthWebModalProps = {
  visible: boolean;
  mode: AuthWebModalMode;
  /** Backdrop, close control, and Android back. */
  onClose: () => void;
  /** Switch between login and signup without closing (links under the form). */
  onSwitchMode: (mode: AuthWebModalMode) => void;
  /** After OTP verification stores tokens (e.g. invalidate `useUserProfile`). */
  onAuthenticated?: () => void | Promise<void>;
};

export function AuthWebModal({
  visible,
  mode,
  onClose,
  onSwitchMode,
  onAuthenticated,
}: AuthWebModalProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const compactWeb =
    isWeb && windowWidth > 0 && windowWidth < WEB_AUTH_COMPACT_MAX_WIDTH;

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  const [signupMode, setSignupMode] = useState<'phone' | 'email'>('phone');
  const [loginValue, setLoginValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ''),
  );
  /** Snapshot at “Get OTP” time for verify request */
  const [pendingVerify, setPendingVerify] = useState<{
    channel: 'email' | 'phone';
    contact: string;
    fullName?: string;
  } | null>(null);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  const isLogin = mode === 'login';
  const isEmailLogin = isLogin && loginMode === 'email';
  const isEmailSignup = !isLogin && signupMode === 'email';

  useEffect(() => {
    if (visible) {
      setSubmitError(null);
      setStep('credentials');
      setLoginMode('phone');
      setSignupMode('phone');
      setLoginValue('');
      setFullName('');
      setContactValue('');
      setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
      setPendingVerify(null);
    }
  }, [visible, mode]);

  useEffect(() => {
    if (visible && step === 'otp') {
      const t = setTimeout(() => otpRefs.current[0]?.focus?.(), 150);
      return () => clearTimeout(t);
    }
  }, [visible, step]);

  const close = () => {
    setSubmitError(null);
    setStep('credentials');
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setPendingVerify(null);
    onClose();
  };

  const goBackToCredentials = () => {
    setSubmitError(null);
    setStep('credentials');
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setPendingVerify(null);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const num = value.replace(/\D/g, '');
    if (num.length > 1) {
      const chars = num.slice(0, OTP_LENGTH).split('');
      const next = [...otpDigits];
      chars.forEach((c, i) => {
        if (index + i < OTP_LENGTH) next[index + i] = c;
      });
      setOtpDigits(next);
      const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpRefs.current[nextFocus]?.focus?.();
      return;
    }
    const next = [...otpDigits];
    next[index] = num;
    setOtpDigits(next);
    if (num && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus?.();
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus?.();
    }
  };

  const handleVerifyOtpPress = () => {
    if (isVerifyingOtp || !pendingVerify) return;
    const code = otpDigits.join('');
    if (code.length !== OTP_LENGTH) return;
    setSubmitError(null);

    verifyOtp(
      {
        ...(pendingVerify.fullName != null && pendingVerify.fullName !== ''
          ? { full_name: pendingVerify.fullName }
          : {}),
        channel: pendingVerify.channel,
        otp: code,
        ...(pendingVerify.channel === 'email'
          ? { email: pendingVerify.contact }
          : { phone: pendingVerify.contact }),
      },
      {
        onSuccess: async (res) => {
          if (res?.success && res?.data?.access_token) {
            try {
              await onAuthenticated?.();
            } finally {
              setSubmitError(null);
              setStep('credentials');
              setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
              setPendingVerify(null);
              onClose();
            }
            return;
          }
          setSubmitError(res?.message ?? 'Invalid or expired OTP.');
        },
        onError: (err) => setSubmitError(getErrorMessage(err)),
      },
    );
  };

  const handleLoginGetOtp = () => {
    setSubmitError(null);
    const trimmed = loginValue.trim();
    if (!trimmed) {
      setSubmitError('Please enter your email or phone number.');
      return;
    }
    const payload = isEmailLogin
      ? { channel: 'email' as const, email: trimmed }
      : { channel: 'phone' as const, phone: trimmed };

    sendOtp(payload, {
      onSuccess: (res) => {
        if (res?.success) {
          setPendingVerify({
            channel: isEmailLogin ? 'email' : 'phone',
            contact: trimmed,
          });
          setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
          setStep('otp');
          return;
        }
        setSubmitError(res?.message ?? 'Failed to send OTP. Please try again.');
      },
      onError: (err) => setSubmitError(getErrorMessage(err)),
    });
  };

  const handleSignupGetOtp = () => {
    setSubmitError(null);
    const trimmedName = fullName.trim();
    const trimmedContact = contactValue.trim();
    if (!trimmedName || !trimmedContact) {
      setSubmitError('Please enter your full name and contact details.');
      return;
    }

    sendOtp(
      {
        full_name: trimmedName,
        channel: isEmailSignup ? 'email' : 'phone',
        ...(isEmailSignup ? { email: trimmedContact } : { phone: trimmedContact }),
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setPendingVerify({
              channel: isEmailSignup ? 'email' : 'phone',
              contact: trimmedContact,
              fullName: trimmedName,
            });
            setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
            setStep('otp');
            return;
          }
          setSubmitError(res?.message ?? 'Failed to send OTP. Please try again.');
        },
        onError: (err) => setSubmitError(getErrorMessage(err)),
      },
    );
  };

  const switchLoginMode = () => {
    setLoginValue('');
    setLoginMode((p) => (p === 'phone' ? 'email' : 'phone'));
    setSubmitError(null);
  };

  const switchSignupMode = () => {
    setContactValue('');
    setSignupMode((p) => (p === 'phone' ? 'email' : 'phone'));
    setSubmitError(null);
  };

  if (!isWeb) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlay} onPress={close}>
          <Pressable
            style={[
              styles.cardWrap,
              compactWeb
                ? {
                    maxWidth: Math.min(420, Math.max(0, windowWidth - spacing['4'] * 2)),
                    maxHeight:
                      windowHeight > 0
                        ? Math.min(620, Math.round(windowHeight * 0.88))
                        : (('88%' as unknown) as number),
                  }
                : null,
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.card, compactWeb && styles.cardCompact]}>
              {!compactWeb ? (
                <View style={styles.brand}>
                  <Image
                    source={WebLogo}
                    style={styles.brandLogo}
                    resizeMode="contain"
                    accessibilityLabel="GoTrip Holiday"
                  />
                  <Text variant="bodySemibold" style={styles.brandTagline}>
                    {isLogin ? 'Your travel partner!' : 'Welcome to GoTrip Holiday'}
                  </Text>
                  <View style={styles.brandSpacer} />
                  <View style={styles.brandFeature}>
                    <Ionicons name="business" size={40} color={colors.surface.white} />
                    <Text variant="caption" style={styles.brandFeatureLabel}>
                      Hotels
                    </Text>
                  </View>
                  <View style={styles.dots}>
                    <View style={[styles.dot, step === 'credentials' && styles.dotActive]} />
                    <View style={[styles.dot, step === 'otp' && styles.dotActive]} />
                    <View style={styles.dot} />
                  </View>
                </View>
              ) : null}

              {/* Form column */}
              <View style={[styles.formColumn, compactWeb && styles.formColumnCompact]}>
                <Pressable
                  onPress={close}
                  style={styles.closeBtn}
                  hitSlop={12}
                  accessibilityLabel="Close"
                >
                  <Ionicons name="close" size={24} color={colors.text.primary} />
                </Pressable>
                {compactWeb && step === 'credentials' ? (
                  <View style={styles.compactLogoRow} accessibilityRole="header">
                    <Image
                      source={WebLogo}
                      style={styles.compactLogo}
                      resizeMode="contain"
                      accessibilityLabel="GoTrip Holiday"
                    />
                    <Text variant="caption" style={styles.compactTagline}>
                      {isLogin ? 'Your travel partner!' : 'Welcome to GoTrip Holiday'}
                    </Text>
                  </View>
                ) : null}
                <ScrollView
                  style={styles.formScroll}
                  contentContainerStyle={[
                    styles.formScrollContent,
                    compactWeb && styles.formScrollContentCompact,
                  ]}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {step === 'otp' && pendingVerify ? (
                    <>
                      <Pressable
                        onPress={goBackToCredentials}
                        style={styles.otpBackRow}
                        accessibilityRole="button"
                        accessibilityLabel="Back to phone or email"
                      >
                        <Ionicons name="chevron-back" size={22} color={colors.primary} />
                        <Text variant="bodySemibold" style={styles.otpBackText}>
                          Back
                        </Text>
                      </Pressable>
                      <Text variant="heading2" style={styles.title}>
                        Enter OTP
                      </Text>
                      <Text
                        variant="caption"
                        style={[styles.subtitle, compactWeb && styles.subtitleOtpCompact]}
                        numberOfLines={compactWeb ? 5 : undefined}
                        ellipsizeMode="tail"
                      >
                        Code sent to{' '}
                        {pendingVerify.channel === 'email'
                          ? pendingVerify.contact
                          : maskContact(pendingVerify.contact, false)}{' '}
                        {pendingVerify.channel === 'email' ? 'via email' : 'via SMS'}.
                      </Text>
                      <View style={[styles.otpRow, compactWeb && styles.otpRowCompact]}>
                        {otpDigits.map((d, idx) => (
                          <TextInput
                            key={idx}
                            ref={(r) => {
                              otpRefs.current[idx] = r;
                            }}
                            value={d}
                            onChangeText={(v) => handleOtpDigitChange(idx, v)}
                            onKeyPress={({ nativeEvent }) =>
                              handleOtpKeyPress(idx, nativeEvent.key)
                            }
                            keyboardType="number-pad"
                            maxLength={2}
                            style={[styles.otpBox, compactWeb && styles.otpBoxCompact]}
                            placeholder="•"
                            placeholderTextColor="rgba(0, 5, 29, 0.25)"
                          />
                        ))}
                      </View>
                      {submitError ? (
                        <Text variant="caption" style={styles.errorText}>
                          {submitError}
                        </Text>
                      ) : null}
                      <Button
                        variant="primary"
                        size="default"
                        style={styles.primaryCta}
                        onPress={handleVerifyOtpPress}
                        disabled={
                          isVerifyingOtp ||
                          otpDigits.join('').length !== OTP_LENGTH
                        }
                      >
                        {isVerifyingOtp ? 'Verifying...' : 'Verify & continue'}
                      </Button>
                      <Pressable
                        onPress={goBackToCredentials}
                        style={styles.switchLink}
                        accessibilityRole="button"
                      >
                        <Text variant="caption" style={styles.switchLinkText}>
                          Wrong number or email?{' '}
                          <Text style={styles.switchLinkBold}>Change</Text>
                        </Text>
                      </Pressable>
                    </>
                  ) : isLogin ? (
                    <>
                      <Text variant="heading2" style={styles.title}>
                        Welcome Back!
                      </Text>
                      <Text variant="caption" style={styles.subtitle}>
                        {isEmailLogin
                          ? 'Enter your email to continue.'
                          : 'Enter your Phone to continue.'}
                      </Text>
                      <View style={styles.formStack}>
                        <Input
                          placeholder={isEmailLogin ? 'Email' : 'Phone number'}
                          keyboardType={isEmailLogin ? 'email-address' : 'phone-pad'}
                          placeholderTextColor={colors.neutral.alpha['9']}
                          style={styles.input}
                          value={loginValue}
                          onChangeText={setLoginValue}
                        />
                        <Text variant="caption" style={styles.helper}>
                          {isEmailLogin
                            ? "You'll get OTP to this email."
                            : "You'll get OTP to this number."}
                        </Text>
                        {submitError ? (
                          <Text variant="caption" style={styles.errorText}>
                            {submitError}
                          </Text>
                        ) : null}
                        <Button
                          variant="primary"
                          size="default"
                          style={styles.primaryCta}
                          onPress={handleLoginGetOtp}
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? 'Sending OTP...' : 'Get OTP'}
                        </Button>
                        <Divider style={styles.divider} />
                        <View style={styles.socialStack}>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              isEmailLogin ? (
                                <MobileIcon width={socialIconSize} height={socialIconSize} />
                              ) : (
                                <MailIcon width={socialIconSize} height={socialIconSize} />
                              )
                            }
                            onPress={switchLoginMode}
                          >
                            {isEmailLogin ? 'Login with phone' : 'Log in with mail'}
                          </Button>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              <GoogleIcon width={socialIconSize} height={socialIconSize} />
                            }
                            onPress={() => {}}
                          >
                            Continue with Google
                          </Button>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              <AppleIcon width={socialIconSize} height={socialIconSize} />
                            }
                            onPress={() => {}}
                          >
                            Continue with Apple
                          </Button>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              <FacebookIcon width={socialIconSize} height={socialIconSize} />
                            }
                            onPress={() => {}}
                          >
                            Continue with Facebook
                          </Button>
                        </View>
                        <Pressable
                          onPress={() => onSwitchMode('signup')}
                          style={styles.switchLink}
                          accessibilityRole="button"
                        >
                          <Text variant="caption" style={styles.switchLinkText}>
                            Don&apos;t have an account?{' '}
                            <Text style={styles.switchLinkBold}>Sign up</Text>
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text variant="heading2" style={styles.title}>
                        Join the Tribe!
                      </Text>
                      <Text variant="caption" style={styles.subtitle}>
                        {isEmailSignup
                          ? 'Enter your details with email.'
                          : 'Enter your details with phone.'}
                      </Text>
                      <View style={styles.formStack}>
                        <Input
                          placeholder="Full name"
                          placeholderTextColor={colors.neutral.alpha['9']}
                          style={styles.input}
                          value={fullName}
                          onChangeText={setFullName}
                          autoCapitalize="words"
                        />
                        <View>
                          <Input
                            placeholder={isEmailSignup ? 'Email' : 'Phone number'}
                            keyboardType={isEmailSignup ? 'email-address' : 'phone-pad'}
                            placeholderTextColor={colors.neutral.alpha['9']}
                            style={styles.input}
                            value={contactValue}
                            onChangeText={setContactValue}
                          />
                          <Text variant="caption" style={styles.helper}>
                            {isEmailSignup
                              ? "You'll get OTP to this email."
                              : "You'll get OTP to this number."}
                          </Text>
                        </View>
                        {submitError ? (
                          <Text variant="caption" style={styles.errorText}>
                            {submitError}
                          </Text>
                        ) : null}
                        <Button
                          variant="primary"
                          size="default"
                          style={styles.primaryCta}
                          onPress={handleSignupGetOtp}
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? 'Sending OTP...' : 'Get OTP'}
                        </Button>
                        <Divider style={styles.divider} />
                        <View style={styles.socialStack}>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              isEmailSignup ? (
                                <MobileIcon width={socialIconSize} height={socialIconSize} />
                              ) : (
                                <MailIcon width={socialIconSize} height={socialIconSize} />
                              )
                            }
                            onPress={switchSignupMode}
                          >
                            {isEmailSignup ? 'Sign up with phone' : 'Sign up with mail'}
                          </Button>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              <GoogleIcon width={socialIconSize} height={socialIconSize} />
                            }
                            onPress={() => {}}
                          >
                            Continue with Google
                          </Button>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              <AppleIcon width={socialIconSize} height={socialIconSize} />
                            }
                            onPress={() => {}}
                          >
                            Continue with Apple
                          </Button>
                          <Button
                            variant="outlineSoft"
                            size="compact"
                            leftAdornment={
                              <FacebookIcon width={socialIconSize} height={socialIconSize} />
                            }
                            onPress={() => {}}
                          >
                            Continue with Facebook
                          </Button>
                        </View>
                        <Pressable
                          onPress={() => onSwitchMode('login')}
                          style={styles.switchLink}
                          accessibilityRole="button"
                        >
                          <Text variant="caption" style={styles.switchLinkText}>
                            Already have an account?{' '}
                            <Text style={styles.switchLinkBold}>Log in</Text>
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4'],
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        } as Record<string, string>)
      : {}),
  },
  cardWrap: {
    width: '100%',
    maxWidth: 920,
    maxHeight: '92%' as unknown as number,
  },
  card: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 480,
    borderRadius: borderRadius['3xl'],
    overflow: 'hidden',
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: {
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.22)',
      },
      default: {
        elevation: 12,
      },
    }),
  },
  cardCompact: {
    flexDirection: 'column',
    minHeight: 0,
    flexShrink: 1,
  },
  brand: {
    flex: 1,
    minWidth: 260,
    maxWidth: 400,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['7'],
    justifyContent: 'space-between',
  },
  brandLogo: {
    width: 160,
    height: 56,
    ...(Platform.OS === 'web'
      ? ({ filter: 'brightness(0) invert(1)' } as object)
      : {}),
  },
  brandTagline: {
    color: colors.surface.white,
    fontSize: 18,
    lineHeight: 26,
    marginTop: spacing['4'],
  },
  brandSpacer: {
    flex: 1,
    minHeight: spacing['4'],
  },
  brandFeature: {
    alignItems: 'center',
    gap: spacing['2'],
  },
  brandFeatureLabel: {
    color: colors.surface.white,
    opacity: 0.95,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['2'],
    marginTop: spacing['6'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.surface.white,
  },
  formColumn: {
    flex: 1,
    minWidth: 280,
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['6'],
    paddingBottom: spacing['5'],
  },
  formColumnCompact: {
    minWidth: 0,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
    paddingBottom: spacing['4'],
  },
  compactLogoRow: {
    alignItems: 'center',
    paddingTop: spacing['6'],
    paddingBottom: spacing['2'],
    paddingHorizontal: spacing['2'],
  },
  compactLogo: {
    width: 132,
    height: 48,
  },
  compactTagline: {
    marginTop: spacing['2'],
    color: colors.text.secondary,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: spacing['4'],
    right: spacing['4'],
    zIndex: 2,
    padding: spacing['1'],
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingTop: spacing['5'],
    paddingRight: spacing['2'],
    paddingBottom: spacing['4'],
  },
  formScrollContentCompact: {
    paddingTop: spacing['2'],
    width: '100%',
  },
  title: {
    color: colors.text.primary,
    marginBottom: spacing['2'],
  },
  subtitle: {
    color: colors.neutral.alpha['9'],
    marginBottom: spacing['4'],
  },
  /** Stops long email/phone from widening scroll content and clipping the OTP row on narrow web. */
  subtitleOtpCompact: {
    alignSelf: 'stretch',
    maxWidth: '100%',
    ...(Platform.OS === 'web'
      ? ({ overflowWrap: 'anywhere' } as Record<string, string>)
      : {}),
  },
  formStack: {
    gap: spacing['3'],
  },
  input: {
    height: 44,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.neutral.alpha['5'],
    borderRadius: borderRadius['3'],
    paddingHorizontal: spacing['3'],
  },
  helper: {
    color: colors.neutral.alpha['9'],
    marginTop: spacing['1'],
    paddingHorizontal: spacing['1'],
  },
  errorText: {
    color: '#d32f2f',
    paddingHorizontal: spacing['1'],
  },
  primaryCta: {
    width: '100%',
    borderRadius: borderRadius.lg,
    marginTop: spacing['1'],
  },
  divider: {
    marginVertical: spacing['2'],
  },
  socialStack: {
    gap: spacing['3'],
  },
  switchLink: {
    alignSelf: 'center',
    marginTop: spacing['2'],
    paddingVertical: spacing['2'],
  },
  switchLinkText: {
    color: colors.text.secondary,
  },
  switchLinkBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  otpBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    marginBottom: spacing['3'],
    alignSelf: 'flex-start',
  },
  otpBackText: {
    color: colors.primary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexWrap: 'nowrap',
    gap: spacing['2'],
    marginBottom: spacing['2'],
    maxWidth: '100%',
  },
  /** Narrow web: smaller fixed boxes so 4×width + gaps fit (flex width did not override otpBox). */
  otpRowCompact: {
    alignSelf: 'stretch',
    width: '100%',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 0,
  },
  /** Fixed width so all 4 digits stay on one row inside the modal (no flex stretch). */
  otpBox: {
    width: 44,
    height: 44,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: borderRadius['3'],
    borderWidth: 1,
    borderColor: colors.neutral.alpha['5'],
    backgroundColor: colors.surface.card,
    textAlign: 'center',
    fontSize: 17,
    color: colors.text.primary,
    paddingHorizontal: 0,
    ...(Platform.OS === 'web'
      ? ({ boxSizing: 'border-box' as const } as object)
      : {}),
  },
  otpBoxCompact: {
    width: 36,
    height: 42,
    flexGrow: 0,
    flexShrink: 0,
    fontSize: 15,
    paddingHorizontal: 0,
  },
});
