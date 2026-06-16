import { colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_LISTING_CATEGORIES,
  type VendorListingCategory,
  type VendorListingCategoryId,
} from '@/src/constants/vendorOnboardingConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type VendorListingCategorySheetProps = {
  visible: boolean;
  selectedId: VendorListingCategoryId;
  onClose: () => void;
  onSelect: (id: VendorListingCategoryId) => void;
};

export function VendorListingCategorySheet({
  visible,
  selectedId,
  onClose,
  onSelect,
}: VendorListingCategorySheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select category</Text>
          <View style={styles.options}>
            {VENDOR_LISTING_CATEGORIES.map((category) => (
              <CategoryOptionRow
                key={category.id}
                category={category}
                selected={category.id === selectedId}
                onPress={() => onSelect(category.id)}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CategoryOptionRow({
  category,
  selected,
  onPress,
}: {
  category: VendorListingCategory;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && styles.optionPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Image source={category.thumbnail} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
          {category.title}
        </Text>
        <Text style={styles.optionSubtitle} numberOfLines={2}>
          {category.subtitle}
        </Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={20} color={colors.accent.main} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="rgba(28, 32, 36, 0.35)" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['6'],
    gap: spacing['3'],
    maxHeight: '75%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(28, 32, 36, 0.15)',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  options: { gap: 10 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    borderRadius: 12,
    padding: spacing['3'],
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  optionRowSelected: {
    borderColor: colors.accent.main,
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  thumbnail: {
    width: 56,
    height: 40,
    borderRadius: 8,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  optionTitleSelected: {
    color: colors.accent.main,
  },
  optionSubtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  optionPressed: { opacity: 0.85 },
});
