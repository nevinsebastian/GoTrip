import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card, Text, Input, Button, IconButton } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/DesignTokens';

const isIOS = Platform.OS === 'ios';

export default function OtpScreen() {
  const [code, setCode] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // TODO: verify OTP and navigate to main app
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
              onPress={handleBack}
            />
            <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
              Enter OTP
            </Text>
          </View>

          <View style={styles.screen}>
            <Card padding="none" style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.copyBlock}>
                  <Text variant="bodySemibold" style={styles.title}>
                    Verify your number
                  </Text>
                  <Text variant="caption" style={styles.subtitle}>
                    We&apos;ve sent a verification code to your phone. Enter it below to continue.
                  </Text>
                </View>

                <View style={styles.otpBlock}>
                  <Input
                    placeholder="••••"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={code}
                    onChangeText={setCode}
                    style={styles.otpInput}
                    textAlign="center"
                  />
                </View>

                <Button
                  variant="primary"
                  size="default"
                  style={styles.continueButton}
                  onPress={handleContinue}
                >
                  Continue
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
    gap: spacing['5'],
  },
  copyBlock: {
    width: '100%',
    gap: spacing['2'],
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.neutral.alpha['9'],
  },
  otpBlock: {
    width: '100%',
    alignItems: 'center',
  },
  otpInput: {
    width: '60%',
    ...Platform.select({
      ios: { height: 48 },
      default: { height: 44 },
    }),
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.neutral.alpha['5'],
    borderRadius: borderRadius['3'],
    fontSize: 20,
    letterSpacing: 8,
  },
  continueButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
});

