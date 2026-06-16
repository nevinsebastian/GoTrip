import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { BookingTicketCard } from '@/src/components/tickets/BookingTicketCard';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { useBookings } from '@/src/hooks/useBookings';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabKey = 'active' | 'past';

function toDateOnly(input: string) {
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function bookingCode(id: string) {
  const digits = id.replace(/\D/g, '');
  const tail = (digits || id.replace(/-/g, '')).slice(-5);
  return `B${tail.toUpperCase()}`;
}

function formatDateRange(start: string, end: string) {
  const startDt = new Date(start);
  const endDt = new Date(end);
  if (Number.isNaN(startDt.getTime()) || Number.isNaN(endDt.getTime())) {
    return `${start} - ${end}`;
  }

  const sameMonth =
    startDt.getMonth() === endDt.getMonth() && startDt.getFullYear() === endDt.getFullYear();

  if (sameMonth) {
    const monthYear = endDt.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    return `${startDt.getDate()}-${endDt.getDate()} ${monthYear}`;
  }

  const fmt = (d: Date) =>
    d.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${fmt(startDt)} - ${fmt(endDt)}`;
}

function moneyLabel(value?: string | null) {
  const num = Number(value ?? '');
  if (!Number.isFinite(num)) return null;
  return `₹ ${num.toLocaleString('en-IN')}`;
}

export function MobileTicketsScreen() {
  const { s } = useHomeScale();
  const [activeTab, setActiveTab] = useState<TabKey>('past');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const contentPadding = s(16);
  const { data: bookingsRes, isLoading, error } = useBookings({ page: 1, limit: 20 });

  const todayOnly = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);

  const visibleBookings = useMemo(() => {
    const bookings = bookingsRes?.data ?? [];
    const search = searchQuery.trim().toLowerCase();

    return bookings.filter((b) => {
      const start = toDateOnly(b.start_date);
      const inTab =
        activeTab === 'active'
          ? start.getTime() >= todayOnly.getTime()
          : start.getTime() < todayOnly.getTime();

      if (!inTab) return false;
      if (!search) return true;

      const title = (b.listing?.title ?? '').toLowerCase();
      const location = (b.listing?.location ?? '').toLowerCase();
      return (
        b.id.toLowerCase().includes(search) ||
        bookingCode(b.id).toLowerCase().includes(search) ||
        title.includes(search) ||
        location.includes(search)
      );
    });
  }, [bookingsRes?.data, activeTab, searchQuery, todayOnly]);

  const emptyState =
    activeTab === 'active'
      ? {
          title: 'No Active tickets found',
          subtitle: 'Your active tickets & booking details will appear here.',
        }
      : {
          title: 'No Bookings yet',
          subtitle: 'Your past tickets & booking details will appear here.',
        };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: contentPadding, paddingTop: s(8), gap: s(16) }]}>
        <View style={[styles.headerRow, { gap: s(12) }]}>
          <Pressable
            style={[styles.backBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}
            onPress={() => router.replace('/(tabs)')}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={s(22)} color={colors.surface.white} />
          </Pressable>
          <Text style={[styles.headerTitle, { fontSize: s(24), lineHeight: s(32) }]}>
            Tickets - Bookings
          </Text>
        </View>

        <View style={[styles.tabsPill, { height: s(32), borderRadius: s(10) }]}>
          <Pressable
            style={styles.tabBtn}
            onPress={() => setActiveTab('active')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'active' }}
          >
            <Text
              style={[
                styles.tabLabel,
                { fontSize: s(12) },
                activeTab === 'active' && styles.tabLabelActive,
              ]}
            >
              Active tickets
            </Text>
            {activeTab === 'active' ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
          <Pressable
            style={styles.tabBtn}
            onPress={() => setActiveTab('past')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'past' }}
          >
            <Text
              style={[
                styles.tabLabel,
                { fontSize: s(12) },
                activeTab === 'past' && styles.tabLabelActive,
              ]}
            >
              Past bookings
            </Text>
            {activeTab === 'past' ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
        </View>

        <View style={[styles.searchRow, { gap: s(8) }]}>
          <View
            style={[
              styles.searchPill,
              {
                borderRadius: s(9999),
                paddingHorizontal: s(16),
                minHeight: s(44),
              },
            ]}
          >
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search your bookings"
              placeholderTextColor="rgba(28, 32, 36, 0.4)"
              style={[styles.searchInput, { fontSize: s(14), lineHeight: s(20) }]}
              returnKeyType="search"
            />
            <Ionicons name="search" size={s(18)} color={colors.text.primary} />
          </View>

          <Pressable
            style={[styles.filterBtn, { width: s(44), height: s(44), borderRadius: s(12) }]}
            accessibilityLabel="Filter"
          >
            <Ionicons name="filter-outline" size={s(18)} color={colors.accent.main} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: contentPadding,
          paddingTop: s(12),
          paddingBottom: s(100),
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <View style={styles.stateWrap}>
            <Text style={[styles.stateTitle, { fontSize: s(18) }]}>Unable to load bookings</Text>
            <Text style={[styles.stateBody, { fontSize: s(14), marginTop: s(8) }]}>
              {getErrorMessage(error)}
            </Text>
          </View>
        ) : isLoading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator size="large" color={colors.accent.main} />
          </View>
        ) : visibleBookings.length === 0 ? (
          <View style={styles.stateWrap}>
            <Text style={[styles.stateTitle, { fontSize: s(18) }]}>{emptyState.title}</Text>
            <Text style={[styles.stateBody, { fontSize: s(14), marginTop: s(8) }]}>
              {emptyState.subtitle}
            </Text>
          </View>
        ) : (
          <View style={{ gap: s(12) }}>
            {visibleBookings.map((booking) => (
              <BookingTicketCard
                key={booking.id}
                booking={booking}
                bookingCode={bookingCode(booking.id)}
                expanded={expandedId === booking.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === booking.id ? null : booking.id))
                }
                formatDateRange={formatDateRange}
                moneyLabel={moneyLabel}
                onDetails={() =>
                  router.push({
                    pathname: '/booking/review',
                    params: {
                      listingId: booking.listing_id,
                      title: booking.listing?.title ?? 'Booking',
                    },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  header: {
    backgroundColor: colors.surface.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
    flex: 1,
  },
  tabsPill: {
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: '#B9BBC6',
  },
  tabLabelActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.accent.main,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  filterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.2)',
  },
  scroll: {
    flex: 1,
  },
  stateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  stateTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  stateBody: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
