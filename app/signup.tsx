import { Button, Card, Divider, IconButton, Input, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import Logo from '@/assets/images/logogotrip.svg';
import MailIcon from '@/assets/images/mail.svg';
import MobileIcon from '@/assets/images/mobile.svg';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { getErrorMessage } from '@/src/utils/errorHandler';

const isWeb = Platform.OS === 'web';
const isIOS = Platform.OS === 'ios';

type SignupMode = 'phone' | 'email';

function useSignupSizes() {
  const { width } = useWindowDimensions();
  const isNarrow = width < 380;
  const logoWidth = isIOS ? 150 : isNarrow ? 110 : 130;
  const logoHeight = isIOS ? 69 : isNarrow ? 51 : 60;
  const socialIconSize = isIOS ? 22 : 20;
  return { logoWidth, logoHeight, socialIconSize };
}

export default function SignupScreen() {
  const [signupMode, setSignupMode] = useState<SignupMode>('phone');
  const [fullName, setFullName] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { logoWidth, logoHeight, socialIconSize } = useSignupSizes();
  const isEmailMode = signupMode === 'email';

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const switchMode = () => {
    setContactValue('');
    setSignupMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

  const goToLogin = () => {
    router.replace('/login');
  };

  const wrap = (content: React.ReactNode) =>
    isWeb ? (
      <View style={styles.touchableWrap}>{content}</View>
    ) : (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.touchableWrap}>{content}</View>
      </TouchableWithoutFeedback>
    );

  const handleSignup = () => {
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
        channel: isEmailMode ? 'email' : 'phone',
        ...(isEmailMode ? { email: trimmedContact } : { phone: trimmedContact }),
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            router.push({
              pathname: '/otp',
              params: {
                contact: trimmedContact,
                isEmail: isEmailMode ? '1' : '0',
                fullName: trimmedName,
              },
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {wrap(
        <>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <IconButton
                icon="chevron-back"
                size={isIOS ? 24 : 20}
                color={colors.primary}
                onPress={goToLogin}
              />
              <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
                Sign up
              </Text>
            </View>
            <Pressable onPress={() => router.replace('/(tabs)')} accessibilityLabel="Skip signup">
              <Text variant="bodySemibold" color="primaryBrand">
                Skip
              </Text>
            </Pressable>
          </View>

          <View style={styles.screen}>
            <Card padding="none" style={styles.card}>
              <View
                style={[
                  styles.cardInner,
                  !isWeb && styles.cardInnerNative,
                  isIOS && styles.cardInnerIos,
                ]}
              >
                <View style={styles.logoWrap}>
                  <Logo width={logoWidth} height={logoHeight} />
                </View>

                <View style={styles.copyBlock}>
                  <Text variant="bodySemibold" style={styles.welcome}>
                    Create your account..
                  </Text>
                  <Text variant="caption" style={styles.subtitle}>
                    {isEmailMode
                      ? 'Enter your Email.'
                      : 'Enter your Phone number.'}
                  </Text>
                </View>

                <View style={styles.form}>
                  <View>
                    <Input
                      placeholder="Full name"
                      placeholderTextColor={colors.neutral.alpha['9']}
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View>
                    <Input
                      placeholder={
                        isEmailMode ? 'Email' : 'Phone number'
                      }
                      keyboardType={
                        isEmailMode ? 'email-address' : 'phone-pad'
                      }
                      placeholderTextColor={colors.neutral.alpha['9']}
                      style={styles.textInput}
                      value={contactValue}
                      onChangeText={setContactValue}
                    />
                    <Text variant="caption" style={styles.helper}>
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

                  <Button
                    variant="primary"
                    size="default"
                    style={styles.signupButton}
                    onPress={handleSignup}
                    disabled={isSendingOtp}
                  >
                    Sign up
                  </Button>

                  <Divider style={styles.divider} />

                  <View style={styles.socialStack}>
                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={
                        isEmailMode ? (
                          <MobileIcon
                            width={socialIconSize}
                            height={socialIconSize}
                          />
                        ) : (
                          <MailIcon
                            width={socialIconSize}
                            height={socialIconSize}
                          />
                        )
                      }
                      onPress={switchMode}
                    >
                      {isEmailMode
                        ? 'Sign up with phone'
                        : 'Sign up with mail'}
                    </Button>

                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={
                        <GoogleIcon
                          width={socialIconSize}
                          height={socialIconSize}
                        />
                      }
                      onPress={() => {}}
                    >
                      Continue with Google
                    </Button>

                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={
                        <AppleIcon
                          width={socialIconSize}
                          height={socialIconSize}
                        />
                      }
                      onPress={() => {}}
                    >
                      Continue with Apple
                    </Button>

                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={
                        <FacebookIcon
                          width={socialIconSize}
                          height={socialIconSize}
                        />
                      }
                      onPress={() => {}}
                    >
                      Continue with Facebook
                    </Button>
                  </View>
                </View>
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
  screen: {
    flex: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['6'],
    paddingBottom: spacing['4'],
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['2'],
    minHeight: 48,
    backgroundColor: colors.gray['2'],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: spacing['2'],
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
  cardInnerNative: {
    paddingBottom: spacing['8'],
  },
  cardInnerIos: {
    paddingVertical: spacing['6'],
    paddingHorizontal: spacing['6'],
    gap: spacing['5'],
  },
  logoWrap: {
    marginBottom: spacing['2'],
  },
  copyBlock: {
    width: '100%',
    gap: 2,
    marginBottom: spacing['2'],
  },
  welcome: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.neutral.alpha['9'],
  },
  form: {
    width: '100%',
    gap: spacing['3'],
  },
  textInput: {
    ...Platform.select({
      ios: { height: 44 },
      default: { height: 40 },
    }),
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.neutral.alpha['5'],
    borderRadius: borderRadius['3'],
    paddingHorizontal: spacing['2'],
    paddingVertical: 0,
  },
  helper: {
    color: colors.neutral.alpha['9'],
    paddingHorizontal: spacing['2'],
    marginTop: spacing['1'],
  },
  errorText: {
    color: '#d32f2f',
    paddingHorizontal: spacing['2'],
  },
  signupButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  divider: {
    marginVertical: spacing['2'],
  },
  socialStack: {
    width: '100%',
    gap: spacing['3'],
  },
});
