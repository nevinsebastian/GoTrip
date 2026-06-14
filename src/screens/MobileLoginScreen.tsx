import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { AuthMobileHero } from '@/src/components/AuthMobileHero';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MailIcon from '@/assets/images/mail.svg';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';

const GoogleIcon = require('../../assets/images/google.png');

const isWeb = Platform.OS === 'web';
const isIOS = Platform.OS === 'ios';
const ACCENT = colors.accent.main;
const DESIGN_WIDTH = 402;

type LoginMode = 'phone' | 'email';

function OrDivider() {
  return (
    <View style={styles.orDivider}>
      <View style={styles.orLinePrimary} />
      <Text style={styles.orText}>OR</Text>
      <View style={styles.orLineMuted} />
    </View>
  );
}

export function MobileLoginScreen() {
  const contentPadding = spacing['4'];
  const socialIconSize = 16;

  const [loginMode, setLoginMode] = useState<LoginMode>('phone');
  const [inputValue, setInputValue] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEmailMode = loginMode === 'email';
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const switchMode = () => {
    setInputValue('');
    setSubmitError(null);
    setLoginMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

  const handleGetOtp = () => {
    setSubmitError(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setSubmitError(
        isEmailMode ? 'Please enter your email.' : 'Please enter your phone number.',
      );
      return;
    }

    const payload = isEmailMode
      ? { channel: 'email' as const, email: trimmed }
      : { channel: 'phone' as const, phone: trimmed };

    sendOtp(payload, {
      onSuccess: (res) => {
        if (res?.success) {
          router.push({
            pathname: '/otp',
            params: {
              contact: trimmed,
              isEmail: isEmailMode ? '1' : '0',
            },
          });
          return;
        }
        setSubmitError(res?.message ?? 'Failed to send OTP. Please try again.');
      },
      onError: (err) => {
        setSubmitError(getErrorMessage(err));
      },
    });
  };

  const dismissKeyboard = () => {
    if (!isWeb) Keyboard.dismiss();
  };

  const shell = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={isIOS ? 8 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: contentPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthMobileHero />

          <View style={styles.formSection}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>

            <View style={styles.formBody}>
              <View style={styles.formTop}>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>
                    {isEmailMode ? 'Enter your Email to continue.' : 'Enter your Phone to continue.'}
                  </Text>

                  <Input
                    placeholder={isEmailMode ? 'Email' : '+91 9744893210'}
                    keyboardType={isEmailMode ? 'email-address' : 'phone-pad'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={colors.text.primary}
                    style={styles.phoneInput}
                    value={inputValue}
                    onChangeText={setInputValue}
                  />

                  <Text style={styles.helper}>
                    {isEmailMode
                      ? "You'll get OTP to this email."
                      : "You'll get OTP to this number."}
                  </Text>
                </View>

                {submitError ? (
                  <Text variant="caption" style={styles.errorText}>
                    {submitError}
                  </Text>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    styles.getOtpButton,
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
                    <Text style={styles.getOtpText}>Get OTP</Text>
                  )}
                </Pressable>
              </View>

              <OrDivider />

              <View style={styles.socialStack}>
                <Pressable
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={switchMode}
                  accessibilityRole="button"
                >
                  <MailIcon width={socialIconSize} height={socialIconSize} />
                  <Text style={styles.socialButtonText}>
                    {isEmailMode ? 'Login with phone' : 'Log in with mail'}
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {}}
                  accessibilityRole="button"
                >
                  <Image
                    source={GoogleIcon}
                    style={{ width: socialIconSize, height: socialIconSize }}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.joinTribeButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => router.push('/signup')}
                  accessibilityRole="button"
                  accessibilityLabel="Join the Tribe signup"
                >
                  <Text style={styles.joinTribeText}>Join the Tribe!</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (isWeb) {
    return shell;
  }

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
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: spacing['6'],
    gap: 18,
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  formSection: {
    width: '100%',
    gap: 12,
  },
  welcomeTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 42,
    letterSpacing: typography.letterSpacing['3'],
    color: ACCENT,
  },
  formBody: { gap: 12 },
  formTop: { gap: 24 },
  inputGroup: { gap: 12 },
  fieldLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight['1'],
    letterSpacing: typography.letterSpacing['1'],
    color: colors.text.primary,
  },
  phoneInput: {
    height: 40,
    borderRadius: 24,
    borderColor: 'rgba(0, 0, 47, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing['2'],
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['3'],
  },
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
  errorText: { color: '#d32f2f' },
  getOtpButton: {
    height: 36,
    borderRadius: 24,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3'],
    width: '100%',
  },
  getOtpText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight['2'],
    letterSpacing: typography.letterSpacing['2'],
    color: colors.surface.white,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.7 },
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
  joinTribeButton: {
    height: 36,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3'],
    width: '100%',
    marginTop: spacing['1'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  joinTribeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight['2'],
    letterSpacing: typography.letterSpacing['2'],
    color: ACCENT,
  },
});
