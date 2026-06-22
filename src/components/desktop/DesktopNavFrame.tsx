import { colors } from '@/constants/DesignTokens';
import { DESKTOP_HERO_SPECS } from '@/src/constants/desktopHomeConstants';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const SPECS = DESKTOP_HERO_SPECS;

type DesktopNavFrameProps = {
  children: React.ReactNode;
};

/** Orange-bordered shell used on profile and other compact desktop headers. */
export function DesktopNavFrame({ children }: DesktopNavFrameProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.frame}>
        <View style={styles.shell}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
  },
  frame: {
    borderWidth: SPECS.frameBorderWidth,
    borderColor: SPECS.frameBorderColor,
    borderRadius: SPECS.frameBorderRadius,
    overflow: 'visible',
    backgroundColor: SPECS.accent,
    ...Platform.select({
      web: { boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' },
      default: {},
    }),
  },
  shell: {
    padding: SPECS.framePadding,
    overflow: 'visible',
  },
});
