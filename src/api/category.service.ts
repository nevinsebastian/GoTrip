// src/api/category.service.ts
// Category-related API calls.

import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { CategoriesByTypeResponse, CategoryType } from './types';

export const fetchRootCategories = async (): Promise<CategoriesByTypeResponse> => {
  const response = await apiClient.get<CategoriesByTypeResponse>(ENDPOINTS.categories.root);
  return response.data;
};

export const fetchCategoriesByType = async (
  type: CategoryType,
): Promise<CategoriesByTypeResponse> => {
  const response = await apiClient.get<CategoriesByTypeResponse>(
    ENDPOINTS.categories.byType(type),
  );
  return response.data;
};

