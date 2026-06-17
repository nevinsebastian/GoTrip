import { colors } from '@/constants/DesignTokens';
import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';

import BellLoginIcon from '@/assets/images/login-figma/bell-login.svg';
import MenuLoginIcon from '@/assets/images/login-figma/menu-login.svg';

const HeaderLogo = require('../../../assets/images/login-figma/logo-header.png');

const DESIGN_WIDTH = 402;

/** Compact vendor header bar — no hero image. */
export function VendorListingHeader() {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const headerLogoWidth = Math.round(68 * scale);
  const headerLogoHeight = Math.round(32 * scale);

  return (
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
});
