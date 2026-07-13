import { Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { AuthMobileHero } from '@/src/components/AuthMobileHero';
import { OtpEntryModal } from '@/src/components/OtpEntryModal';
import type { OtpChannel } from '@/src/api/types';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
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
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MailIcon from '@/assets/images/mail.svg';
import { useRegister } from '@/src/hooks/useRegister';
import { getErrorMessage } from '@/src/utils/errorHandler';

const GoogleIcon = require('../../assets/images/google.png');

const isWeb = Platform.OS === 'web';
const isIOS = Platform.OS === 'ios';
const ACCENT = colors.accent.main;
const DESIGN_WIDTH = 402;

type SignupMode = 'phone' | 'email';

type OtpSession = {
  contact: string;
  channel: OtpChannel;
  fullName: string;
  email: string;
  phone: string;
};

function OrDivider() {
  return (
    <View style={styles.orDivider}>
      <View style={styles.orLinePrimary} />
      <Text style={styles.orText}>OR</Text>
      <View style={styles.orLineMuted} />
    </View>
  );
}

export function MobileSignupScreen() {
  const contentPadding = spacing['4'];
  const socialIconSize = 16;
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const [signupMode, setSignupMode] = useState<SignupMode>('phone');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [otpSession, setOtpSession] = useState<OtpSession | null>(null);

  const isEmailMode = signupMode === 'email';
  const { mutate: registerUser, isPending: isSendingOtp } = useRegister();

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

  const scrollToForm = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const switchMode = () => {
    setSubmitError(null);
    setSignupMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

  const handleGetOtp = () => {
    setSubmitError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setSubmitError('Please enter your full name.');
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      setSubmitError('Please enter a password (at least 6 characters).');
      return;
    }

    if (isEmailMode) {
      if (!trimmedEmail) {
        setSubmitError('Please enter your email.');
        return;
      }
    } else if (!trimmedPhone) {
      setSubmitError('Please enter your phone number.');
      return;
    }

    const channel: OtpChannel = isEmailMode ? 'email' : 'phone';
    const contact = isEmailMode ? trimmedEmail : trimmedPhone;

    registerUser(
      {
        fullName: trimmedName,
        password: trimmedPassword,
        role: 'user',
        ...(isEmailMode ? { email: trimmedEmail } : { phone: trimmedPhone }),
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            Keyboard.dismiss();
            setOtpSession({
              contact,
              channel,
              fullName: trimmedName,
              email: trimmedEmail,
              phone: trimmedPhone,
            });
            return;
          }
          setSubmitError(res?.message ?? 'Failed to send OTP. Please try again.');
        },
        onError: (err) => {
          setSubmitError(getErrorMessage(err));
        },
      },
    );
  };

  const dismissKeyboard = () => {
    if (!isWeb) Keyboard.dismiss();
  };

  const shell = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: contentPadding,
              paddingBottom: spacing['6'] + keyboardPadding,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={isIOS}
          showsVerticalScrollIndicator={false}
        >
          <AuthMobileHero />

          <View style={styles.formSection}>
            <Text style={styles.title}>Join the Tribe!</Text>

            <View style={styles.formBody}>
              <View style={styles.formTop}>
                <View style={styles.inputGroup}>
                  <Input
                    placeholder="Full name"
                    placeholderTextColor={colors.text.placeholder}
                    style={authFieldInputStyle.field}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    onFocus={scrollToForm}
                  />

                  <Input
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={colors.text.placeholder}
                    style={authFieldInputStyle.field}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={scrollToForm}
                  />

                  <Input
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={colors.text.placeholder}
                    style={authFieldInputStyle.field}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={scrollToForm}
                  />

                  <View>
                    <Input
                      placeholder="+91 9744893210"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor={colors.text.placeholder}
                      style={authFieldInputStyle.field}
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={scrollToForm}
                    />
                    {!isEmailMode ? (
                      <Text style={styles.helper}>You'll get OTP to this number.</Text>
                    ) : null}
                  </View>
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
                    {isEmailMode ? 'Sign up with phone' : 'Sign up with mail'}
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
              </View>

              <Pressable
                onPress={() => router.replace('/login')}
                style={styles.loginLinkWrap}
                accessibilityRole="button"
              >
                <Text style={styles.loginLink}>
                  Already have an account? <Text style={styles.loginLinkAccent}>Log in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <OtpEntryModal
        visible={otpSession !== null}
        onClose={() => setOtpSession(null)}
        contact={otpSession?.contact ?? ''}
        channel={otpSession?.channel ?? 'phone'}
        fullName={otpSession?.fullName}
        email={otpSession?.email}
        phone={otpSession?.phone}
        flow="register"
      />
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
    gap: 18,
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  formSection: {
    width: '100%',
    gap: 12,
  },
  title: {
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
  helper: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['1'],
    letterSpacing: typography.letterSpacing['1'],
    color: 'rgba(28, 32, 36, 0.5)',
    textAlign: 'right',
    width: '100%',
    marginTop: spacing['1'],
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
  loginLinkWrap: {
    alignItems: 'center',
    paddingTop: spacing['2'],
  },
  loginLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: colors.text.secondary,
    textAlign: 'center',
  },
  loginLinkAccent: {
    color: ACCENT,
    fontWeight: typography.fontWeight.medium,
  },
});
