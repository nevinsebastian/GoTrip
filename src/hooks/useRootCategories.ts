// src/hooks/useRootCategories.ts
// React Query hook for fetching root categories (`GET /categories`).

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchRootCategories } from '../api/category.service';
import type { APIError, CategoriesByTypeResponse } from '../api/types';

export const ROOT_CATEGORIES_QUERY_KEY = ['categories', 'root'];

export const useRootCategories = (
  enabled: boolean,
): UseQueryResult<CategoriesByTypeResponse, APIError> => {
  return useQuery<CategoriesByTypeResponse, APIError>({
    queryKey: ROOT_CATEGORIES_QUERY_KEY,
    queryFn: fetchRootCategories,
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};

