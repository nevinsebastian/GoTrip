import { Input, Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { AuthMobileHero } from '@/src/components/AuthMobileHero';
import { OtpEntryModal } from '@/src/components/OtpEntryModal';
import type { OtpChannel } from '@/src/api/types';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import { VENDOR_WORKSPACE_BLUE } from '@/src/constants/vendorWorkspaceConstants';
import { loginExistingVendor } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
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

const isWeb = Platform.OS === 'web';
const isIOS = Platform.OS === 'ios';
const VENDOR_ACCENT = VENDOR_WORKSPACE_BLUE;
const DESIGN_WIDTH = 402;

type LoginMode = 'phone' | 'email';

type OtpSession = {
  contact: string;
  channel: OtpChannel;
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

export function MobileVendorLoginScreen() {
  const contentPadding = spacing['4'];
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const [loginMode, setLoginMode] = useState<LoginMode>('phone');
  const [inputValue, setInputValue] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [otpSession, setOtpSession] = useState<OtpSession | null>(null);

  const isEmailMode = loginMode === 'email';

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
    Keyboard.dismiss();
    const channel: OtpChannel = isEmailMode ? 'email' : 'phone';
    setOtpSession({ contact: trimmed, channel });
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
          <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
            <Text style={styles.backText}>Guest login</Text>
          </Pressable>

          <AuthMobileHero />

          <View style={styles.formSection}>
            <Text style={styles.welcomeTitle}>Vendor Login</Text>
            <Text style={styles.subtitle}>Sign in to manage your listings and bookings.</Text>

            <View style={styles.formBody}>
              <View style={styles.formTop}>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>
                    {isEmailMode ? 'Enter your vendor email.' : 'Enter your vendor phone.'}
                  </Text>

                  <Input
                    placeholder={isEmailMode ? 'vendor@email.com' : '+91 9744893210'}
                    keyboardType={isEmailMode ? 'email-address' : 'phone-pad'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={colors.text.placeholder}
                    style={authFieldInputStyle.field}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onFocus={scrollToForm}
                  />

                  <Text style={styles.helper}>
                    Demo mode — enter any contact, then use any 4-digit OTP.
                  </Text>
                </View>

                {submitError ? (
                  <Text variant="caption" style={styles.errorText}>
                    {submitError}
                  </Text>
                ) : null}

                <Pressable
                  style={({ pressed }) => [styles.getOtpButton, pressed && styles.buttonPressed]}
                  onPress={handleGetOtp}
                  accessibilityRole="button"
                >
                  <Text style={styles.getOtpText}>Get OTP</Text>
                </Pressable>
              </View>

              <OrDivider />

              <View style={styles.socialStack}>
                <Pressable
                  style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                  onPress={switchMode}
                  accessibilityRole="button"
                >
                  <Text style={styles.socialButtonText}>
                    {isEmailMode ? 'Login with phone' : 'Log in with mail'}
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.joinTribeButton, pressed && styles.buttonPressed]}
                  onPress={() => router.push('/become-vendor')}
                  accessibilityRole="button"
                  accessibilityLabel="Join the Tribe vendor signup"
                >
                  <Text style={styles.joinTribeText}>Join the Tribe!</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <OtpEntryModal
        visible={otpSession !== null}
        onClose={() => setOtpSession(null)}
        contact={otpSession?.contact ?? ''}
        channel={otpSession?.channel ?? 'phone'}
        mockMode
        redirectTo="/vendor/home"
        onAuthenticated={loginExistingVendor}
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    gap: 18,
    width: '100%',
    maxWidth: DESIGN_WIDTH,
    alignSelf: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  formSection: {
    width: '100%',
    gap: 8,
  },
  welcomeTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 42,
    letterSpacing: typography.letterSpacing['3'],
    color: VENDOR_ACCENT,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
    marginBottom: 4,
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
    backgroundColor: VENDOR_ACCENT,
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
    backgroundColor: VENDOR_ACCENT,
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
    borderColor: VENDOR_ACCENT,
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
    color: VENDOR_ACCENT,
  },
});
