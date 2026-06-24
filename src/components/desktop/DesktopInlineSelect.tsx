import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type View as ViewType,
} from 'react-native';

export type DesktopSelectOption = {
  value: string;
  label: string;
};

type DesktopInlineSelectProps = {
  value: string;
  options: readonly string[] | DesktopSelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  menuMaxHeight?: number;
  startAdornment?: React.ReactNode;
  renderOption?: (option: DesktopSelectOption, selected: boolean) => React.ReactNode;
};

function normalizeOptions(options: readonly string[] | DesktopSelectOption[]): DesktopSelectOption[] {
  return options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
}

export function DesktopInlineSelect({
  value,
  options,
  onSelect,
  placeholder = 'Select',
  disabled = false,
  menuMaxHeight = 220,
  startAdornment,
  renderOption,
}: DesktopInlineSelectProps) {
  const triggerRef = useRef<ViewType>(null);
  const [open, setOpen] = useState(false);
  const [menuLayout, setMenuLayout] = useState({ top: 0, left: 0, width: 0 });

  const normalizedOptions = normalizeOptions(options);
  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? value;

  const closeMenu = () => setOpen(false);

  const openMenu = () => {
    if (disabled) return;
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setMenuLayout({ top: y + height + 4, left: x, width });
      setOpen(true);
    });
  };

  const handleSelect = (nextValue: string) => {
    onSelect(nextValue);
    closeMenu();
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={openMenu}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        {startAdornment ? <View style={styles.startAdornment}>{startAdornment}</View> : null}
        <Text style={[styles.triggerText, !displayLabel && styles.placeholderText]} numberOfLines={1}>
          {displayLabel || placeholder}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="rgba(28, 32, 36, 0.45)"
        />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.backdrop} onPress={closeMenu} accessibilityLabel="Close menu" />
        <View
          style={[
            styles.menu,
            {
              top: menuLayout.top,
              left: menuLayout.left,
              width: menuLayout.width,
              maxHeight: menuMaxHeight,
            },
          ]}
        >
          <ScrollView
            style={styles.menuScroll}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={Platform.OS === 'web'}
          >
            {normalizedOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.optionRow,
                    renderOption ? styles.optionRowCustom : null,
                    isSelected && styles.optionRowSelected,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  accessibilityRole="menuitem"
                >
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {option.label}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={16} color={colors.accent.main} />
                      ) : null}
                    </>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    paddingHorizontal: 12,
    backgroundColor: colors.surface.white,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  startAdornment: {
    marginRight: 8,
  },
  triggerText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 8,
  },
  placeholderText: {
    color: 'rgba(28, 32, 36, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    backgroundColor: colors.surface.white,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  menuScroll: {
    flexGrow: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.08)',
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  optionRowCustom: {
    justifyContent: 'flex-start',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(232, 84, 51, 0.06)',
  },
  optionLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  optionPressed: {
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
  },
});
