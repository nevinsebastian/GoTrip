import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card, Text, Input, Button, IconButton, Divider } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/DesignTokens';

import Logo from '@/assets/images/logogotrip.svg';
import MailIcon from '@/assets/images/mail.svg';
import MobileIcon from '@/assets/images/mobile.svg';
import GoogleIcon from '@/assets/images/google.svg';
import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';

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

  const { logoWidth, logoHeight, socialIconSize } = useSignupSizes();
  const isEmailMode = signupMode === 'email';

  const switchMode = () => {
    setContactValue('');
    setSignupMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

  const goToLogin = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.touchableWrap}>
          <View style={styles.header}>
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

                  <Button
                    variant="primary"
                    size="default"
                    style={styles.signupButton}
                    onPress={() => router.push('/otp')}
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
        </View>
      </TouchableWithoutFeedback>
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
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['2'],
    minHeight: 48,
    backgroundColor: colors.gray['2'],
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
