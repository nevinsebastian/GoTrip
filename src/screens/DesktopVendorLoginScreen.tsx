import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import MailIcon from '@/assets/images/mail.svg';
import HotelIcon from '@/assets/images/login-figma/hotel-icon.svg';
import SpeechBubbleIcon from '@/assets/images/login-figma/speech-bubble.svg';
import { Button, Divider, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { useVerifyOtp } from '@/src/hooks/useVerifyOtp';
import {
  DESKTOP_VENDOR_LANDING_CARD,
  desktopContentShellStyle,
} from '@/src/constants/desktopLayoutConstants';
import { VENDOR_DASHBOARD_COPY } from '@/src/constants/vendorDashboardConstants';
import { VENDOR_ONBOARDING } from '@/src/constants/vendorOnboardingConstants';
import {
  VENDOR_WORKSPACE_BLUE,
  VENDOR_WORKSPACE_COPY,
} from '@/src/constants/vendorWorkspaceConstants';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { loginExistingVendor } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HeroLogoWhite = require('@/assets/images/login-figma/logo-hero-white.png');
const VendorHeroImage = require('@/assets/images/desktop-web/vendor-hero.jpg');

const FIELD_BORDER = 'rgba(28, 32, 36, 0.12)';
const VENDOR_BTN_PINK = '#C2185B';
const OTP_LENGTH = 4;
const SOCIAL_ICON_SIZE = 20;

export function DesktopVendorLoginScreen() {
  const { width } = useResponsive();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ''),
  );
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  const compact = useMemo(() => width > 0 && width < 980, [width]);

  const cardSize = useMemo(() => {
    const designW = DESKTOP_VENDOR_LANDING_CARD.width;
    const designH = DESKTOP_VENDOR_LANDING_CARD.height;
    const aspect = designW / designH;
    const maxW = windowWidth - 64;
    const maxH = windowHeight - (DESKTOP_VENDOR_LANDING_CARD.viewportHeaderOffset ?? 100);

    let height = Math.min(designH, maxH);
    let width = height * aspect;

    if (width > Math.min(designW, maxW)) {
      width = Math.min(designW, maxW);
      height = width / aspect;
    }

    return { width, height };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (step === 'otp') {
      const t = setTimeout(() => otpRefs.current[0]?.focus?.(), 150);
      return () => clearTimeout(t);
    }
  }, [step]);

  const goBackToPhone = () => {
    setSubmitError(null);
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setStep('credentials');
  };

  const handleGetOtpPress = () => {
    if (isSendingOtp) return;
    setSubmitError(null);
    const trimmed = phone.trim();
    if (!trimmed) {
      setSubmitError('Please enter your phone number.');
      return;
    }

    sendOtp(
      { channel: 'phone', phone: trimmed },
      {
        onSuccess: (res) => {
          if (res?.success) {
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

  const handleConfirmOtpPress = () => {
    if (isVerifyingOtp) return;
    setSubmitError(null);
    const trimmed = phone.trim();
    const code = otpDigits.join('');
    if (!trimmed) {
      setSubmitError('Please enter your phone number.');
      setStep('credentials');
      return;
    }
    if (code.length !== OTP_LENGTH) return;

    verifyOtp(
      { channel: 'phone', phone: trimmed, otp: code },
      {
        onSuccess: async (res) => {
          if (res?.success && res?.data?.access_token) {
            try {
              await loginExistingVendor();
            } finally {
              router.replace('/vendor/home');
            }
            return;
          }
          setSubmitError(res?.message ?? 'Invalid or expired OTP.');
        },
        onError: (err) => setSubmitError(getErrorMessage(err)),
      },
    );
  };

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pageScrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentShell}>
          <View style={styles.header}>
            <Pressable onPress={() => router.replace('/(tabs)')} accessibilityRole="button">
              <Text style={styles.brand}>{VENDOR_DASHBOARD_COPY.brand}</Text>
            </Pressable>

            <View style={styles.searchWrap}>
              <Input
                placeholder={VENDOR_ONBOARDING.searchPlaceholder}
                placeholderTextColor="rgba(28,32,36,0.5)"
                style={styles.searchInput}
                editable={false}
              />
              <View style={styles.searchIcon}>
                <Ionicons name="search" size={18} color={VENDOR_WORKSPACE_BLUE} />
              </View>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/become-vendor')}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <LinearGradient
                  colors={['#4A9FD4', VENDOR_WORKSPACE_BLUE]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>{VENDOR_WORKSPACE_COPY.addListing}</Text>
                  <Ionicons name="home" size={16} color={colors.surface.white} />
                </LinearGradient>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/vendor/(workspace)/listings')}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <LinearGradient
                  colors={['#E91E8C', VENDOR_BTN_PINK]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>{VENDOR_WORKSPACE_COPY.allListings}</Text>
                  <Ionicons name="business" size={16} color={colors.surface.white} />
                </LinearGradient>
              </Pressable>

              <View style={styles.profileBtn} accessibilityLabel="Profile">
                <Ionicons name="person-outline" size={20} color={VENDOR_WORKSPACE_BLUE} />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.mainCard,
              compact && styles.mainCardCompact,
              { width: cardSize.width, height: cardSize.height, maxWidth: cardSize.width },
            ]}
          >
            {!compact ? (
              <View style={styles.heroPanel}>
                <Image source={VendorHeroImage} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay}>
                  <Image
                    source={HeroLogoWhite}
                    style={[styles.heroLogo, Platform.OS === 'web' ? (styles.heroLogoWeb as object) : null]}
                    resizeMode="contain"
                  />

                  <View style={styles.speechBubbleWrap}>
                    <SpeechBubbleIcon width={300} height={40} style={StyleSheet.absoluteFillObject} />
                    <View style={styles.speechBubbleRow}>
                      <Text style={styles.speechText}>
                        <Text style={styles.speechBold}>Host worry-free</Text> - We&apos;ve got your back!
                      </Text>
                    </View>
                  </View>

                  <View style={styles.propertyPill}>
                    <HotelIcon width={18} height={18} />
                    <Text style={styles.propertyLead}>Manage your Property.</Text>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>Vacation Rentals</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={[styles.formPanel, compact && styles.formPanelCompact]}>
              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.formScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {step === 'credentials' ? (
                  <>
                    <Text variant="heading2" style={styles.title}>
                      Welcome Back!
                    </Text>
                    <Text variant="caption" style={styles.subtitle}>
                      Enter your Phone to continue.
                    </Text>

                    <View style={styles.formStack}>
                      <Input
                        value={phone}
                        onChangeText={(v) => {
                          setPhone(v);
                          if (submitError) setSubmitError(null);
                        }}
                        placeholder={VENDOR_ONBOARDING.defaultPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor={colors.text.placeholder}
                        style={styles.input}
                      />
                      <Text variant="caption" style={styles.helper}>
                        You&apos;ll get OTP to this number.
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
                        onPress={handleGetOtpPress}
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? 'Sending OTP…' : 'Get OTP'}
                      </Button>

                      <Divider style={styles.divider} />

                      <View style={styles.socialStack}>
                        <Button variant="outlineSoft" size="compact" leftAdornment={<MailIcon width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />} onPress={() => {}}>
                          Log in with mail
                        </Button>
                        <Button variant="outlineSoft" size="compact" leftAdornment={<GoogleIcon width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />} onPress={() => {}}>
                          Continue with Google
                        </Button>
                        <Button variant="outlineSoft" size="compact" leftAdornment={<AppleIcon width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />} onPress={() => {}}>
                          Continue with Apple
                        </Button>
                        <Button variant="outlineSoft" size="compact" leftAdornment={<FacebookIcon width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />} onPress={() => {}}>
                          Continue with Facebook
                        </Button>
                      </View>

                      <Pressable
                        style={({ pressed }) => [styles.joinRow, pressed && styles.pressed]}
                        onPress={() => router.push('/become-vendor')}
                        accessibilityRole="button"
                      >
                        <Text variant="caption" style={styles.joinText}>
                          New vendor? <Text style={styles.joinBold}>Join the tribe!</Text>
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={goBackToPhone}
                      style={({ pressed }) => [styles.changeContactRow, pressed && styles.pressed]}
                      accessibilityRole="button"
                    >
                      <Text variant="caption" style={styles.changeContactText}>
                        Change phone
                      </Text>
                    </Pressable>

                    <Text variant="heading2" style={styles.title}>
                      Enter OTP
                    </Text>
                    <Text variant="caption" style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
                      OTP sent to {phone.trim() || 'your phone'} via SMS.
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
                          selectTextOnFocus
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
                      onPress={handleConfirmOtpPress}
                      disabled={isVerifyingOtp || otpDigits.join('').length !== OTP_LENGTH}
                    >
                      {isVerifyingOtp ? (
                        <View style={styles.spinnerRow}>
                          <ActivityIndicator color={colors.surface.white} size="small" />
                          <Text style={styles.spinnerText}>Verifying…</Text>
                        </View>
                      ) : (
                        'Confirm'
                      )}
                    </Button>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  pageScroll: { flex: 1 },
  pageScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentShell: {
    ...desktopContentShellStyle,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brand: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    color: VENDOR_WORKSPACE_BLUE,
    flexShrink: 0,
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
    minWidth: 0,
    maxWidth: 520,
  },
  searchInput: {
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    paddingLeft: 16,
    paddingRight: 44,
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  actionBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  actionBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: VENDOR_WORKSPACE_BLUE,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  mainCard: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: DESKTOP_VENDOR_LANDING_CARD.borderRadius,
    backgroundColor: DESKTOP_VENDOR_LANDING_CARD.backgroundColor,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  mainCardCompact: {
    flexDirection: 'column',
    height: 'auto' as unknown as number,
  },
  heroPanel: {
    width: '50%',
    height: '100%',
    position: 'relative',
    backgroundColor: colors.gray['2'],
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  heroLogo: {
    width: 120,
    height: 52,
    tintColor: colors.surface.white,
  },
  heroLogoWeb: {
    filter: 'brightness(0) invert(1)',
  },
  speechBubbleWrap: {
    width: 300,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubbleRow: {
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    color: colors.surface.white,
    textAlign: 'center',
  },
  speechBold: {
    fontWeight: typography.fontWeight.bold,
  },
  propertyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface.white,
    borderRadius: 100,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    maxWidth: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' },
      default: {},
    }),
  },
  propertyLead: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    flexShrink: 1,
  },
  categoryPill: {
    backgroundColor: VENDOR_WORKSPACE_BLUE,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  categoryPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  formPanel: {
    flex: 1,
    height: '100%',
    minHeight: 0,
    backgroundColor: colors.surface.white,
  },
  formPanelCompact: {
    width: '100%',
    minHeight: 420,
  },
  formScroll: { flex: 1 },
  formScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 28,
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
    marginTop: -spacing['1'],
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
    backgroundColor: VENDOR_WORKSPACE_BLUE,
  },
  divider: {
    marginVertical: spacing['2'],
  },
  socialStack: {
    gap: spacing['3'],
  },
  joinRow: {
    alignSelf: 'center',
    paddingVertical: spacing['2'],
  },
  joinText: {
    color: colors.text.secondary,
  },
  joinBold: {
    color: VENDOR_WORKSPACE_BLUE,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: { opacity: 0.85 },
  changeContactRow: {
    alignSelf: 'flex-start',
    paddingVertical: spacing['1'],
    marginBottom: spacing['2'],
  },
  changeContactText: {
    color: VENDOR_WORKSPACE_BLUE,
    fontWeight: typography.fontWeight.semibold,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: spacing['3'],
    width: '100%',
  },
  otpBox: {
    width: 44,
    height: 48,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: colors.surface.white,
    textAlign: 'center',
    fontSize: 18,
    color: colors.text.primary,
    paddingHorizontal: 0,
    ...(Platform.OS === 'web'
      ? ({ boxSizing: 'border-box' as const, minWidth: 0 } as object)
      : {}),
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  spinnerText: {
    color: colors.surface.white,
    fontWeight: typography.fontWeight.semibold,
  },
});
