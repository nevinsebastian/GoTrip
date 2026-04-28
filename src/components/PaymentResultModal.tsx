import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';

type Props = {
  visible: boolean;
  status: 'success' | 'failed';
  bookingId?: string;
  title?: string;
  ratingLabel?: string;
  customersLabel?: string;
  imageSource?: any;
  datesLabel?: string;
  guestsLabel?: string;
  totalPriceLabel?: string;
  errorMessage?: string;
  onClose: () => void;
  onRetry?: () => void;
};

export function PaymentResultModal({
  visible,
  status,
  bookingId,
  title,
  ratingLabel = '4.5',
  customersLabel = '500+ customers',
  imageSource,
  datesLabel,
  guestsLabel,
  totalPriceLabel,
  errorMessage,
  onClose,
  onRetry,
}: Props) {
  const isSuccess = status === 'success';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </Pressable>
          <Text variant="bodySemibold" style={styles.headerTitle}>
            Home
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text variant="heading2" style={styles.topTitle}>
            {isSuccess ? 'All Done!' : 'Sorry.'}
          </Text>
          <View style={styles.statusRow}>
            <Text
              variant="heading2"
              style={[styles.statusText, isSuccess ? styles.statusSuccess : styles.statusFailed]}
            >
              {isSuccess ? 'Booking successful!' : 'Booking Failed!'}
            </Text>
            <Ionicons
              name={isSuccess ? 'checkmark-circle' : 'close-circle'}
              size={22}
              color={isSuccess ? '#19A65B' : '#D53B3B'}
            />
          </View>

          <View style={styles.card}>
            {bookingId ? (
              <Text variant="caption" style={styles.bookingId}>
                Booking ID# : <Text variant="caption" style={styles.bookingIdBold}>{bookingId}</Text>
              </Text>
            ) : null}

            <View style={styles.cardTopRow}>
              <View style={styles.thumbnail}>
                {imageSource ? (
                  <Image source={imageSource} style={styles.thumbnailImg} resizeMode="cover" />
                ) : (
                  <View style={styles.thumbnailPlaceholder} />
                )}
              </View>

              <View style={styles.cardTopRight}>
                <Text variant="bodySemibold" style={styles.listingTitle}>
                  {title ?? 'Your booking'}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#E44D26" />
                  <Text variant="caption" style={styles.ratingText}>
                    {ratingLabel}
                  </Text>
                  <View style={styles.dot} />
                  <Text variant="caption" style={styles.customersText}>
                    {customersLabel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {isSuccess ? (
              <>
                <View style={styles.infoGrid}>
                  <View style={styles.infoCol}>
                    <Text variant="bodySemibold" style={styles.infoLabel}>
                      Dates
                    </Text>
                    <Text variant="caption" style={styles.infoValue}>
                      {datesLabel ?? '—'}
                    </Text>
                  </View>
                  <View style={styles.infoColRight}>
                    <Text variant="bodySemibold" style={styles.infoLabel}>
                      Guests
                    </Text>
                    <Text variant="caption" style={styles.infoValue}>
                      {guestsLabel ?? '—'}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalRow}>
                  <View>
                    <Text variant="bodySemibold" style={styles.totalLabel}>
                      Total price
                    </Text>
                    <Text variant="caption" style={styles.totalSub}>
                      {totalPriceLabel ?? ''}
                    </Text>
                  </View>
                  <Pressable style={styles.detailsBtn} accessibilityLabel="Details">
                    <Text variant="caption" style={styles.detailsBtnText}>
                      Details
                    </Text>
                  </Pressable>
                </View>

                <Pressable style={styles.viewAllRow} accessibilityLabel="View all bookings">
                  <Text variant="caption" style={styles.viewAllText}>
                    View all bookings
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                </Pressable>
              </>
            ) : (
              <>
                <Text variant="caption" style={styles.failTitle}>
                  An error occurred <Ionicons name="alert-circle" size={14} color="#D53B3B" />
                </Text>
                <Text variant="caption" style={styles.failBody}>
                  {errorMessage ??
                    "Your payment transaction was unsuccessful. Please contact our help center for further assistance, or retry payment."}
                </Text>

                <View style={styles.failButtonsRow}>
                  <Pressable style={styles.helpBtn} accessibilityLabel="Help">
                    <Ionicons name="help-circle-outline" size={16} color={colors.text.primary} />
                    <Text variant="bodySemibold" style={styles.helpBtnText}>
                      Help
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.retryBtn}
                    onPress={onRetry}
                    disabled={!onRetry}
                    accessibilityLabel="Retry Payment"
                  >
                    <Text variant="bodySemibold" style={styles.retryBtnText}>
                      Retry Payment
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['3'],
  },
  headerTitle: { color: colors.primary },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['8'],
  },
  topTitle: { marginTop: spacing['2'] },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], marginTop: spacing['1'] },
  statusText: {},
  statusSuccess: { color: '#19A65B' },
  statusFailed: { color: '#D53B3B' },
  card: {
    marginTop: spacing['4'],
    backgroundColor: '#FDF1EF',
    borderRadius: borderRadius['2xl'],
    padding: spacing['4'],
  },
  bookingId: { color: colors.text.secondary },
  bookingIdBold: { color: colors.text.primary },
  cardTopRow: { flexDirection: 'row', gap: spacing['3'], marginTop: spacing['3'] },
  thumbnail: {
    width: 86,
    height: 74,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  thumbnailImg: { width: '100%', height: '100%' },
  thumbnailPlaceholder: { flex: 1, backgroundColor: colors.gray['2'] },
  cardTopRight: { flex: 1 },
  listingTitle: { color: colors.text.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  ratingText: { color: '#E44D26' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#E44D26', opacity: 0.9 },
  customersText: { color: '#E44D26' },
  divider: { height: 1, backgroundColor: 'rgba(0, 9, 50, 0.10)', marginVertical: spacing['3'] },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoCol: { flex: 1 },
  infoColRight: { flex: 1, alignItems: 'flex-end' },
  infoLabel: { color: colors.text.primary },
  infoValue: { color: colors.text.secondary, marginTop: 4 },
  totalRow: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { color: colors.text.primary },
  totalSub: { color: '#E44D26', marginTop: 4 },
  detailsBtn: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.15)',
    backgroundColor: colors.surface.white,
  },
  detailsBtnText: { color: colors.text.primary },
  viewAllRow: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewAllText: { color: colors.text.secondary },
  failTitle: { color: '#D53B3B' },
  failBody: { color: colors.text.secondary, marginTop: spacing['2'], lineHeight: 18 },
  failButtonsRow: { flexDirection: 'row', gap: spacing['3'], marginTop: spacing['4'] },
  helpBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.15)',
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing['2'],
  },
  helpBtnText: { color: colors.text.primary },
  retryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D53B3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: { color: colors.surface.white },
});

