import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_PINK,
} from '@/src/constants/vendorWorkspaceConstants';
import { useVendorPayouts } from '@/src/hooks/useVendorPayouts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

function formatCurrency(amount?: number): string {
  if (amount == null) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function MobileVendorEarningsScreen() {
  const { payouts, isLoading } = useVendorPayouts(50);

  const totalEarnings = useMemo(
    () => payouts.reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [payouts],
  );
  const pendingPayouts = useMemo(
    () =>
      payouts
        .filter((p) => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [payouts],
  );
  const completedPayouts = useMemo(
    () =>
      payouts
        .filter((p) => p.status === 'completed' || p.status === 'settled')
        .reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [payouts],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.topTitle}>Earnings</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator color={VENDOR_WORKSPACE_PINK} style={{ marginTop: 40 }} />
          ) : (
            <>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>{VENDOR_WORKSPACE_COPY.totalEarnings}</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalEarnings)}</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>{VENDOR_WORKSPACE_COPY.pendingPayouts}</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(pendingPayouts)}</Text>
                </View>
                <View style={[styles.summaryCard, styles.summaryCardWide]}>
                  <Text style={styles.summaryLabel}>{VENDOR_WORKSPACE_COPY.completedPayouts}</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(completedPayouts)}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Recent transactions</Text>
              <View style={styles.txList}>
                {payouts.length === 0 ? (
                  <Text style={styles.emptyText}>No transactions yet.</Text>
                ) : (
                  payouts.map((p) => (
                    <View key={p.id} style={styles.txRow}>
                      <View style={styles.txInfo}>
                        <Text style={styles.txLabel} numberOfLines={1}>
                          {p.listingTitle ?? p.bookingRef ?? p.id}
                        </Text>
                        <Text style={styles.txDate}>
                          {p.settledAt ?? p.createdAt ?? ''}
                        </Text>
                      </View>
                      <Text style={styles.txAmount}>{formatCurrency(p.amount)}</Text>
                    </View>
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  topTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    width: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 6,
    backgroundColor: colors.surface.white,
  },
  summaryCardWide: { width: '100%' },
  summaryLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  summaryValue: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  chartCard: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingTop: 8,
  },
  barCol: { alignItems: 'center', gap: 6, flex: 1 },
  bar: {
    width: 28,
    borderRadius: borderRadius.md,
  },
  barLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  txList: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.08)',
  },
  txInfo: { flex: 1, gap: 2 },
  txLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  txDate: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.55)',
  },
  txAmount: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  emptyText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.5)',
    textAlign: 'center',
    padding: 16,
  },
});
