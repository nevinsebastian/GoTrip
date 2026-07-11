import { Input, Text } from '@/components/ui';
import { colors } from '@/constants/DesignTokens';
import { authFieldInputStyle } from '@/src/constants/authInputStyles';
import {
  VENDOR_ONBOARDING,
  type VendorProfileForm,
} from '@/src/constants/vendorOnboardingConstants';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { typography } from '@/constants/DesignTokens';

type VendorProfileFormFieldsProps = {
  profile: VendorProfileForm;
  onChange: (field: keyof VendorProfileForm, value: string) => void;
  onFocusField?: () => void;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function VendorProfileFormFields({
  profile,
  onChange,
  onFocusField,
  error,
  style,
}: VendorProfileFormFieldsProps) {
  return (
    <View style={[styles.stack, style]}>
      <Input
        placeholder={VENDOR_ONBOARDING.businessNamePlaceholder}
        autoCapitalize="words"
        autoCorrect={false}
        placeholderTextColor={colors.text.placeholder}
        style={authFieldInputStyle.field}
        value={profile.businessName}
        onChangeText={(value) => onChange('businessName', value)}
        onFocus={onFocusField}
        accessibilityLabel={VENDOR_ONBOARDING.businessNameLabel}
      />
      <Input
        placeholder={VENDOR_ONBOARDING.panNumberPlaceholder}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholderTextColor={colors.text.placeholder}
        style={authFieldInputStyle.field}
        value={profile.panNumber}
        onChangeText={(value) => onChange('panNumber', value.toUpperCase())}
        onFocus={onFocusField}
        accessibilityLabel={VENDOR_ONBOARDING.panNumberLabel}
      />
      <Input
        placeholder={VENDOR_ONBOARDING.gstNumberPlaceholder}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholderTextColor={colors.text.placeholder}
        style={authFieldInputStyle.field}
        value={profile.gstNumber}
        onChangeText={(value) => onChange('gstNumber', value.toUpperCase())}
        onFocus={onFocusField}
        accessibilityLabel={VENDOR_ONBOARDING.gstNumberLabel}
      />
      <Text variant="caption" style={styles.optionalHint}>
        {VENDOR_ONBOARDING.profileOptionalTaxHint}
      </Text>
      {error ? (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12,
    width: '100%',
  },
  errorText: {
    color: colors.primaryAlt,
  },
  optionalHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});
