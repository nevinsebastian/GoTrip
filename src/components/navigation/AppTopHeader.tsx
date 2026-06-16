import { colors } from '@/constants/DesignTokens';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BellLoginIcon from '@/assets/images/login-figma/bell-login.svg';
import MenuLoginIcon from '@/assets/images/login-figma/menu-login.svg';
import { useHomeScale } from '@/src/components/home/useHomeScale';

const HeaderLogo = require('../../../assets/images/login-figma/logo-header.png');

export function AppTopHeader() {
  const { s } = useHomeScale();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + s(10), paddingHorizontal: s(16) }]}>
      <View style={[styles.card, { borderRadius: s(10), paddingHorizontal: s(14), paddingVertical: s(12) }]}>
        <Image source={HeaderLogo} style={{ width: s(92), height: s(36) }} resizeMode="contain" />

        <View style={[styles.actions, { gap: s(14) }]}>
          <Pressable
            style={[styles.iconBtn, { width: s(34), height: s(34), borderRadius: s(17) }]}
            accessibilityLabel="Notifications"
          >
            <BellLoginIcon width={s(18)} height={s(18)} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { width: s(34), height: s(34), borderRadius: s(17) }]}
            accessibilityLabel="Menu"
          >
            <MenuLoginIcon width={s(22)} height={s(22)} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

