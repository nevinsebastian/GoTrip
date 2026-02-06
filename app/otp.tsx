import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card, Text, Input, Button, IconButton } from '@/components/ui';
import { colors, spacing, borderRadius, components } from '@/constants/DesignTokens';

import Logo from '@/assets/images/logogotrip.svg';

const isIOS = Platform.OS === 'ios';
const OTP_LENGTH = 4;

export default function OtpScreen() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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
    const code = digits.join('');
    if (code.length === OTP_LENGTH) {
      // TODO: verify OTP and navigate to main app
    }
  };

  const code = digits.join('');
  const canConfirm = code.length === OTP_LENGTH;

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
                  OTP sent to +91 97******10 via SMS
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
                  You&apos;ll get OTP in this number.
                </Text>

                <Button
                  variant="primary"
                  size="default"
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                  disabled={!canConfirm}
                >
                  Confirm
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
  confirmButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    borderWidth: 0,
    marginTop: spacing['2'],
  },
});
