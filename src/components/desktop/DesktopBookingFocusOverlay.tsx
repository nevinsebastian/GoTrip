import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type DesktopBookingFocusOverlayProps = {
  visible: boolean;
  sectionTitle: string;
  children: React.ReactNode;
};

export function DesktopBookingFocusOverlay({
  visible,
  sectionTitle,
  children,
}: DesktopBookingFocusOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.blurLayer} />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <View style={styles.modalSlot}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      } as object,
      default: {},
    }),
  },
  content: {
    ...desktopContentShellStyle,
    alignItems: 'center',
    gap: 32,
    zIndex: 1,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 28,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    width: '100%',
  },
  modalSlot: {
    width: '100%',
    alignItems: 'center',
  },
});
