import React, { useState } from 'react';
import { View, StyleSheet, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
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

const logoWidth = isIOS ? 150 : 130;
const logoHeight = isIOS ? 69 : 60;
const socialIconSize = isIOS ? 22 : 20;

type LoginMode = 'phone' | 'email';

export default function LoginScreen() {
  const [loginMode, setLoginMode] = useState<LoginMode>('phone');
  const [inputValue, setInputValue] = useState('');

  const isEmailMode = loginMode === 'email';

  const switchMode = () => {
    setInputValue('');
    setLoginMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

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
              onPress={() => router.replace('/signup')}
            />
            <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
              Log in
            </Text>
          </View>

          <View style={styles.screen}>
            <Card padding="none" style={styles.card}>
              <View style={[styles.cardInner, !isWeb && styles.cardInnerNative, isIOS && styles.cardInnerIos]}>
                <View style={styles.logoWrap}>
                  <Logo width={logoWidth} height={logoHeight} />
                </View>

                <View style={styles.copyBlock}>
                  <Text variant="bodySemibold" style={styles.welcome}>
                    Welcome Back..
                  </Text>
                  <Text variant="caption" style={styles.subtitle}>
                    {isEmailMode ? 'Enter your Email.' : 'Enter your Phone number.'}
                  </Text>
                </View>

                <View style={styles.form}>
                  <View>
                    <Input
                      placeholder={isEmailMode ? 'Email' : 'Phone number'}
                      keyboardType={isEmailMode ? 'email-address' : 'phone-pad'}
                      placeholderTextColor={colors.neutral.alpha['9']}
                      style={styles.phoneInput}
                      value={inputValue}
                      onChangeText={setInputValue}
                    />
                    <Text variant="caption" style={styles.helper}>
                      {isEmailMode ? "You'll get OTP to this email." : "You'll get OTP to this number."}
                    </Text>
                  </View>

                  <Button
                    variant="primary"
                    size="default"
                    style={styles.getOtpButton}
                    onPress={() =>
                      router.push({
                        pathname: '/otp',
                        params: {
                          contact: inputValue,
                          isEmail: isEmailMode ? '1' : '0',
                        },
                      })
                    }
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
                          <MobileIcon width={socialIconSize} height={socialIconSize} />
                        ) : (
                          <MailIcon width={socialIconSize} height={socialIconSize} />
                        )
                      }
                      onPress={switchMode}
                    >
                      {isEmailMode ? 'Login with phone' : 'Log in with mail'}
                    </Button>

                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={<GoogleIcon width={socialIconSize} height={socialIconSize} />}
                      onPress={() => {}}
                    >
                      Continue with Google
                    </Button>

                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={<AppleIcon width={socialIconSize} height={socialIconSize} />}
                      onPress={() => {}}
                    >
                      Continue with Apple
                    </Button>

                    <Button
                      variant="outlineSoft"
                      size="compact"
                      leftAdornment={<FacebookIcon width={socialIconSize} height={socialIconSize} />}
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
  phoneInput: {
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
  getOtpButton: {
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
