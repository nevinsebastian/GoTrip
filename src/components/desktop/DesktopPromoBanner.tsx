import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DESKTOP_WEB_IMAGES } from '@/src/constants/desktopHomeConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Platform, Pressable, StyleSheet, View } from 'react-native';

export function DesktopPromoBanner() {
  return (
    <View style={styles.outer}>
      <View style={styles.carouselNav}>
        <Pressable style={styles.arrowBtn} accessibilityLabel="Previous">
          <Ionicons name="chevron-back" size={16} color={colors.text.primary} />
        </Pressable>
        <Pressable style={[styles.arrowBtn, styles.arrowBtnRight]} accessibilityLabel="Next">
          <Ionicons name="chevron-forward" size={16} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.bannerWrap}>
        <ImageBackground
          source={DESKTOP_WEB_IMAGES.promoCarouselBg}
          style={styles.banner}
          imageStyle={styles.bannerImage}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <View style={styles.copyCol}>
              <Text style={styles.grabUpto}>Grab upto</Text>
              <Text style={styles.headline}>Enjoy Up to 60% OFF* on Hotel Bookings</Text>
              <Text style={styles.discount}>₹ 1500/- off</Text>
            </View>

            <View style={styles.codePill}>
              <Ionicons name="copy-outline" size={18} color={colors.surface.white} />
              <Text style={styles.codeText}>Use code: GTFIRST100</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    maxWidth: 1097,
    alignSelf: 'center',
    marginTop: 72,
    marginBottom: 8,
    position: 'relative',
    minHeight: 171,
    justifyContent: 'center',
  },
  carouselNav: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    pointerEvents: 'box-none',
  },
  arrowBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
      default: {},
    }),
  },
  arrowBtnRight: {
    alignSelf: 'center',
    marginLeft: 'auto',
  },
  bannerWrap: {
    marginHorizontal: 70,
    borderRadius: 16,
    overflow: 'hidden',
  },
  banner: {
    minHeight: 159,
    justifyContent: 'center',
  },
  bannerImage: {
    borderRadius: 16,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingVertical: 30,
    gap: 24,
    zIndex: 1,
    flexWrap: 'wrap',
  },
  copyCol: {
    gap: 18,
    maxWidth: 390,
  },
  grabUpto: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
    lineHeight: 23,
  },
  headline: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.regular,
    color: colors.surface.white,
    lineHeight: 14,
  },
  discount: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
    lineHeight: 25,
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 42,
  },
  codeText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.surface.white,
  },
});
