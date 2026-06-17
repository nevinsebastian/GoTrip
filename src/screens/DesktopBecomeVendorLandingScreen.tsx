import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import {
  DESKTOP_VENDOR_LANDING,
  DESKTOP_WEB_COLORS,
} from '@/src/constants/desktopWebConstants';
import { VENDOR_ONBOARDING } from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowTopRight from '@/assets/images/arrow-top-right.svg';

const HeroImage = require('../../assets/images/backgroundimagehomehotels.jpg');
const DiscoverImage = require('../../assets/images/glampingoffer.jpg');

type DesktopBecomeVendorLandingScreenProps = {
  onStart: () => void;
};

export function DesktopBecomeVendorLandingScreen({ onStart }: DesktopBecomeVendorLandingScreenProps) {
  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.split}>
          <View style={styles.leftPanel}>
            <Text style={styles.landingTitle}>{VENDOR_ONBOARDING.landingTitle}</Text>
            <View style={styles.leftAccent} />
            <Text style={styles.headline}>{VENDOR_ONBOARDING.landingHeadline}</Text>
            <Text style={styles.earnings}>
              {VENDOR_ONBOARDING.earningsPrefix}
              <Text style={styles.earningsAmount}>{VENDOR_ONBOARDING.earningsAmount}</Text>
            </Text>

            <View style={styles.featureList}>
              {VENDOR_ONBOARDING.features.map((feature) => (
                <View key={feature.id} style={styles.featureRow}>
                  <Ionicons name={feature.icon} size={18} color={DESKTOP_WEB_COLORS.accentLine} />
                  <Text style={styles.featureText}>{feature.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.ctaRow}>
              <Pressable style={styles.primaryCta} onPress={onStart}>
                <Text style={styles.primaryCtaText}>Become a Vendor</Text>
                <View style={styles.primaryCtaIcon}>
                  <ArrowTopRight width={14} height={14} />
                </View>
              </Pressable>
              <Pressable style={styles.helpBtn}>
                <Ionicons name="help-circle-outline" size={16} color={colors.text.caption} />
                <Text style={styles.helpText}>{DESKTOP_VENDOR_LANDING.help}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.rightPanel}>
            <View style={styles.rightAccent} />
            <Image source={HeroImage} style={styles.rightImage} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.discoverBanner}>
          <Image source={DiscoverImage} style={styles.discoverImage} resizeMode="cover" />
          <View style={styles.discoverCopy}>
            <Text style={styles.discoverTitle}>{DESKTOP_VENDOR_LANDING.discoverTitle}</Text>
            <Text style={styles.discoverBody}>{DESKTOP_VENDOR_LANDING.discoverBody}</Text>
          </View>
          <Pressable style={styles.exploreBtn}>
            <Text style={styles.exploreText}>{DESKTOP_VENDOR_LANDING.exploreMore}</Text>
            <View style={styles.exploreIcon}>
              <ArrowTopRight width={12} height={12} />
            </View>
          </Pressable>
        </View>

        <DesktopSiteFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: DESKTOP_WEB_COLORS.vendorPanel,
  },
  scroll: {
    flexGrow: 1,
  },
  split: {
    flexDirection: 'row',
    minHeight: 560,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: DESKTOP_WEB_COLORS.vendorPanel,
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 120,
    justifyContent: 'center',
    gap: 20,
    minWidth: 360,
  },
  landingTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 32,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: typography.fontWeight.medium,
  },
  leftAccent: {
    height: 1,
    backgroundColor: DESKTOP_WEB_COLORS.accentLine,
    width: '100%',
  },
  headline: {
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: DESKTOP_WEB_COLORS.accentLine,
    lineHeight: 36,
  },
  earnings: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    color: 'rgba(255,255,255,0.45)',
  },
  earningsAmount: {
    textDecorationLine: 'underline',
    color: 'rgba(255,255,255,0.55)',
  },
  featureList: {
    gap: 14,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: DESKTOP_WEB_COLORS.accentLine,
    borderRadius: 999,
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 8,
  },
  primaryCtaText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
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
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  helpText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.caption,
  },
  rightPanel: {
    flex: 1,
    minWidth: 360,
    position: 'relative',
  },
  rightAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.surface.white,
    zIndex: 2,
  },
  rightImage: {
    width: '100%',
    height: '100%',
    minHeight: 560,
  },
  discoverBanner: {
    marginTop: -72,
    marginHorizontal: 48,
    marginBottom: 48,
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    zIndex: 5,
  },
  discoverImage: {
    width: 140,
    height: 88,
    borderRadius: 12,
  },
  discoverCopy: {
    flex: 1,
    gap: 8,
    minWidth: 200,
  },
  discoverTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  discoverBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DESKTOP_WEB_COLORS.vendorPanel,
    borderRadius: 999,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 8,
  },
  exploreText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  exploreIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
