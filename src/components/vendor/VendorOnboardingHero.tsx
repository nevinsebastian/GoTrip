import { colors, spacing, typography } from '@/constants/DesignTokens';
import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import BellLoginIcon from '@/assets/images/login-figma/bell-login.svg';
import HotelIcon from '@/assets/images/login-figma/hotel-icon.svg';
import HotelsDividerIcon from '@/assets/images/login-figma/hotels-divider.svg';
import MenuLoginIcon from '@/assets/images/login-figma/menu-login.svg';
import SpeechBubbleIcon from '@/assets/images/login-figma/speech-bubble.svg';
import { Text } from '@/components/ui';
import {
  getVendorListingCategory,
  VENDOR_ONBOARDING,
  type VendorListingCategoryId,
} from '@/src/constants/vendorOnboardingConstants';

const DefaultHeroImage = require('../../../loginimage.png');
const HeaderLogo = require('../../../assets/images/login-figma/logo-header.png');
const HeroLogoWhite = require('../../../assets/images/login-figma/logo-hero-white.png');

const DESIGN_WIDTH = 402;
const HERO_HEIGHT = 327;
const isWeb = Platform.OS === 'web';

type VendorOnboardingHeroProps = {
  categoryId?: VendorListingCategoryId;
};

export function VendorOnboardingHero({ categoryId }: VendorOnboardingHeroProps) {
  const category = categoryId ? getVendorListingCategory(categoryId) : null;
  const heroImage = category?.heroImage ?? DefaultHeroImage;
  const pillLabel = category?.pillLabel ?? 'Hotels';
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const heroHeight = Math.round(HERO_HEIGHT * scale);
  const headerLogoWidth = Math.round(68 * scale);
  const headerLogoHeight = Math.round(32 * scale);
  const heroLogoWidth = Math.round(78 * scale);
  const heroLogoHeight = Math.round(36 * scale);
  const speechBubbleWidth = Math.round(248 * scale);
  const speechBubbleHeight = Math.round(36 * scale);

  return (
    <>
      <View style={styles.orangeFrame}>
        <View style={styles.topBar}>
          <Image
            source={HeaderLogo}
            style={{ width: headerLogoWidth, height: headerLogoHeight }}
            resizeMode="contain"
          />
          <View style={styles.topBarActions}>
            <View style={styles.headerIconButton}>
              <BellLoginIcon width={18} height={18} />
            </View>
            <View style={styles.headerIconButton}>
              <MenuLoginIcon width={24} height={24} />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.orangeFrameHero, { height: heroHeight }]}>
        <ImageBackground
          key={categoryId ?? 'default'}
          source={heroImage}
          style={[
            styles.heroImage,
            {
              left: Math.round(-16 * scale),
              top: Math.round(-48 * scale),
              width: Math.round(405 * scale),
              height: Math.round(573 * scale),
            },
          ]}
          resizeMode="cover"
        />

        <View style={[styles.heroContent, { top: Math.round(28 * scale) }]}>
          <Image
            source={HeroLogoWhite}
            style={[
              { width: heroLogoWidth, height: heroLogoHeight },
              styles.heroLogoWhite,
              isWeb ? (styles.heroLogoWeb as object) : null,
            ]}
            resizeMode="contain"
          />

          <View
            style={[
              styles.speechBubbleWrap,
              { width: speechBubbleWidth, height: speechBubbleHeight },
            ]}
          >
            <SpeechBubbleIcon
              width={speechBubbleWidth}
              height={speechBubbleHeight}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.speechBubbleRow}>
              <Text style={styles.speechText}>{VENDOR_ONBOARDING.speechBubble}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.hotelsPill, { bottom: Math.round(14 * scale) }]}>
          <View style={styles.hotelsDividerWrap}>
            <HotelsDividerIcon width={21} height={6} />
          </View>
          <HotelIcon width={18} height={18} />
          <Text style={styles.hotelsPillText}>{pillLabel}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  orangeFrame: {
    backgroundColor: colors.accent.main,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    padding: 12,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: 10,
    padding: 12,
    width: '100%',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  headerIconButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangeFrameHero: {
    backgroundColor: colors.accent.main,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
  },
  heroContent: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 7,
    zIndex: 1,
  },
  heroLogoWhite: {
    tintColor: colors.surface.white,
  },
  heroLogoWeb: {
    filter: 'brightness(0) invert(1)',
  },
  speechBubbleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3'],
    maxWidth: '100%',
  },
  speechText: {
    flexShrink: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['3'],
    letterSpacing: typography.letterSpacing['3'],
    color: colors.surface.white,
    textAlign: 'center',
  },
  hotelsPill: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(28, 32, 36, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 1,
    ...Platform.select({
      web: { backdropFilter: 'blur(3px)' as unknown as undefined },
    }),
  },
  hotelsDividerWrap: {
    width: 6,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
  hotelsPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight['1'],
    letterSpacing: typography.letterSpacing['1'],
    color: colors.surface.white,
  },
});
