import { Button, Card, IconButton, Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const isWeb = Platform.OS === 'web';

import Logo from '@/assets/images/logogotrip.svg';
import { useVerifyOtp } from '@/src/hooks/useVerifyOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';

const isIOS = Platform.OS === 'ios';
const OTP_LENGTH = 4;

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

export default function OtpScreen() {
  const { contact = '', isEmail = '0', fullName = '' } = useLocalSearchParams<{
    contact?: string;
    isEmail?: string;
    fullName?: string;
  }>();
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const isEmailMode = isEmail === '1';
  const sentToLabel = isEmailMode ? contact : maskContact(contact, false);
  const sentVia = isEmailMode ? 'via email' : 'via SMS';

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  const handleBack = () => {
    router.back();
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
      inputRefs.current[nextFocus]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = num;
    setDigits(next);
    if (num && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    if (isVerifying) return;
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) return;
    setSubmitError(null);

    verifyOtp(
      {
        full_name: fullName || undefined,
        channel: isEmailMode ? 'email' : 'phone',
        otp: code,
        ...(isEmailMode ? { email: contact } : { phone: contact }),
      },
      {
        onSuccess: (res) => {
          if (res?.success && res?.data?.access_token) {
            router.replace('/(tabs)');
            return;
          }
          setSubmitError(res?.message ?? 'Invalid or expired OTP.');
        },
        onError: (err) => {
          setSubmitError(getErrorMessage(err));
        },
      },
    );
  };

  const code = digits.join('');
  const canConfirm = code.length === OTP_LENGTH && !isVerifying;

  const wrap = (content: React.ReactNode) =>
    isWeb ? (
      <View style={styles.touchableWrap}>{content}</View>
    ) : (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.touchableWrap}>{content}</View>
      </TouchableWithoutFeedback>
    );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {wrap(
        <>
          <View style={styles.header}>
            <IconButton
              icon="chevron-back"
              size={isIOS ? 24 : 20}
              color={colors.primary}
              onPress={handleBack}
            />
            <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
              Sign up
            </Text>
          </View>

          <View style={styles.screen}>
            <Card padding="none" style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.logoWrap}>
                  <Logo width={isIOS ? 120 : 100} height={isIOS ? 44 : 38} />
                </View>

                <Text variant="bodySemibold" style={styles.enterOtpTitle}>
                  Enter OTP
                </Text>
                <Text variant="caption" style={styles.subtitle}>
                  OTP sent to {sentToLabel} {sentVia}
                </Text>

                <View style={styles.otpRow}>
                  {digits.map((d, i) => (
                    <Input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      value={d}
                      onChangeText={(v) => handleDigitChange(i, v)}
                      onKeyPress={({ nativeEvent }) =>
                        handleKeyPress(i, nativeEvent.key)
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      placeholder="0"
                      placeholderTextColor={colors.neutral.alpha['9']}
                      style={styles.otpDigit}
                      containerStyle={styles.otpDigitContainer}
                    />
                  ))}
                </View>

                <Text variant="caption" style={styles.helper}>
                  {isEmailMode
                    ? "You'll get OTP on this email."
                    : "You'll get OTP on this number."}
                </Text>

                {submitError ? (
                  <Text variant="caption" style={styles.errorText}>
                    {submitError}
                  </Text>
                ) : null}

                <Button
                  variant="primary"
                  size="default"
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                  disabled={!canConfirm}
                >
                  {isVerifying ? 'Verifying...' : 'Confirm'}
                </Button>

                <Button
                  variant="link"
                  size="compact"
                  onPress={() => {}}
                >
                  Resend code
                </Button>
              </View>
            </Card>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray['2'],
  },
  touchableWrap: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['2'],
    minHeight: 48,
    backgroundColor: colors.gray['2'],
  },
  headerTitle: {
    marginLeft: spacing['2'],
  },
  screen: {
    flex: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['6'],
    paddingBottom: spacing['4'],
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.gray['1'],
    borderRadius: borderRadius['6'],
  },
  cardInner: {
    alignItems: 'center',
    paddingVertical: spacing['5'],
    paddingHorizontal: spacing['5'],
    gap: spacing['4'],
  },
  logoWrap: {
    marginBottom: spacing['2'],
  },
  enterOtpTitle: {
    color: colors.text.primary,
    alignSelf: 'flex-start',
  },
  subtitle: {
    color: colors.neutral.alpha['9'],
    alignSelf: 'flex-start',
    marginTop: spacing['1'],
  },
  otpRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: spacing['2'],
    marginTop: spacing['3'],
  },
  otpDigitContainer: {
    flex: 1,
    minWidth: 0,
  },
  otpDigit: {
    ...Platform.select({
      ios: { height: 48 },
      default: { height: 44 },
    }),
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.neutral.alpha['5'],
    borderRadius: borderRadius['3'],
    paddingHorizontal: 0,
    fontSize: 20,
    textAlign: 'center',
  },
  helper: {
    color: colors.neutral.alpha['9'],
    alignSelf: 'flex-start',
    marginTop: spacing['2'],
  },
  errorText: {
    color: '#d32f2f',
    alignSelf: 'flex-start',
    marginTop: spacing['1'],
  },
  confirmButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    borderWidth: 0,
    marginTop: spacing['2'],
  },
});
