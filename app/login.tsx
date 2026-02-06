import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Input, Button, IconButton, Divider } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/DesignTokens';

import Logo from '@/assets/images/logogotrip.svg';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        {/* Header (chevron-left + title, left aligned) */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-back"
            size={16}
            color={colors.accent.main}
            onPress={() => {
              // TODO: wire navigation
            }}
          />
          <Text variant="bodySemibold" style={styles.headerTitle}>
            Log in
          </Text>
        </View>

        {/* Main content card */}
        <Card padding="none" style={styles.card}>
          <View style={styles.cardInner}>
            <Logo width={65} height={30} />

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
                  leftAdornment={<Image source={{ uri: 'https://www.figma.com/api/mcp/asset/9dbcf19b-9c52-45bf-9bfa-9761f181ec9f' }} style={styles.icon16} />}
                  onPress={() => {}}
                >
                  Log in with mail
                </Button>

                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<Image source={{ uri: 'https://www.figma.com/api/mcp/asset/f4d17cfe-afb9-4971-aeb8-be70ad02b40b' }} style={styles.icon16} />}
                  onPress={() => {}}
                >
                  Continue with Google
                </Button>

                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<Image source={{ uri: 'https://www.figma.com/api/mcp/asset/9adda6dd-5997-4ea7-8226-84ecb6e7d591' }} style={styles.icon24} />}
                  onPress={() => {}}
                >
                  Continue with Apple
                </Button>

                <Button
                  variant="outlineSoft"
                  size="compact"
                  leftAdornment={<Image source={{ uri: 'https://www.figma.com/api/mcp/asset/154b7da3-4e63-4650-a2c2-a7a8cf353bb1' }} style={styles.icon24} />}
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
  screen: {
    flex: 1,
    // Figma: px 17, py 45, gap 32, centered
    paddingHorizontal: 17,
    paddingVertical: 45,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 340,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing['4'],
    marginBottom: spacing['6'],
    gap: spacing['3'],
  },
  headerTitle: {
    color: colors.accent.main,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.gray['1'],
    borderRadius: borderRadius['6'],
    // Card shadow in Figma is subtle; keep Card's existing shadow behavior.
  },
  cardInner: {
    alignItems: 'center',
    paddingTop: spacing['8'],
    paddingBottom: spacing['7'],
    paddingHorizontal: spacing['4'],
    gap: spacing['8'],
  },
  copyBlock: {
    width: '100%',
    gap: 2,
  },
  welcome: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.neutral.alpha['9'],
  },
  form: {
    width: '100%',
    gap: spacing['4'],
  },
  phoneInput: {
    height: 40,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.neutral.alpha['5'],
    borderRadius: borderRadius['3'],
    paddingHorizontal: spacing['2'],
    // keep RN TextInput baseline padding minimal to match Figma
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
    marginVertical: 0,
  },
  socialStack: {
    width: '100%',
    gap: spacing['4'],
  },
  icon16: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  icon24: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
