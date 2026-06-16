import { colors, typography } from '@/constants/DesignTokens';
import type { Booking } from '@/src/api/types';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { RESORT_PLACEHOLDER_IMAGE } from '@/src/constants/placeholderImages';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const ResortImage = RESORT_PLACEHOLDER_IMAGE;

type BookingTicketCardProps = {
  booking: Booking;
  bookingCode: string;
  expanded: boolean;
  onToggle: () => void;
  formatDateRange: (start: string, end: string) => string;
  moneyLabel: (value?: string | null) => string | null;
  onDetails?: () => void;
};

export function BookingTicketCard({
  booking,
  bookingCode,
  expanded,
  onToggle,
  formatDateRange,
  moneyLabel,
  onDetails,
}: BookingTicketCardProps) {
  const { s } = useHomeScale();
  const title = booking.listing?.title ?? 'Booking';
  const dateLabel = formatDateRange(booking.start_date, booking.end_date);
  const total = moneyLabel(booking.total_amount);

  return (
    <View style={[styles.card, { borderRadius: s(16), paddingHorizontal: s(14), paddingVertical: s(12), gap: s(8) }]}>
      <Pressable
        style={[styles.headerRow, { minHeight: s(22), paddingVertical: s(2) }]}
        onPress={onToggle}
        accessibilityLabel="Toggle booking details"
      >
        <View style={[styles.bookingIdRow, { gap: s(4) }]}>
          <Text style={[styles.bookingId, { fontSize: s(10), lineHeight: s(16) }]}>
            Booking ID# :
          </Text>
          <Text style={[styles.bookingIdBold, { fontSize: s(10), lineHeight: s(16) }]}>
            {bookingCode}
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={s(18)}
          color={colors.text.secondary}
        />
      </Pressable>

      <View style={styles.separator} />

      <View style={[styles.bodyRow, { gap: s(16) }]}>
        <View style={[styles.thumbWrap, { width: s(103), height: s(63), borderRadius: s(8) }]}>
          <Image source={ResortImage} style={styles.thumbImg} resizeMode="cover" />
        </View>
        <View style={styles.bodyRight}>
          <Text style={[styles.title, { fontSize: s(12), lineHeight: s(16) }]} numberOfLines={expanded ? 3 : 2}>
            {title}
          </Text>
          {!expanded ? (
            <Text style={[styles.meta, { fontSize: s(10), lineHeight: s(14) }]}>{dateLabel}</Text>
          ) : (
            <View style={[styles.ratingRow, { gap: s(4), marginTop: s(4) }]}>
              <Ionicons name="star" size={s(12)} color={colors.accent.main} />
              <Text style={[styles.ratingText, { fontSize: s(10) }]}>4.5</Text>
              <Text style={[styles.ratingDivider, { fontSize: s(10) }]}>|</Text>
              <Text style={[styles.ratingText, { fontSize: s(10) }]}>500+ customers</Text>
            </View>
          )}
        </View>
      </View>

      {expanded ? (
        <>
          <Pressable
            style={[styles.messageBtn, { height: s(28), borderRadius: s(6), gap: s(6) }]}
            accessibilityLabel="Message host"
          >
            <Ionicons name="chatbubbles-outline" size={s(14)} color={colors.text.primary} />
            <Text style={[styles.messageBtnText, { fontSize: s(10) }]}>Message Host</Text>
          </Pressable>

          <View style={styles.separator} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { fontSize: s(12) }]}>Dates</Text>
              <Text style={[styles.detailValue, { fontSize: s(10), marginTop: s(4) }]}>{dateLabel}</Text>
            </View>
            <View style={styles.detailColRight}>
              <Text style={[styles.detailLabel, { fontSize: s(12) }]}>Guests</Text>
              <Text style={[styles.detailValue, { fontSize: s(10), marginTop: s(4) }]}>
                {booking.guests} adults
              </Text>
            </View>
          </View>

          <View style={styles.totalRow}>
            <View style={{ flex: 1, paddingRight: s(8) }}>
              <Text style={[styles.detailLabel, { fontSize: s(12) }]}>Total price</Text>
              <Text style={[styles.totalValue, { fontSize: s(10), marginTop: s(4) }]}>
                {(total ?? '—') + ' including tax'}
              </Text>
            </View>
            <Pressable
              style={[styles.detailsBtn, { height: s(24), borderRadius: s(6), paddingHorizontal: s(10) }]}
              accessibilityLabel="Details"
              onPress={onDetails}
            >
              <Text style={[styles.detailsBtnText, { fontSize: s(10) }]}>Details</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingIdRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingRight: 8,
  },
  bookingId: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  bookingIdBold: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 9, 50, 0.12)',
  },
  bodyRow: {
    flexDirection: 'row',
  },
  thumbWrap: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.gray['2'],
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  bodyRight: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(28, 32, 36, 0.6)',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  ratingDivider: {
    fontFamily: typography.fontFamily.text,
    color: colors.accent.main,
  },
  messageBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
  },
  messageBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  detailValue: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: 'rgba(0, 7, 20, 0.62)',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  totalValue: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  detailsBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  detailsBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
