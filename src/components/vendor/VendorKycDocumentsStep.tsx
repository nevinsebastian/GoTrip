import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { DesktopInlineSelect } from '@/src/components/desktop/DesktopInlineSelect';
import {
  VENDOR_ONBOARDING,
  type VendorDocumentField,
} from '@/src/constants/vendorOnboardingConstants';
import type { VendorLocalDocument } from '@/src/utils/vendorDocumentPicker';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

const ACCENT = colors.accent.main;

type VendorKycDocumentsStepProps = {
  variant: 'desktop' | 'mobile';
  idType: string;
  propertyDocType: string;
  idDocument: VendorLocalDocument | null;
  propertyDocument: VendorLocalDocument | null;
  onIdTypeChange: (value: string) => void;
  onPropertyDocTypeChange: (value: string) => void;
  onOpenIdPicker?: () => void;
  onOpenPropertyPicker?: () => void;
  onUpload: (field: VendorDocumentField) => void;
  uploadingField: VendorDocumentField | null;
  error?: string | null;
};

function DocumentTypeSelect({
  variant,
  label,
  value,
  options,
  onChange,
  onOpenPicker,
}: {
  variant: 'desktop' | 'mobile';
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  onOpenPicker?: () => void;
}) {
  if (variant === 'desktop') {
    return (
      <View style={styles.typeBlock}>
        <Text style={styles.documentLabel}>{label}</Text>
        <DesktopInlineSelect value={value} options={options} onSelect={onChange} />
      </View>
    );
  }

  return (
    <View style={styles.typeBlock}>
      <Text style={styles.documentLabel}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.mobileSelect, pressed && styles.pressed]}
        onPress={onOpenPicker}
        accessibilityRole="button"
      >
        <Text style={styles.mobileSelectText} numberOfLines={1}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={16} color="rgba(28, 32, 36, 0.45)" />
      </Pressable>
    </View>
  );
}

function UploadRow({
  fileName,
  onUpload,
  isUploading,
}: {
  fileName?: string;
  onUpload: () => void;
  isUploading?: boolean;
}) {
  return (
    <View style={styles.uploadRow}>
      <Pressable
        style={[styles.uploadButton, isUploading && styles.uploadDisabled]}
        onPress={onUpload}
        disabled={isUploading}
        accessibilityRole="button"
      >
        {isUploading ? (
          <ActivityIndicator color={colors.surface.white} size="small" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={14} color={colors.surface.white} />
            <Text style={styles.uploadButtonText}>
              {Platform.OS === 'web' ? 'Upload from device' : 'Upload'}
            </Text>
          </>
        )}
      </Pressable>
      {fileName ? <Text style={styles.uploadedFileName}>{fileName}</Text> : null}
    </View>
  );
}

export function VendorKycDocumentsStep({
  variant,
  idType,
  propertyDocType,
  idDocument,
  propertyDocument,
  onIdTypeChange,
  onPropertyDocTypeChange,
  onOpenIdPicker,
  onOpenPropertyPicker,
  onUpload,
  uploadingField,
  error,
}: VendorKycDocumentsStepProps) {
  return (
    <View style={styles.root}>
      <Text style={[styles.title, variant === 'mobile' && styles.titleMobile]}>
        {VENDOR_ONBOARDING.documentsTitle}
      </Text>
      <Text style={styles.subtitle}>{VENDOR_ONBOARDING.documentsSubtitle}</Text>

      <View style={styles.documentRow}>
        <DocumentTypeSelect
          variant={variant}
          label={VENDOR_ONBOARDING.idTypeLabel}
          value={idType}
          options={VENDOR_ONBOARDING.idTypes}
          onChange={onIdTypeChange}
          onOpenPicker={onOpenIdPicker}
        />
        <UploadRow
          fileName={idDocument?.name}
          onUpload={() => onUpload('id')}
          isUploading={uploadingField === 'id'}
        />
      </View>

      <View style={styles.documentRow}>
        <DocumentTypeSelect
          variant={variant}
          label={VENDOR_ONBOARDING.propertyDocLabel}
          value={propertyDocType}
          options={VENDOR_ONBOARDING.propertyDocTypes}
          onChange={onPropertyDocTypeChange}
          onOpenPicker={onOpenPropertyPicker}
        />
        <UploadRow
          fileName={propertyDocument?.name}
          onUpload={() => onUpload('property')}
          isUploading={uploadingField === 'property'}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: 12,
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 22,
    fontWeight: typography.fontWeight.semibold,
    color: ACCENT,
  },
  titleMobile: {
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  documentRow: {
    gap: 10,
    marginBottom: 8,
  },
  typeBlock: {
    gap: 8,
  },
  documentLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
  },
  mobileSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    backgroundColor: colors.surface.white,
  },
  mobileSelectText: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 8,
  },
  uploadRow: {
    gap: 6,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 14,
    minHeight: 44,
    paddingVertical: 10,
  },
  uploadDisabled: {
    opacity: 0.7,
  },
  uploadButtonText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  uploadedFileName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: colors.text.secondary,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.primaryAlt,
  },
  pressed: {
    opacity: 0.85,
  },
});
