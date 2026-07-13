import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import type { PackageEnquiryRequest } from '@/src/api/types';
import { formatPackageDateRange } from '@/src/utils/packageDates';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type PackageEnquiryModalProps = {
  visible: boolean;
  title: string;
  defaultTravelDate?: string;
  defaultCheckOut?: string;
  minAdults?: number;
  submitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (payload: PackageEnquiryRequest) => void;
};

export function PackageEnquiryModal({
  visible,
  title,
  defaultTravelDate,
  defaultCheckOut,
  minAdults = 1,
  submitting = false,
  errorMessage,
  onClose,
  onSubmit,
}: PackageEnquiryModalProps) {
  const [adults, setAdults] = useState(Math.max(minAdults, 2));
  const [infants, setInfants] = useState(0);
  const [travelDate, setTravelDate] = useState(defaultTravelDate ?? '');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    onSubmit({
      adults: Math.max(minAdults, adults),
      infants,
      ...(travelDate.trim() ? { travelDate: travelDate.trim() } : {}),
      ...(message.trim() ? { message: message.trim() } : {}),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Send enquiry</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.text.primary} />
            </Pressable>
          </View>

          <Text style={styles.packageTitle} numberOfLines={2}>
            {title}
          </Text>

          {defaultTravelDate && defaultCheckOut ? (
            <Text style={styles.dateHint}>
              Suggested travel: {formatPackageDateRange(defaultTravelDate, defaultCheckOut)}
            </Text>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Travel date (YYYY-MM-DD)</Text>
            <TextInput
              value={travelDate}
              onChangeText={setTravelDate}
              placeholder="2026-08-15"
              placeholderTextColor="rgba(28,32,36,0.4)"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.label}>Adults</Text>
            <View style={styles.counter}>
              <Pressable style={styles.counterBtn} onPress={() => setAdults((n) => Math.max(minAdults, n - 1))}>
                <Ionicons name="remove" size={18} color={colors.text.primary} />
              </Pressable>
              <Text style={styles.counterValue}>{adults}</Text>
              <Pressable style={styles.counterBtn} onPress={() => setAdults((n) => n + 1)}>
                <Ionicons name="add" size={18} color={colors.text.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.label}>Infants</Text>
            <View style={styles.counter}>
              <Pressable style={styles.counterBtn} onPress={() => setInfants((n) => Math.max(0, n - 1))}>
                <Ionicons name="remove" size={18} color={colors.text.primary} />
              </Pressable>
              <Text style={styles.counterValue}>{infants}</Text>
              <Pressable style={styles.counterBtn} onPress={() => setInfants((n) => n + 1)}>
                <Ionicons name="add" size={18} color={colors.text.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Message (optional)</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell the vendor about your group or preferences"
              placeholderTextColor="rgba(28,32,36,0.4)"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />
          </View>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <Pressable
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.surface.white} />
            ) : (
              <Text style={styles.submitText}>Submit enquiry</Text>
            )}
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    ...Platform.select({
      web: { boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  packageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
  },
  dateHint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: colors.accent.main,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    minWidth: 24,
    textAlign: 'center',
  },
  error: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: '#d32f2f',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
