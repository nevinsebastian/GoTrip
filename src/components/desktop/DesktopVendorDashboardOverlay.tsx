import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

type DesktopVendorDashboardOverlayProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  align?: 'center' | 'right';
};

/** Figma Group 9 — blurred backdrop with elevated modal card. */
export function DesktopVendorDashboardOverlay({
  visible,
  onClose,
  children,
  contentStyle,
  align = 'center',
}: DesktopVendorDashboardOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, align === 'right' && styles.backdropRight]}
        onPress={onClose}
      >
        <Pressable
          style={[styles.cardWrap, align === 'right' && styles.cardWrapRight, contentStyle]}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      } as object,
    }),
  },
  backdropRight: {
    alignItems: 'flex-end',
    paddingRight: 42,
  },
  cardWrap: {
    maxWidth: '92%',
  },
  cardWrapRight: {},
});
