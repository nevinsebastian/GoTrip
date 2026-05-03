import { Text } from '@/components/ui';
import {
  borderRadius,
  colors,
  spacing,
} from '@/constants/DesignTokens';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { useVerifyOtp } from '@/src/hooks/useVerifyOtp';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const OTP_LENGTH = 4;

type LoginStep = 'login' | 'otp';

type LoginSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  /**
   * Called after OTP verification stores a new access token.
   * Use to refetch user-dependent queries.
   */
  onAuthenticated?: () => void | Promise<void>;
};

export function LoginSheetModal({
  visible,
  onClose,
  onAuthenticated,
}: LoginSheetModalProps) {
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  const [loginValue, setLoginValue] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginStep, setLoginStep] = useState<LoginStep>('login');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  useEffect(() => {
    if (visible) {
      setLoginStep('login');
      setLoginError(null);
      setLoginMode('phone');
      setLoginValue('');
      setOtpDigits(['', '', '', '']);
    }
  }, [visible]);

  const closeLoginModal = () => {
    onClose();
    setLoginError(null);
    setLoginStep('login');
    setOtpDigits(['', '', '', '']);
  };

  const handleGetOtp = () => {
    setLoginError(null);
    const trimmed = loginValue.trim();
    if (!trimmed) {
      setLoginError(
        loginMode === 'email' ? 'Please enter your email.' : 'Please enter your phone number.',
      );
      return;
    }

    const payload =
      loginMode === 'email'
        ? { channel: 'email' as const, email: trimmed }
        : { channel: 'phone' as const, phone: trimmed };

    sendOtp(payload, {
      onSuccess: (res) => {
        if (res?.success) {
          setLoginStep('otp');
          setOtpDigits(['', '', '', '']);
          setTimeout(() => otpRefs.current[0]?.focus?.(), 150);
          return;
        }
        setLoginError(res?.message ?? 'Failed to send OTP. Please try again.');
      },
      onError: (err) => setLoginError(getErrorMessage(err)),
    });
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

  const handleVerifyOtp = () => {
    if (isVerifyingOtp) return;
    setLoginError(null);
    const code = otpDigits.join('');
    if (code.length !== OTP_LENGTH) return;

    verifyOtp(
      {
        channel: loginMode === 'email' ? 'email' : 'phone',
        otp: code,
        ...(loginMode === 'email' ? { email: loginValue.trim() } : { phone: loginValue.trim() }),
      },
      {
        onSuccess: async (res) => {
          if (res?.success && res?.data?.access_token) {
            try {
              await onAuthenticated?.();
            } finally {
              closeLoginModal();
            }
            return;
          }
          setLoginError(res?.message ?? 'Invalid or expired OTP.');
        },
        onError: (err) => setLoginError(getErrorMessage(err)),
      },
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={loginStep === 'otp' ? undefined : closeLoginModal}
    >
      <Pressable
        style={styles.sheetOverlay}
        onPress={loginStep === 'otp' ? undefined : closeLoginModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
          <Pressable style={styles.sheetCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Pressable onPress={closeLoginModal} hitSlop={12} accessibilityLabel="Close login">
                <Ionicons name="chevron-back" size={22} color={colors.primary} />
              </Pressable>
              <Text variant="bodySemibold" style={styles.sheetTitle}>
                {loginStep === 'otp' ? 'Enter OTP' : 'Log in or sign up'}
              </Text>
              <View style={{ width: 22 }} />
            </View>

            <View style={styles.sheetBody}>
              {loginStep === 'login' ? (
                <>
                  <TextInput
                    value={loginValue}
                    onChangeText={setLoginValue}
                    placeholder={loginMode === 'email' ? 'Email' : 'Phone number'}
                    placeholderTextColor="rgba(0, 5, 29, 0.45)"
                    keyboardType={loginMode === 'email' ? 'email-address' : 'phone-pad'}
                    autoCapitalize="none"
                    style={styles.loginPhoneInput}
                  />
                  <Text variant="caption" style={styles.loginHelper}>
                    {loginMode === 'email'
                      ? "You'll get OTP to this email."
                      : "You'll get OTP to this number."}
                  </Text>

                  <Pressable
                    onPress={() => {
                      setLoginMode((p) => (p === 'phone' ? 'email' : 'phone'));
                      setLoginValue('');
                      setLoginError(null);
                    }}
                    accessibilityLabel={loginMode === 'email' ? 'Login with phone' : 'Login with email'}
                    hitSlop={8}
                    style={styles.loginModeSwitch}
                  >
                    <Text variant="caption" style={styles.loginModeSwitchText}>
                      {loginMode === 'email' ? 'Login with phone' : 'Login with email'}
                    </Text>
                  </Pressable>

                  {loginError ? (
                    <Text variant="caption" style={styles.loginError}>
                      {loginError}
                    </Text>
                  ) : null}

                  <Pressable
                    style={[styles.getOtpBtn, isSendingOtp && styles.btnDisabled]}
                    onPress={handleGetOtp}
                    disabled={isSendingOtp}
                    accessibilityLabel="Get OTP"
                  >
                    <Text variant="bodySemibold" style={styles.getOtpBtnText}>
                      {isSendingOtp ? 'Sending OTP...' : 'Get OTP'}
                    </Text>
                  </Pressable>

                  <View style={styles.socialDividerRow}>
                    <View style={styles.socialDivider} />
                    <Text variant="caption" style={styles.socialDividerText}>
                      Or
                    </Text>
                    <View style={styles.socialDivider} />
                  </View>

                  <View style={styles.socialStack}>
                    <Pressable style={styles.socialBtn} accessibilityLabel="Continue with Google">
                      <Ionicons name="logo-google" size={18} color={colors.text.primary} />
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Google
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} accessibilityLabel="Continue with Apple">
                      <Ionicons name="logo-apple" size={18} color={colors.text.primary} />
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Apple
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} accessibilityLabel="Continue with Facebook">
                      <Ionicons name="logo-facebook" size={18} color={colors.text.primary} />
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Facebook
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text
                    variant="caption"
                    style={styles.otpSubtitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {loginMode === 'email'
                      ? `Sent to ${loginValue.trim() || 'your email'}`
                      : `Sent to ${loginValue.trim() || 'your phone number'}`}
                  </Text>

                  <View style={styles.otpRow}>
                    {otpDigits.map((d, idx) => (
                      <TextInput
                        key={idx}
                        ref={(r) => {
                          otpRefs.current[idx] = r;
                        }}
                        value={d}
                        onChangeText={(v) => handleOtpDigitChange(idx, v)}
                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(idx, nativeEvent.key)}
                        keyboardType="number-pad"
                        maxLength={2}
                        style={styles.otpBox}
                        placeholder="•"
                        placeholderTextColor="rgba(0, 5, 29, 0.25)"
                      />
                    ))}
                  </View>

                  {loginError ? (
                    <Text variant="caption" style={styles.loginError}>
                      {loginError}
                    </Text>
                  ) : null}

                  <Pressable
                    style={[
                      styles.getOtpBtn,
                      (isVerifyingOtp || otpDigits.join('').length !== OTP_LENGTH) &&
                        styles.btnDisabled,
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={isVerifyingOtp || otpDigits.join('').length !== OTP_LENGTH}
                    accessibilityLabel="Verify OTP"
                  >
                    <Text variant="bodySemibold" style={styles.getOtpBtnText}>
                      {isVerifyingOtp ? 'Verifying...' : 'Confirm'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setLoginStep('login');
                      setOtpDigits(['', '', '', '']);
                      setLoginError(null);
                    }}
                    accessibilityLabel="Change contact"
                    hitSlop={8}
                    style={styles.changeContactBtn}
                  >
                    <Text variant="caption" style={styles.loginModeSwitchText}>
                      Change email/phone
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.27)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    width: '100%',
    backgroundColor: colors.gray['1'],
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingTop: spacing['5'],
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['6'],
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing['4'],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  sheetBody: {
    gap: spacing['2'],
    alignSelf: 'stretch',
    width: '100%',
  },
  loginPhoneInput: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    borderRadius: 6,
    paddingHorizontal: spacing['3'],
    color: colors.text.primary,
  },
  loginHelper: {
    color: 'rgba(0, 5, 29, 0.45)',
    paddingHorizontal: spacing['1'],
  },
  loginError: {
    color: '#d32f2f',
  },
  getOtpBtn: {
    height: 32,
    borderRadius: borderRadius.sm ?? 4,
    backgroundColor: colors.neutral?.['9'] ?? '#8b8d98',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2'],
  },
  getOtpBtnText: {
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loginModeSwitch: {
    alignSelf: 'flex-start',
    marginTop: spacing['1'],
    paddingVertical: spacing['1'],
  },
  loginModeSwitchText: {
    color: colors.primary,
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['3'],
    marginBottom: spacing['1'],
  },
  socialDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 9, 50, 0.12)',
  },
  socialDividerText: {
    color: 'rgba(0, 5, 29, 0.45)',
  },
  socialStack: {
    gap: spacing['2'],
  },
  socialBtn: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  socialBtnText: {
    color: colors.text.primary,
  },
  otpSubtitle: {
    color: 'rgba(0, 5, 29, 0.45)',
    marginBottom: spacing['2'],
    alignSelf: 'stretch',
    maxWidth: '100%',
    ...(Platform.OS === 'web'
      ? ({ overflowWrap: 'anywhere' } as Record<string, string>)
      : {}),
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 6,
    marginBottom: spacing['2'],
    width: '100%',
  },
  /**
   * Fixed widths: `flex:1` on TextInput blows up on Safari/RN Web (large intrinsic min-width),
   * so only ~2 OTP cells were visible.
   */
  otpBox: {
    width: 44,
    height: 48,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: 18,
    color: colors.text.primary,
    paddingHorizontal: 0,
    ...(Platform.OS === 'web'
      ? ({ boxSizing: 'border-box' as const, minWidth: 0 } as object)
      : {}),
  },
  changeContactBtn: {
    alignSelf: 'center',
    marginTop: spacing['2'],
    paddingVertical: spacing['1'],
  },
});
