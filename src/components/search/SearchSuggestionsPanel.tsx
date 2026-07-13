import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import type { SearchType, SuggestionListing, SuggestionLocation } from '@/src/api/types';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { useSearchSuggestions } from '@/src/hooks/useSearchSuggestions';
import { formatSuggestionLocation } from '@/src/utils/searchNavigation';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

const DEFAULT_MAX_SUGGESTIONS = 3;

type SearchSuggestionsPanelProps = {
  query: string;
  searchType?: SearchType;
  enabled?: boolean;
  maxSuggestions?: number;
  onSelectLocation: (city: string, label: string) => void;
  onSelectListing: (listing: SuggestionListing) => void;
  compact?: boolean;
};

type SuggestionItem =
  | { kind: 'location'; key: string; city: string; label: string; categories: string[] }
  | { kind: 'listing'; key: string; listing: SuggestionListing };

function buildSuggestionItems(
  locations: SuggestionLocation[],
  listings: SuggestionListing[],
  max: number,
): SuggestionItem[] {
  const items: SuggestionItem[] = [];

  for (const loc of locations) {
    if (items.length >= max) break;
    items.push({
      kind: 'location',
      key: `loc-${loc.city}-${loc.state ?? ''}`,
      city: loc.city,
      label: formatSuggestionLocation(loc.city, loc.state),
      categories: loc.categories,
    });
  }

  for (const listing of listings) {
    if (items.length >= max) break;
    items.push({ kind: 'listing', key: `listing-${listing.id}`, listing });
  }

  return items.slice(0, max);
}

export function SearchSuggestionsPanel({
  query,
  searchType,
  enabled = true,
  maxSuggestions = DEFAULT_MAX_SUGGESTIONS,
  onSelectLocation,
  onSelectListing,
  compact = false,
}: SearchSuggestionsPanelProps) {
  const debouncedQuery = useDebouncedValue(query, 300);
  const trimmed = debouncedQuery.trim();
  const canFetch = enabled && trimmed.length >= 2;

  const { data, isFetching, isError } = useSearchSuggestions(trimmed, searchType, canFetch);

  const locations: SuggestionLocation[] = data?.locations ?? [];
  const listings: SuggestionListing[] = data?.listings ?? [];

  const visibleItems = useMemo(
    () => buildSuggestionItems(locations, listings, maxSuggestions),
    [locations, listings, maxSuggestions],
  );

  if (!enabled) return null;

  if (trimmed.length > 0 && trimmed.length < 2) {
    return (
      <View style={[styles.panel, compact && styles.panelCompact]}>
        <Text style={[styles.hint, compact && styles.hintCompact]}>
          Type at least 2 characters for suggestions
        </Text>
      </View>
    );
  }

  if (trimmed.length >= 2 && isFetching && !visibleItems.length) {
    return (
      <View style={[styles.panel, compact && styles.panelCompact]}>
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accent.main} />
        </View>
      </View>
    );
  }

  if (trimmed.length >= 2 && isError) {
    return (
      <View style={[styles.panel, compact && styles.panelCompact]}>
        <Text style={[styles.hint, compact && styles.hintCompact]}>
          Could not load suggestions
        </Text>
      </View>
    );
  }

  if (trimmed.length >= 2 && !visibleItems.length) {
    return (
      <View style={[styles.panel, compact && styles.panelCompact]}>
        <Text style={[styles.hint, compact && styles.hintCompact]}>
          No matches for &quot;{trimmed}&quot;
        </Text>
      </View>
    );
  }

  if (!visibleItems.length) return null;

  return (
    <View style={[styles.panel, compact && styles.panelCompact]}>
      {visibleItems.map((item) =>
        item.kind === 'location' ? (
          <Pressable
            key={item.key}
            style={[styles.row, compact && styles.rowCompact]}
            onPress={() => onSelectLocation(item.city, item.label)}
          >
            <Ionicons name="location-outline" size={compact ? 14 : 16} color={colors.accent.main} />
            <View style={styles.rowText}>
              <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1}>
                {item.label}
              </Text>
              {item.categories.length ? (
                <Text style={[styles.sub, compact && styles.subCompact]} numberOfLines={1}>
                  {item.categories.join(', ')}
                </Text>
              ) : null}
            </View>
          </Pressable>
        ) : (
          <Pressable
            key={item.key}
            style={[styles.row, compact && styles.rowCompact]}
            onPress={() => onSelectListing(item.listing)}
          >
            <Ionicons name="search-outline" size={compact ? 14 : 16} color={colors.text.secondary} />
            <View style={styles.rowText}>
              <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1}>
                {item.listing.title}
              </Text>
              <Text style={[styles.sub, compact && styles.subCompact]} numberOfLines={1}>
                {[item.listing.category, item.listing.city, item.listing.state]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
          </Pressable>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    maxHeight: 132,
    overflow: 'hidden',
    gap: 0,
  },
  panelCompact: {
    maxHeight: 114,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    maxHeight: 44,
    overflow: 'hidden',
  },
  rowCompact: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 36,
    maxHeight: 38,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    overflow: 'hidden',
  },
  title: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  titleCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
  sub: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    lineHeight: 14,
    color: colors.text.secondary,
  },
  subCompact: {
    fontSize: 9,
    lineHeight: 12,
  },
  hint: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 15,
    color: colors.text.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hintCompact: {
    fontSize: 10,
    paddingHorizontal: 8,
  },
  loadingRow: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});
