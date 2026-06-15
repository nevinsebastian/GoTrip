import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import {
  HOST_DESCRIPTION,
  HOST_NAME,
  INSTRUCTIONS_TEXT,
} from '@/src/components/resort/resortConstants';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { useHomeScale } from '@/src/components/home/useHomeScale';

export function ResortHostInstructions() {
  const { s } = useHomeScale();

  return (
    <View style={[styles.card, { padding: s(16), borderRadius: s(18), gap: s(24) }]}>
      <View style={{ gap: s(12) }}>
        <View style={[styles.hostRow, { gap: s(18) }]}>
          <Image
            source={RESORT_PLACEHOLDER_IMAGE}
            style={[styles.avatar, { width: s(82), height: s(82), borderRadius: s(41) }]}
          />
          <View style={{ flex: 1, gap: s(8), minHeight: s(82), justifyContent: 'space-between' }}>
            <Text style={[styles.hostName, { fontSize: s(14), lineHeight: s(20) }]}>{HOST_NAME}</Text>
            <Text style={[styles.hostBio, { fontSize: s(10), lineHeight: s(12) }]}>{HOST_DESCRIPTION}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={s(14)} color={colors.accent.main} />
              <Text style={[styles.ratingAccent, { fontSize: s(10) }]}>4.5</Text>
              <Text style={[styles.ratingMuted, { fontSize: s(10) }]}>|</Text>
              <Text style={[styles.ratingAccent, { fontSize: s(10) }]}>500+ customers</Text>
            </View>
          </View>
        </View>

        <Pressable style={[styles.actionBtn, { paddingVertical: s(10), borderRadius: s(12) }]}>
          <Text style={[styles.actionBtnText, { fontSize: s(10) }]}>View host profile</Text>
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={[styles.dividerAccent, { height: 1 }]} />
        <View style={[styles.dividerMuted, { height: 1 }]} />
      </View>

      <View style={{ gap: s(18) }}>
        <Text style={[styles.sectionTitle, { fontSize: s(16), lineHeight: s(24) }]}>Instructions</Text>
        <Text style={[styles.instructions, { fontSize: s(10), lineHeight: s(12) }]}>{INSTRUCTIONS_TEXT}</Text>
        <Pressable style={[styles.actionBtn, { paddingVertical: s(10), borderRadius: s(12) }]}>
          <Text style={[styles.actionBtnText, { fontSize: s(10) }]}>More detals</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  hostName: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  hostBio: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingAccent: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.accent.main,
  },
  ratingMuted: {
    fontFamily: typography.fontFamily.text,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  actionBtn: {
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(28, 32, 36, 0.6)',
    letterSpacing: 0.04,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerAccent: {
    flex: 1,
    backgroundColor: colors.accent.main,
  },
  dividerMuted: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.2)',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  instructions: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
    letterSpacing: 0.04,
  },
});
