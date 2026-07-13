import { fetchSearchSuggestions } from '@/src/api/search.service';
import type { APIError, SearchType, SuggestionsResponse } from '@/src/api/types';
import { useQuery } from '@tanstack/react-query';

export const searchSuggestionsQueryKey = (q: string, type?: SearchType) =>
  ['search', 'suggestions', q, type ?? 'all'] as const;

export function useSearchSuggestions(
  q: string,
  type?: SearchType,
  enabled = true,
) {
  const trimmed = q.trim();
  return useQuery<SuggestionsResponse, APIError>({
    queryKey: searchSuggestionsQueryKey(trimmed, type),
    queryFn: () => fetchSearchSuggestions({ q: trimmed, type }),
    enabled: enabled && trimmed.length >= 2,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
