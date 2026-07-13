import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { VENDOR_LISTINGS_COPY } from '@/src/constants/vendorListingsConstants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

type VendorListingsStateViewsProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  isEmpty: boolean;
  emptyFiltered?: boolean;
  onRetry?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  shownCount?: number;
  totalCount?: number;
  onLoadMore?: () => void;
  style?: ViewStyle;
};

export function VendorListingsStateViews({
  isLoading,
  isError,
  errorMessage,
  isEmpty,
  emptyFiltered = false,
  onRetry,
  hasMore = false,
  isFetchingNextPage = false,
  shownCount = 0,
  totalCount = 0,
  onLoadMore,
  style,
}: VendorListingsStateViewsProps) {
  if (isLoading) {
    return (
      <View style={[styles.centered, style]}>
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text style={styles.loadingText}>{VENDOR_LISTINGS_COPY.loading}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, style]}>
        <Ionicons name="cloud-offline-outline" size={36} color="rgba(15, 26, 32, 0.45)" />
        <Text style={styles.stateTitle}>{VENDOR_LISTINGS_COPY.errorTitle}</Text>
        {errorMessage ? <Text style={styles.stateBody}>{errorMessage}</Text> : null}
        {onRetry ? (
          <Pressable style={styles.retryBtn} onPress={onRetry} accessibilityRole="button">
            <Text style={styles.retryText}>{VENDOR_LISTINGS_COPY.retry}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={[styles.centered, style]}>
        <Ionicons name="business-outline" size={36} color="rgba(15, 26, 32, 0.45)" />
        <Text style={styles.stateTitle}>
          {emptyFiltered
            ? VENDOR_LISTINGS_COPY.emptyFilteredTitle
            : VENDOR_LISTINGS_COPY.emptyTitle}
        </Text>
        <Text style={styles.stateBody}>
          {emptyFiltered
            ? VENDOR_LISTINGS_COPY.emptyFilteredBody
            : VENDOR_LISTINGS_COPY.emptyBody}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.footer, style]}>
      {totalCount > 0 ? (
        <Text style={styles.countText}>
          {VENDOR_LISTINGS_COPY.showingCount(shownCount, totalCount)}
        </Text>
      ) : null}
      {hasMore ? (
        <Pressable
          style={[styles.loadMoreBtn, isFetchingNextPage && styles.loadMoreDisabled]}
          onPress={onLoadMore}
          disabled={isFetchingNextPage}
          accessibilityRole="button"
        >
          {isFetchingNextPage ? (
            <ActivityIndicator size="small" color={colors.surface.white} />
          ) : (
            <Text style={styles.loadMoreText}>{VENDOR_LISTINGS_COPY.loadMore}</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(15, 26, 32, 0.65)',
  },
  stateTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  stateBody: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(15, 26, 32, 0.65)',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 4,
    backgroundColor: colors.text.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  retryText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  footer: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  countText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: 'rgba(15, 26, 32, 0.55)',
  },
  loadMoreBtn: {
    minWidth: 160,
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    ...Platform.select({ web: { cursor: 'pointer' as const } }),
  },
  loadMoreDisabled: {
    opacity: 0.75,
  },
  loadMoreText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
