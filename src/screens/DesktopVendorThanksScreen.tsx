import { Text } from '@/components/ui';
import { borderRadius, colors, typography } from '@/constants/DesignTokens';
import { DesktopVendorOnboardingShell } from '@/src/components/desktop/DesktopVendorOnboardingShell';
import { DESKTOP_VENDOR_HERO_SPEECH } from '@/src/constants/desktopVendorListingConstants';
import { VENDOR_MOCK_HOST, VENDOR_THANKS_COPY } from '@/src/constants/vendorListingConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const FIELD_BORDER = 'rgba(28, 32, 36, 0.1)';

export function DesktopVendorThanksScreen() {
  const listingCategoryId = useVendorListingCategory();
  const hostName = VENDOR_MOCK_HOST.firstName;

  return (
    <DesktopVendorOnboardingShell
      layout="split"
      listingCategoryId={listingCategoryId}
      heroSpeechText={DESKTOP_VENDOR_HERO_SPEECH.done}
      footer={
        <Pressable
          style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
          onPress={() => router.replace('/vendor/home')}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>{VENDOR_THANKS_COPY.cta}</Text>
        </Pressable>
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Congratulations {hostName}!</Text>
        <Text style={styles.subtitle}>{VENDOR_THANKS_COPY.subtitle}</Text>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to GoTrip {hostName}!</Text>
          <Text style={styles.welcomeBody}>{VENDOR_THANKS_COPY.welcomeBody}</Text>
          <Text style={styles.signature}>{VENDOR_THANKS_COPY.signature}</Text>
        </View>
      </View>
    </DesktopVendorOnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  welcomeCard: {
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 10,
    backgroundColor: colors.surface.white,
  },
  welcomeTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  welcomeBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(28, 32, 36, 0.65)',
  },
  signature: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
    textAlign: 'right',
  },
  ctaButton: {
    width: '100%',
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  pressed: { opacity: 0.85 },
});

