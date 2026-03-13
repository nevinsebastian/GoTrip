// src/api/trip.service.ts
// Trip-related API calls.

import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { Trip } from './types';

export const fetchTrips = async (): Promise<Trip[]> => {
  const response = await apiClient.get<Trip[]>(ENDPOINTS.trips.list);
  return response.data;
};

export const fetchTripDetails = async (id: string): Promise<Trip> => {
  const response = await apiClient.get<Trip>(ENDPOINTS.trips.details(id));
  return response.data;
};

