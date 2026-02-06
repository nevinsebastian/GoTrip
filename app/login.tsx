import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Input, Button, IconButton, Divider } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/DesignTokens';

import Logo from '@/assets/images/logogotrip.svg';
import MailIcon from '@/assets/images/mail.svg';
import GoogleIcon from '@/assets/images/google.svg';
import AppleIcon from '@/assets/images/apple.svg';
import FacebookIcon from '@/assets/images/facebook.svg';

const SocialIconSize = 20;

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="chevron-back"
          size={20}
          color={colors.primary}
          onPress={() => {}}
        />
        <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
          Log in
        </Text>
      </View>

      <View style={styles.screen}>
        <Card padding="none" style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.logoWrap}>
              <Logo width={130} height={60} />
            </View>

            <View style={styles.copyBlock}>
              <Text variant="bodySemibold" style={styles.welcome}>
                Welcome Back..
              </Text>
              <Text variant="caption" style={styles.subtitle}>
                Enter your Phone number.
              </Text>
            </View>

            <View style={styles.form}>
              <View>
                <Input
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.neutral.alpha['9']}
                  style={styles.phoneInput}
                />
                <Text variant="caption" style={styles.helper}>
                  You’ll get OTP to this number.
                </Text>
              </View>

              <Button
                variant="primary"
                size="compact"
                style={styles.getOtpButton}
                onPress={() => {
                  // TODO: handle OTP
                }}
              >
                Get OTP
              </Button>

              <Divider style={styles.divider} />

              <View style={styles.socialStack}>
                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<MailIcon width={SocialIconSize} height={SocialIconSize} />}
                  onPress={() => {}}
                >
                  Log in with mail
                </Button>

                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<GoogleIcon width={SocialIconSize} height={SocialIconSize} />}
                  onPress={() => {}}
                >
                  Continue with Google
                </Button>

                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<AppleIcon width={SocialIconSize} height={SocialIconSize} />}
                  onPress={() => {}}
                >
                  Continue with Apple
                </Button>

                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<FacebookIcon width={SocialIconSize} height={SocialIconSize} />}
                  onPress={() => {}}
                >
                  Continue with Facebook
                </Button>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray['2'],
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
    paddingBottom: spacing['4'],
    alignItems: 'center',
    minHeight: 0,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.gray['1'],
    borderRadius: borderRadius['6'],
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['5'],
    paddingHorizontal: spacing['5'],
    gap: spacing['4'],
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
    flex: 1,
    width: '100%',
    gap: spacing['3'],
    minHeight: 0,
  },
  phoneInput: {
    height: 40,
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
    borderRadius: borderRadius['2'],
    backgroundColor: colors.accent.main,
    borderWidth: 1,
    borderColor: colors.accent.main,
  },
  divider: {
    marginVertical: spacing['2'],
  },
  socialStack: {
    width: '100%',
    gap: spacing['3'],
  },
});
