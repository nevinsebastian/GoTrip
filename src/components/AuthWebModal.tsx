/**
 * Desktop web login / signup modal (Figma split-panel).
 * Reuses the same OTP flow as app/login.tsx and app/signup.tsx (useSendOtp → /otp).
 */

import { Button, Divider, Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import MailIcon from '@/assets/images/mail.svg';
import MobileIcon from '@/assets/images/mobile.svg';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const WebLogo = require('@/assets/images/logogotrip.png');
const isWeb = Platform.OS === 'web';
const socialIconSize = 20;

export type AuthWebModalMode = 'login' | 'signup';

export type AuthWebModalProps = {
  visible: boolean;
  mode: AuthWebModalMode;
  onClose: () => void;
  /** Switch between login and signup without closing (links under the form). */
  onSwitchMode: (mode: AuthWebModalMode) => void;
};

export function AuthWebModal({
  visible,
  mode,
  onClose,
  onSwitchMode,
}: AuthWebModalProps) {
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  const [signupMode, setSignupMode] = useState<'phone' | 'email'>('phone');
  const [loginValue, setLoginValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const isLogin = mode === 'login';
  const isEmailLogin = isLogin && loginMode === 'email';
  const isEmailSignup = !isLogin && signupMode === 'email';

  useEffect(() => {
    if (visible) {
      setSubmitError(null);
      setLoginMode('phone');
      setSignupMode('phone');
      setLoginValue('');
      setFullName('');
      setContactValue('');
    }
  }, [visible, mode]);

  const close = () => {
    setSubmitError(null);
    onClose();
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
          close();
          router.push({
            pathname: '/otp',
            params: {
              contact: trimmed,
              isEmail: isEmailLogin ? '1' : '0',
            },
          });
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
            close();
            router.push({
              pathname: '/otp',
              params: {
                contact: trimmedContact,
                isEmail: isEmailSignup ? '1' : '0',
                fullName: trimmedName,
              },
            });
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
          <Pressable style={styles.cardWrap} onPress={(e) => e.stopPropagation()}>
            <View style={styles.card}>
              {/* Brand column */}
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
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>

              {/* Form column */}
              <View style={styles.formColumn}>
                <Pressable
                  onPress={close}
                  style={styles.closeBtn}
                  hitSlop={12}
                  accessibilityLabel="Close"
                >
                  <Ionicons name="close" size={24} color={colors.text.primary} />
                </Pressable>
                <ScrollView
                  style={styles.formScroll}
                  contentContainerStyle={styles.formScrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {isLogin ? (
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
  title: {
    color: colors.text.primary,
    marginBottom: spacing['2'],
  },
  subtitle: {
    color: colors.neutral.alpha['9'],
    marginBottom: spacing['4'],
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
});
