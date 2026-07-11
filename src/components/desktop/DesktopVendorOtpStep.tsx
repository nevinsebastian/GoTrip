import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import { VENDOR_ONBOARDING, type VendorRegistrationForm, type VendorSignupMode } from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const ACCENT = colors.accent.main;

type DesktopVendorOtpStepProps = {
  form: VendorRegistrationForm;
  signupMode: VendorSignupMode;
  digits: string[];
  inputRefs: React.MutableRefObject<(TextInput | null)[]>;
  onDigitChange: (index: number, value: string) => void;
  onKeyPress: (index: number, key: string) => void;
  onClose: () => void;
  onResend: () => void;
  onSubmit: () => void;
  isResending: boolean;
  isVerifying: boolean;
  canSubmit: boolean;
  error: string | null;
};

export function DesktopVendorOtpStep({
  form,
  signupMode,
  digits,
  inputRefs,
  onDigitChange,
  onKeyPress,
  onClose,
  onResend,
  onSubmit,
  isResending,
  isVerifying,
  canSubmit,
  error,
}: DesktopVendorOtpStepProps) {
  const isEmailMode = signupMode === 'email';

  return (
    <View style={styles.root}>
      <View style={styles.backdrop} pointerEvents="none">
        <Text style={styles.backdropTitle}>{VENDOR_ONBOARDING.registerTitle}</Text>
        <Text style={styles.backdropSubtitle}>{VENDOR_ONBOARDING.landingTitle}</Text>
        <View style={styles.backdropFields}>
          <View style={styles.backdropField}>
            <Text style={styles.backdropFieldText} numberOfLines={1}>
              {form.fullName || 'Full name'}
            </Text>
          </View>
          {isEmailMode ? (
            <View style={styles.backdropField}>
              <Text style={styles.backdropFieldText} numberOfLines={1}>
                {form.email || 'Email'}
              </Text>
            </View>
          ) : (
            <View style={styles.backdropField}>
              <Text style={styles.backdropFieldText} numberOfLines={1}>
                {form.phone || 'Phone number'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.backdropCta} />
      </View>

      <View style={styles.blurLayer} pointerEvents="none" />

      <View style={styles.modalLayer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Enter OTP</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close OTP">
              <Ionicons name="close" size={22} color={ACCENT} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Please enter the OTP as shared on your mobile as SMS/Email
          </Text>

          <View style={styles.iconWrap}>
            <Ionicons name="phone-portrait-outline" size={28} color={ACCENT} />
            <Ionicons name="shield-checkmark-outline" size={18} color={ACCENT} style={styles.shieldIcon} />
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
            <Text style={styles.resendHint}>Didn&apos;t receive OTP?</Text>
            <Pressable onPress={onResend} disabled={isResending} accessibilityRole="button">
              {isResending ? (
                <ActivityIndicator size="small" color={ACCENT} />
              ) : (
                <Text style={styles.resendLink}>Resend OTP</Text>
              )}
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.submitBtn, (!canSubmit || isVerifying) && styles.btnDisabled]}
            onPress={onSubmit}
            disabled={!canSubmit || isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color={colors.surface.white} size="small" />
            ) : (
              <Text style={styles.submitText}>Submit OTP</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 28,
    paddingTop: 24,
    gap: 10,
    zIndex: 0,
  },
  backdropTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
  },
  backdropSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  backdropFields: {
    gap: 10,
  },
  backdropField: {
    ...authFieldInputStyle.field,
    justifyContent: 'center',
  },
  backdropFieldText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  backdropCta: {
    marginTop: 8,
    height: 42,
    borderRadius: 100,
    backgroundColor: ACCENT,
    opacity: 0.85,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    zIndex: 1,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      } as object,
      default: {},
    }),
  },
  modalLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
    padding: 18,
    gap: 12,
    ...Platform.select({
      web: { boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(28, 32, 36, 0.5)',
  },
  iconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(232, 84, 51, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  shieldIcon: {
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
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    borderRadius: borderRadius.md,
    textAlign: 'center',
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
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
      default: {},
    }),
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resendHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.text.secondary,
  },
  resendLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.primaryAlt,
  },
  submitBtn: {
    width: '100%',
    minHeight: 44,
    borderRadius: 100,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
