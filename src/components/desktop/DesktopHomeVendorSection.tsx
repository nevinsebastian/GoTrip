import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DESKTOP_VENDOR_LANDING } from '@/src/constants/desktopWebConstants';
import { VENDOR_ONBOARDING } from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import ArrowTopRight from '@/assets/images/arrow-top-right.svg';

const VendorHeroImage = require('../../../assets/images/desktop-web/vendor-hero.jpg');
const DiscoverImage = require('../../../assets/images/desktop-web/vendor-discover.jpg');

const ACCENT = '#E54D2E';

const FEATURE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  payments: 'card-outline',
  risk: 'alert-decagram-outline',
  rules: 'clipboard-text-outline',
  steps: 'play-forward-outline',
};

export function DesktopHomeVendorSection() {
  const handleStart = () => {
    router.push('/become-vendor');
  };

  return (
    <View style={styles.outer}>
      <View style={styles.frame}>
        <View style={styles.heroImageWrap} pointerEvents="none">
          <Image source={VendorHeroImage} style={styles.heroImage} resizeMode="cover" />
        </View>

        <View style={styles.content}>
          <Text style={styles.landingTitle}>{VENDOR_ONBOARDING.landingTitle}</Text>

          <View style={styles.accentRow}>
            <View style={styles.accentPrimary} />
            <View style={styles.accentMuted} />
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.headline}>
              {VENDOR_ONBOARDING.landingHeadline.replace('. ', '.\n')}
            </Text>

            <Text style={styles.earnings}>
              {VENDOR_ONBOARDING.earningsPrefix}
              <Text style={styles.earningsAmount}>{VENDOR_ONBOARDING.earningsAmount}</Text>
            </Text>

            <View style={styles.featureList}>
              {VENDOR_ONBOARDING.features.map((feature) => (
                <View key={feature.id} style={styles.featureRow}>
                  <Ionicons
                    name={FEATURE_ICONS[feature.id] ?? feature.icon}
                    size={20}
                    color={ACCENT}
                  />
                  <Text style={styles.featureText}>{feature.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.ctaRow}>
              <Pressable style={styles.primaryCta} onPress={handleStart}>
                <Text style={styles.primaryCtaText}>Become a Vendor</Text>
                <View style={styles.primaryCtaIcon}>
                  <ArrowTopRight width={14} height={14} />
                </View>
              </Pressable>
              <Pressable style={styles.helpBtn}>
                <Ionicons name="help-circle-outline" size={18} color={colors.text.primary} />
                <Text style={styles.helpText}>{DESKTOP_VENDOR_LANDING.help}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.discoverBanner}>
            <View style={styles.discoverThumbWrap}>
              <Image source={DiscoverImage} style={styles.discoverImage} resizeMode="cover" />
            </View>

            <View style={styles.discoverCopy}>
              <Text style={styles.discoverTitle}>{DESKTOP_VENDOR_LANDING.discoverTitle}</Text>
              <View style={styles.discoverBottomRow}>
                <Text style={styles.discoverBody}>{DESKTOP_VENDOR_LANDING.discoverBody}</Text>
                <Pressable style={styles.exploreBtn}>
                  <Text style={styles.exploreText}>{DESKTOP_VENDOR_LANDING.exploreMore}</Text>
                  <View style={styles.exploreIcon}>
                    <ArrowTopRight width={12} height={12} />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    marginTop: 72,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  frame: {
    width: '100%',
    maxWidth: 1280,
    backgroundColor: 'rgba(229, 77, 46, 0.05)',
    borderRadius: 24,
    padding: 42,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 721,
  },
  heroImageWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 615,
    height: 721,
    overflow: 'hidden',
  },
  heroImage: {
    position: 'absolute',
    right: -42,
    width: 714,
    height: 721,
  },
  content: {
    gap: 36,
    zIndex: 1,
    maxWidth: '100%',
  },
  landingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 32,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 51,
  },
  accentRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 551,
  },
  accentPrimary: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
  accentMuted: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.surface.white,
  },
  copyBlock: {
    gap: 28,
    maxWidth: 551,
  },
  headline: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    color: ACCENT,
    lineHeight: 31,
    maxWidth: 505,
  },
  earnings: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 24,
  },
  earningsAmount: {
    textDecorationLine: 'underline',
  },
  featureList: {
    gap: 0,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 10,
  },
  featureText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    lineHeight: 24,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 18,
    backgroundColor: ACCENT,
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 9999,
    paddingVertical: 8,
    paddingLeft: 18,
    paddingRight: 8,
    width: 228,
    minHeight: 48,
  },
  primaryCtaText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
  primaryCtaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.text.primary,
    borderRadius: 24,
    paddingHorizontal: 12,
    width: 228,
    minHeight: 48,
  },
  helpText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 20,
  },
  discoverBanner: {
    backgroundColor: colors.surface.white,
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 12.5px rgba(0, 0, 0, 0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  discoverThumbWrap: {
    width: 200,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface.white,
    flexShrink: 0,
  },
  discoverImage: {
    width: '100%',
    height: '100%',
  },
  discoverCopy: {
    flex: 1,
    gap: 8,
    paddingVertical: 8,
    minWidth: 0,
  },
  discoverTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 16,
    letterSpacing: 0.04,
  },
  discoverBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  discoverBody: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.8)',
    lineHeight: 16,
    letterSpacing: 0.04,
    minWidth: 200,
    maxWidth: 644,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    backgroundColor: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 9999,
    paddingVertical: 8,
    paddingLeft: 18,
    paddingRight: 8,
    flexShrink: 0,
  },
  exploreText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    letterSpacing: 0.04,
  },
  exploreIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
