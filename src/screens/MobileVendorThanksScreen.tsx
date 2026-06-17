import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorOnboardingHero } from '@/src/components/vendor/VendorOnboardingHero';
import { VENDOR_MOCK_HOST, VENDOR_THANKS_COPY } from '@/src/constants/vendorListingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function MobileVendorThanksScreen() {
  const hostName = VENDOR_MOCK_HOST.firstName;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <VendorOnboardingHero
            categoryId="property"
            hostOverlay={{
              label: 'Your host',
              name: VENDOR_MOCK_HOST.fullName,
              avatar: VENDOR_MOCK_HOST.avatar,
            }}
          />

          <Text style={styles.title}>Congratulations {hostName}!</Text>
          <Text style={styles.subtitle}>{VENDOR_THANKS_COPY.subtitle}</Text>

          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome to GoTrip {hostName}!</Text>
            <Text style={styles.welcomeBody}>{VENDOR_THANKS_COPY.welcomeBody}</Text>
            <Text style={styles.signature}>{VENDOR_THANKS_COPY.signature}</Text>
          </View>

          <Text style={styles.verificationNote}>{VENDOR_THANKS_COPY.verificationNote}</Text>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>{VENDOR_THANKS_COPY.cta}</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="arrow-forward" size={16} color={colors.accent.main} />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: 10,
    paddingBottom: spacing['4'],
    gap: 14,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  welcomeCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 10,
    backgroundColor: colors.surface.white,
  },
  welcomeTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  welcomeBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 17,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  signature: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    textAlign: 'right',
  },
  verificationNote: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    textAlign: 'center',
    paddingHorizontal: spacing['2'],
  },
  footer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    paddingTop: spacing['2'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
  },
  ctaButton: {
    height: 48,
    borderRadius: 28,
    backgroundColor: colors.accent.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['4'],
    gap: 10,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  ctaText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    textAlign: 'center',
  },
  ctaIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});
