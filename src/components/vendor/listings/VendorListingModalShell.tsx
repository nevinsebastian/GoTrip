import { colors } from '@/constants/DesignTokens';
import React from 'react';
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

type VendorListingModalShellProps = {
  onClose: () => void;
  children: React.ReactNode;
  cardStyle?: ViewStyle;
  centered?: boolean;
};

export function VendorListingModalShell({
  onClose,
  children,
  cardStyle,
  centered = true,
}: VendorListingModalShellProps) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.scrim} onPress={onClose} accessibilityRole="button">
        <View
          style={[
            styles.backdrop,
            Platform.OS === 'web'
              ? ({
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                } as object)
              : null,
          ]}
        />
      </Pressable>

      <View style={[styles.cardWrap, centered && styles.cardWrapCentered]}>
        <View style={[styles.card, cardStyle]}>{children}</View>
      </View>
    </View>
  );
}

const FIGMA_BORDER = 'rgba(15, 26, 32, 0.2)';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'flex-end',
  },
  cardWrapCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 624,
    borderWidth: 1,
    borderColor: FIGMA_BORDER,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 48,
    gap: 18,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      ios: {
        shadowColor: '#1C2024',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
      web: { boxShadow: '0px 4px 25px rgba(28, 32, 36, 0.2)' },
    }),
  },
});
