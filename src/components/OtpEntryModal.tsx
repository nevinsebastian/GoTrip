import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import type { OtpChannel } from '@/src/api/types';
import { useVerifyOtp } from '@/src/hooks/useVerifyOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { enterVendorWorkspace, VENDOR_HOME_PATH } from '@/src/utils/vendorNavigation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const ACCENT = colors.accent.main;
const OTP_LENGTH = 4;

function maskContact(value: string, isEmail: boolean): string {
  if (!value.trim()) return isEmail ? 'your email' : 'your phone number';
  if (isEmail) {
    const at = value.indexOf('@');
    if (at <= 0) return value.charAt(0) + '***';
    return value.charAt(0) + '***' + value.slice(at);
  }
  const digits = value.replace(/\D/g, '').slice(-10);
  if (digits.length < 2) return '+91 ******' + digits;
  return '+91 ' + digits.slice(0, 2) + '******' + digits.slice(-2);
}

export type OtpEntryModalProps = {
  visible: boolean;
  onClose: () => void;
  contact: string;
  channel: OtpChannel;
  fullName?: string;
  email?: string;
  phone?: string;
  onAuthenticated?: () => void | Promise<void>;
  /** Skip API verification — any 4-digit OTP succeeds. */
  mockMode?: boolean;
  /** Route after successful mock or API auth (default guest tabs). */
  redirectTo?: string;
};

export function OtpEntryModal({
  visible,
  onClose,
  contact,
  channel,
  fullName,
  email,
  phone,
  onAuthenticated,
  mockMode = false,
  redirectTo = '/(tabs)',
}: OtpEntryModalProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const isEmailMode = channel === 'email';
  const sentToLabel = isEmailMode ? contact : maskContact(contact, false);
  const sentVia = isEmailMode ? 'via email' : 'via SMS';

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  useEffect(() => {
    if (visible) {
      setDigits(['', '', '', '']);
      setSubmitError(null);
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    }
  }, [visible]);

  const handleClose = () => {
    setSubmitError(null);
    setDigits(['', '', '', '']);
    onClose();
  };

  const navigateAfterAuth = async (target: string) => {
    if (Platform.OS === 'web' && target === VENDOR_HOME_PATH) {
      await enterVendorWorkspace();
      return;
    }
    router.replace(target as any);
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

    if (mockMode) {
      void (async () => {
        try {
          await onAuthenticated?.();
        } finally {
          handleClose();
          await navigateAfterAuth(redirectTo);
        }
      })();
      return;
    }

    verifyOtp(
      {
        full_name: fullName || undefined,
        channel,
        otp: code,
        ...(email ? { email } : isEmailMode ? { email: contact } : {}),
        ...(phone ? { phone } : !isEmailMode ? { phone: contact } : {}),
      },
      {
        onSuccess: async (res) => {
          if (res?.success && res?.data?.access_token) {
            try {
              await onAuthenticated?.();
            } finally {
              handleClose();
              await navigateAfterAuth(redirectTo);
            }
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
          style={styles.keyboardWrap}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Pressable onPress={handleClose} hitSlop={12} accessibilityLabel="Close OTP">
                <Ionicons name="close" size={22} color={colors.text.primary} />
              </Pressable>
              <Text style={styles.title}>Enter OTP</Text>
              <View style={{ width: 22 }} />
            </View>

            <Text style={styles.subtitle}>
              OTP sent to {sentToLabel} {sentVia}
            </Text>

            <View style={styles.otpRow}>
              {digits.map((d, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  value={d}
                  onChangeText={(v) => handleDigitChange(i, v)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={2}
                  style={styles.otpBox}
                  placeholder="•"
                  placeholderTextColor="rgba(0, 5, 29, 0.25)"
                  selectTextOnFocus
                />
              ))}
            </View>

            {submitError ? (
              <Text style={styles.errorText}>{submitError}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                (!canConfirm || isVerifying) && styles.buttonDisabled,
                pressed && canConfirm && styles.buttonPressed,
              ]}
              onPress={handleConfirm}
              disabled={!canConfirm}
              accessibilityRole="button"
            >
              {isVerifying ? (
                <ActivityIndicator color={colors.surface.white} size="small" />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </Pressable>

            <Pressable onPress={handleClose} style={styles.changeContactBtn}>
              <Text style={styles.changeContactText}>Change email/phone</Text>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.45)',
    justifyContent: 'flex-end',
  },
  keyboardWrap: {
    width: '100%',
  },
  sheet: {
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['6'],
    gap: spacing['3'],
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.15)',
    marginBottom: spacing['1'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.medium,
    color: ACCENT,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    lineHeight: typography.lineHeight['2'],
    color: 'rgba(0, 5, 29, 0.45)',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: spacing['2'],
  },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 47, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: typography.fontFamily.text,
    color: colors.text.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
      ios: {
        paddingTop: 14,
      },
    }),
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: '#d32f2f',
  },
  confirmButton: {
    height: 44,
    borderRadius: 24,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['1'],
  },
  confirmText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  changeContactBtn: {
    alignSelf: 'center',
    paddingVertical: spacing['1'],
  },
  changeContactText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: ACCENT,
  },
});
