import { Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/src/utils/errorHandler';

type CategoryDetailRouteShellProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  is404?: boolean;
  categoryLabel: string;
  browsePath: string;
  onRetry: () => void;
  children: React.ReactNode;
};

export function CategoryDetailRouteShell({
  isLoading,
  isError,
  error,
  is404,
  categoryLabel,
  browsePath,
  onRetry,
  children,
}: CategoryDetailRouteShellProps) {
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="caption" style={styles.loadingText}>
          Loading {categoryLabel}…
        </Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    const notFound = is404 ?? (error as { status?: number })?.status === 404;
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="search-outline" size={40} color={colors.text.caption} />
        <Text variant="bodySemibold" style={styles.errorTitle}>
          {notFound ? `${categoryLabel} not found` : `Could not load ${categoryLabel.toLowerCase()}`}
        </Text>
        <Text variant="caption" style={styles.errorBody}>
          {notFound ? 'This listing may have been removed.' : getErrorMessage(error)}
        </Text>
        <Pressable
          onPress={() => (notFound ? router.replace(browsePath as never) : onRetry())}
          style={styles.retryBtn}
        >
          <Text style={styles.retryBtnText}>{notFound ? `Browse ${categoryLabel.toLowerCase()}s` : 'Retry'}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['3'],
    padding: spacing['5'],
    backgroundColor: colors.surface.white,
  },
  loadingText: {
    color: colors.text.secondary,
  },
  errorTitle: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  errorBody: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing['2'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['4'],
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  retryBtnText: {
    color: colors.surface.white,
    fontWeight: '600',
  },
});
