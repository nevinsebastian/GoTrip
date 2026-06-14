import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { Platform, StyleSheet } from 'react-native';

/** Compact auth field styling — avoids clipped text on Android when height is 40px */
export const authFieldInputStyle = StyleSheet.create({
  field: {
    height: 40,
    borderRadius: 24,
    borderColor: 'rgba(0, 0, 47, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing['3'],
    paddingVertical: 0,
    fontSize: typography.fontSize['1'],
    fontFamily: typography.fontFamily.text,
    color: colors.text.primary,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
      ios: {
        paddingTop: 10,
        paddingBottom: 10,
      },
      default: {},
    }),
  },
});
