// src/hooks/useCategoriesByType.ts
// React Query hook for fetching categories by type.

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchCategoriesByType } from '../api/category.service';
import type { APIError, CategoriesByTypeResponse, CategoryType } from '../api/types';

export const categoriesByTypeQueryKey = (type: CategoryType) => ['categories', 'type', type];

export const useCategoriesByType = (
  type: CategoryType,
  enabled: boolean,
): UseQueryResult<CategoriesByTypeResponse, APIError> => {
  return useQuery<CategoriesByTypeResponse, APIError>({
    queryKey: categoriesByTypeQueryKey(type),
    queryFn: () => fetchCategoriesByType(type),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

