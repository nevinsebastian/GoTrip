import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import {
  DESKTOP_FOOTER_COLUMNS,
  DESKTOP_FOOTER_DESCRIPTION,
  DESKTOP_WEB_COLORS,
} from '@/src/constants/desktopWebConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

const WebLogo = require('../../../assets/images/login-figma/logo-hero-white.png');

export function DesktopSiteFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.accentLine}>
        <View style={styles.accentLinePrimary} />
        <View style={styles.accentLineMuted} />
      </View>

      <View style={styles.inner}>
        <View style={styles.linkGrid}>
          {DESKTOP_FOOTER_COLUMNS.map((col) => (
            <View key={col.title} style={styles.linkCol}>
              <Text style={styles.colTitle}>{col.title}</Text>
              {col.links.map((link) => (
                <Pressable key={link} accessibilityRole="button">
                  <Text style={styles.colLink}>{link}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.appBar}>
          <View style={styles.storeRow}>
            <Pressable style={styles.storeBtn}>
              <Ionicons name="logo-google-playstore" size={18} color={colors.surface.white} />
              <View>
                <Text style={styles.storeSmall}>Android app on</Text>
                <Text style={styles.storeLabel}>Google Play</Text>
              </View>
            </Pressable>
            <Pressable style={styles.storeBtn}>
              <Ionicons name="logo-apple" size={18} color={colors.surface.white} />
              <View>
                <Text style={styles.storeSmall}>iOS app on</Text>
                <Text style={styles.storeLabel}>App Store</Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.regionRow}>
            <Pressable style={styles.regionBtn}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.regionText}>INDIA</Text>
            </Pressable>
            <Pressable style={styles.regionBtn}>
              <View style={styles.rupeeIcon}>
                <Text style={styles.rupee}>₹</Text>
              </View>
              <Text style={styles.regionText}>INR</Text>
              <Ionicons name="chevron-down" size={14} color={colors.surface.white} />
            </Pressable>
          </View>
        </View>

        <View style={styles.brandRow}>
          <Image source={WebLogo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.description}>{DESKTOP_FOOTER_DESCRIPTION}</Text>
        </View>

        <Text style={styles.copyright}>© Copyright 2026 Gotrip Holiday - All Rights Reserved</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: DESKTOP_WEB_COLORS.footerBg,
    marginTop: 48,
  },
  accentLine: {
    flexDirection: 'row',
    height: 2,
  },
  accentLinePrimary: {
    flex: 1,
    backgroundColor: DESKTOP_WEB_COLORS.accentLine,
  },
  accentLineMuted: {
    flex: 1,
    backgroundColor: DESKTOP_WEB_COLORS.accentLineMuted,
  },
  inner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 32,
  },
  linkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    justifyContent: 'space-between',
  },
  linkCol: {
    minWidth: 160,
    flex: 1,
    gap: 10,
  },
  colTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: DESKTOP_WEB_COLORS.footerHeading,
    marginBottom: 4,
  },
  colLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: DESKTOP_WEB_COLORS.footerText,
    lineHeight: 22,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: DESKTOP_WEB_COLORS.footerBar,
    borderRadius: 16,
    padding: 16,
  },
  storeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  storeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#252932',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  storeSmall: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: DESKTOP_WEB_COLORS.footerText,
  },
  storeLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  regionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  regionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#252932',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  flag: {
    fontSize: 16,
  },
  regionText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  rupeeIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: DESKTOP_WEB_COLORS.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupee: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface.white,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
    flexWrap: 'wrap',
  },
  logo: {
    width: 140,
    height: 56,
  },
  description: {
    flex: 1,
    minWidth: 280,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    lineHeight: 22,
    color: DESKTOP_WEB_COLORS.footerText,
  },
  copyright: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: DESKTOP_WEB_COLORS.footerText,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
