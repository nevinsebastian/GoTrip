import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import {
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_EARNINGS,
  VENDOR_WORKSPACE_PINK,
} from '@/src/constants/vendorWorkspaceConstants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const CHART_MAX = Math.max(...VENDOR_WORKSPACE_EARNINGS.chartValues);

export function MobileVendorEarningsScreen() {
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
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{VENDOR_WORKSPACE_COPY.totalEarnings}</Text>
              <Text style={styles.summaryValue}>{VENDOR_WORKSPACE_EARNINGS.total}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{VENDOR_WORKSPACE_COPY.pendingPayouts}</Text>
              <Text style={styles.summaryValue}>{VENDOR_WORKSPACE_EARNINGS.pending}</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardWide]}>
              <Text style={styles.summaryLabel}>{VENDOR_WORKSPACE_COPY.completedPayouts}</Text>
              <Text style={styles.summaryValue}>{VENDOR_WORKSPACE_EARNINGS.completed}</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Revenue trend</Text>
            <View style={styles.chart}>
              {VENDOR_WORKSPACE_EARNINGS.chartValues.map((value, index) => (
                <View key={VENDOR_WORKSPACE_EARNINGS.chartWeeks[index]} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      { height: Math.max(24, (value / CHART_MAX) * 120), backgroundColor: VENDOR_WORKSPACE_PINK },
                    ]}
                  />
                  <Text style={styles.barLabel}>{VENDOR_WORKSPACE_EARNINGS.chartWeeks[index]}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent transactions</Text>
          <View style={styles.txList}>
            {VENDOR_WORKSPACE_EARNINGS.transactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txInfo}>
                  <Text style={styles.txLabel} numberOfLines={1}>
                    {tx.label}
                  </Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={styles.txAmount}>{tx.amount}</Text>
              </View>
            ))}
          </View>
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
});
