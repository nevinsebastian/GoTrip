import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import MailIcon from '@/assets/images/mail.svg';
import MobileIcon from '@/assets/images/mobile.svg';
import HotelIcon from '@/assets/images/login-figma/hotel-icon.svg';
import SpeechBubbleIcon from '@/assets/images/login-figma/speech-bubble.svg';
import { Button, Divider, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import type { OtpChannel } from '@/src/api/types';
import { VENDOR_ONBOARDING } from '@/src/constants/vendorOnboardingConstants';
import { VENDOR_WORKSPACE_COPY } from '@/src/constants/vendorWorkspaceConstants';
import { goToVendorLogin, enterVendorWorkspace } from '@/src/utils/vendorNavigation';
import { loginExistingVendor } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
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

const HeaderLogo = require('@/assets/images/login-figma/logo-header.png');
const HeroLogoWhite = require('@/assets/images/login-figma/logo-hero-white.png');
const VendorHeroImage = require('@/assets/images/desktop-web/vendor-hero.jpg');

/** Figma "Login - Web" frame */
const FIGMA_PAGE_WIDTH = 1280;
const FIGMA_CARD_WIDTH = 1196;
const FIGMA_CARD_HEIGHT = 585;
const FIGMA_HEADER_HEIGHT = 90;
const FIGMA_BLUE = '#2C6F9C';
const FIGMA_PINK = '#AA1155';
const FIGMA_VENDOR_SUFFIX = '#E54D2E';
const FIGMA_TITLE = '#0F1A20';

const OTP_LENGTH = 4;
const SOCIAL_ICON_SIZE = 20;
/** Figma / demo vendor login — no API calls. */
const DEMO_VENDOR_EMAIL = 'vendor@gotrip.com';

type LoginMode = 'phone' | 'email';

type PendingVerify = {
  contact: string;
  channel: OtpChannel;
};

export function DesktopVendorLoginScreen() {
  const { width } = useResponsive();
  const { width: windowWidth } = useWindowDimensions();
  const [loginMode, setLoginMode] = useState<LoginMode>('phone');
  const [contactValue, setContactValue] = useState('');
  const [pendingVerify, setPendingVerify] = useState<PendingVerify | null>(null);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ''),
  );
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const isEmailMode = loginMode === 'email';

  const compact = useMemo(() => width > 0 && width < 980, [width]);

  const cardSize = useMemo(() => {
    const shellWidth = Math.min(FIGMA_PAGE_WIDTH, windowWidth);
    const maxCardWidth = Math.min(FIGMA_CARD_WIDTH, shellWidth);
    const scale = maxCardWidth / FIGMA_CARD_WIDTH;
    return {
      width: maxCardWidth,
      height: Math.round(FIGMA_CARD_HEIGHT * scale),
    };
  }, [windowWidth]);

  useEffect(() => {
    if (step === 'otp') {
      const t = setTimeout(() => otpRefs.current[0]?.focus?.(), 150);
      return () => clearTimeout(t);
    }
  }, [step]);

  const goBackToCredentials = () => {
    setSubmitError(null);
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setPendingVerify(null);
    setStep('credentials');
  };

  const switchLoginMode = () => {
    setContactValue('');
    setSubmitError(null);
    setLoginMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

  const handleGetOtpPress = () => {
    setSubmitError(null);
    const trimmed = contactValue.trim();
    if (!trimmed) {
      setSubmitError(
        isEmailMode ? 'Please enter your email.' : 'Please enter your phone number.',
      );
      return;
    }

    const channel: OtpChannel = isEmailMode ? 'email' : 'phone';
    setPendingVerify({ contact: trimmed, channel });
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setStep('otp');
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

  const handleConfirmOtpPress = async () => {
    if (isVerifyingOtp || !pendingVerify) return;
    setSubmitError(null);
    const code = otpDigits.join('');
    if (code.length !== OTP_LENGTH) return;

    setIsVerifyingOtp(true);
    try {
      // Demo mode — any 4-digit OTP succeeds (matches mobile vendor login).
      await loginExistingVendor();
      await enterVendorWorkspace();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.pageShell}>
        <View style={[styles.headerBar, compact && styles.headerBarCompact]}>
          <Pressable onPress={() => goToVendorLogin()} style={styles.brandRow} accessibilityRole="button">
            <Image source={HeaderLogo} style={styles.brandLogo} resizeMode="contain" />
            <Text style={styles.brandVendorSuffix}>-vendor</Text>
          </Pressable>

          <View style={[styles.searchSection, compact && styles.searchSectionCompact]}>
            <View style={styles.searchWrap}>
              <Input
                placeholder={VENDOR_ONBOARDING.searchPlaceholder}
                placeholderTextColor="#1C2024"
                style={styles.searchInput}
                editable={false}
              />
              <View style={styles.searchIcon}>
                <Ionicons name="search" size={16} color="#1C2024" />
              </View>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/become-vendor')}
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnBlue, pressed && styles.pressed]}
            >
              <Text style={styles.actionBtnText}>{VENDOR_WORKSPACE_COPY.addListing}</Text>
              <Ionicons name="home" size={24} color={colors.surface.white} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/vendor/(workspace)/listings')}
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnPink, pressed && styles.pressed]}
            >
              <Text style={styles.actionBtnText}>{VENDOR_WORKSPACE_COPY.allListings}</Text>
              <Ionicons name="business" size={24} color={colors.surface.white} />
            </Pressable>

            <View style={styles.profileBtn} accessibilityLabel="Profile">
              <Ionicons name="person-outline" size={20} color={FIGMA_BLUE} />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyScrollContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.mainCard,
              compact && styles.mainCardCompact,
              { width: cardSize.width, height: compact ? undefined : cardSize.height },
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
                    <Text style={styles.propertyLead}>List your Property.</Text>
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
                      {isEmailMode
                        ? 'Enter your Email to continue.'
                        : 'Enter your Phone to continue.'}
                    </Text>

                    <View style={styles.formStack}>
                      <Input
                        value={contactValue}
                        onChangeText={(v) => {
                          setContactValue(v);
                          if (submitError) setSubmitError(null);
                        }}
                        placeholder={
                          isEmailMode ? DEMO_VENDOR_EMAIL : VENDOR_ONBOARDING.defaultPhone
                        }
                        keyboardType={isEmailMode ? 'email-address' : 'phone-pad'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholderTextColor={colors.text.placeholder}
                        style={styles.input}
                      />
                      <Text variant="caption" style={styles.helper}>
                        {isEmailMode
                          ? "You'll get OTP to this email."
                          : "You'll get OTP to this number."}
                      </Text>
                      <Text variant="caption" style={styles.demoHelper}>
                        Demo mode — enter any contact, then use any 4-digit OTP.
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
                      >
                        Get OTP
                      </Button>

                      <Divider style={styles.divider} />

                      <View style={styles.socialStack}>
                        <Button
                          variant="outlineSoft"
                          size="compact"
                          leftAdornment={
                            isEmailMode ? (
                              <MobileIcon width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />
                            ) : (
                              <MailIcon width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />
                            )
                          }
                          onPress={switchLoginMode}
                        >
                          {isEmailMode ? 'Login with phone' : 'Log in with mail'}
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
                      onPress={goBackToCredentials}
                      style={({ pressed }) => [styles.changeContactRow, pressed && styles.pressed]}
                      accessibilityRole="button"
                    >
                      <Text variant="caption" style={styles.changeContactText}>
                        Change {pendingVerify?.channel === 'email' ? 'email' : 'phone'}
                      </Text>
                    </Pressable>

                    <Text variant="heading2" style={styles.title}>
                      Enter OTP
                    </Text>
                    <Text variant="caption" style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
                      OTP sent to {pendingVerify?.contact.trim() || 'your contact'}{' '}
                      {pendingVerify?.channel === 'email' ? 'via email' : 'via SMS'}.
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  pageShell: {
    flex: 1,
    width: '100%',
    maxWidth: FIGMA_PAGE_WIDTH,
    alignSelf: 'center',
    gap: 32,
  },
  headerBar: {
    width: '100%',
    height: FIGMA_HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 42,
    gap: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 7, 20, 0.25)',
    backgroundColor: colors.surface.white,
    zIndex: 10,
  },
  headerBarCompact: {
    gap: 16,
    paddingHorizontal: 16,
    height: 'auto' as unknown as number,
    minHeight: FIGMA_HEADER_HEIGHT,
    flexWrap: 'wrap',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 48,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 189,
    height: 34,
    flexShrink: 0,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  brandLogo: {
    width: 87,
    height: 40,
  },
  brandVendorSuffix: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 24,
    color: FIGMA_VENDOR_SUFFIX,
    marginBottom: 2,
  },
  searchSection: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 80,
    justifyContent: 'center',
  },
  searchSectionCompact: {
    paddingHorizontal: 0,
    flexBasis: '100%',
  },
  searchWrap: {
    position: 'relative',
    width: '100%',
    height: 40,
  },
  searchInput: {
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.8)',
    paddingLeft: 8,
    paddingRight: 40,
    fontSize: 16,
    lineHeight: 24,
  },
  searchIcon: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flexShrink: 0,
  },
  actionBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer' as const,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  actionBtnBlue: {
    backgroundColor: FIGMA_BLUE,
  },
  actionBtnPink: {
    backgroundColor: FIGMA_PINK,
  },
  actionBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 21,
    letterSpacing: 0.56,
    color: colors.surface.white,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(44, 111, 156, 0.8)',
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 24,
    gap: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.2)',
    backgroundColor: colors.surface.white,
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
    flex: 615,
    minHeight: 0,
    position: 'relative',
    backgroundColor: FIGMA_BLUE,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
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
    backgroundColor: FIGMA_BLUE,
    borderRadius: 24,
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
    flex: 501,
    minHeight: 0,
    minWidth: 0,
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
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  title: {
    color: FIGMA_TITLE,
    fontSize: 32,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 24,
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
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 32, 0.1)',
    borderRadius: 6,
    paddingHorizontal: spacing['3'],
  },
  helper: {
    color: colors.neutral.alpha['9'],
    marginTop: -spacing['1'],
    paddingHorizontal: spacing['1'],
  },
  demoHelper: {
    color: 'rgba(28, 32, 36, 0.45)',
    fontSize: 11,
    paddingHorizontal: spacing['1'],
  },
  errorText: {
    color: '#d32f2f',
    paddingHorizontal: spacing['1'],
  },
  primaryCta: {
    width: '100%',
    height: 32,
    borderRadius: 4,
    marginTop: spacing['1'],
    backgroundColor: FIGMA_BLUE,
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
    color: FIGMA_BLUE,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: { opacity: 0.85 },
  changeContactRow: {
    alignSelf: 'flex-start',
    paddingVertical: spacing['1'],
    marginBottom: spacing['2'],
  },
  changeContactText: {
    color: FIGMA_BLUE,
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
    borderColor: 'rgba(15, 26, 32, 0.1)',
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
