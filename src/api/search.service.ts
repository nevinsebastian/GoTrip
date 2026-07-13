import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  SearchParams,
  SearchResponse,
  SearchSuggestionsParams,
  SearchType,
  SuggestionsResponse,
} from './types';

function resolveOffset(params: { offset?: number; page?: number; limit: number }): number {
  if (params.offset != null) return Math.max(0, params.offset);
  if (params.page != null) return Math.max(0, (params.page - 1) * params.limit);
  return 0;
}

function normalizeSearchResponse(
  payload: Partial<SearchResponse> | null | undefined,
  limit: number,
  offset: number,
): SearchResponse {
  const data = Array.isArray(payload?.data) ? payload.data : [];
  return {
    success: payload?.success,
    data,
    total: Number(payload?.total ?? data.length),
    limit: Number(payload?.limit ?? limit),
    offset: Number(payload?.offset ?? offset),
    meta: payload?.meta,
  };
}

export async function fetchSearch(params: SearchParams): Promise<SearchResponse> {
  const limit = params.limit ?? 20;
  const offset = resolveOffset({ ...params, limit });
  const query: Record<string, string | number> = {
    type: params.type,
    limit,
    offset,
  };

  if (params.q?.trim()) query.q = params.q.trim();
  if (params.checkIn) query.checkIn = params.checkIn;
  if (params.checkOut) query.checkOut = params.checkOut;
  if (params.rooms != null) query.rooms = params.rooms;
  if (params.guests != null) query.guests = params.guests;
  if (params.category?.trim()) query.category = params.category.trim();

  const response = await apiClient.get<SearchResponse>(ENDPOINTS.search.browse, { params: query });
  return normalizeSearchResponse(response.data, limit, offset);
}

export async function fetchSearchSuggestions(
  params: SearchSuggestionsParams,
): Promise<SuggestionsResponse> {
  const q = params.q.trim();
  const query: Record<string, string> = { q };
  if (params.type) query.type = params.type;

  const response = await apiClient.get<SuggestionsResponse>(ENDPOINTS.search.suggestions, {
    params: query,
  });
  const payload = response.data;
  return {
    success: payload?.success,
    locations: Array.isArray(payload?.locations) ? payload.locations : [],
    listings: Array.isArray(payload?.listings) ? payload.listings : [],
  };
}

export type { SearchType };
