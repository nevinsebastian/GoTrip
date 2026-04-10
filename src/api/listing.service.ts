// src/api/listing.service.ts
// Listing-related API calls.

import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { ListingsResponse } from './types';

export interface BrowseListingsParams {
  category_id?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export const browseListings = async (params: BrowseListingsParams): Promise<ListingsResponse> => {
  const response = await apiClient.get<ListingsResponse>(ENDPOINTS.listings.browse, { params });
  return response.data;
};

